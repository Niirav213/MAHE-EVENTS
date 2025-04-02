
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, testConnection } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
  next();
};

// Routes
app.get('/', (req, res) => {
  res.send('College Events API is running');
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  const connected = await testConnection();
  if (connected) {
    res.json({ message: 'Database connected successfully' });
  } else {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// User Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;
    
    // Check if user already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    const token = jwt.sign({ id: result.insertId, email, role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ user: { id: result.insertId, name, email, role }, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }, 
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Events Routes
app.get('/api/events', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = `
      SELECT e.*, u.name as organizer_name 
      FROM events e
      JOIN users u ON e.organizer_id = u.id
    `;
    
    const params = [];
    if (category) {
      query += ' WHERE e.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY e.date ASC';
    
    const [events] = await pool.query(query, params);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const [events] = await pool.query(
      `SELECT e.*, u.name as organizer_name 
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = ?`, 
      [req.params.id]
    );
    
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(events[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin Routes - Create, Update, Delete Events
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const { 
      title, description, image_url, date, time_start, time_end,
      location, category, price, total_tickets
    } = req.body;
    
    // Only allow admins to create events
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied: Only admins can create events. Your event submission has been sent for approval.'
      });
    }
    
    const [result] = await pool.query(
      `INSERT INTO events 
       (title, description, image_url, date, time_start, time_end, location, 
        category, price, total_tickets, available_tickets, organizer_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, image_url, date, time_start, time_end, location, 
       category, price, total_tickets, total_tickets, req.user.id]
    );
    
    const [newEvent] = await pool.query('SELECT * FROM events WHERE id = ?', [result.insertId]);
    res.status(201).json(newEvent[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// New endpoint for regular users to submit event requests
app.post('/api/events/request', authenticateToken, async (req, res) => {
  try {
    const { 
      title, description, image_url, date, time_start, time_end,
      location, category, price, total_tickets
    } = req.body;
    
    // Store event request in a pending_events table
    const [result] = await pool.query(
      `INSERT INTO pending_events 
       (title, description, image_url, date, time_start, time_end, location, 
        category, price, total_tickets, requester_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [title, description, image_url, date, time_start, time_end, location, 
       category, price, total_tickets, req.user.id]
    );
    
    res.status(201).json({ 
      message: 'Event request submitted successfully and is pending approval',
      request_id: result.insertId
    });
  } catch (error) {
    console.error('Error submitting event request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/events/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { 
      title, description, image_url, date, time_start, time_end,
      location, category, price
    } = req.body;
    
    const [result] = await pool.query(
      `UPDATE events SET 
       title = ?, description = ?, image_url = ?, date = ?, time_start = ?,
       time_end = ?, location = ?, category = ?, price = ?
       WHERE id = ?`,
      [title, description, image_url, date, time_start, time_end, 
       location, category, price, req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const [updatedEvent] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
    res.json(updatedEvent[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/events/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    // First check if there are tickets for this event
    const [tickets] = await pool.query('SELECT id FROM tickets WHERE event_id = ?', [req.params.id]);
    
    if (tickets.length > 0) {
      // Delete tickets first
      await pool.query('DELETE FROM tickets WHERE event_id = ?', [req.params.id]);
    }
    
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Tickets Routes
app.post('/api/tickets', authenticateToken, async (req, res) => {
  try {
    const { event_id } = req.body;
    
    // Check if event exists and has available tickets
    const [events] = await pool.query(
      'SELECT * FROM events WHERE id = ? AND available_tickets > 0',
      [event_id]
    );
    
    if (events.length === 0) {
      return res.status(400).json({ message: 'Event not found or no tickets available' });
    }
    
    // Generate unique ticket code
    const ticketCode = `TCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create ticket
    const [result] = await pool.query(
      'INSERT INTO tickets (event_id, user_id, ticket_code) VALUES (?, ?, ?)',
      [event_id, req.user.id, ticketCode]
    );
    
    // Update available tickets
    await pool.query(
      'UPDATE events SET available_tickets = available_tickets - 1 WHERE id = ?',
      [event_id]
    );
    
    const [ticket] = await pool.query(
      `SELECT t.*, e.title as event_title, e.date, e.time_start, e.location
       FROM tickets t
       JOIN events e ON t.event_id = e.id
       WHERE t.id = ?`,
      [result.insertId]
    );
    
    res.status(201).json(ticket[0]);
  } catch (error) {
    console.error('Error purchasing ticket:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/tickets/my', authenticateToken, async (req, res) => {
  try {
    const [tickets] = await pool.query(
      `SELECT t.*, e.title as event_title, e.date, e.time_start, e.location, e.image_url
       FROM tickets t
       JOIN events e ON t.event_id = e.id
       WHERE t.user_id = ?
       ORDER BY t.purchase_date DESC`,
      [req.user.id]
    );
    
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  testConnection();
});

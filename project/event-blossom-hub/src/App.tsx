
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import TicketsPage from "./pages/TicketsPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEventForm from "./pages/AdminEventForm";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateEventPage from "./pages/CreateEventPage";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/events" element={<EventsPage />} />
    <Route path="/events/:id" element={<EventDetailPage />} />
    <Route path="/sign-in" element={<SignInPage />} />
    <Route path="/sign-up" element={<SignUpPage />} />
    
    {/* Protected routes - require authentication */}
    <Route path="/tickets" element={
      <ProtectedRoute>
        <TicketsPage />
      </ProtectedRoute>
    } />
    <Route path="/create-event" element={
      <ProtectedRoute>
        <CreateEventPage />
      </ProtectedRoute>
    } />
    
    {/* Admin routes */}
    <Route path="/admin" element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    } />
    <Route path="/admin/events/new" element={
      <AdminRoute>
        <AdminEventForm />
      </AdminRoute>
    } />
    <Route path="/admin/events/:id/edit" element={
      <AdminRoute>
        <AdminEventForm />
      </AdminRoute>
    } />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

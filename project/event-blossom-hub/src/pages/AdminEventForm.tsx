
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Tag, DollarSign, Users, Save, Loader2 } from "lucide-react";
import { eventsService } from "@/services/api";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  image_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  time_start: z.string().min(1, "Start time is required"),
  time_end: z.string().min(1, "End time is required"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  total_tickets: z.coerce.number().int().positive("Total tickets must be a positive integer")
});

type EventFormValues = z.infer<typeof eventSchema>;

const AdminEventForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!id;
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      date: new Date().toISOString().split("T")[0],
      time_start: "09:00",
      time_end: "17:00",
      location: "",
      category: "academic",
      price: 0,
      total_tickets: 100
    }
  });

  const categories = [
    { value: "academic", label: "Academic" },
    { value: "cultural", label: "Cultural" },
    { value: "sports", label: "Sports" },
    { value: "conferences", label: "Conferences" },
    { value: "festivals", label: "Festivals" },
    { value: "workshops", label: "Workshops" },
    { value: "competitions", label: "Competitions" },
    { value: "social", label: "Social" }
  ];

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }

    const fetchEvent = async () => {
      if (isEditMode) {
        setLoading(true);
        try {
          const event = await eventsService.getEventById(id);
          // Format date and time for form inputs
          const date = new Date(event.date).toISOString().split("T")[0];
          
          form.reset({
            title: event.title,
            description: event.description,
            image_url: event.image_url || "",
            date,
            time_start: event.time_start,
            time_end: event.time_end,
            location: event.location,
            category: event.category,
            price: event.price,
            total_tickets: event.total_tickets
          });
        } catch (error) {
          toast.error("Failed to load event data");
          navigate("/admin");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [id, isEditMode, isAdmin, navigate, form]);

  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await eventsService.updateEvent(id, data);
        toast.success("Event updated successfully");
      } else {
        await eventsService.createEvent(data);
        toast.success("Event created successfully");
      }
      navigate("/admin");
    } catch (error: any) {
      toast.error(error.message || "There was an error saving the event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-eventPurple" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <select
                              className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-eventPurple"
                              {...field}
                            >
                              {categories.map((category) => (
                                <option 
                                  key={category.value} 
                                  value={category.value}
                                >
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="date"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="time_start"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="time_end"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Event location"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="total_tickets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Tickets</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="number"
                                min="1"
                                step="1"
                                placeholder="100"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for the event cover image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter event details..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-eventPurple hover:bg-eventPurple-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        {isEditMode ? "Update Event" : "Create Event"}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminEventForm;

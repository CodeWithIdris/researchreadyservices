import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, Video, User, Mail, Phone, Globe } from "lucide-react";
import { z } from "zod";
import { trackConversion } from "@/lib/analytics";

const appointmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, "Please select a time"),
  type: z.string().min(1, "Please select appointment type"),
  notes: z.string().max(500).optional(),
});

const appointmentTypes = [
  { value: "consultation", label: "Research Consultation (30 min)", duration: 30 },
  { value: "project-discussion", label: "Research Project Discussion (1 hr)", duration: 60 },
  { value: "thesis-review", label: "Thesis Research Review (1 hr)", duration: 60 },
  { value: "data-analysis", label: "Data Analysis Consultation (45 min)", duration: 45 },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

const AppointmentBooking = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [visitorTimezone, setVisitorTimezone] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    time: "",
    type: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setVisitorTimezone(timezone);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const convertTimeToLocal = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    // Nigeria is UTC+1, convert to local
    const nigeriaOffset = 1;
    const localOffset = -date.getTimezoneOffset() / 60;
    const offsetDiff = localOffset - nigeriaOffset;
    
    const localHours = (hours + offsetDiff + 24) % 24;
    const period = localHours >= 12 ? 'PM' : 'AM';
    const hours12 = localHours % 12 || 12;
    
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationData = {
      ...formData,
      date: selectedDate,
    };

    const result = appointmentSchema.safeParse(validationData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (!selectedDate) return;

    setIsLoading(true);

    try {
      // Use edge function with server-side rate limiting and validation
      const { data, error } = await supabase.functions.invoke("appointments", {
        body: {
          action: "create",
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone || null,
          client_timezone: visitorTimezone,
          appointment_date: selectedDate.toISOString().split('T')[0],
          appointment_time: formData.time,
          appointment_type: formData.type,
          meeting_link: null,
          notes: formData.notes || null,
        },
      });

      if (error) throw error;
      
      // Check for rate limit or validation errors from the edge function
      if (data?.error) {
        throw new Error(data.error);
      }

      setBookingComplete(true);
      toast({
        title: "Consultation request received",
        description: "Your requested date and research details have been recorded.",
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", time: "", type: "", notes: "" });
    setSelectedDate(undefined);
    setBookingComplete(false);
  };

  // Disable past dates and weekends
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0;
  };

  if (bookingComplete) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Consultation Request Received</h3>
        <p className="text-muted-foreground mb-4">
          We have recorded the request for <strong>{formData.email}</strong> and will review the details.
        </p>
        <div className="bg-secondary/50 rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground">Appointment Details:</p>
          <p className="font-semibold text-foreground">
            {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-foreground">{convertTimeToLocal(formData.time)} (Your Time)</p>
          <p className="text-sm text-muted-foreground mt-2">
            {appointmentTypes.find(t => t.value === formData.type)?.label}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
          <Video className="w-4 h-4" />
          <span>Contact details for the consultation will be shared after review.</span>
        </div>
        <Button onClick={resetForm} variant="outline">Book Another Appointment</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Schedule a Consultation</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              Select Date
            </Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={disabledDays}
              className="rounded-md border"
            />
            {errors.date && <p className="text-sm text-destructive mt-1">{errors.date}</p>}
          </div>

          {/* Time & Type */}
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Select Time
              </Label>
              <Select value={formData.time} onValueChange={(v) => handleSelectChange("time", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {convertTimeToLocal(slot)} (Your Time)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && <p className="text-sm text-destructive mt-1">{errors.time}</p>}
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Times shown in {visitorTimezone.split('/').pop()?.replace('_', ' ')}
              </p>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Video className="w-4 h-4 text-muted-foreground" />
                Appointment Type
              </Label>
              <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive mt-1">{errors.type}</p>}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Your Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Phone Number (Optional)
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 234 567 8900"
          />
        </div>

        <div>
          <Label htmlFor="notes" className="mb-2 block">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Tell us about your project or questions..."
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Request Consultation"}
        </Button>
      </form>
    </Card>
  );
};

export default AppointmentBooking;
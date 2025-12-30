import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  academicLevel: z.string().min(1, "Please select an academic level"),
  deadline: z.string().min(1, "Please select a deadline"),
  pageCount: z.string().optional(),
  description: z.string().trim().min(20, "Please provide more details about your project").max(2000),
});

const ProjectRequestForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    academicLevel: "",
    deadline: "",
    pageCount: "",
    description: "",
  });
  const { toast } = useToast();

  const projectTypes = [
    "Dissertation Writing",
    "Thesis Writing",
    "Literature Review",
    "Research Proposal",
    "Research Analysis",
    "Thesis Editing",
    "Statistical Analysis",
    "Other",
  ];

  const academicLevels = [
    "Undergraduate",
    "Master's",
    "PhD/Doctoral",
    "Post-Doctoral",
  ];

  const deadlines = [
    "1-2 weeks",
    "2-4 weeks",
    "1-2 months",
    "2-3 months",
    "3+ months",
    "Flexible",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      toast({
        title: "Validation Error",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    // Create email content
    const subject = encodeURIComponent(
      `New Project Request: ${formData.projectType} - ${formData.name}`
    );
    const body = encodeURIComponent(
      `PROJECT REQUEST DETAILS\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone || "Not provided"}\n\n` +
        `Project Type: ${formData.projectType}\n` +
        `Academic Level: ${formData.academicLevel}\n` +
        `Deadline: ${formData.deadline}\n` +
        `Page Count: ${formData.pageCount || "Not specified"}\n\n` +
        `Project Description:\n${formData.description}\n\n` +
        `---\n` +
        `Submitted via ResearchReady Website`
    );

    // Open email client
    window.location.href = `mailto:researchreadyservices@gmail.com?subject=${subject}&body=${body}`;

    toast({
      title: "Email client opened",
      description: "Please send the email to complete your project request.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      projectType: "",
      academicLevel: "",
      deadline: "",
      pageCount: "",
      description: "",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Submit Project Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl text-primary">
            Project Request Form
          </DialogTitle>
          <DialogDescription>
            Fill out the form below with your project details. We'll review and get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 xxx xxx xxxx"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pageCount">Estimated Page Count</Label>
              <Input
                id="pageCount"
                type="text"
                placeholder="e.g., 50-80 pages"
                value={formData.pageCount}
                onChange={(e) =>
                  setFormData({ ...formData, pageCount: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Project Type *</Label>
              <Select
                value={formData.projectType}
                onValueChange={(value) =>
                  setFormData({ ...formData, projectType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Academic Level *</Label>
              <Select
                value={formData.academicLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, academicLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {academicLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Deadline *</Label>
              <Select
                value={formData.deadline}
                onValueChange={(value) =>
                  setFormData({ ...formData, deadline: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deadline" />
                </SelectTrigger>
                <SelectContent>
                  {deadlines.map((deadline) => (
                    <SelectItem key={deadline} value={deadline}>
                      {deadline}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              placeholder="Please describe your project in detail. Include your research topic, specific requirements, methodology preferences, and any other relevant information..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[120px]"
              required
            />
          </div>

          <Button type="submit" variant="gold" className="w-full gap-2">
            <Send className="w-4 h-4" />
            Submit via Email
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRequestForm;

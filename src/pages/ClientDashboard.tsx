import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProfileSection from "@/components/ProfileSection";
import { 
  LayoutDashboard, FolderOpen, Clock, CheckCircle, 
  AlertCircle, DollarSign, Calendar, User, LogOut,
  FileText, MessageSquare, RefreshCw, Settings
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  project_type: string;
  status: string;
  progress: number;
  deadline: string | null;
  amount: number | null;
  amount_paid: number | null;
  payment_status: string;
  assigned_expert: string | null;
  created_at: string;
  updated_at: string;
}

interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  update_type: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  in_progress: "bg-blue-500/20 text-blue-500",
  review: "bg-purple-500/20 text-purple-500",
  revision: "bg-orange-500/20 text-orange-500",
  completed: "bg-green-500/20 text-green-500",
  cancelled: "bg-red-500/20 text-red-500",
};

const paymentColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  partial: "bg-blue-500/20 text-blue-500",
  paid: "bg-green-500/20 text-green-500",
  refunded: "bg-red-500/20 text-red-500",
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      setProfile(profileData);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("client_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch all updates for user's projects
      if (projectsData && projectsData.length > 0) {
        const projectIds = projectsData.map(p => p.id);
        const { data: updatesData } = await supabase
          .from("project_updates")
          .select("*")
          .in("project_id", projectIds)
          .order("created_at", { ascending: false });
        setUpdates(updatesData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load your projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("client-projects-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "client_projects" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setProjects(prev => prev.map(p => 
              p.id === payload.new.id ? payload.new as Project : p
            ));
            toast({
              title: "Project Updated",
              description: `Your project "${(payload.new as Project).title}" has been updated.`,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "project_updates" },
        (payload) => {
          setUpdates(prev => [payload.new as ProjectUpdate, ...prev]);
          toast({
            title: "New Update",
            description: `New update: ${(payload.new as ProjectUpdate).title}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getProjectStats = () => {
    const total = projects.length;
    const inProgress = projects.filter(p => p.status === "in_progress").length;
    const completed = projects.filter(p => p.status === "completed").length;
    const pending = projects.filter(p => p.status === "pending").length;
    return { total, inProgress, completed, pending };
  };

  const stats = getProjectStats();

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">
                Welcome, {profile?.full_name || user?.email?.split("@")[0]}!
              </h1>
              <p className="text-muted-foreground">Track your research projects and stay updated</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>
          </div>

          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Projects Yet</h2>
              <p className="text-muted-foreground mb-6">
                You don't have any projects yet. Start by requesting a consultation!
              </p>
              <Button onClick={() => navigate("/book")}>Book a Consultation</Button>
            </Card>
          ) : (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="updates" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Updates ({updates.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Profile Section */}
                <ProfileSection 
                  profile={profile} 
                  email={user?.email || ""} 
                  onProfileUpdate={fetchData}
                />

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/book")}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Book Consultation</h3>
                        <p className="text-xs text-muted-foreground">Schedule a meeting</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
                    <a 
                      href="https://wa.me/2349022282963?text=Hi, I need support with my project"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                        <MessageSquare className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Get Support</h3>
                        <p className="text-xs text-muted-foreground">Chat on WhatsApp</p>
                      </div>
                    </a>
                  </Card>
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/support")}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <Settings className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Help Center</h3>
                        <p className="text-xs text-muted-foreground">FAQs & support</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recent Projects Preview */}
                {projects.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Recent Projects</h3>
                      <Button variant="link" size="sm" onClick={() => document.querySelector('[data-state="inactive"][value="projects"]')?.dispatchEvent(new MouseEvent('click'))}>
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {projects.slice(0, 2).map((project) => (
                        <Card key={project.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">{project.title}</h4>
                                <p className="text-xs text-muted-foreground capitalize">{project.project_type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium">{project.progress}%</p>
                                <Progress value={project.progress} className="w-20 h-1.5" />
                              </div>
                              <Badge className={statusColors[project.status] || "bg-secondary"}>
                                {project.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={statusColors[project.status] || "bg-secondary"}>
                          {project.status.replace("_", " ")}
                        </Badge>
                        <Badge className={paymentColors[project.payment_status] || "bg-secondary"}>
                          {project.payment_status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium text-foreground">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium text-foreground capitalize">{project.project_type}</span>
                      </div>
                      {project.deadline && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Deadline:</span>
                          <span className="font-medium text-foreground">
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {project.assigned_expert && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Expert:</span>
                          <span className="font-medium text-foreground">{project.assigned_expert}</span>
                        </div>
                      )}
                      {project.amount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium text-foreground">
                            ${project.amount_paid || 0} / ${project.amount}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={`https://wa.me/2349022282963?text=Hi, I have a question about my project: ${encodeURIComponent(project.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Ask Question
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="updates" className="space-y-4">
                {updates.length === 0 ? (
                  <Card className="p-8 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No updates yet. Check back later!</p>
                  </Card>
                ) : (
                  updates.map((update) => {
                    const project = projects.find(p => p.id === update.project_id);
                    return (
                      <Card key={update.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-foreground">{update.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {update.update_type}
                              </Badge>
                            </div>
                            {update.description && (
                              <p className="text-sm text-muted-foreground mb-2">{update.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{project?.title}</span>
                              <span>{new Date(update.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default ClientDashboard;
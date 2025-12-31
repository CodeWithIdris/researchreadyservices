import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, LogOut, MessageSquare, Ticket, Mail, Users, 
  Calendar, Clock, RefreshCw, Eye 
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  chat_messages: { count: number }[];
}

interface SupportTicket {
  id: string;
  session_id: string | null;
  visitor_name: string | null;
  visitor_email: string | null;
  subject: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

interface Message {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoad();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuthAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin");
      return;
    }
    loadData();
  };

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { action: "get_admin_data" },
      });

      if (error) throw error;

      setSessions(data.sessions || []);
      setTickets(data.tickets || []);
      setSubscribers(data.subscribers || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const viewSessionMessages = async (sessionId: string) => {
    setSelectedSession(sessionId);
    setIsMessagesLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { action: "get_session_messages", session_id: sessionId },
      });

      if (error) throw error;
      setSessionMessages(data.messages || []);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke("chat", {
        body: { action: "update_ticket_status", ticket_id: ticketId, status },
      });

      if (error) throw error;

      setTickets(prev => 
        prev.map(t => t.id === ticketId ? { ...t, status } : t)
      );

      toast({
        title: "Status updated",
        description: `Ticket status changed to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Error",
        description: "Failed to update ticket status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "destructive";
      case "in_progress": return "default";
      case "resolved": case "closed": return "secondary";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "normal": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Admin Dashboard | ResearchReady"
        description="Manage chat sessions, support tickets, and newsletter subscribers."
      />
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="font-playfair text-xl font-bold text-primary">
              ResearchReady Admin
            </h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sessions.length}</p>
                    <p className="text-sm text-muted-foreground">Chat Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {tickets.filter(t => t.status === "open").length}
                    </p>
                    <p className="text-sm text-muted-foreground">Open Tickets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{subscribers.length}</p>
                    <p className="text-sm text-muted-foreground">Subscribers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{tickets.length}</p>
                    <p className="text-sm text-muted-foreground">Total Tickets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="sessions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sessions" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Chat Sessions
              </TabsTrigger>
              <TabsTrigger value="tickets" className="gap-2">
                <Ticket className="w-4 h-4" />
                Support Tickets
              </TabsTrigger>
              <TabsTrigger value="subscribers" className="gap-2">
                <Mail className="w-4 h-4" />
                Subscribers
              </TabsTrigger>
            </TabsList>

            {/* Chat Sessions Tab */}
            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Sessions</CardTitle>
                  <CardDescription>Recent chat conversations with visitors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {sessions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No chat sessions yet.
                        </p>
                      ) : (
                        sessions.map((session) => (
                          <div 
                            key={session.id} 
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{session.visitor_name || "Anonymous"}</span>
                                <Badge variant={session.status === "active" ? "default" : "secondary"}>
                                  {session.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {session.chat_messages?.[0]?.count || 0} messages
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(session.created_at)}
                                </span>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => viewSessionMessages(session.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tickets Tab */}
            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>Support Tickets</CardTitle>
                  <CardDescription>Escalated requests and support inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {tickets.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No support tickets yet.
                        </p>
                      ) : (
                        tickets.map((ticket) => (
                          <div 
                            key={ticket.id} 
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{ticket.subject}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {ticket.visitor_name || "Unknown"} • {ticket.visitor_email || "No email"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getPriorityColor(ticket.priority)}>
                                  {ticket.priority}
                                </Badge>
                                <Select
                                  value={ticket.status}
                                  onValueChange={(value) => updateTicketStatus(ticket.id, value)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="open">Open</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {ticket.description && (
                              <p className="text-sm text-muted-foreground mt-2">
                                {ticket.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Created: {formatDate(ticket.created_at)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscribers Tab */}
            <TabsContent value="subscribers">
              <Card>
                <CardHeader>
                  <CardTitle>Newsletter Subscribers</CardTitle>
                  <CardDescription>Email newsletter subscription list</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {subscribers.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No subscribers yet.
                        </p>
                      ) : (
                        subscribers.map((subscriber) => (
                          <div 
                            key={subscriber.id} 
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span>{subscriber.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                                {subscriber.is_active ? "Active" : "Inactive"}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(subscriber.subscribed_at)}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Messages Dialog */}
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Chat Messages</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[500px] pr-4">
              {isMessagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {sessionMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex ${msg.sender_type === "visitor" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        msg.sender_type === "visitor" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminDashboard;

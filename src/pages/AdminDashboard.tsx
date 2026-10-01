import { useState, useEffect, useCallback } from "react";
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
  Calendar, Clock, RefreshCw, Eye, Bell, Target, Zap, Filter, FileText, ExternalLink
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

interface ProjectLead {
  id: string;
  name: string;
  email: string;
  country: string;
  budget_range: string;
  project_type: string;
  deadline: string;
  description: string;
  priority: string;
  status: string;
  source: string;
  fast_response: boolean;
  created_at: string;
  whatsapp: string | null;
  research_level: string | null;
  discipline: string | null;
  support_type: string | null;
  research_stage: string | null;
  preferred_contact: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  landing_page: string | null;
  ad_angle: string | null;
  first_utm_source: string | null;
  first_utm_medium: string | null;
  first_utm_campaign: string | null;
  first_referrer: string | null;
  first_landing_page: string | null;
}

interface EnquiryDocument { id: string; lead_id: string; original_name: string; mime_type: string; size_bytes: number; }

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [leads, setLeads] = useState<ProjectLead[]>([]);
  const [leadDocuments, setLeadDocuments] = useState<Record<string, EnquiryDocument[]>>({});
  const [leadFilter, setLeadFilter] = useState<string>("all");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<Message[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ProjectLead | null>(null);
  const [newActivityCount, setNewActivityCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const setupRealtimeSubscriptions = useCallback(() => {
    const sessionsChannel = supabase
      .channel('admin-sessions')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_sessions' },
        (payload) => {
          const newSession = payload.new as ChatSession;
          newSession.chat_messages = [{ count: 0 }];
          setSessions(prev => [newSession, ...prev]);
          setNewActivityCount(prev => prev + 1);
          toast({
            title: "💬 New Chat Session",
            description: `${newSession.visitor_name || 'A visitor'} started a chat`,
          });
        }
      )
      .subscribe();

    const ticketsChannel = supabase
      .channel('admin-tickets')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_tickets' },
        (payload) => {
          const newTicket = payload.new as SupportTicket;
          setTickets(prev => [newTicket, ...prev]);
          setNewActivityCount(prev => prev + 1);
          toast({
            title: "🎫 New Support Ticket",
            description: newTicket.subject,
            variant: newTicket.priority === 'high' ? 'destructive' : 'default',
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'support_tickets' },
        (payload) => {
          const updatedTicket = payload.new as SupportTicket;
          setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('admin-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMessage = payload.new as Message & { session_id: string };
          setSessions(prev => prev.map(s => {
            if (s.id === newMessage.session_id) {
              const currentCount = s.chat_messages?.[0]?.count || 0;
              return { ...s, chat_messages: [{ count: currentCount + 1 }] };
            }
            return s;
          }));
          if (selectedSession === newMessage.session_id) {
            setSessionMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    // Subscribe to new leads
    const leadsChannel = supabase
      .channel('admin-leads')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'project_leads' },
        (payload) => {
          const newLead = payload.new as ProjectLead;
          setLeads(prev => [newLead, ...prev]);
          setNewActivityCount(prev => prev + 1);
          const emoji = newLead.priority === 'high' ? '🔥' : newLead.priority === 'medium' ? '📋' : '📝';
          toast({
            title: `${emoji} New Lead: ${newLead.name}`,
            description: `${newLead.budget_range} • ${newLead.country} • ${newLead.priority.toUpperCase()} priority`,
            variant: newLead.priority === 'high' ? 'default' : undefined,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(ticketsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(leadsChannel);
    };
  }, [selectedSession, toast]);

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
    
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (adminError || !adminUser) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      navigate("/admin");
      return;
    }

    loadData();
  };

  useEffect(() => {
    if (!isLoading && sessions.length >= 0) {
      const cleanup = setupRealtimeSubscriptions();
      return cleanup;
    }
  }, [isLoading, setupRealtimeSubscriptions]);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      // Load chat/ticket/subscriber data
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { action: "get_admin_data" },
      });

      if (error) throw error;

      setSessions(data.sessions || []);
      setTickets(data.tickets || []);
      setSubscribers(data.subscribers || []);

      // Load leads directly
      const { data: leadsData, error: leadsError } = await supabase
        .from('project_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!leadsError && leadsData) {
        setLeads(leadsData as ProjectLead[]);
      }
      const { data: documentsData } = await supabase
        .from('enquiry_documents')
        .select('id, lead_id, original_name, mime_type, size_bytes')
        .order('created_at', { ascending: false });
      if (documentsData) {
        setLeadDocuments(documentsData.reduce<Record<string, EnquiryDocument[]>>((grouped, document) => {
          (grouped[document.lead_id] ||= []).push(document);
          return grouped;
        }, {}));
      }
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

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('project_leads')
        .update({ status })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
      toast({ title: "Lead status updated" });
    } catch {
      toast({ title: "Error", description: "Failed to update lead.", variant: "destructive" });
    }
  };

  const openEnquiryDocument = async (document: EnquiryDocument) => {
    const { data, error } = await supabase.functions.invoke('research-enquiry', {
      body: { action: 'signed_document_url', document_id: document.id },
    });
    if (error || !data?.url) {
      toast({ title: "Unable to open document", description: "Please try again.", variant: "destructive" });
      return;
    }
    window.open(data.url, '_blank', 'noopener,noreferrer');
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

  const getTicketPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "normal": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  const getLeadPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20";
      case "medium": return "border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20";
      case "low": return "border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
      default: return "";
    }
  };

  const getLeadPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return <Badge className="bg-green-600 hover:bg-green-700 text-white">HIGH</Badge>;
      case "medium": return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">MEDIUM</Badge>;
      case "low": return <Badge className="bg-red-500 hover:bg-red-600 text-white">LOW</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const filteredLeads = leadFilter === "all"
    ? leads
    : leads.filter(l => l.priority === leadFilter);

  const highPriorityLeads = leads.filter(l => l.priority === "high");

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
        noindex
      />
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <header className="bg-background border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-playfair text-xl font-bold text-primary">
                ResearchReady Admin
              </h1>
              {newActivityCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <Bell className="w-3 h-3 mr-1" />
                  {newActivityCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { loadData(); setNewActivityCount(0); }}
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{leads.length}</p>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{highPriorityLeads.length}</p>
                    <p className="text-sm text-muted-foreground">High Priority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{subscribers.length}</p>
                    <p className="text-sm text-muted-foreground">Subscribers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="leads" className="space-y-4">
            <TabsList>
              <TabsTrigger value="leads" className="gap-2">
                <Target className="w-4 h-4" />
                Project Leads
                {highPriorityLeads.length > 0 && (
                  <Badge variant="destructive" className="ml-1 text-xs px-1.5 py-0">
                    {highPriorityLeads.length}
                  </Badge>
                )}
              </TabsTrigger>
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

            {/* Leads Tab */}
            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Project Leads</CardTitle>
                      <CardDescription>Research enquiries from the consultation form</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <Select value={leadFilter} onValueChange={setLeadFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Leads</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {filteredLeads.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No leads yet.
                        </p>
                      ) : (
                        filteredLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className={`p-4 rounded-lg transition-colors ${getLeadPriorityStyles(lead.priority)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-semibold">{lead.name}</span>
                                  {getLeadPriorityBadge(lead.priority)}
                                  {lead.fast_response && (
                                    <Badge variant="outline" className="text-xs border-amber-500 text-amber-600">
                                      <Zap className="w-3 h-3 mr-1" />
                                      Fast Response
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {lead.source}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {lead.email} • {lead.country}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-sm">
                                  <span className="font-medium">{lead.budget_range}</span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-muted-foreground">{lead.project_type}</span>
                                  <span className="text-muted-foreground">•</span>
                                  <span className="text-muted-foreground">{lead.deadline}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Select
                                  value={lead.status}
                                  onValueChange={(v) => updateLeadStatus(lead.id, v)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                     <SelectItem value="reviewing">Reviewing</SelectItem>
                                    <SelectItem value="contacted">Contacted</SelectItem>
                                     <SelectItem value="qualified">Qualified</SelectItem>
                                    <SelectItem value="converted">Converted</SelectItem>
                                     <SelectItem value="not_a_fit">Not a fit</SelectItem>
                                     <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedLead(lead)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {lead.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(lead.created_at)}
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
                                <Badge variant={getTicketPriorityColor(ticket.priority)}>
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

        {/* Lead Detail Dialog */}
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                Lead Details
                {selectedLead && getLeadPriorityBadge(selectedLead.priority)}
                {selectedLead?.fast_response && (
                  <Badge variant="outline" className="border-amber-500 text-amber-600">
                    <Zap className="w-3 h-3 mr-1" /> Fast Response
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedLead.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedLead.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{selectedLead.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Range</p>
                    <p className="font-medium">{selectedLead.budget_range}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Project Type</p>
                    <p className="font-medium">{selectedLead.project_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-medium">{selectedLead.deadline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="font-medium capitalize">{selectedLead.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">{formatDate(selectedLead.created_at)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project Description</p>
                  <p className="text-sm bg-muted/50 rounded-lg p-4">{selectedLead.description}</p>
                </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-sm text-muted-foreground">Research level</p><p className="font-medium">{selectedLead.research_level || "Not provided"}</p></div>
                    <div><p className="text-sm text-muted-foreground">Discipline</p><p className="font-medium">{selectedLead.discipline || "Not provided"}</p></div>
                    <div><p className="text-sm text-muted-foreground">Research stage</p><p className="font-medium">{selectedLead.research_stage || "Not provided"}</p></div>
                    <div><p className="text-sm text-muted-foreground">Preferred contact</p><p className="font-medium">{selectedLead.preferred_contact || "Not provided"}</p></div>
                    {selectedLead.whatsapp && <div><p className="text-sm text-muted-foreground">WhatsApp</p><p className="font-medium">{selectedLead.whatsapp}</p></div>}
                    <div><p className="text-sm text-muted-foreground">Session campaign</p><p className="font-medium">{selectedLead.utm_campaign || selectedLead.ad_angle || "Organic / untagged"}</p></div>
                    <div><p className="text-sm text-muted-foreground">First-touch campaign</p><p className="font-medium">{selectedLead.first_utm_campaign || selectedLead.first_utm_source || "Organic / untagged"}</p></div>
                    {selectedLead.landing_page && <div className="min-w-0"><p className="text-sm text-muted-foreground">Landing page</p><p className="break-all text-sm">{selectedLead.landing_page}</p></div>}
                    {selectedLead.first_landing_page && <div className="min-w-0"><p className="text-sm text-muted-foreground">First landing page</p><p className="break-all text-sm">{selectedLead.first_landing_page}</p></div>}
                    {selectedLead.first_referrer && <div className="min-w-0"><p className="text-sm text-muted-foreground">First referrer</p><p className="break-all text-sm">{selectedLead.first_referrer}</p></div>}
                  </div>
                  {(leadDocuments[selectedLead.id]?.length || 0) > 0 && <div><p className="mb-2 text-sm text-muted-foreground">Documents</p><div className="space-y-2">{leadDocuments[selectedLead.id].map((document) => <Button key={document.id} variant="outline" className="w-full justify-between" onClick={() => openEnquiryDocument(document)}><span className="flex min-w-0 items-center gap-2"><FileText className="h-4 w-4 shrink-0" /><span className="truncate">{document.original_name}</span></span><ExternalLink className="h-4 w-4 shrink-0" /></Button>)}</div></div>}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(v) => {
                      updateLeadStatus(selectedLead.id, v);
                      setSelectedLead({ ...selectedLead, status: v });
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                       <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                       <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                       <SelectItem value="not_a_fit">Not a fit</SelectItem>
                       <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminDashboard;

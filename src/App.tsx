import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePageViewTracking } from "@/hooks/usePageViewTracking";
import GAVerification from "@/components/GAVerification";
import CookieConsent from "@/components/CookieConsent";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Insights from "./pages/Insights";
import InsightDetail from "./pages/InsightDetail";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FAQs from "./pages/FAQs";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Support from "./pages/Support";
import AboutUs from "./pages/AboutUs";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import WordChallenge from "./pages/WordChallenge";
import BookAppointment from "./pages/BookAppointment";
import WorkWithUs from "./pages/WorkWithUs";
import ClientAuth from "./pages/ClientAuth";
import ClientDashboard from "./pages/ClientDashboard";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const RouteTracker = () => {
  usePageViewTracking();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteTracker />
          <CookieConsent />
          <GAVerification />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/work-with-us" element={<WorkWithUs />} />
            <Route path="/research/:angle" element={<WorkWithUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<InsightDetail />} />
            <Route path="/auth" element={<ClientAuth />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/game" element={<WordChallenge />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

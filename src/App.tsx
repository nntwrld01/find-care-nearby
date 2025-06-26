
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Map from "./pages/Map";
import HospitalRegister from "./pages/HospitalRegister";
import HospitalLogin from "./pages/HospitalLogin";
import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalProfileEdit from "./pages/HospitalProfileEdit";
import HospitalServicesManage from "./pages/HospitalServicesManage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/hospitals" element={<Index />} />
          <Route path="/map" element={<Map />} />
          <Route path="/hospital-register" element={<HospitalRegister />} />
          <Route path="/hospital-login" element={<HospitalLogin />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
          <Route path="/hospital-profile-edit" element={<HospitalProfileEdit />} />
          <Route path="/hospital-services-manage" element={<HospitalServicesManage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

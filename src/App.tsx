
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AiAssistant from "./pages/AiAssistant";
import Documents from "./pages/Documents";
import Assessments from "./pages/Assessments";
import Reports from "./pages/Reports";
import Clients from "./pages/Clients";
import CaseSilo from "./pages/CaseSilo";
import Profile from "./pages/Profile";
import Interview from "./pages/Interview";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientDetails from "./pages/ClientDetails";
import LegalTasks from "./pages/LegalTasks";
import Schedule from "./pages/Schedule";
import AllAssessments from "./pages/AllAssessments";
import JITAI from "./pages/JITAI";
import Knowledge from "./pages/Knowledge";
import ServiceData from "./pages/ServiceData";
import ModuleMarketplace from "./pages/ModuleMarketplace";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/all-assessments" element={<AllAssessments />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/client-details/:clientId" element={<ClientDetails />} />
              <Route path="/legal-tasks" element={<LegalTasks />} />
              <Route path="/legal-tasks/:taskId" element={<LegalTasks />} />
              <Route path="/case-silo" element={<CaseSilo />} />
              <Route path="/interview/:caseId" element={<Interview />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/jitai" element={<JITAI />} />
              <Route path="/knowledge" element={<Knowledge />} />
              <Route path="/service-data" element={<ServiceData />} />
              <Route path="/module-marketplace" element={<ModuleMarketplace />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

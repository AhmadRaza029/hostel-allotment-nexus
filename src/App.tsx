
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ApplicationForm from "./pages/ApplicationForm";
import AllocationDetails from "./pages/AllocationDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApplicationDetail from "./pages/AdminApplicationDetail";
import Rules from "./pages/Rules";
import { AuthProvider, RequireAuth } from "./lib/auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Student Routes */}
            <Route 
              path="/dashboard" 
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/apply" 
              element={
                <RequireAuth>
                  <ApplicationForm />
                </RequireAuth>
              } 
            />
            <Route 
              path="/allocation" 
              element={
                <RequireAuth>
                  <AllocationDetails />
                </RequireAuth>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <RequireAuth admin>
                  <AdminDashboard />
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/application/:id" 
              element={
                <RequireAuth admin>
                  <AdminApplicationDetail />
                </RequireAuth>
              } 
            />
            
            {/* Public Routes */}
            <Route path="/rules" element={<Rules />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

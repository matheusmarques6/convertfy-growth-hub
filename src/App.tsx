import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Componentes de autenticação
import { PrivateRoute, AdminRoute } from "@/components/auth/PrivateRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";

// Páginas públicas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import ResetPassword from "./pages/public/ResetPassword";

// Páginas protegidas
import Dashboard from "./pages/dashboard/Dashboard";
import Inbox from "./pages/inbox/Inbox";
import Chatbots from "./pages/chatbots/Chatbots";
import FlowBuilder from "./pages/flow/FlowBuilder";
import Broadcast from "./pages/broadcast/Broadcast";
import CampaignDetail from "./pages/broadcast/CampaignDetail";
import Contacts from "./pages/contacts/Contacts";
import Phonebook from "./pages/phonebook/Phonebook";
import Templates from "./pages/templates/Templates";
import Agents from "./pages/agents/Agents";
import Settings from "./pages/settings/Settings";
import Instances from "./pages/instances/Instances";
import Plans from "./pages/plans/Plans";

// Páginas de admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminSettings from "./pages/admin/AdminSettings";
import OnboardingStores from "./pages/onboarding/OnboardingStores";
import OnboardingStoreDetails from "./pages/onboarding/OnboardingStoreDetails";
import OnboardingAutomations from "./pages/onboarding/OnboardingAutomations";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Página inicial pública */}
          <Route path="/" element={<Index />} />

          {/* Rotas públicas (redireciona se já logado) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
              <ResetPassword />
            </PublicRoute>
            }
          />

          {/* Onboarding */}
          <Route path="/onboarding/stores" element={<OnboardingStores />} />
          <Route path="/onboarding/stores/new" element={<OnboardingStoreDetails />} />
          <Route path="/onboarding/stores/new/automations" element={<OnboardingAutomations />} />

          {/* Rotas protegidas (requer autenticação) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <PrivateRoute>
                <Inbox />
              </PrivateRoute>
            }
          />
          <Route
            path="/chatbots"
            element={
              <PrivateRoute>
                <Chatbots />
              </PrivateRoute>
            }
          />
          <Route
            path="/flow/:id"
            element={
              <PrivateRoute>
                <FlowBuilder />
              </PrivateRoute>
            }
          />
          <Route
            path="/broadcast"
            element={
              <PrivateRoute>
                <Broadcast />
              </PrivateRoute>
            }
          />
          <Route
            path="/broadcast/:id"
            element={
              <PrivateRoute>
                <CampaignDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <PrivateRoute>
                <Contacts />
              </PrivateRoute>
            }
          />
          <Route
            path="/phonebook"
            element={
              <PrivateRoute>
                <Phonebook />
              </PrivateRoute>
            }
          />
          <Route
            path="/templates"
            element={
              <PrivateRoute>
                <Templates />
              </PrivateRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <PrivateRoute>
                <Agents />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/instances"
            element={
              <PrivateRoute>
                <Instances />
              </PrivateRoute>
            }
          />
          <Route
            path="/plans"
            element={
              <PrivateRoute>
                <Plans />
              </PrivateRoute>
            }
          />

          {/* Rotas de admin (requer role admin) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/plans"
            element={
              <AdminRoute>
                <AdminPlans />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            }
          />

          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DesignerPage from "./pages/DesignerPage";
import ProfilePage from "./pages/ProfilePage";
import CollectionPage from "./pages/CollectionPage";
import AuthPage from "./pages/AuthPage";
import ManufacturersPage from "./pages/ManufacturersPage";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import { ManufacturerPortalLayout } from "./components/layout/ManufacturerPortalLayout";
import { ManufacturerOrdersPage } from "./pages/manufacturer/ManufacturerOrdersPage";
import { ManufacturerWalletPage } from "./pages/manufacturer/ManufacturerWalletPage";
import { ManufacturerPortfolioPage } from "./pages/manufacturer/ManufacturerPortfolioPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Navigate } from "react-router-dom";

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
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/designer" element={<DesignerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/manufacturers" element={<ManufacturersPage />} />
            
            {/* Manufacturer Portal Routes */}
            <Route path="/manufacturer" element={
              <ProtectedRoute>
                <ManufacturerPortalLayout />
              </ProtectedRoute>
            }>
              <Route path="orders" element={<ManufacturerOrdersPage />} />
              <Route path="wallet" element={<ManufacturerWalletPage />} />
              <Route path="portfolio" element={<ManufacturerPortfolioPage />} />
            </Route>
            
            {/* Legacy redirect */}
            <Route path="/manufacturer-dashboard" element={<Navigate to="/manufacturer/orders" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Admin from "./pages/Admin.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Register from "./pages/Register.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import DataDeletion from "./pages/DataDeletion.tsx";
import NotFound from "./pages/NotFound.tsx";
import DynamicPage from "./pages/DynamicPage.tsx";
import HomePage from "./pages/redesign/HomePage.tsx";
import RoomsPage from "./pages/redesign/RoomsPage.tsx";
import SurroundingsPage from "./pages/redesign/SurroundingsPage.tsx";
import BookingPage from "./pages/redesign/BookingPage.tsx";
import ContactPage from "./pages/redesign/ContactPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/legacy" element={<Index />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/surroundings" element={<SurroundingsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import Diary from "./pages/Diary";
import DiaryEntry from "./pages/DiaryEntry"; // Add import for new page
import Cafes from "./pages/Cafes";
import Cozy from "./pages/Cozy.tsx";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/recipes" element={<Recipes />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/diary/:id" element={<DiaryEntry />} /> {/* Add new route */}
          <Route path="/cafes" element={<Cafes />} />
          <Route path="/cozy" element={<Cozy />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

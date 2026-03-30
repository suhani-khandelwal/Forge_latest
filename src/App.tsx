import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UploadProvider } from "@/context/UploadContext";
import Index from "./pages/Index";
import UploadPage from "./pages/UploadPage";
import MinePage from "./pages/MinePage";
import LoadingPage from "./pages/LoadingPage";
import ResultsPage from "./pages/ResultsPage";
import IntelligencePage from "./pages/IntelligencePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UploadProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/mine" element={<MinePage />} />
            <Route path="/loading" element={<LoadingPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/intelligence/:id" element={<IntelligencePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UploadProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

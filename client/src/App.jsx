import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <AppRoutes key={location.pathname} location={location} />
    </AnimatePresence>
  );
}

// Context: AuthProvider wrapped

// Fix: fail-safe JWT decoding from hash

// Fix: implicit OAuth hash parser

// Booking: confirmation toast notification

// Hook: streamlined useAuth hook

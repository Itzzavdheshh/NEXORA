import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../services/supabaseClient";
import { authService } from "../../services/authService";
import { authStorage } from "../../utils/authStorage";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_HOME } from "../../constants/app";
import { Button } from "../../components/ui/Button";

const LOG = (...args) => console.log("[NEXORA-AUTH-CALLBACK]", ...args);

export function AuthCallbackPage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { persistSession } = useAuth();

  useEffect(() => {
    let isMounted = true;
    let processed = false;

    LOG("=== AuthCallbackPage mounted ===");
    LOG("pathname:", window.location.pathname);
    LOG("search:", window.location.search);
    LOG("hash:", window.location.hash);
    LOG("localStorage token at mount:", authStorage.getToken());
    LOG("localStorage user at mount:", authStorage.getUser());

    async function processSession(session) {
      LOG("processSession called — processed:", processed, "has access_token:", !!session?.access_token);
      if (processed || !session?.access_token) {
        LOG("SKIPPED processSession — already processed or no token");
        return;
      }
      processed = true;

      try {
        const token = session.access_token;
        const requestedRole = localStorage.getItem("nexora.oauth_role") || "student";
        const authUser = session.user;

        LOG("--- Step 1: processSession data ---");
        LOG("token (first 30 chars):", token.slice(0, 30));
        LOG("requestedRole:", requestedRole);
        LOG("authUser.id:", authUser?.id);
        LOG("authUser.email:", authUser?.email);

        // 1. Immediately store token & fallback user
        authStorage.setToken(token);
        LOG("localStorage after setToken:", authStorage.getToken()?.slice(0, 30));

        const fallbackUser = {
          auth_id: authUser?.id,
          id: authUser?.id,
          full_name:
            authUser?.user_metadata?.full_name ||
            authUser?.user_metadata?.name ||
            (authUser?.email ? authUser.email.split("@")[0] : "Nexora User"),
          email: authUser?.email || `${authUser?.id}@oauth.local`,
          role: requestedRole,
          status: "active",
        };

        authStorage.setUser(fallbackUser);
        LOG("fallbackUser stored:", fallbackUser);
        LOG("localStorage user after setUser:", authStorage.getUser());

        // 2. Try syncing profile with backend
        let finalUser = fallbackUser;
        try {
          LOG("--- Step 2: calling oauthSync ---");
          const syncRes = await authService.oauthSync({ role: requestedRole });
          LOG("oauthSync raw response:", JSON.stringify(syncRes));
          const candidate = syncRes?.data || syncRes?.user || syncRes;
          if (candidate && typeof candidate === "object") {
            finalUser = candidate.data && !candidate.role ? candidate.data : candidate;
          }
          LOG("finalUser after sync:", JSON.stringify(finalUser));
        } catch (syncErr) {
          LOG("oauthSync FAILED:", syncErr?.message, syncErr?.status);
          LOG("Will use fallbackUser instead");
        }

        if (finalUser && finalUser.data && typeof finalUser.data === "object" && !finalUser.role) {
          finalUser = finalUser.data;
          LOG("finalUser unwrapped from .data:", finalUser);
        }

        LOG("--- Step 3: finalUser.role:", finalUser?.role);

        localStorage.removeItem("nexora.oauth_role");

        // 3. Persist into AuthContext
        if (isMounted) {
          LOG("--- Step 4: calling persistSession ---");
          persistSession({ token, user: finalUser });
          LOG("persistSession called with user.role:", finalUser?.role);
        }

        // 4. Navigate using React Router (NOT window.location.href)
        const targetRole = finalUser?.role || requestedRole || "student";
        const redirectPath = ROLE_HOME[targetRole] || "/student/dashboard";
        LOG("--- Step 5: navigating to:", redirectPath, "using navigate()");

        // Use React Router navigate — preserves React state, no full reload
        if (isMounted) {
          navigate(redirectPath, { replace: true });
        }
      } catch (err) {
        console.error("[NEXORA-AUTH-CALLBACK] processSession error:", err);
        if (isMounted) {
          setError(err.message || "Failed to complete authentication.");
        }
      }
    }

    async function handleAuth() {
      try {
        LOG("--- handleAuth: calling supabase.auth.getSession() ---");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        LOG("getSession result — session:", !!session, "error:", sessionError?.message);

        if (sessionError) throw sessionError;

        if (session) {
          LOG("Session found immediately, calling processSession");
          await processSession(session);
          return;
        }

        LOG("No session yet — subscribing to onAuthStateChange");
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          LOG("onAuthStateChange fired — event:", event, "has session:", !!newSession);
          if (newSession && !processed) {
            processSession(newSession);
          }
        });

        const timer = setTimeout(() => {
          if (!processed && isMounted) {
            LOG("TIMEOUT — no session received in 6 seconds");
            setError("Authentication session timed out. Please try signing in again.");
          }
        }, 6000);

        return () => {
          subscription?.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err) {
        console.error("[NEXORA-AUTH-CALLBACK] handleAuth error:", err);
        if (isMounted) {
          setError(err.message || "OAuth login failed.");
        }
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
      LOG("=== AuthCallbackPage unmounted ===");
    };
  }, [persistSession, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-lg border border-border-subtle bg-[var(--bg-elevated)] p-8 shadow-md">
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-danger/10 text-accent-danger">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Authentication Failed</h2>
            <p className="text-xs text-text-secondary leading-relaxed">{error}</p>
            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => navigate("/login", { replace: true })}
            >
              Return to Login
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent-primary" />
            <h2 className="text-base font-semibold text-text-primary">Completing sign in…</h2>
            <p className="text-xs text-text-secondary">
              Synchronizing your account with Nexora workspace.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

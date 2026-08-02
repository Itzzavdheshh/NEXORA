const supabase = require("../config/supabase");

/**
 * Safely decodes a JWT payload without external libraries
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    const token = authHeader.split(" ")[1];
    let authUser = null;

    // 1. Primary verification via Supabase Auth API
    try {
      const result = await supabase.auth.getUser(token);
      if (result.data?.user) {
        authUser = result.data.user;
      }
    } catch (err) {
      console.warn("Primary supabase.auth.getUser failed:", err.message);
    }

    // 2. Fallback verification via token payload + admin.getUserById
    if (!authUser) {
      const payload = decodeJwtPayload(token);
      const userId = payload?.sub;
      const isNotExpired = payload?.exp ? payload.exp * 1000 > Date.now() : false;

      if (userId && isNotExpired) {
        const { data: adminUserRes, error: adminErr } = await supabase.auth.admin.getUserById(userId);
        if (!adminErr && adminUserRes?.user) {
          authUser = adminUserRes.user;
        }
      }
    }

    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // 3. Fetch application user profile from public.users
    let { data: appUser } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authUser.id)
      .maybeSingle();

    // 4. Self-healing / auto-provisioning for OAuth users
    if (!appUser) {
      const fullName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        (authUser.email ? authUser.email.split("@")[0] : "Nexora User");
      const role = authUser.user_metadata?.role || "student";

      const { data: newProfile, error: createError } = await supabase
        .from("users")
        .upsert(
          {
            auth_id: authUser.id,
            full_name: fullName,
            email: authUser.email || `${authUser.id}@oauth.local`,
            role: role,
            status: "active",
          },
          { onConflict: "auth_id" }
        )
        .select()
        .maybeSingle();

      if (createError) {
        return res.status(500).json({
          success: false,
          message: `User profile initialization failed: ${createError.message}`,
        });
      }
      appUser = newProfile;
    }

    // Reject users with restricted status
    if (appUser.status !== "active") {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your account status is currently ${appUser.status}.`,
      });
    }

    // Attach complete application user
    req.user = appUser;

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = authenticate;
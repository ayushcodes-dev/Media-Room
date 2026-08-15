import { signout } from "@/api/auth.js";

/**
 * Handle user signout: call backend API, clear local storage session, and update UI state
 */
async function handleUserSignout() {
  try {
    const res = await signout();
    // Clear user auth cache in localStorage
    localStorage.removeItem("user_auth");
    return res;
  } catch (err) {
    console.error("Signout error:", err);
    localStorage.removeItem("user_auth");
    return { success: false, message: "Signout failed" };
  }
}

export default handleUserSignout;

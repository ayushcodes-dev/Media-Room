import { deleteAccountAPI } from "@/api/auth.js";

/**
 * Handle permanent account deletion: call backend API and clear local cache
 */
async function handleUserDeleteAccount() {
  try {
    const res = await deleteAccountAPI();
    localStorage.removeItem("user_auth");
    return res;
  } catch (err) {
    console.error("Delete account error:", err);
    localStorage.removeItem("user_auth");
    return { success: false, message: "Delete account failed" };
  }
}

export default handleUserDeleteAccount;

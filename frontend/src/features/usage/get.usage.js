import { getUsageAPI } from "@/api/usage.js";

async function getUsage({ orderID }, callbacks = {}) {
  try {
    const res = await getUsageAPI({ orderID });
    if (res && res.success && res.data) {
      if (typeof callbacks.setUsageLogs === "function") {
        callbacks.setUsageLogs(Array.isArray(res.data.usage) ? [...res.data.usage] : []);
      }
      if (typeof callbacks.setUsageData === "function") {
        callbacks.setUsageData(res.data);
      }
      return res.data;
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch usage:", err);
    return null;
  }
}
export default getUsage;
import { getPaymentHistoryAPI } from "@/api/billing.js";

async function getPaymentHistory({ setPaymentHistory }) {
  const history = await getPaymentHistoryAPI();
  if (history && history.success) {
    console.log("Payment history API response:", history);
    const plansList =
      history.data?.plans ||
      history.data?.history ||
      (Array.isArray(history.data) ? history.data : []);
    if (plansList && plansList.length > 0) {
      setPaymentHistory([...plansList]);
    }
  }
}

export default getPaymentHistory;
// src/service/PricingService.ts
export const createSubscription = async (planKey: string) => {
  try {
    const token = await window.shopify.idToken();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/billing/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`

      },
      // Request payload: { "plan": "go" }
      body: JSON.stringify({ plan: planKey })
    });

    if (!response.ok) {
      throw new Error("Failed to create subscription API");
    }

    const result = await response.json();

    // Return response data
    return result.data;
  } catch (error) {
    console.error("[PricingService] Lỗi khi tạo subscription:", error);
    throw error;
  }
};

export const fetchBillingUsage = async () => {
  try {
    const token = await window.shopify.idToken();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/billing/usage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch billing usage");
    }

    const result = await response.json();
    return result.data; // Return usage and subscription details
  } catch (error) {
    console.error("[PricingService] Lỗi khi lấy thông tin usage:", error);
    throw error;
  }
};


export const fetchBillingPlans = async () => {
  try {
    const token = await window.shopify.idToken();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/billing/plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch billing plans");
    }

    const result = await response.json();
    return result.data; // Return array of pricing plans
  } catch (error) {
    console.error("[PricingService] Lỗi khi lấy danh sách gói cước:", error);
    throw error;
  }
};

/**
 * Cancel the current subscription plan
 */
export const cancelSubscription = async () => {
  try {
    const token = await window.shopify.idToken();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/billing/cancel`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ "prorate": false })
    });

    if (!response.ok) {
      throw new Error("Failed to cancel subscription");
    }

    return await response.json();
  } catch (error) {
    console.error("[PricingService] Lỗi khi hủy gói cước:", error);
    throw error;
  }
};
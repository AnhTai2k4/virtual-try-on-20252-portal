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
      // Request body truyền lên { "plan": "go" }
      body: JSON.stringify({ plan: planKey }) 
    });

    if (!response.ok) {
      throw new Error("Failed to create subscription API");
    }

    const result = await response.json();

    // Trả về thẳng object 'data' theo cấu trúc ảnh image_bf375c.png
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
    return result.data; // Trả về object data chứa plan, usage, subscription...
  } catch (error) {
    console.error("[PricingService] Lỗi khi lấy thông tin usage:", error);
    throw error;
  }
};
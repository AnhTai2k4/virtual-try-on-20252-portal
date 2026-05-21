import appConfig from '@/configs/app';
// src/service/PricingService.ts
export const createSubscription = async (planKey: string) => {
  try {
    const token = await window.shopify.idToken();
    const response = await fetch(`${appConfig.API_URL}/api/portal/billing/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`

      },
      // Request body sent: { "plan": "go" }
      body: JSON.stringify({ plan: planKey })
    });

    if (!response.ok) {
      throw new Error("Failed to create subscription API");
    }

    const result = await response.json();

    // Return 'data' object directly matching image_bf375c.png structure
    return result.data;
  } catch (error) {
    console.error("[PricingService] Error creating subscription:", error);
    throw error;
  }
};

export const fetchBillingUsage = async () => {
  try {
    const token = await window.shopify.idToken();
    const response = await fetch(`${appConfig.API_URL}/api/portal/billing/usage`, {
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
    return result.data; // Return data object containing plan, usage, subscription...
  } catch (error) {
    console.error("[PricingService] Error fetching billing usage:", error);
    throw error;
  }
};


export const fetchBillingPlans = async () => {
  try {
    const token = await window.shopify.idToken();
    const response = await fetch(`${appConfig.API_URL}/api/portal/billing/plans`, {
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
    return result.data; // Return billing plans array
  } catch (error) {
    console.error("[PricingService] Error fetching billing plans:", error);
    throw error;
  }
};

/**
 * Call API to cancel the current subscription plan
 */
export const cancelSubscription = async () => {
  try {
    const token = await window.shopify.idToken();
    const response = await fetch(`${appConfig.API_URL}/api/portal/billing/cancel`, {
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
    console.error("[PricingService] Error cancelling subscription:", error);
    throw error;
  }
};
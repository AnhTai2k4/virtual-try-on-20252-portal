export const getSetting = async () => {
  const token = await window.shopify.idToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/tryon/settings`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`

    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.data;

}

export const setSetting = async (data: object) => {
  const token = await window.shopify.idToken();
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/portal/tryon/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`

    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const result = await response.json();
  return result.data;

}

export const fetchShopifyMetafield = async () => {
  try {
    await (window as any).shopify?.idToken();
    const query = `
      query {
        shop {
          id
          metafield(namespace: "custom_vto", key: "require_login") {
            value
          }
        }
      }
    `;

    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const result = await res.json();
    
    let shopId = null;
    let requireLogin = false;

    if (result.data?.shop) {
      shopId = result.data.shop.id;
      const mfValue = result.data.shop.metafield?.value;
      if (mfValue !== undefined) {
        requireLogin = mfValue === "true";
      }
    }

    // Trả về một Object chứa cả Shop ID và trạng thái Login
    return { shopId, requireLogin };
  } catch (error) {
    console.error("[SettingService] Lỗi khi tải Shopify Metafield:", error);
    throw error;
  }
};

/**
 * Cập nhật Metafield require_login lên Shopify Admin API
 */
export const updateShopifyMetafield = async (shopId: string, requireLogin: boolean) => {
  if (!shopId) throw new Error("Shop ID missing. Cannot update metafield.");

  try {
    const query = `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { message }
        }
      }
    `;
    
    const variables = {
      metafields: [
        {
          ownerId: shopId,
          namespace: "custom_vto",
          key: "require_login",
          type: "boolean",
          value: requireLogin ? "true" : "false" 
        }
      ]
    };

    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });

    const result = await res.json();
    if (result.data?.metafieldsSet?.userErrors?.length > 0) {
      throw new Error(result.data.metafieldsSet.userErrors[0].message);
    }

    return true; // Trả về true nếu thành công
  } catch (error) {
    console.error("[SettingService] Lỗi khi cập nhật Shopify Metafield:", error);
    throw error;
  }
};
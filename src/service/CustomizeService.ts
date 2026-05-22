// src/service/CustomizeService.ts

export const getCustomizationSettings = async () => {
  try {
    await (window as any).shopify.idToken();
    
    const graphqlQuery = {
      query: `
        query {
          shop {
            id
            metafield(namespace: "custom_vto", key: "button_settings") {
              value
            }
          }
        }
      `
    };

    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphqlQuery),
    });

    const result = await res.json();
    
    if (result.errors) throw new Error(result.errors[0].message);
    
    const shop = result.data?.shop;
    let settings = null;
    
    // Parse JSON settings if the shop has saved configurations before
    if (shop?.metafield?.value) {
      settings = JSON.parse(shop.metafield.value);
    }

    return { shopId: shop?.id, settings };
  } catch (error) {
    console.error("[CustomizeService] Error loading customization settings:", error);
    throw error;
  }
};

/**
 * Save theme customization settings to Shop Metafields
 */
export const updateCustomizationSettings = async (shopId: string, settingsData: any) => {
  try {
    const graphqlQuery = {
      query: `
        mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        metafields: [
          {
            ownerId: shopId,
            namespace: "custom_vto",
            key: "button_settings",
            type: "json",
            value: JSON.stringify(settingsData)
          }
        ]
      }
    };

    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphqlQuery),
    });

    const result = await res.json();

    if (result.data?.metafieldsSet?.userErrors?.length > 0) {
      throw new Error(result.data.metafieldsSet.userErrors[0].message);
    }

    return result.data?.metafieldsSet?.metafields;
  } catch (error) {
    console.error("[CustomizeService] Error saving customization settings:", error);
    throw error;
  }
};

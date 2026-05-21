/**
 * Check Step 1: Has the app block been added to the product template in the theme?
 */
export const checkAddButtonStep = async (): Promise<boolean> => {
  try {
    const res = await fetch('shopify:admin/api/2024-10/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          themes(first: 1, roles: MAIN) {
            nodes {
              files(filenames: ["templates/product.json"], first: 1) {
                nodes {
                  body {
                    ... on OnlineStoreThemeFileBodyText {
                      content
                    }
                  }
                }
              }
            }
          }
        }`
      })
    });
    
    const data = await res.json();
    
    // Get template file content from returned JSON
    const themeNode = data?.data?.themes?.nodes?.[0];
    const fileNode = themeNode?.files?.nodes?.[0];
    const content = fileNode?.body?.content;

    if (!content) {
      console.warn('[Setup Step 1] Failed to read templates/product.json via GraphQL');
      return false;
    }

    console.log('[Setup Step 1] RAW CONTENT of product.json is:', content);

    // The handle in Shopify might still be taitta-20252 despite the app name change.
    // Include fallback checks for both new and old handles for complete safety.
    const hasAppBlock = 
      content.includes('taitta-20252') || 
      content.includes('staging-virtual-try-on') || 
      content.includes('app-embed') || 
      content.includes('app-sdk');
      
    console.log('[Setup Step 1] Block check result:', hasAppBlock);

    return hasAppBlock;
  } catch (error) {
    console.error('[Setup Step 1] ERROR:', error);
    return false;
  }
};

/**
 * Check Step 2: Has the shop configured the launch mode?
 */
export const checkAddProductStep = async (): Promise<boolean> => {
  try {
    const res = await fetch('shopify:admin/api/2024-10/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          shop {
            metafield(namespace: "custom", key: "vto_launch_mode") {
              value
            }
          }
        }`
      })
    });
    const data = await res.json();
    const launchMode = data?.data?.shop?.metafield?.value;
    // Valid value AND not equal to "none" (disabled) -> configured
    return !!launchMode && launchMode.length > 0 && launchMode !== 'none';
  } catch (error) {
    console.warn('[Setup] Failed to verify vto_launch_mode metafield:', error);
    return false;
  }
};

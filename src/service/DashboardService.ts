/**
 * Step 1: Check if the app block is added to the product template in the theme
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
    
    // Get template content from GraphQL response
    const themeNode = data?.data?.themes?.nodes?.[0];
    const fileNode = themeNode?.files?.nodes?.[0];
    const content = fileNode?.body?.content;

    if (!content) {
      console.warn('[Setup Step 1] Failed to read templates/product.json via GraphQL');
      return false;
    }

    console.log('[Setup Step 1] templates/product.json content:', content);

    // Support both old and new app handles for compatibility
    const hasAppBlock = 
      content.includes('taitta-20252') || 
      content.includes('staging-virtual-try-on') || 
      content.includes('app-embed') || 
      content.includes('app-sdk');
      
    console.log('[Setup Step 1] App block check result:', hasAppBlock);

    return hasAppBlock;
  } catch (error) {
    console.error('[Setup Step 1] ERROR:', error);
    return false;
  }
};

/**
 * Step 2: Check if the store launch mode has been configured
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
    // Launch mode is configured if it exists and is not disabled ('none')
    return !!launchMode && launchMode.length > 0 && launchMode !== 'none';
  } catch (error) {
    console.warn('[Setup Step 2] Failed to check vto_launch_mode metafield:', error);
    return false;
  }
};

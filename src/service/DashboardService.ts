/**
 * Kiểm tra Bước 1: App block đã được thêm vào product template trong theme chưa?
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
    
    // Lấy nội dung file template từ JSON trả về
    const themeNode = data?.data?.themes?.nodes?.[0];
    const fileNode = themeNode?.files?.nodes?.[0];
    const content = fileNode?.body?.content;

    if (!content) {
      console.warn('[Setup Step 1] Không đọc được templates/product.json qua GraphQL');
      return false;
    }

    // Tìm app handle trong nội dung template
    const hasAppBlock = content.includes('taitta-20252') || content.includes('app-sdk');
    return hasAppBlock;
  } catch (error) {
    console.error('[Setup Step 1] LỖI:', error);
    return false;
  }
};

/**
 * Kiểm tra Bước 2: Shop đã cấu hình launch mode chưa?
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
    // Có giá trị hợp lệ VÀ khác "none" (disable all) → đã cấu hình
    return !!launchMode && launchMode.length > 0 && launchMode !== 'none';
  } catch (error) {
    console.warn('[Setup] Không thể kiểm tra metafield vto_launch_mode:', error);
    return false;
  }
};

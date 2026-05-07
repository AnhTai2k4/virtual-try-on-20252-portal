// Định nghĩa kiểu cho Metafield để TypeScript bắt lỗi nếu truyền thiếu dữ liệu
export interface MetafieldDef {
  namespace: string;
  key: string;
  value: string;
}

/**
 * Lấy token xác thực từ App Bridge của Shopify
 */
const initToken = async (): Promise<void> => {
  const shopifyObj = (window as any).shopify;
  if (shopifyObj && shopifyObj.idToken) {
    await shopifyObj.idToken();
  }
};

/**
 * 1. Gọi API lấy thông tin cấu hình VTO Mode hiện tại của Shop
 */
export const getShopData = async (): Promise<any> => {
  await initToken();
  
  const shopQuery = {
    query: `
      query getShopData {
        shop {
          id
          launchMode: metafield(namespace: "custom", key: "vto_launch_mode") { value }
        }
      }
    `
  };
  
  const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(shopQuery),
  });
  const result = await res.json();
  return result.data.shop;
};

/**
 * 2. Gọi API lấy toàn bộ danh sách Sản phẩm và Biến thể
 */
export const getProductsData = async (): Promise<any[]> => {
  await initToken();
  
  const productQuery = {
    query: `
      query getProducts {
        products(first: 250) {
          edges {
            node {
              id title featuredImage { url }
              vtoStatus: metafield(namespace: "custom", key: "vto_enabled") { value }
              variants(first: 20) {
                edges {
                  node {
                    id title image { url }
                    vtoStatus: metafield(namespace: "custom", key: "vto_enabled") { value }
                    product { id } 
                  }
                }
              }
            }
          }
        }
      }
    `
  };

  const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productQuery),
  });
  const result = await res.json();
  return result.data.products.edges.map((e: any) => e.node);
};

/**
 * 3. Cập nhật Metafield hàng loạt cho Shopify (Tự động chia nhỏ 25 item/lần)
 */
export const batchUpdateMetafields = async (ownerIds: string[], metafieldDefs: MetafieldDef[]): Promise<void> => {
  await initToken();
  const chunkSize = 25; 
  
  for (let i = 0; i < ownerIds.length; i += chunkSize) {
    const chunk = ownerIds.slice(i, i + chunkSize);
    
    const metafields = chunk.flatMap(id => 
      metafieldDefs.map(def => ({
        ownerId: id,
        namespace: def.namespace,
        key: def.key,
        type: def.key === "vto_launch_mode" ? "single_line_text_field" : "boolean",
        value: def.value
      }))
    );

    const graphqlQuery = {
      query: `mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { userErrors { message } } }`,
      variables: { metafields }
    };

    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(graphqlQuery)
    });
    const result = await res.json();
    if (result.data?.metafieldsSet?.userErrors?.length > 0) {
      throw new Error(result.data.metafieldsSet.userErrors[0].message);
    }
  }
};
<template lang="pug">
ui-title-bar(title="Taitta VTON - Products")

Page(title="Product Management")
    //- ==========================================
    //- GIAO DIỆN "CHOOSE PRODUCT TO LAUNCH" (INLINE)
    //- ==========================================
    Card(class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ")      
      div(class="px-6 py-5 border-b border-gray-200 ")
        div(class="flex justify-between items-start")
          
          //- Khối bên trái: Icon + Title + Subtitle
          div(class="flex gap-4")
            //- Icon Box (Giỏ hàng) có đổ bóng nhẹ
            //- div(class="hidden sm:flex items-center justify-center w-12 h-12 bg-white rounded-xl border border-gray-200 shadow-sm text-gray-700")
            //-   svg(class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24")
            //-     path(stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z")
            
            div(class="text-sm")
              div(class="flex items-center gap-2.5")
                h1(class="!font-bold !text-base ") Choose product to launch
                //- Badge nổi bật
              
              //- Subtitle giải thích chi tiết
              p(class=" mt-1.5 text-gray-500 leading-relaxed max-w-xl") 
                | Select where the Virtual Try-On button should appear on your storefront. You can apply it globally or restrict it to specific items to control quota.

          //- Khối bên phải: Nút Help/Guide
          button(class="hidden md:flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-800 transition-colors mt-1")
            svg(class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
              path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")
            | View guide
       
      //- BODY (RADIO OPTIONS)
      div(class="p-6 space-y-5")
        
        //- Option 1: Specific products
        label(class="flex items-start gap-3 cursor-pointer group")
          div(class="pt-0.5")
            input(
              type="radio" 
              v-model="launchMode" 
              value="specific_products" 
              @change="handleModeChange"
              class="w-4 h-4 text-gray-900 border-gray-400 focus:ring-gray-900"
            )
          div
            div(class="font-medium text-gray-900") Specific products
            div(class="text-sm text-gray-500 mt-0.5") Choose products to apply this option set. Learn more about #[a(href="#" class="text-blue-600 hover:underline") apply on products]
        
        //- Option 2: Specific variants
        label(class="flex items-start gap-3 cursor-pointer group")
          div(class="pt-0.5")
            input(
              type="radio" 
              v-model="launchMode" 
              value="specific_variants" 
              @change="handleModeChange"
              class="w-4 h-4 text-gray-900 border-gray-400 focus:ring-gray-900"
            )
          div
            div(class="font-medium text-gray-900") Specific variants
            div(class="text-sm text-gray-500 mt-0.5") Choose specific variants to apply this option set. Learn more about #[a(href="#" class="text-blue-600 hover:underline") apply on specific variants]
        
        //- Option 3: All products
        label(class="flex items-start gap-3 cursor-pointer group")
          div(class="pt-0.5")
            input(
              type="radio" 
              v-model="launchMode" 
              value="all" 
              @change="handleModeChange"
              class="w-4 h-4 text-gray-900 border-gray-400 focus:ring-gray-900"
            )
          div
            div(class="font-medium text-gray-900") All products
            div(class="text-sm text-gray-500 mt-0.5") Apply this option set to all products on your store, except for those that have been applied manually or automatically.

        //- ==========================================
        //- VÙNG CHỌN SẢN PHẨM & HIỂN THỊ DANH SÁCH
        //- ==========================================
        div(v-if="launchMode !== 'all'" class="pt-6 border-t border-gray-200 mt-6")
          
          button(
            @click="triggerPicker"
            class="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          ) Choose products
          
          div(class="mt-4 text-sm text-gray-800 font-medium mb-3") {{ selectedItems.length }} {{ launchMode === 'specific_products' ? 'products' : 'variants' }} selected

          //- Loading State khi đang fetch data cũ
          div(v-if="isLoadingData" class="py-4 text-center text-sm text-gray-500 flex justify-center items-center gap-2")
            svg(class="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
              circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
              path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
            span Đang tải danh sách hiện tại...

          //- Danh sách Item đã chọn
          div(v-else class="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar")
            div(
              v-for="(item, index) in selectedItems" 
              :key="item.id" 
              class="flex items-center justify-between p-2 bg-white rounded-lg group"
            )
              div(class="flex items-center gap-4")
                img(v-if="item.image" :src="item.image" class="w-10 h-10 rounded border border-gray-200 object-cover")
                div(class="w-10 h-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400" v-else) 📦
                span(class="text-sm text-gray-800") {{ item.title }}
              
              button(
                @click="removeItem(index)" 
                class="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                title="Remove item"
              )
                svg(class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
                  path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16")
      //- FOOTER ACTIONS
      div(class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50")
        button(
          @click="resetSelection"
          class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm"
        ) Cancel
        
        button(
          @click="applySettings"
          :disabled="isApplying"
          class="px-6 py-2 text-sm font-medium text-white bg-[#1a1a1a] rounded-lg hover:bg-black shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        ) 
          span(v-if="!isApplying") Apply
          span(v-else) Applying...
          svg(v-if="isApplying" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
            circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
            path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

</template>

<script setup>
import { ref, onMounted } from 'vue';

// ==========================================
// A. KHAI BÁO BIẾN TRẠNG THÁI (STATE)
// ==========================================
const launchMode = ref('specific_products');
const selectedItems = ref([]);
const isLoadingData = ref(false);
const isApplying = ref(false);
const shopId = ref(null); 

const previouslyEnabledIds = ref([]);

// ==========================================
// B. HÀM LẤY DỮ LIỆU TỪ SHOPIFY (FETCH)
// ==========================================
const fetchCurrentState = async (isInitialLoad = false) => {
  isLoadingData.value = true;
  selectedItems.value = [];
  previouslyEnabledIds.value = [];
  
  try {
    await window.shopify.idToken();
    
    // 1. Lấy ID của Shop và Mode đang lưu
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
    
    const shopRes = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(shopQuery),
    });
    const shopResult = await shopRes.json();
    shopId.value = shopResult.data.shop.id;
    
    // CHỈ ghi đè lại Mode từ Database nếu là lần tải đầu tiên (F5) hoặc bấm Cancel
    if (isInitialLoad && shopResult.data.shop.launchMode?.value) {
      launchMode.value = shopResult.data.shop.launchMode.value;
    }

    // 2. Chỉ tải danh sách sản phẩm nếu KHÔNG chọn "All products"
    if (launchMode.value !== 'all') {
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
                      }
                    }
                  }
                }
              }
            }
          }
        `
      };

      const productRes = await fetch('shopify:admin/api/2026-04/graphql.json', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productQuery),
      });
      const productResult = await productRes.json();
      const products = productResult.data.products.edges.map(e => e.node);

      // Phân loại data đưa lên giao diện
      if (launchMode.value === 'specific_products') {
        const enabledProducts = products.filter(p => p.vtoStatus?.value === 'true');
        previouslyEnabledIds.value = enabledProducts.map(p => p.id);
        
        selectedItems.value = enabledProducts.map(p => ({
          id: p.id, title: p.title, image: p.featuredImage?.url
        }));
      } 
      else if (launchMode.value === 'specific_variants') {
        let enabledVariants = [];
        products.forEach(p => {
          p.variants.edges.forEach(vEdge => {
            const v = vEdge.node;
            if (v.vtoStatus?.value === 'true') {
              previouslyEnabledIds.value.push(v.id);
              enabledVariants.push({
                id: v.id, title: `${p.title} - ${v.title}`, image: v.image?.url || p.featuredImage?.url
              });
            }
          });
        });
        selectedItems.value = enabledVariants;
      }
    }
  } catch (error) {
    console.error("Lỗi fetch current state:", error);
  } finally {
    isLoadingData.value = false;
  }
};

// ==========================================
// C. CÁC HÀM XỬ LÝ SỰ KIỆN GIAO DIỆN (UI ACTIONS)
// ==========================================
const handleModeChange = () => {
  // Chuyển radio -> KHÔNG load lại mode từ DB (false) để tránh bị nhảy ngược
  fetchCurrentState(false);
};

const resetSelection = () => {
  // Bấm Cancel -> Xóa sạch thao tác, load lại từ DB (true)
  fetchCurrentState(true); 
};

const removeItem = (index) => selectedItems.value.splice(index, 1);

const triggerPicker = async () => {
  const isVariantMode = launchMode.value === 'specific_variants';
  const preSelectedIds = selectedItems.value.map(item => ({ id: item.id }));

  const selected = await window.shopify.resourcePicker({
    type: "product", 
    multiple: true,
    action: "select", 
    filter: { variants: isVariantMode },
    selectionIds: preSelectedIds
  });

  if (!selected) return;

  let finalSelectionList = [];
  if (isVariantMode) {
    selected.forEach(product => {
      product.variants.forEach(variant => {
        finalSelectionList.push({
          id: variant.id, title: `${product.title} - ${variant.title}`, image: variant.image?.originalSrc || product.images?.[0]?.originalSrc
        });
      });
    });
  } else {
    selected.forEach(product => {
      finalSelectionList.push({
        id: product.id, title: product.title, image: product.images?.[0]?.originalSrc
      });
    });
  }
  selectedItems.value = finalSelectionList;
};

// ==========================================
// D. THUẬT TOÁN ĐỒNG BỘ VÀ LƯU TRỮ (APPLY)
// ==========================================
const applySettings = async () => {
  isApplying.value = true;
  
  try {
    const isAllMode = launchMode.value === 'all';
    
    // 1. Luôn lưu trạng thái Mode và Enable_All cho toàn Shop
    await batchUpdateMetafields([shopId.value], [
      { namespace: "custom", key: "vto_launch_mode", value: launchMode.value },
      { namespace: "custom", key: "vto_enable_all", value: isAllMode ? "true" : "false" }
    ]);

    // 2. Chỉ cập nhật từng Sản phẩm/Biến thể nếu Mode KHÔNG phải là "All"
    if (!isAllMode) {
      const currentSelectedIds = selectedItems.value.map(i => i.id);
      
      const idsToTurnOn = currentSelectedIds.filter(id => !previouslyEnabledIds.value.includes(id));
      const idsToTurnOff = previouslyEnabledIds.value.filter(id => !currentSelectedIds.includes(id));

      if (idsToTurnOn.length > 0) {
        await batchUpdateMetafields(idsToTurnOn, [{ namespace: "custom", key: "vto_enabled", value: "true" }]);
      }
      if (idsToTurnOff.length > 0) {
        await batchUpdateMetafields(idsToTurnOff, [{ namespace: "custom", key: "vto_enabled", value: "false" }]);
      }
    }

    window.shopify.toast.show('Applied VTO settings successfully!');
    
    // Lưu xong thì tải lại trang thái từ DB như mới
    await fetchCurrentState(true);

  } catch (error) {
    console.error("Lỗi Apply:", error);
    window.shopify.toast.show('Failed to apply settings', { isError: true });
  } finally {
    isApplying.value = false;
  }
};

const batchUpdateMetafields = async (ownerIds, metafieldDefs) => {
  await window.shopify.idToken();
  const chunkSize = 25; // Giới hạn của Shopify là 25 metafields mỗi lần gọi
  
  for (let i = 0; i < ownerIds.length; i += chunkSize) {
    const chunk = ownerIds.slice(i, i + chunkSize);
    
    const metafields = chunk.flatMap(id => 
      metafieldDefs.map(def => ({
        ownerId: id,
        namespace: def.namespace,
        key: def.key,
        // Nếu lưu Mode (chữ) thì dùng text, lưu Bật/Tắt thì dùng boolean
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

// ==========================================
// E. LIFECYCLE (CHẠY KHI MỞ TRANG)
// ==========================================
onMounted(() => {
  // Lần đầu mở trang -> Ưu tiên lấy data từ DB (true)
  fetchCurrentState(true);
});
</script>

<style>
/* CSS cho thanh cuộn danh sách sản phẩm được đẹp hơn */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>
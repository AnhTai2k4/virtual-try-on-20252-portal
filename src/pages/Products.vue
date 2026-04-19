<template lang="pug">
ui-title-bar(title="Taitta VTON - Products")

Page
  
  
    //- ==========================================
    //- GIAO DIỆN "CHOOSE PRODUCT TO LAUNCH" (INLINE)
    //- ==========================================
    Card(class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-4")
      
      //- HEADER
      div(class="px-6 py-4 border-b border-gray-200 flex justify-between items-center")
        h1(class="!text-xl font-bold text-gray-900") Choose product to launch
        
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

// --- TRẠNG THÁI UI ---
const launchMode = ref('specific_products');
const selectedItems = ref([]);
const isLoadingData = ref(false);
const isApplying = ref(false);

// --- LƯU TRỮ TRẠNG THÁI GỐC (Dùng để so sánh Tắt/Bật) ---
const previouslyEnabledIds = ref([]);
const allProductIdsStore = ref([]); // Dùng khi chọn "All products"

// ==========================================
// 1. LẤY DỮ LIỆU ĐANG BẬT VTO HIỆN TẠI TỪ SHOPIFY
// ==========================================
const fetchCurrentState = async () => {
  isLoadingData.value = true;
  selectedItems.value = [];
  previouslyEnabledIds.value = [];
  
  try {
    await window.shopify.idToken();
    
    // Query lấy tối đa 250 sản phẩm (Nếu store lớn hơn em cần viết hàm loop Pagination)
    const graphqlQuery = {
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

    const response = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(graphqlQuery),
    });
    const result = await response.json();

    const products = result.data.products.edges.map(e => e.node);
    allProductIdsStore.value = products.map(p => p.id); // Lưu lại toàn bộ ID để dùng cho "All products"

    // Map dữ liệu vào mảng selectedItems dựa theo mode hiện tại
    if (launchMode.value === 'specific_products') {
      const enabledProducts = products.filter(p => p.vtoStatus?.value === 'true');
      previouslyEnabledIds.value = enabledProducts.map(p => p.id);
      
      selectedItems.value = enabledProducts.map(p => ({
        id: p.id,
        title: p.title,
        image: p.featuredImage?.url
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
              id: v.id,
              title: `${p.title} - ${v.title}`,
              image: v.image?.url || p.featuredImage?.url
            });
          }
        });
      });
      selectedItems.value = enabledVariants;
    }

  } catch (error) {
    console.error("Lỗi fetch current state:", error);
  } finally {
    isLoadingData.value = false;
  }
};

// Xử lý khi đổi radio button (Tải lại danh sách tương ứng)
const handleModeChange = () => {
  if (launchMode.value !== 'all') {
    fetchCurrentState();
  }
};

const resetSelection = () => {
  fetchCurrentState();
};

const removeItem = (index) => {
  selectedItems.value.splice(index, 1);
};


// ==========================================
// 2. MỞ RESOURCE PICKER VÀ ĐỒNG BỘ CHECKBOX
// ==========================================
const triggerPicker = async () => {
  const isVariantMode = launchMode.value === 'specific_variants';
  
  // 1. Chuẩn bị mảng ID để Shopify biết cần "Tick xanh" sẵn những ô nào
  const preSelectedIds = selectedItems.value.map(item => ({ id: item.id }));

  // Gọi API chính chủ của Shopify App Bridge
  const selected = await window.shopify.resourcePicker({
    type: "product", 
    multiple: true,
    action: "select", // Giữ nguyên "select" là chuẩn nhất
    filter: { variants: isVariantMode },
    selectionIds: preSelectedIds // <-- BÍ QUYẾT LÀ DÒNG NÀY NÈ BẠN TÔI
  });

  // Nếu user bấm dấu X tắt popup (không lưu)
  if (!selected) return;

  // 2. Xử lý danh sách trả về
  let finalSelectionList = [];

  if (isVariantMode) {
    selected.forEach(product => {
      product.variants.forEach(variant => {
        finalSelectionList.push({
          id: variant.id,
          title: `${product.title} - ${variant.title}`,
          image: variant.image?.originalSrc || product.images?.[0]?.originalSrc
        });
      });
    });
  } else {
    selected.forEach(product => {
      finalSelectionList.push({
        id: product.id,
        title: product.title,
        image: product.images?.[0]?.originalSrc
      });
    });
  }

  // THAY ĐỔI QUAN TRỌNG: GHI ĐÈ TOÀN BỘ thay vì push thêm vào.
  // Vì danh sách `selected` trả về đã phản ánh chính xác thao tác Tích thêm / Bỏ tích của User rồi.
  selectedItems.value = finalSelectionList;
};

// ==========================================
// 3. THUẬT TOÁN ĐỒNG BỘ VÀ CẬP NHẬT (APPLY)
// ==========================================
const applySettings = async () => {
  isApplying.value = true;
  
  try {
    let idsToTurnOn = [];
    let idsToTurnOff = [];

    if (launchMode.value === 'all') {
      // Bật toàn bộ sản phẩm trong cửa hàng
      idsToTurnOn = allProductIdsStore.value;
      // Tắt toàn bộ variant (Để tránh conflict nếu trước đó họ dùng variant)
      // *Thực tế em cần query lấy hết variant id để tắt, ở đây anh mô phỏng logic
    } else {
      // THUẬT TOÁN DIFFING: So sánh mảng cũ và mảng mới
      const currentSelectedIds = selectedItems.value.map(i => i.id);
      
      // 1. Những ID có trong mảng Mới nhưng chưa có trong mảng Cũ -> CẦN BẬT (true)
      idsToTurnOn = currentSelectedIds.filter(id => !previouslyEnabledIds.value.includes(id));
      
      // 2. Những ID có trong mảng Cũ nhưng không còn trong mảng Mới -> CẦN TẮT (false)
      idsToTurnOff = previouslyEnabledIds.value.filter(id => !currentSelectedIds.includes(id));
    }

    // Gửi Batching Updates
    if (idsToTurnOn.length > 0) await batchUpdateMetafields(idsToTurnOn, "true");
    if (idsToTurnOff.length > 0) await batchUpdateMetafields(idsToTurnOff, "false");

    window.shopify.toast.show('Applied VTO settings successfully!');
    
    // Cập nhật lại trạng thái gốc sau khi lưu thành công
    await fetchCurrentState();

  } catch (error) {
    console.error("Lỗi Apply:", error);
    window.shopify.toast.show('Failed to apply settings', { isError: true });
  } finally {
    isApplying.value = false;
  }
};

// Hàm cập nhật Metafield chia gói 25
const batchUpdateMetafields = async (ids, valueStr) => {
  await window.shopify.idToken();
  const chunkSize = 25;
  
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const metafields = chunk.map(id => ({
      ownerId: id,
      namespace: "custom", // SỬA THÀNH NAMESPACE CỦA EM
      key: "vto_enabled",  // SỬA THÀNH KEY CỦA EM
      type: "boolean",
      value: valueStr
    }));

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

onMounted(() => {
  // Khi mở trang, tải dữ liệu đang được bật sẵn
  fetchCurrentState();
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
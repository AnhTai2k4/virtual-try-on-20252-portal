<template lang="pug">
ui-title-bar(title="Taitta VTON - Products")

Page(title="Product Management")
 
  Card(class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")
    div(class="px-2 ")
      div(class="flex justify-between items-center mb-1.5")
        Text(variant="headingMd", as="h2" class="text-lg font-semibold text-gray-900") Virtual Try-On Button Visibility
      div(class="flex justify-between")
        Text(variant="bodyMd", as="p" class="text-gray-600") Enable collections to activate try-on for all products, or select individual products for custom settings.

  //- MAIN CARD: GIAO DIỆN "CHOOSE PRODUCT TO LAUNCH"

  Card(class="mb-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative")      
    
    //- MÀN HÌNH LOADING CHỜ LẤY MODE BAN ĐẦU
    div(v-if="isInitializing" class="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3")
      svg(class="animate-spin h-7 w-7 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
        circle(class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
        path(class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
      span(class="text-sm font-medium text-gray-600") Loading configuration...

    //- NỘI DUNG CARD CHÍNH
    div(:class="{ 'opacity-40 pointer-events-none transition-opacity': isInitializing }")
      div(class="px-2 py-5 border-b border-gray-200 bg-gray-50/50")
        div(class="flex justify-between items-start")
          
          //- Khối bên trái: Title + Subtitle
          div(class="flex gap-4")
            div(class="text-sm")
              div(class="flex items-center gap-2.5 mb-2")
                Text(variant="headingMd", as="h1" class="text-lg font-semibold text-gray-900 ") Choose product to launch
              
              //- Subtitle giải thích chi tiết
              p(class="mt-1.5 text-gray-600 leading-relaxed max-w-2xl") 
                | Select where the Virtual Try-On button should appear on your storefront. You can apply it globally, restrict it to specific items, or turn it off completely.

          //- Khối bên phải: Nút Help/Guide
          button(class="hidden md:flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors mt-1")
            svg(class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
              path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z")
            | View guide
        
      //- BODY (RADIO OPTIONS)
      div(class="p-4 ")
        
        //- Option 1: Specific products
        label(class="relative flex items-start gap-4 cursor-pointer group p-4 -mx-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200")
          div(class="pt-0.5 flex-shrink-0")
            input(
              type="radio" 
              v-model="launchMode" 
              value="specific_products" 
              @change="handleModeChange"
              class="w-4 h-4 text-gray-900 border-gray-400 focus:ring-gray-900 focus:ring-offset-0 mt-0.5"
            )
          div
            div(class="font-medium text-gray-900") Specific products
            div(class="text-sm text-gray-500 mt-1 leading-relaxed") Choose products to apply this option set. Learn more about #[a(href="#" class="text-blue-600 hover:underline") apply on products]
        
        //- Option 2: Specific variants
        label(class="relative flex items-start gap-4 cursor-pointer group p-4 -mx-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200")
          div(class="pt-0.5 flex-shrink-0")
            input(
              type="radio" 
              v-model="launchMode" 
              value="specific_variants" 
              @change="handleModeChange"
              class="w-4 h-4 text-gray-900 border-gray-400 focus:ring-gray-900 focus:ring-offset-0 mt-0.5"
            )
          div
            div(class="font-medium text-gray-900") Specific variants
            div(class="text-sm text-gray-500 mt-1 leading-relaxed") Choose specific variants to apply this option set. Learn more about #[a(href="#" class="text-blue-600 hover:underline") apply on specific variants]
        
        //- Option 3: All products
        label(class="relative flex items-start gap-4 cursor-pointer group p-4 -mx-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200")
          div(class="pt-0.5 flex-shrink-0")
            input(
              type="radio" 
              v-model="launchMode" 
              value="all" 
              @change="handleModeChange"
              class="w-4 h-4 text-gray-900 border-gray-400 focus:ring-gray-900 focus:ring-offset-0 mt-0.5"
            )
          div
            div(class="font-medium text-gray-900") All products
            div(class="text-sm text-gray-500 mt-1 leading-relaxed") Apply this option set to all products on your store, except for those that have been applied manually or automatically.

        //- Option 4: Disable on all products (THÊM MỚI Ở ĐÂY)
        label(class="relative flex items-start gap-4 cursor-pointer group p-4 -mx-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200")
          div(class="pt-0.5 flex-shrink-0")
            input(
              type="radio" 
              v-model="launchMode" 
              value="none" 
              @change="handleModeChange"
              class="w-4 h-4 text-gray-900 border-gray-400 focus:ring-gray-900 focus:ring-offset-0 mt-0.5"
            )
          div
            div(class="font-medium text-gray-900") Disable on all products
            div(class="text-sm text-gray-500 mt-1 leading-relaxed") Deactivate the Virtual Try-On button completely across your entire store.

        //- ==========================================
        //- VÙNG CHỌN SẢN PHẨM & HIỂN THỊ DANH SÁCH
        //- ==========================================
        //- Ẩn khung này nếu chọn 'all' hoặc 'none'
        div(v-show="launchMode === 'specific_products' || launchMode === 'specific_variants'" class="pt-6 border-t border-gray-200 mt-4")
          
          div(class="flex items-center justify-between mb-4")
            button(
              v-if="launchMode === 'specific_products' || launchMode === 'specific_variants'"
              @click="triggerPicker"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm active:bg-gray-100"
            ) {{ launchMode === 'specific_products' ? 'Browse products' : 'Browse variants' }}
            
            div(class="text-sm text-gray-500 font-medium") {{ selectedItems.length }} {{ launchMode === 'specific_products' ? 'products' : 'variants' }} selected

          //- Loading State khi đang fetch data cũ
          div(v-if="isLoadingData" class="py-10 text-center flex flex-col justify-center items-center gap-3 bg-gray-50 rounded-lg border border-dashed border-gray-300")
            svg(class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
              circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
              path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
            span(class="text-sm text-gray-500") Loading selected items...

          //- Danh sách Item đã chọn
          div(v-else-if="selectedItems.length > 0" class="border border-gray-200 rounded-lg overflow-hidden max-h-80 overflow-y-auto custom-scrollbar bg-white")
            div(
              v-for="(item, index) in selectedItems" 
              :key="item.id" 
              class="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors group"
            )
              div(class="flex items-center gap-3.5")
                div(class="relative w-10 h-10 rounded border border-gray-200 bg-white overflow-hidden flex-shrink-0")
                  img(v-if="item.image" :src="item.image" class="w-full h-full object-cover")
                  div(v-else class="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs") 📦
                span(class="text-sm font-medium text-gray-800 line-clamp-1") {{ item.title }}
              
              button(
                @click="removeItem(index)" 
                class="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Remove item"
              )
                svg(class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
                  path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16")
          
          //- Empty State
          div(v-else class="py-10 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center")
            span(class="text-2xl mb-2") 🛍️
            p(class="text-sm text-gray-500") No items selected yet.
                  
      //- FOOTER ACTIONS
      div(class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl")
        button(
          @click="resetSelection"
          :disabled="isApplying"
          class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50"
        ) Discard
        
        button(
          @click="applySettings"
          :disabled="isApplying"
          class="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        ) 
          span(v-if="!isApplying") Save settings
          span(v-else) Saving...
          svg(v-if="isApplying" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
            circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
            path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getShopData, getProductsData, batchUpdateMetafields } from '../service/ProductService';

// Định nghĩa khung xương (Interface) cho 1 dòng dữ liệu hiển thị trên danh sách
interface SelectedItem {
  id: string;
  title: string;
  image?: string;
  productId?: string;
}


const isInitializing = ref<boolean>(true); 
const launchMode = ref<string>('');
const selectedItems = ref<SelectedItem[]>([]);
const isLoadingData = ref<boolean>(false);
const isApplying = ref<boolean>(false);
const shopId = ref<string | null>(null); 
const previouslyEnabledIds = ref<string[]>([]);

// HÀM LẤY DỮ LIỆU TỪ SHOPIFY (FETCH)
const fetchCurrentState = async (isInitialLoad: boolean = false): Promise<void> => {
  if (isInitialLoad) isInitializing.value = true;
  else isLoadingData.value = true;
  
  selectedItems.value = [];
  previouslyEnabledIds.value = [];
  
  try {
    const shop = await getShopData();
    shopId.value = shop.id;
    
    if (isInitialLoad) {
      launchMode.value = shop.launchMode?.value || 'specific_products';
    }

    // TỐI ƯU: Chỉ gọi API tải toàn bộ sản phẩm nếu mode là "specific"
    if (launchMode.value === 'specific_products' || launchMode.value === 'specific_variants') {
      const products = await getProductsData();

      if (launchMode.value === 'specific_products') {
        const enabledProducts = products.filter((p: any) => p.vtoStatus?.value === 'true');
        previouslyEnabledIds.value = enabledProducts.map((p: any) => p.id);
        
        selectedItems.value = enabledProducts.map((p: any) => ({
          id: p.id, title: p.title, image: p.featuredImage?.url
        }));
      } 
      else if (launchMode.value === 'specific_variants') {
        let enabledVariants: SelectedItem[] = [];
        products.forEach((p: any) => {
          p.variants.edges.forEach((vEdge: any) => {
            const v = vEdge.node;
            if (v.vtoStatus?.value === 'true') {
              previouslyEnabledIds.value.push(v.id);
              enabledVariants.push({
                id: v.id, 
                title: `${p.title} - ${v.title}`, 
                image: v.image?.url || p.featuredImage?.url,
                productId: v.product.id
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
    if (isInitialLoad) isInitializing.value = false;
    else isLoadingData.value = false;
  }
};

// CÁC HÀM XỬ LÝ SỰ KIỆN GIAO DIỆN (UI ACTIONS)

const handleModeChange = (): Promise<void> => fetchCurrentState(false);
const resetSelection = (): Promise<void> => fetchCurrentState(true);
const removeItem = (index: number): void => {
  selectedItems.value.splice(index, 1);
};

const triggerPicker = async (): Promise<void> => {
  const isVariantMode = launchMode.value === 'specific_variants';
  
  let preSelectedIds: any[] = [];
  if (isVariantMode) {
    const grouped = selectedItems.value.reduce((acc: any, item: SelectedItem) => {
      const pId = item.productId || '';
      if (!acc[pId]) acc[pId] = [];
      acc[pId].push({ id: item.id });
      return acc;
    }, {});
    preSelectedIds = Object.keys(grouped).map(pId => ({ id: pId, variants: grouped[pId] }));
  } else {
    preSelectedIds = selectedItems.value.map(item => ({ id: item.id }));
  }

  const selected = await (window as any).shopify.resourcePicker({
    type: "product", 
    multiple: true,
    action: "select", 
    filter: { variants: isVariantMode },
    selectionIds: preSelectedIds
  });

  if (!selected) return;

  let finalSelectionList: SelectedItem[] = [];
  if (isVariantMode) {
    selected.forEach((product: any) => {
      product.variants.forEach((variant: any) => {
        finalSelectionList.push({
          id: variant.id, 
          title: `${product.title} - ${variant.title}`, 
          image: variant.image?.originalSrc || product.images?.[0]?.originalSrc,
          productId: product.id
        });
      });
    });
  } else {
    selected.forEach((product: any) => {
      finalSelectionList.push({
        id: product.id, title: product.title, image: product.images?.[0]?.originalSrc
      });
    });
  }
  selectedItems.value = finalSelectionList;
};

// THUẬT TOÁN ĐỒNG BỘ VÀ LƯU TRỮ (APPLY)
const applySettings = async (): Promise<void> => {
  isApplying.value = true;
  
  try {
    const isAllMode = launchMode.value === 'all';
    
    // Lưu chế độ launchMode mới (nếu là 'none' thì tự động disable bên file Liquid)
    await batchUpdateMetafields([shopId.value as string], [
      { namespace: "custom", key: "vto_launch_mode", value: launchMode.value },
      { namespace: "custom", key: "vto_enable_all", value: isAllMode ? "true" : "false" }
    ]);

    // TỐI ƯU: Chỉ cập nhật Metafield cho từng item nếu đang ở chế độ Specific
    if (launchMode.value === 'specific_products' || launchMode.value === 'specific_variants') {
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

    (window as any).shopify.toast.show('Settings saved successfully!');
    await fetchCurrentState(true);

  } catch (error) {
    console.error("Lỗi Apply:", error);
    (window as any).shopify.toast.show('Failed to save settings', { isError: true });
  } finally {
    isApplying.value = false;
  }
};


onMounted(() => {
  fetchCurrentState(true);
});
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>
<template lang="pug">
ui-save-bar(ref="saveBarRef")
  button(variant="primary" @click="applySettings") Save
  button(@click="resetSelection") Discard

ui-title-bar(title="Staging Virtual Try On - Products")

Page(title="Product Management")
 
  Layout(style = "margin-bottom: 2rem;")
    LayoutSection
      Card
        BlockStack(gap="200")
          Text(variant="headingMd" as="h2") Virtual Try-On Button Visibility
          Text(variant="bodyMd" as="p" tone="subdued") Enable collections to activate try-on for all products, or select individual products for custom settings.

    LayoutSection
      //- MAIN CARD: "CHOOSE PRODUCT TO LAUNCH" INTERFACE
      Card
        div(style="position: relative;")
          //- INITIAL MODE LOADING SCREEN
          div(v-if="isInitializing" style="position: absolute; inset: 0; z-index: 10; background: rgba(255,255,255,0.8); backdrop-filter: blur(4px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;")
            Spinner(size="large")
            Text(variant="bodySm" fontWeight="medium" tone="subdued") Loading configuration...

          //- MAIN CARD CONTENT
          BlockStack(:class="{ 'opacity-40 pointer-events-none transition-opacity': isInitializing }" gap="400")
            
            BlockStack(gap="200")
              InlineStack(align="space-between" blockAlign="start")
                Text(variant="headingMd" as="h1") Choose product to launch
                Button(plain) View guide
              Text(variant="bodyMd" tone="subdued") Select where the Virtual Try-On button should appear on your storefront. You can apply it globally, restrict it to specific items, or turn it off completely.
            
            Divider
            
            //- BODY (RADIO OPTIONS)
            BlockStack(gap="400")
              
              //- Option 1: Specific products
              RadioButton(
                label="Specific products"
                helpText="Choose products to apply this option set."
                id="mode_specific_products"
                name="launchMode"
                value="specific_products"
                :checked="launchMode === 'specific_products'"
                @change="() => { launchMode = 'specific_products'; handleModeChange(); }"
              )
              
              //- Option 2: Specific variants
              RadioButton(
                label="Specific variants"
                helpText="Choose specific variants to apply this option set."
                id="mode_specific_variants"
                name="launchMode"
                value="specific_variants"
                :checked="launchMode === 'specific_variants'"
                @change="() => { launchMode = 'specific_variants'; handleModeChange(); }"
              )
              
              //- Option 3: All products
              RadioButton(
                label="All products"
                helpText="Apply this option set to all products on your store, except for those that have been applied manually or automatically."
                id="mode_all"
                name="launchMode"
                value="all"
                :checked="launchMode === 'all'"
                @change="() => { launchMode = 'all'; handleModeChange(); }"
              )

              //- Option 4: Disable on all products
              RadioButton(
                label="Disable on all products"
                helpText="Deactivate the Virtual Try-On button completely across your entire store."
                id="mode_none"
                name="launchMode"
                value="none"
                :checked="launchMode === 'none'"
                @change="() => { launchMode = 'none'; handleModeChange(); }"
              )

            //- PRODUCT SELECTION ZONE & LIST DISPLAY
            div(v-show="launchMode === 'specific_products' || launchMode === 'specific_variants'")
              Divider
              
              div(style="margin-top: var(--p-space-400)")
                InlineStack(align="space-between" blockAlign="center" style="margin-bottom: var(--p-space-400)")
                  Button(@click="triggerPicker") {{ launchMode === 'specific_products' ? 'Choose products' : 'Choose variants' }}
                  Text(variant="bodySm" tone="subdued" fontWeight="medium") {{ selectedItems.length }} {{ launchMode === 'specific_products' ? 'products' : 'variants' }} selected

                //- Loading State while fetching previous configuration
                BlockStack(v-if="isLoadingData" inlineAlign="center" style="padding: 40px 0; align-items: center;")
                  Spinner(size="small")
                  Text(variant="bodySm" tone="subdued") Loading selected items...

                //- Selected items list
                div(v-else-if="selectedItems.length > 0" class="custom-scrollbar" style="border: 1px solid var(--p-color-border-subdued); border-radius: var(--p-border-radius-200); max-height: 320px; overflow-y: auto;")
                  div(
                    v-for="(item, index) in selectedItems" 
                    :key="item.id" 
                    style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--p-color-border-subdued);"
                  )
                    InlineStack(gap="300" blockAlign="center")
                      div(style="width: 40px; height: 40px; border-radius: 4px; border: 1px solid var(--p-color-border-subdued); overflow: hidden; flex-shrink: 0; background: var(--p-color-bg-surface-secondary); display: flex; align-items: center; justify-content: center;")
                        img(v-if="item.image" :src="item.image" style="width: 100%; height: 100%; object-fit: cover;")
                        span(v-else style="color: var(--p-color-text-subdued); font-size: 12px;") 📦
                      Text(variant="bodySm" fontWeight="medium") {{ item.title }}
                    
                    Button(plain destructive @click="removeItem(index)" ) Remove
                
                //- Empty State
                div(v-else style="padding: 40px 0; text-align: center; background: var(--p-color-bg-surface-secondary); border-radius: var(--p-border-radius-200); border: 1px dashed var(--p-color-border-subdued);")
                  Text(variant="headingLg" as="span") 🛍️
                  div(style="margin-top: 8px;")
                    Text(variant="bodySm" tone="subdued") No items selected yet.

</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getShopData, getProductsData, batchUpdateMetafields } from '../service/ProductService';

// Define schema interface for a single item row in the list
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

const saveBarRef = ref<any>(null);
const initialSettingsStr = ref("");

const updateInitialState = () => {
  initialSettingsStr.value = JSON.stringify({ mode: launchMode.value, items: selectedItems.value.map(i => i.id) });
  if (saveBarRef.value?.hide) saveBarRef.value.hide();
};

watch([launchMode, selectedItems, isLoadingData], () => {
  if (isInitializing.value || isLoadingData.value) return;
  const currentStr = JSON.stringify({ mode: launchMode.value, items: selectedItems.value.map(i => i.id) });
  if (currentStr !== initialSettingsStr.value) {
    if (saveBarRef.value?.show) saveBarRef.value.show();
  } else {
    if (saveBarRef.value?.hide) saveBarRef.value.hide();
  }
}, { deep: true });


// FETCH DATA FROM SHOPIFY
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

    // OPTIMIZED: Only fetch all products if the launch mode is set to specific
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

    if (isInitialLoad) updateInitialState();

  } catch (error) {
    console.error("Error fetching current state:", error);
  } finally {
    if (isInitialLoad) isInitializing.value = false;
    else isLoadingData.value = false;
  }
};

// INTERFACE EVENT HANDLERS (UI ACTIONS)

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

// SYNC AND SAVE LOGIC (APPLY)
const applySettings = async (): Promise<void> => {
  isApplying.value = true;
  
  try {
    const isAllMode = launchMode.value === 'all';
    
    // Save the new launch mode (setting to 'none' automatically disables it in Liquid)
    await batchUpdateMetafields([shopId.value as string], [
      { namespace: "custom", key: "vto_launch_mode", value: launchMode.value },
      { namespace: "custom", key: "vto_enable_all", value: isAllMode ? "true" : "false" }
    ]);

    // OPTIMIZED: Only update individual item metafields if launch mode is set to specific
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
    console.error("Error applying settings:", error);
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
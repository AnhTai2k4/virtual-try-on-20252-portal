<template lang="pug">
ui-title-bar(title="Taitta VTON - Settings")

Page(title="Settings")

  //- ==========================================
  //- MÀN HÌNH LOADING KHI LOAD DATA BAN ĐẦU
  //- ==========================================
  div(v-if="isLoading" class="flex flex-col items-center justify-center py-32 bg-white rounded-xl shadow-sm border border-gray-200")
    svg(class="animate-spin h-8 w-8 text-gray-800 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
      circle(class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
      path(class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
    p(class="text-sm font-medium text-gray-500") Loading settings...

  //- ==========================================
  //- GIAO DIỆN SETTINGS (HIỂN THỊ KHI ĐÃ LOAD XONG)
  //- ==========================================
  div(v-else)
    //- CARD 1: CUSTOMER ACCESS (SHOPIFY METAFIELD)
    Card(class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")
      div
        Text(variant="headingMd", as="h2" class="text-lg font-semibold text-gray-900") Customer Access
        p(class="text-sm text-gray-600 mb-5 leading-relaxed") When enabled, only logged-in customers can use the virtual try-on. Anonymous shoppers see a login prompt instead of the upload buttons. Helps reduce abuse and ties try-ons to customer profiles.
        
        label(class="flex items-center gap-3 cursor-pointer group")
          input(
            type="checkbox" 
            v-model="settings.requireLogin" 
            class="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
          )
          span(class="text-sm text-gray-800 group-hover:text-black transition-colors") Logged-in customers only

    //- CARD 2: GENERATION LIMITS (BACKEND API)
    Card(class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")
      div
        h2(class="text-base font-semibold text-gray-900 mb-5") Generation Limits
        
        div(class="space-y-6")
          //- Input: Max Generations
          div(class="space-y-1.5")
            label(class="block text-sm font-medium text-gray-800") Max Generations Per User
            input(
              type="number"
              v-model.number="settings.dailyLimit"
              min="1"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            )
            p(class="text-sm text-gray-500 mt-1 leading-relaxed") Set the maximum number of try-ons a user can generate based on the period below.

          //- Select: Limit Period (Giữ lại cho tương lai)
          div(class="space-y-1.5")
            label(class="block text-sm font-medium text-gray-800") Reset Period Limit
            div(class="relative")
              select(
                v-model="settings.limitPeriod"
                class="w-full appearance-none px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
              )
                option(v-for="opt in periodOptions" :key="opt.value" :value="opt.value") {{ opt.label }}
              
              div(class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500")
                svg(class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
                  path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4")
                  
            p(class="text-sm text-gray-500 mt-1 leading-relaxed") Choose how often each user's try-on count resets. Daily is currently active by default on the server.

    //- CARD 3: DATA RETENTION (BACKEND API)
    Card(class="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")
      div
        h2(class="text-base font-semibold text-gray-900 mb-5") Data Retention
        
        div(class="space-y-1.5")
          label(class="block text-sm font-medium text-gray-800") Customer Image Retention
          div(class="relative")
            select(
              v-model.number="settings.retentionHours"
              class="w-full appearance-none px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
            )
              option(v-for="opt in retentionOptions" :key="opt.value" :value="opt.value") {{ opt.label }}
            
            div(class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500")
              svg(class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
                path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4")
                
          p(class="text-sm text-gray-500 mt-1 leading-relaxed") Configure how long customer and generated try-on images are stored. Uploaded photos and generated try-on images are automatically and permanently deleted after this period. Default is 3 days.

    //- FOOTER: ACTIONS
    div(class="flex justify-end pt-4 pb-12 border-t border-gray-200 mt-2")
      button(
        @click="saveAllSettings"
        :disabled="isSaving"
        class="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
      )
        span(v-if="!isSaving") Save Settings
        span(v-else) Saving...
        svg(v-if="isSaving" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24")
          circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
          path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { getSetting, setSetting, fetchShopifyMetafield, updateShopifyMetafield } from '../service/SettingService'; 

// ==========================================
// STATE
// ==========================================
const isLoading = ref(true); // Trạng thái Load khi mới mở trang
const isSaving = ref(false); // Trạng thái Load khi bấm nút Save
const shopId = ref<string | null>(null);

const settings = reactive({
  requireLogin: false, // Lưu ở Shopify Metafield
  dailyLimit: 5,       // Lưu ở Backend API
  limitPeriod: 'daily', // UI giữ lại cho tương lai (chưa đẩy lên BE nếu BE chưa cần)
  retentionHours: 72   // Lưu ở Backend API
});

const periodOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];

const retentionOptions = [
  { label: '1 day', value: 24 },
  { label: '3 days', value: 72 },
  { label: '7 days', value: 168 },
  { label: '14 days', value: 336 },
  { label: '30 days', value: 720 }
];

// ==========================================
// HÀM ĐIỀU PHỐI (ACTIONS)
// ==========================================
const loadAllSettings = async () => {
  isLoading.value = true; 
  try {
    // Chạy song song 2 request lấy dữ liệu
    const [beSettings, shopifyData] = await Promise.all([
      getSetting(),
      fetchShopifyMetafield() // Hàm import từ service
    ]);

    // 1. Gán dữ liệu Backend
    if (beSettings) {
      settings.dailyLimit = beSettings.daily_try_on_limit || 5;
      settings.retentionHours = beSettings.result_retention_hours || 72;
    }

    // 2. Gán dữ liệu Metafield
    if (shopifyData.shopId) {
      shopId.value = shopifyData.shopId;
      settings.requireLogin = shopifyData.requireLogin;
    }
  } catch (error) {
    console.error("Lỗi khi load Settings:", error);
    (window as any).shopify?.toast?.show('Failed to load settings', { isError: true });
  } finally {
    isLoading.value = false; 
  }
};

const saveAllSettings = async () => {
  isSaving.value = true;
  try {
    if (!shopId.value) {
      throw new Error("Không tìm thấy Shop ID, vui lòng tải lại trang.");
    }

    const backendPayload = {
      daily_try_on_limit: settings.dailyLimit,
      result_retention_hours: settings.retentionHours
    };

    // Chạy song song 2 request lưu dữ liệu
    await Promise.all([
      setSetting(backendPayload),
      updateShopifyMetafield(shopId.value, settings.requireLogin) // Truyền tham số cho service
    ]);

    (window as any).shopify?.toast?.show('Settings saved successfully!');
  } catch (error) {
    console.error("Lỗi khi lưu Settings:", error);
    (window as any).shopify?.toast?.show('Failed to save settings', { isError: true });
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadAllSettings();
});
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
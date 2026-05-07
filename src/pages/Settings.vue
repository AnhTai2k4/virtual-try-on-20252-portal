<template lang="pug">
ui-title-bar(title="Taitta VTON - Settings")

Page(title="Settings")
  
  //- ==========================================
  //- CARD 1: TRY-ON BUTTON SETTINGS
  //- ==========================================
  Card(class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")
    div
      h2(class="text-base font-semibold text-gray-900 mb-5") Try-On Button Settings
      
      div(class="space-y-1.5")
        label(class="block text-sm font-medium text-gray-800") Email Collection Step
        div(class="relative")
          select(
            v-model="settings.emailCollectionStep"
            class="w-full appearance-none px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
          )
            option(v-for="opt in emailOptions" :key="opt.value" :value="opt.value") {{ opt.label }}
          
          //- Icon mũi tên lên/xuống chuẩn Polaris cho Select
          div(class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500")
            svg(class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
              path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4")
              
        p(class="text-sm text-gray-500 mt-1 leading-relaxed") Configure when the email collection form appears to users. Set to 0 to require email before any try-on, or choose when users have completed a certain number of try-ons.

  //- ==========================================
  //- CARD 2: GENERATION LIMITS
  //- ==========================================
  Card(class="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")
    div(class="p-6")
      h2(class="text-base font-semibold text-gray-900 mb-5") Generation Limits
      
      div(class="space-y-6")
        //- Input: Max Generations
        div(class="space-y-1.5")
          label(class="block text-sm font-medium text-gray-800") Max Generations Per User
          input(
            type="number"
            v-model="settings.maxGenerations"
            min="1"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          )
          p(class="text-sm text-gray-500 mt-1 leading-relaxed") Set the maximum number of try-ons a user can generate. Default is 6. This limit resets weekly for each user.

        //- Select: Limit Period
        div(class="space-y-1.5")
          label(class="block text-sm font-medium text-gray-800") Limit Period
          div(class="relative")
            select(
              v-model="settings.limitPeriod"
              class="w-full appearance-none px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
            )
              option(v-for="opt in periodOptions" :key="opt.value" :value="opt.value") {{ opt.label }}
            
            div(class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500")
              svg(class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
                path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4")
                
          p(class="text-sm text-gray-500 mt-1 leading-relaxed") Choose how often each user's try-on count resets. Weekly is recommended.

  //- ==========================================
  //- CARD 3: DATA RETENTION
  //- ==========================================
  Card(class="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")
    div(class="p-6")
      h2(class="text-base font-semibold text-gray-900 mb-5") Data Retention
      
      div(class="space-y-1.5")
        label(class="block text-sm font-medium text-gray-800") Customer Image Retention
        div(class="relative")
          select(
            v-model="settings.dataRetention"
            class="w-full appearance-none px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
          )
            option(v-for="opt in retentionOptions" :key="opt.value" :value="opt.value") {{ opt.label }}
          
          div(class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500")
            svg(class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
              path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4")
              
        p(class="text-sm text-gray-500 mt-1 leading-relaxed") Configure how long customer and generated try-on images are stored. Uploaded photos and generated try-on images are automatically and permanently deleted after this period. Default is 7 days.

  //- ==========================================
  //- FOOTER: NÚT LƯU CÀI ĐẶT
  //- ==========================================
  div(class="flex justify-end pt-4 pb-12 border-t border-gray-200 mt-2")
    button(
      @click="saveSettings"
      :disabled="isSaving"
      class="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
    )
      span(v-if="!isSaving") Save Settings
      span(v-else) Saving...
      svg(v-if="isSaving" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
        circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
        path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

</template>

<script setup lang="ts">
import { ref } from 'vue';

// ==========================================
// 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU
// ==========================================
interface AppSettings {
  emailCollectionStep: string;
  maxGenerations: number;
  limitPeriod: string;
  dataRetention: string;
}

// Giả lập Window Shopify App Bridge
declare global {
  interface Window { shopify: any; }
}

// ==========================================
// 2. STATE QUẢN LÝ DỮ LIỆU FORM
// ==========================================
const isSaving = ref<boolean>(false);

const settings = ref<AppSettings>({
  emailCollectionStep: '0',
  maxGenerations: 6,
  limitPeriod: 'weekly',
  dataRetention: '3'
});

// ==========================================
// 3. OPTIONS CHO CÁC THẺ SELECT
// ==========================================
const emailOptions = [
  { label: 'Before any try-on', value: '0' },
  { label: 'After 1st try-on', value: '1' },
  { label: 'After 2nd try-on', value: '2' },
  { label: 'After 3rd try-on', value: '3' },
  { label: 'After 4th try-on', value: '4' },
  { label: 'Do not collect email', value: 'none' }
];

const periodOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
];

const retentionOptions = [
  { label: '1 day', value: '1' },
  { label: '3 days', value: '3' },
  { label: '7 days', value: '7' },
  { label: '14 days', value: '14' },
  { label: '30 days', value: '30' }
];

// ==========================================
// 4. HÀM XỬ LÝ (ACTIONS)
// ==========================================
const saveSettings = async (): Promise<void> => {
  isSaving.value = true;
  
  try {
    // 1. Lấy token xác thực (nếu cần gọi API Backend của bạn)
    await window.shopify?.idToken();

    // 2. Ở đây bạn sẽ viết lệnh fetch() gửi object `settings.value` lên Database (MongoDB/PostgreSQL) của bạn
    console.log("[Settings] Data chuẩn bị gửi lên server:", settings.value);
    
    // Giả lập độ trễ mạng 1 giây để thấy hiệu ứng loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 3. Báo thành công
    window.shopify?.toast?.show('Settings saved successfully!');
    
  } catch (error) {
    console.error("[Settings] Lỗi khi lưu:", error);
    window.shopify?.toast?.show('Failed to save settings', { isError: true });
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
/* Ẩn mũi tên lên/xuống mặc định của thẻ input type="number" cho gọn gàng (Tùy chọn) */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: auto; /* Có thể đổi thành 'none' nếu bạn muốn giấu hẳn 2 nút mũi tên nhỏ xíu bên phải */
  margin: 0;
}
</style>
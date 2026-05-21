<template lang="pug">
ui-save-bar(ref="saveBarRef")
  button(variant="primary" @click="saveAllSettings") Save
  button(@click="discardSettings") Discard

ui-title-bar(title="Staging Virtual Try On - Settings")

Page(title="Settings")

  //- ==========================================
  //- MÀN HÌNH LOADING KHI LOAD DATA BAN ĐẦU
  //- ==========================================
  BlockStack(v-if="isLoading" inlineAlign="center" gap="400" style="padding: 100px 0; align-items: center;")
    Spinner(accessibilityLabel="Loading settings" size="large")
    Text(variant="bodyMd" as="p" tone="subdued") Loading settings...

  //- ==========================================
  //- GIAO DIỆN SETTINGS (HIỂN THỊ KHI ĐÃ LOAD XONG)
  //- ==========================================
  Layout(v-else style = "margin-bottom: 2rem;")
    
    //- CARD 1: CUSTOMER ACCESS (SHOPIFY METAFIELD)
    LayoutSection
      Card
        BlockStack(gap="400")
          BlockStack(gap="200")
            Text(variant="headingMd" as="h2") Customer Access
            Text(variant="bodyMd" as="p" tone="subdued") When enabled, only logged-in customers can use the virtual try-on. Anonymous shoppers see a login prompt instead of the upload buttons. Helps reduce abuse and ties try-ons to customer profiles.
          
          Divider

          Checkbox(
            label="Logged-in customers only"
            v-model="settings.requireLogin"
          )

    //- CARD 2: GENERATION LIMITS (BACKEND API)
    LayoutSection
      Card
        BlockStack(gap="400")
          BlockStack(gap="200")
            Text(variant="headingMd" as="h2") Generation Limits
            Text(variant="bodyMd" as="p" tone="subdued") Set the maximum number of try-ons a user can generate based on the period below.
            
          Divider

          TextField(
            label="Max Generations Per User"
            type="number"
            v-model.number="settings.dailyLimit"
            autoComplete="off"
            min="1"
            helpText="Set the maximum number of try-ons a user can generate based on the period below."
          )
          
          TextField(
            label="Reset Period Limit After Days"
            type="number"
            v-model.number="settings.limitPeriod"
            helpText="Choose how often each user's try-on count resets. Daily is currently active by default on the server."
            autoComplete="off"
            min="1"
          )

    //- CARD 3: DATA RETENTION (BACKEND API)
    LayoutSection
      Card
        BlockStack(gap="400")
          BlockStack(gap="200")
            Text(variant="headingMd" as="h2") Data Retention
            Text(variant="bodyMd" as="p" tone="subdued") Configure how long customer and generated try-on images are stored. Uploaded photos and generated try-on images are automatically and permanently deleted after this period. Default is 3 days.

          Divider

          Select(
            label="Customer Image Retention"
            v-model="settings.retentionHours"
            :options="retentionOptions"
          )

    //- FOOTER: ACTIONS
    //- LayoutSection
    //-   InlineStack(align="end" style="margin-top: var(--p-space-400); margin-bottom: var(--p-space-800); padding-top: var(--p-space-400); border-top: 1px solid var(--p-color-border-subdued);")
    //-     Button(
    //-       variant="primary"
    //-       @click="saveAllSettings"
    //-       :loading="isSaving"
    //-       :disabled="isSaving"
    //-     ) Save Settings

</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { getSetting, setSetting, fetchShopifyMetafield, updateShopifyMetafield } from '../service/SettingService'; 

// ==========================================
// STATE
// ==========================================
const isLoading = ref(true); // Trạng thái Load khi mới mở trang
const isSaving = ref(false); // Trạng thái Load khi bấm nút Save
const shopId = ref<string | null>(null);

const saveBarRef = ref<any>(null);
const initialSettingsStr = ref("");

const settings = reactive({
  requireLogin: false, // Lưu ở Shopify Metafield
  dailyLimit: 5,       // Lưu ở Backend API
  limitPeriod: 1,      // Lưu ở Backend API
  retentionHours: 72   // Lưu ở Backend API
});



const retentionOptions = [
  { label: '1 day', value: 24 },
  { label: '3 days', value: 72 },
  { label: '7 days', value: 168 },
  { label: '14 days', value: 336 },
  { label: '30 days', value: 720 }
];

// Theo dõi thay đổi để hiện Save Bar
watch(settings, (newVal) => {
  if (isLoading.value) return;
  const currentStr = JSON.stringify(newVal);
  if (currentStr !== initialSettingsStr.value) {
    if (saveBarRef.value?.show) saveBarRef.value.show();
  } else {
    if (saveBarRef.value?.hide) saveBarRef.value.hide();
  }
}, { deep: true });

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
      settings.dailyLimit = beSettings.try_on_limit_per_cycle || beSettings.daily_try_on_limit || 5;
      settings.limitPeriod = beSettings.usage_reset || 1;
      settings.retentionHours = beSettings.result_retention_hours || 72;
    }

    // 2. Gán dữ liệu Metafield
    if (shopifyData.shopId) {
      shopId.value = shopifyData.shopId;
      settings.requireLogin = shopifyData.requireLogin;
    }

    // Lưu lại trạng thái ban đầu để so sánh
    initialSettingsStr.value = JSON.stringify(settings);
    if (saveBarRef.value?.hide) saveBarRef.value.hide();

  } catch (error) {
    console.error("Lỗi khi load Settings:", error);
    (window as any).shopify?.toast?.show('Failed to load settings', { isError: true });
  } finally {
    isLoading.value = false; 
  }
};

const discardSettings = () => {
  if (initialSettingsStr.value) {
    Object.assign(settings, JSON.parse(initialSettingsStr.value));
  }
  if (saveBarRef.value?.hide) saveBarRef.value.hide();
};

const saveAllSettings = async () => {
  isSaving.value = true;
  try {
    if (!shopId.value) {
      throw new Error("Không tìm thấy Shop ID, vui lòng tải lại trang.");
    }

    const backendPayload = {
      try_on_limit_per_cycle: settings.dailyLimit,
      usage_reset: settings.limitPeriod,
      result_retention_hours: settings.retentionHours
    };

    // Chạy song song 2 request lưu dữ liệu
    await Promise.all([
      setSetting(backendPayload),
      updateShopifyMetafield(shopId.value, settings.requireLogin) // Truyền tham số cho service
    ]);

    (window as any).shopify?.toast?.show('Settings saved successfully!');
    
    // Cập nhật lại trạng thái ban đầu
    initialSettingsStr.value = JSON.stringify(settings);
    if (saveBarRef.value?.hide) saveBarRef.value.hide();

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
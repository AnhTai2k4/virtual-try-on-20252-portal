<template>
  <AppProvider :i18n="locales">
    <Page title="Virtual Try On Settings" subtitle="Configure your AI fitting room">
      <Layout>
        
        <LayoutSection>
          <Card>
            <FormLayout>
              <Select
                label="Chọn Model AI"
                :options="modelOptions"
                v-model="selectedModel"
              />
              <TextField
                label="Số Lookback Days"
                type="number"
                v-model="lookbackDays"
                helpText="Default: 30 days - Maximum: 60 days"
              />
              <Checkbox
                label="Bật chế độ tự động tối ưu ảnh"
                v-model="autoOptimize"
              />
            </FormLayout>
          </Card>
          
          <div style="margin-top: 20px;">
            <Button primary @click="saveSettings">Lưu Cài Đặt</Button>
          </div>
        </LayoutSection>

        <LayoutSection secondary>
          <Card>
            <SettingToggle
              :action="{
                content: isAppEnabled ? 'Tắt App' : 'Bật App',
                onAction: toggleApp,
              }"
              :enabled="isAppEnabled"
            >
              App Virtual Try On hiện đang <Text variant="strong" as="span">{{ isAppEnabled ? 'BẬT' : 'TẮT' }}</Text>.
            </SettingToggle>
          </Card>
        </LayoutSection>

      </Layout>
    </Page>
  </AppProvider>
</template>

<script setup>
import { ref } from 'vue';

// Import bộ ngôn ngữ bắt buộc
import locales from '@ownego/polaris-vue/dist/locales/en.json';

// Các biến trạng thái của form
const isAppEnabled = ref(true);
const autoOptimize = ref(true);
const lookbackDays = ref('30');
const selectedModel = ref('idm-vton');

const modelOptions = [
  { label: 'IDM-VTON (Khuyên dùng)', value: 'idm-vton' },
  { label: 'OOTDiffusion', value: 'oot-diffusion' },
  { label: 'Fashn.ai (Pro)', value: 'fashn-api' },
];

const toggleApp = () => {
  isAppEnabled.value = !isAppEnabled.value;
};

const saveSettings = () => {
  console.log('Đang lưu cài đặt...', {
    model: selectedModel.value,
    days: lookbackDays.value,
    optimize: autoOptimize.value
  });
  
  // Dùng App Bridge để gọi Toast của Shopify thay vì alert()
  if (window.shopify) { 
    shopify.toast.show('Đã lưu cấu hình AI thành công!');
  } else {
    alert('Đã lưu thành công! (Chạy ngoài Shopify)');
  }
};
</script>

<style>
body {
  background-color: #f4f6f8; 
}
</style>
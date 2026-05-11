<template lang="pug">
ui-title-bar(title="Taitta VTON - Customize")

Page(title="Customize Appearance" :fullWidth="true")

  //- LOADING STATE
  Card(v-if="isPageLoading")
    div(class="py-20 flex flex-col items-center justify-center")
      Spinner(size="large")
      Text(variant="bodyMd" tone="subdued" class="mt-4") Đang tải cấu hình...

 
  //- GIAO DIỆN CHÍNH
  Layout(v-else)
    //- CỘT TRÁI: KHU VỰC CÀI ĐẶT
    LayoutSection
      Card
        BlockStack(gap="400")
          //- Tiêu đề Card
          Text(variant="headingMd" as="h2") Appearance
          
          //- 1. Background Color
          BlockStack(gap="200")
            Text(variant="bodyMd" as="label" fontWeight="medium") Background Color
            InlineStack(gap="300" align="start")
              //- Nút chọn màu native kết hợp Polaris
              div(class="relative w-10 h-10 rounded border border-gray-300 overflow-hidden cursor-pointer flex-shrink-0")
                input(type="color" v-model="settings.bgColor" class="absolute -top-2 -left-2 w-14 h-14 cursor-pointer")
              div(class="max-w-[200px]")
                TextField(v-model="settings.bgColor" autoComplete="off")

          //- 2. Text & Icon Color
          BlockStack(gap="200")
            Text(variant="bodyMd" as="label" fontWeight="medium") Text & Icon Color
            InlineStack(gap="300" align="start")
              div(class="relative w-10 h-10 rounded border border-gray-300 overflow-hidden cursor-pointer flex-shrink-0")
                input(type="color" v-model="settings.textColor" class="absolute -top-2 -left-2 w-14 h-14 cursor-pointer")
              div(class="max-w-[200px]")
                TextField(v-model="settings.textColor" autoComplete="off")

          Divider

          //- 3. Checkbox Animation Glow
          Checkbox(
            label="Enable golden glow animation"
            helpText="The button text will pulse with a subtle glow to attract attention"
            v-model="settings.enableGlow"
          )

          Divider

          //- 4. Title Text
          TextField(
            label="Title Text"
            v-model="settings.titleText"
            helpText="Text displayed above the try-on button"
            autoComplete="off"
          )

          //- 5. Button Text
          TextField(
            label="Button Text"
            v-model="settings.buttonText"
            helpText="Text displayed on the try-on button"
            maxLength="40"
            showCharacterCount
            autoComplete="off"
          )

          Divider

          //- 6. Button Spacing (Padding)
          BlockStack(gap="300")
            Text(variant="headingSm" as="h3" fontWeight="medium") Button Spacing (Padding)
            InlineStack(gap="400")
              div(class="w-32")
                TextField(
                  label="Top"
                  type="number"
                  v-model.number="settings.paddingTop"
                  min="0"
                  max="100"
                  suffix="px"
                  autoComplete="off"
                )
              div(class="w-32")
                TextField(
                  label="Bottom"
                  type="number"
                  v-model.number="settings.paddingBottom"
                  min="0"
                  max="100"
                  suffix="px"
                  autoComplete="off"
                )

          Divider

          //- 7. Footer Buttons
          InlineStack(align="space-between")
            Button(@click="resetToDefaults") Reset to Defaults
            Button(variant="primary" @click="saveSettings" :loading="isSaving") Save Changes

    //- CỘT PHẢI: KHU VỰC PREVIEW
    //- Dùng variant="oneThird" để cột này nhỏ hơn cột settings
    LayoutSection(variant="oneThird")
      Card
        BlockStack(gap="400")
          
          //- Tiêu đề Preview
          BlockStack(gap="100")
            Text(variant="headingMd" as="h2") Preview
            Text(variant="bodySm" tone="subdued") This is how the button will appear on product pages.
          
          //- Khung Preview (Vẫn giữ Tailwind vì nó mô phỏng giao diện Storefront, không phải Admin)
          div(class="p-5 border border-gray-200 rounded-lg bg-white")
            div(class="w-full h-40 bg-gray-50 rounded-lg mb-4 flex items-center justify-center border border-gray-200 border-dashed")
              span(class="text-gray-400 text-sm font-medium") Product Image
            
            Text(variant="bodyMd" fontWeight="bold") Example Product
            div(class="mb-4 mt-1")
              Text(variant="bodyMd" tone="subdued") $49.99

            //- Vùng bao bọc có Padding động
            div(:style="{ paddingTop: settings.paddingTop + 'px', paddingBottom: settings.paddingBottom + 'px' }")
              
              //- Title
              p(v-if="settings.titleText" style="color:#525252; font-size:14px; margin-bottom: 8px; text-align: center; font-weight: 500;") {{ settings.titleText }}
              
              //- Button
              button(
                :style="{ backgroundColor: settings.bgColor, color: settings.textColor }",
                :class="{ 'glow-animation': settings.enableGlow }",
                class="w-full py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300"
              )
                span {{ settings.buttonText || 'Virtual Try-On' }}
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { 
  Page, Layout, LayoutSection, Card, BlockStack, InlineStack, 
  Text, TextField, Checkbox, Button, Divider, Spinner 
} from '@ownego/polaris-vue';

// 💡 IMPORT TỪ FILE SERVICE VỪA TẠO
import { getCustomizationSettings, updateCustomizationSettings } from '@/service/CustomizeService'; 

// --- STATE CƠ BẢN ---
const isSaving = ref(false);
const isPageLoading = ref(true); 
const shopId = ref(null); 

// Dữ liệu cài đặt mặc định
const settings = reactive({
  bgColor: '#111111',
  textColor: '#FFFFFF',
  enableGlow: true,
  buttonText: 'Virtual Try-On',
  titleText: 'See how you look good in this outfit',
  paddingTop: 16,
  paddingBottom: 16
});

// Hàm Reset về mặc định
const resetToDefaults = () => {
  settings.bgColor = '#111111';
  settings.textColor = '#FFFFFF';
  settings.enableGlow = true;
  settings.buttonText = '✨Virtual Try-On';
  settings.titleText = 'See how you look good in this outfit';
  settings.paddingTop = 16;
  settings.paddingBottom = 16;
};

// ==========================================================
// 1. HÀM TẢI CÀI ĐẶT
// ==========================================================
const loadSettings = async () => {
  isPageLoading.value = true;
  try {
    // Chỉ cần gọi 1 dòng từ Service
    const data = await getCustomizationSettings();
    
    if (data.shopId) shopId.value = data.shopId;
    
    // Nếu có cài đặt cũ, gán đè lên state của Vue
    if (data.settings) {
      settings.bgColor = data.settings.bgColor || '#111111';
      settings.textColor = data.settings.textColor || '#FFFFFF'; 
      settings.enableGlow = data.settings.enableGlow ?? true;
      settings.buttonText = data.settings.buttonText || 'Virtual Try-On';
      settings.titleText = data.settings.titleText || 'See how you look good in this outfit';
      settings.paddingTop = data.settings.paddingTop !== undefined ? data.settings.paddingTop : 16;
      settings.paddingBottom = data.settings.paddingBottom !== undefined ? data.settings.paddingBottom : 16;
    }
  } catch (error) {
    console.error("Lỗi khi tải giao diện:", error);
  } finally {
    isPageLoading.value = false;
  }
};

// ==========================================================
// 2. HÀM LƯU CÀI ĐẶT 
// ==========================================================
const saveSettings = async () => {
  if (!shopId.value) {
    console.error("Chưa có Shop ID, không thể lưu.");
    return;
  }

  isSaving.value = true;
  
  try {
    // Đẩy thẳng state xuống cho Service lo liệu
    await updateCustomizationSettings(shopId.value, settings);
    window.shopify.toast.show('Settings saved successfully!');
  } catch (error) {
    window.shopify.toast.show('Failed to save settings. Please try again.', { isError: true });
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
/* Ma thuật tạo ra "Golden Glow Animation" bằng CSS thuần */

.glow-animation {
  /* Box-shadow này lấy đúng cái biến màu chữ (textColor) đổ bóng ra ngoài */
  box-shadow: 0 0 5px v-bind('settings.textColor'), 0 0 15px v-bind('settings.textColor');
  animation: pulse-glow 2s infinite alternate;
}

@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 2px v-bind('settings.textColor'), 0 0 8px v-bind('settings.textColor');
  }
  100% {
    box-shadow: 0 0 8px v-bind('settings.textColor'), 0 0 20px v-bind('settings.textColor');
  }
}

</style>
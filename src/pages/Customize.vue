<template lang="pug">
ui-title-bar(title="Taitta VTON - Customize")

Page(title="Customize Appearance")
  
  //- ==========================================
  //- LOADING STATE
  //- ==========================================
  Card(v-if="isPageLoading")
    div(class="py-20 flex flex-col items-center justify-center")
      Spinner(size="large")
      Text(variant="bodyMd" tone="subdued" class="mt-4") Đang tải cấu hình...

  //- ==========================================
  //- GIAO DIỆN CHÍNH
  //- ==========================================
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

// --- STATE CƠ BẢN ---
const isSaving = ref(false);
const isPageLoading = ref(true); // Trạng thái lúc mới vào trang đang lấy dữ liệu
const shopId = ref(null); // Lưu ID của Shop để dùng cho lúc Save

// Dữ liệu cài đặt mặc định
const settings = reactive({
  bgColor: '#111111',
  textColor: '#FFFFFF',
  enableGlow: true,
  buttonText: 'Virtual Try-On',
  titleText: 'See how you look good in this outfit', // Khai báo Title
  paddingTop: 16, // Khai báo Padding Top
  paddingBottom: 16 // Khai báo Padding Bottom
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
// 1. HÀM TẢI CÀI ĐẶT TỪ SHOPIFY (CHẠY LÚC VÀO TRANG)
// ==========================================================
const loadSettings = async () => {
  isPageLoading.value = true;
  try {
    const AccessToken= await window.shopify.idToken();
    console.log("Shopify Access Token:", AccessToken); // In ra token để kiểm tra
    
    // Câu lệnh lấy ID của Shop VÀ lấy luôn cái Metafield chứa cấu hình
    const graphqlQuery = {
      query: `
        query {
          shop {
            id
            metafield(namespace: "custom_vto", key: "button_settings") {
              value
            }
          }
        }
      `
    };

    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphqlQuery),
    });

    const result = await res.json();
    
    if (result.data?.shop) {
      // Lưu lại Shop ID để lát nữa dùng cho hàm Save
      shopId.value = result.data.shop.id;

      // Nếu Shop đã từng lưu cài đặt trước đó, ta sẽ bóc tách JSON ra
      const savedMetafield = result.data.shop.metafield;
      if (savedMetafield && savedMetafield.value) {
        const parsedSettings = JSON.parse(savedMetafield.value);
        
        // Gán dữ liệu cũ vào biến giao diện
        settings.bgColor = parsedSettings.bgColor || '#111111';
        settings.textColor = parsedSettings.textColor || '#FFD700';
        settings.enableGlow = parsedSettings.enableGlow ?? true;
        settings.buttonText = parsedSettings.buttonText || 'Virtual Try-On';
        settings.titleText = parsedSettings.titleText || 'See how you look good in this outfit';
        settings.paddingTop = parsedSettings.paddingTop !== undefined ? parsedSettings.paddingTop : 16;
        settings.paddingBottom = parsedSettings.paddingBottom !== undefined ? parsedSettings.paddingBottom : 16;
      }
    }
  } catch (error) {
    console.error("Lỗi khi tải cài đặt:", error);
  } finally {
    isPageLoading.value = false;
  }
};

// ==========================================================
// 2. HÀM LƯU CÀI ĐẶT LÊN SHOPIFY (KHI BẤM NÚT SAVE)
// ==========================================================
const saveSettings = async () => {
  if (!shopId.value) {
    console.error("Chưa có Shop ID, không thể lưu.");
    return;
  }

  isSaving.value = true;
  
  try {
    await window.shopify.idToken();

    // Dùng mutation metafieldsSet để ghi đè dữ liệu vào Shop
    const graphqlQuery = {
      query: `
        mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        metafields: [
          {
            ownerId: shopId.value, // Dán nhãn lên Shop
            namespace: "custom_vto",
            key: "button_settings",
            type: "json", // Kiểu dữ liệu là JSON
            value: JSON.stringify(settings) // Đóng gói object settings thành chuỗi JSON
          }
        ]
      }
    };

    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphqlQuery),
    });

    const result = await res.json();

    if (result.data?.metafieldsSet?.userErrors?.length > 0) {
      throw new Error(result.data.metafieldsSet.userErrors[0].message);
    }

    // Hiển thị thông báo thành công bằng component Toast của App Bridge
    window.shopify.toast.show('Settings saved successfully!');

  } catch (error) {
    console.error("Lỗi khi lưu cài đặt:", error);
    window.shopify.toast.show('Failed to save settings. Please try again.', { isError: true });
  } finally {
    isSaving.value = false;
  }
};

// Gọi hàm loadSettings ngay khi trang vừa được tạo ra
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

/* Ẩn mũi tên lên xuống của input number trên một số trình duyệt nếu bạn muốn nhìn cho gọn */
/*
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
*/
</style>
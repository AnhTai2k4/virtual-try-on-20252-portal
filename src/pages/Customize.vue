<template lang="pug">
div(class="max-w-6xl mx-auto pb-10")
  //- Tiêu đề trang
  div(class="mb-6")
    h1(class="text-2xl font-bold text-gray-900") Customize Button
    p(class="text-sm text-gray-500 mt-1") Design the Virtual Try-On button to match your brand.

  div(v-if="isPageLoading" class="flex flex-col items-center justify-center py-32 bg-white rounded-xl shadow-sm border border-gray-200")
    svg(class="animate-spin h-10 w-10 text-gray-900 mb-4", xmlns="http://www.w3.org/2000/svg", fill="none", viewBox="0 0 24 24")
      circle(class="opacity-25", cx="12", cy="12", r="10", stroke="currentColor", stroke-width="4")
      path(class="opacity-75", fill="currentColor", d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
    div(class="text-gray-500 font-medium")

  // GIAO DIỆN CHÍNH (CHỈ HIỆN KHI ĐÃ CÓ DATA)

  div(v-else class="flex flex-col lg:flex-row gap-6 items-start animate-fade-in")
    
    //- CỘT TRÁI: KHU VỰC CÀI ĐẶT
    div(class="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200")
      div(class="p-6 border-b border-gray-200")
        h2(class="text-lg font-bold text-gray-800") Appearance

      div(class="p-6 flex flex-col gap-8")
        
        //- 1. Background Color
        div
          label(class="block text-sm font-semibold text-gray-800 mb-2") Background Color
          div(class="flex items-center gap-3")
            div(class="relative w-12 h-10 rounded border border-gray-300 overflow-hidden cursor-pointer flex-shrink-0")
              input(type="color" v-model="settings.bgColor" class="absolute -top-2 -left-2 w-16 h-16 cursor-pointer")
            input(type="text" v-model="settings.bgColor" class="border border-gray-300 rounded-lg px-3 py-2 w-48 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase font-mono")

        //- 2. Text & Icon Color
        div
          label(class="block text-sm font-semibold text-gray-800 mb-2") Text & Icon Color
          div(class="flex items-center gap-3")
            div(class="relative w-12 h-10 rounded border border-gray-300 overflow-hidden cursor-pointer flex-shrink-0")
              input(type="color" v-model="settings.textColor" class="absolute -top-2 -left-2 w-16 h-16 cursor-pointer")
            input(type="text" v-model="settings.textColor" class="border border-gray-300 rounded-lg px-3 py-2 w-48 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 uppercase font-mono")

        div(class="w-full h-px bg-gray-100")

        //- 3. Checkbox Animation Glow
        div
          label(class="flex items-start gap-3 cursor-pointer group")
            div(class="relative flex items-center justify-center mt-0.5")
              input(type="checkbox" v-model="settings.enableGlow" class="peer appearance-none w-5 h-5 border border-gray-300 rounded bg-white checked:bg-gray-900 checked:border-gray-900 transition-colors cursor-pointer")
              svg(class="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor")
                path(fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd")
            div
              div(class="text-sm font-semibold text-gray-800 group-hover:text-black transition-colors") Enable golden glow animation
              div(class="text-sm text-gray-500 mt-0.5") The button text will pulse with a subtle glow to attract attention

        div(class="w-full h-px bg-gray-100")

        //- 4. Title Text (Thêm mới)
        div
          label(class="block text-sm font-semibold text-gray-800 mb-2") Title Text
          input(type="text" v-model="settings.titleText" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500")
          p(class="text-sm text-gray-500 mt-2") Text displayed above the try-on button

        //- 5. Button Text
        div
          label(class="block text-sm font-semibold text-gray-800 mb-2") Button Text
          div(class="relative")
            input(type="text" v-model="settings.buttonText" maxlength="40" class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500")
            span(class="absolute right-3 top-2.5 text-xs text-gray-400 font-medium") {{ settings.buttonText.length }}/40
          p(class="text-sm text-gray-500 mt-2") Text displayed on the try-on button

        div(class="w-full h-px bg-gray-100")

        //- 6. Button Spacing (Padding dạng Input)
        div
          label(class="block text-sm font-semibold text-gray-800 mb-4") Button Spacing (Padding)
          div(class="flex flex-col gap-4 max-w-xs")
            
            //- Padding Top
            div
              label(class="block text-sm text-gray-800 mb-1") Top
              div(class="relative flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500")
                input(
                  type="number", min="0", max="100", v-model.number="settings.paddingTop",
                  class="w-full py-2 pl-3 pr-16 text-sm border-none focus:ring-0 outline-none"
                )
                span(class="absolute right-8 text-sm text-gray-500 pointer-events-none") pixels
            
            //- Padding Bottom
            div
              label(class="block text-sm text-gray-800 mb-1") Bottom
              div(class="relative flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500")
                input(
                  type="number", min="0", max="100", v-model.number="settings.paddingBottom",
                  class="w-full py-2 pl-3 pr-16 text-sm border-none focus:ring-0 outline-none"
                )
                span(class="absolute right-8 text-sm text-gray-500 pointer-events-none") pixels

      //- 7. Footer Buttons
      div(class="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl flex items-center justify-between")
        button(@click="resetToDefaults" class="px-5 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm") Reset to Defaults
        
        button(
          @click="saveSettings",
          :disabled="isSaving",
          :class="isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'",
          class="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
        ) 
          svg(v-if="isSaving" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24")
            circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none")
            path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
          span {{ isSaving ? 'Saving...' : 'Save Changes' }}

    //- CỘT PHẢI: KHU VỰC PREVIEW
    div(class="w-full lg:w-1/3 sticky top-6")
      div(class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden")
        div(class="p-6 border-b border-gray-200 bg-gray-50")
          h2(class="text-lg font-bold text-gray-800") Preview
          p(class="text-sm text-gray-500 mt-1") This is how the button will appear on product pages.
        
        div(class="p-6")
          div(class="bg-white")
            div(class="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center border border-gray-200 dashed")
              span(class="text-gray-400 text-sm font-medium") Product Image
            
            div(class="font-bold text-gray-900 mb-1") Example Product
            div(class="text-gray-600 mb-5") $49.99

            //- Vùng bao bọc có Padding
            div(:style="{ paddingTop: settings.paddingTop + 'px', paddingBottom: settings.paddingBottom + 'px' }")
              //- Title (Chỉ hiện nếu có text)
              p(v-if="settings.titleText" style="color:#525252; font-size:16px; margin-bottom: 8px; text-align: center;") {{ settings.titleText }}
              
              button(
                :style="{ backgroundColor: settings.bgColor, color: settings.textColor }",
                :class="{ 'glow-animation': settings.enableGlow }",
                class="w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 mb-3"
              )
                
                span {{ settings.buttonText || 'Virtual Try-On' }}

            //- button(class="w-full py-3 px-4 bg-black text-white rounded-lg font-bold text-sm mt-3") Add to Cart
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

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

    const res = await fetch('shopify:admin/api/2024-04/graphql.json', {
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

    const res = await fetch('shopify:admin/api/2024-04/graphql.json', {
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
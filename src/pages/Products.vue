<template lang="pug">
Page
  Card(padding="0", class="mb-5")
    div(class="flex items-center justify-between p-4 border-b border-gray-200")
      div(class="font-medium text-gray-700") Products ({{ products.length }})
      div(class="flex items-center gap-3")
        button(class="px-4 py-1.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors") Filter
        input(
          type="text",
          placeholder="Search products by name...",
          class="border border-gray-300 rounded-lg px-3 py-1.5 w-64 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        )

    div(class="flex flex-col")
      div(
        v-for="product in products",
        :key="product.id",
        class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
      )
        div(class="flex items-center gap-4")
          div(class="w-12 h-16 bg-gray-100 rounded border border-gray-200 overflow-hidden flex-shrink-0")
            img(:src="product.image", class="w-full h-full object-cover", alt="Product")
          div
            div(class="font-medium text-gray-900") {{ product.title }}
            div(class="flex items-center gap-2 mt-1 text-sm text-gray-500")
              span(
                :class="getBadgeClass(product.status)",
                class="px-2 py-0.5 rounded text-xs font-semibold tracking-wide"
              ) {{ product.status }}
              span {{ product.imagesCount }} images

        div(class="flex items-center gap-3")
          button(
            @click="toggleVto(product)",
            class="relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none border",
            :class="product.vtoEnabled ? 'bg-white border-green-500' : 'bg-gray-50 border-gray-300'"
          )
            span(
              class="absolute flex items-center justify-center w-6 h-6 rounded-full transition-transform duration-200 ease-in-out",
              :class="product.vtoEnabled ? 'translate-x-9 bg-green-500' : 'translate-x-1 bg-gray-300'"
            )
            span(
              class="absolute text-xs font-bold w-full text-center pointer-events-none",
              :class="product.vtoEnabled ? 'text-green-500 pr-5' : 'text-gray-500 pl-5'"
            ) {{ product.vtoEnabled ? 'On' : 'Off' }}

          button(
            @click="openTemplateModal(product)",
            class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          ) Template
          
          button(
            @click="openImageModal(product)",
            class="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          ) Select Image
          
          button(
            v-if="product.status === 'Custom'",
            class="px-2 py-1.5 text-red-500 text-sm font-medium hover:underline"
          ) Reset

  Teleport(to="body")
    div(
      v-if="isTemplateModalOpen",
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm",
      @click="isTemplateModalOpen = false"
    )
      div(class="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative", @click.stop)
        div(class="flex justify-between items-center mb-6 border-b pb-4")
          h2(class="text-xl font-bold text-gray-800") Try-On Templates
          button(class="text-gray-400 hover:text-gray-800 text-2xl leading-none", @click="isTemplateModalOpen = false") &times;
        
        div(class="grid grid-cols-4 gap-6")
          div(
            v-for="temp in templates",
            :key="temp.id",
            class="border border-gray-200 rounded-xl p-4 flex flex-col items-center hover:border-blue-400 transition-colors"
          )
            div(class="h-32 w-full bg-gray-50 rounded-lg flex items-center justify-center mb-4 overflow-hidden")
              img(:src="temp.image", class="h-full object-contain", alt="Template")
            div(class="font-medium text-gray-800 mb-4 flex items-center")
              | {{ temp.name }}
              span(
                v-if="temp.isNew",
                class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 uppercase tracking-wide"
              ) New
            button(class="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors") Use template
        
        div(class="text-center mt-6 text-sm text-gray-400") More templates are coming soon...

  Teleport(to="body")
    div(
      v-if="isImageModalOpen",
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm",
      @click="isImageModalOpen = false"
    )
      div(class="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative", @click.stop)
        div(class="flex justify-between items-center mb-6 border-b pb-4")
          h2(class="text-xl font-bold text-gray-800") Select VTO Image - 
            span(class="text-blue-600") {{ selectedProduct?.title }}
          button(class="text-gray-400 hover:text-gray-800 text-2xl leading-none", @click="isImageModalOpen = false") &times;

        div(class="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50")
          div(class="font-bold flex items-center gap-2 mb-2 text-gray-800")
            span(class="text-lg") ☁️
            | Upload Custom VTO Image 
            span(class="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-semibold") Recommended
          p(class="text-sm text-gray-500 mb-4") Upload a garment-only image that won't appear on your product page. This image will only be used for virtual try-on.
          input(
            type="file",
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:border-gray-300 file:border file:text-gray-700 hover:file:bg-gray-50 cursor-pointer"
          )

        div(class="text-center text-sm text-gray-400 mb-6 relative")
          span(class="bg-white px-3 relative z-10 font-medium") OR
          div(class="absolute left-0 top-1/2 w-full h-px bg-gray-200 -z-0")

        div
          div(class="font-bold flex items-center gap-2 mb-2 text-gray-800")
            span(class="text-lg") 🖼️
            | Select from Product Images
          p(class="text-sm text-gray-500 mb-4") Choose from your existing product images. Best results with flat lay or ghost mannequin shots.
          
          div(class="flex gap-4")
            div(
              v-for="i in 3",
              :key="i",
              class="w-24 h-32 border-2 border-transparent rounded-lg cursor-pointer hover:border-blue-500 overflow-hidden relative group"
            )
              img(:src="selectedProduct?.image", class="w-full h-full object-cover")
              div(class="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all")
              div(class="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-[11px] font-medium text-center py-1") Image {{ i }}

        div(class="mt-8 flex justify-end gap-3 pt-4 border-t")
          button(class="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50", @click="isImageModalOpen = false") Cancel
          button(class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm") Save Image
</template>

<script setup>
import { ref } from 'vue';

// --- MOCK DATA: Danh sách sản phẩm ---
const products = ref([
  { id: 1, title: 'Weave Shirt in White/Red', status: 'Custom', imagesCount: 3, vtoEnabled: true, image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png' },
  { id: 2, title: 'Nuit Trousers in Black', status: 'Auto', imagesCount: 3, vtoEnabled: true, image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png' },
  { id: 3, title: 'Deskle Top in Heather', status: 'Auto', imagesCount: 5, vtoEnabled: true, image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png' },
  { id: 4, title: 'Quilted Mesh T-Shirt Dress', status: 'Auto', imagesCount: 4, vtoEnabled: true, image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png' },
  { id: 5, title: 'Kasuri Jersey Button-Up', status: 'VTO Off', imagesCount: 3, vtoEnabled: false, image: 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png' },
]);

// --- MOCK DATA: Danh sách Template ---
const templates = ref([
  { id: 1, name: 'Upper body', isNew: false, image: 'https://cdn-icons-png.flaticon.com/512/863/863684.png' },
  { id: 2, name: 'Full body', isNew: false, image: 'https://cdn-icons-png.flaticon.com/512/2806/2806085.png' },
  { id: 3, name: 'Bottom body', isNew: false, image: 'https://cdn-icons-png.flaticon.com/512/3050/3050239.png' },
  { id: 4, name: 'Eye wear', isNew: true, image: 'https://cdn-icons-png.flaticon.com/512/2618/2618361.png' },
]);

// --- STATE QUẢN LÝ MODAL ---
const isTemplateModalOpen = ref(false);
const isImageModalOpen = ref(false);
const selectedProduct = ref(null); // Lưu vết xem đang click vào sản phẩm nào

// --- CÁC HÀM XỬ LÝ LÔ-GÍC ---

// Hàm xử lý đổi trạng thái On/Off của nút VTO
const toggleVto = (product) => {
  product.vtoEnabled = !product.vtoEnabled;
  // Cập nhật lại Badge theo logic thiết kế
  if (!product.vtoEnabled) {
    product.status = 'VTO Off';
  } else {
    product.status = 'Auto'; // Hoặc 'Custom' tùy logic Backend sau này trả về
  }
};

const openTemplateModal = (product) => {
  selectedProduct.value = product;
  isTemplateModalOpen.value = true;
};

const openImageModal = (product) => {
  selectedProduct.value = product;
  isImageModalOpen.value = true;
};

// Hàm tô màu Badge động dựa trên text
const getBadgeClass = (status) => {
  switch (status) {
    case 'Custom': return 'bg-green-100 text-green-700';
    case 'Auto': return 'bg-blue-100 text-blue-700';
    case 'VTO Off': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};
</script>

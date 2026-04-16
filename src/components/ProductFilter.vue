<template lang="pug">
div(class="flex items-center gap-3 relative")
  //- Nút Dropdown Filter 2 Lớp
  div(class="relative")
    button(
      @click="toggleMenu",
      class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
    ) 
      | Add filter +
      span(v-if="totalSelected > 0" class="ml-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full") {{ totalSelected }}
    
    div(v-if="isOpen" class="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-2")
      //- Lớp 1: Danh sách các nhóm Filter
      div(v-if="!activeCategory")
        ul(class="text-sm text-gray-700")
          li(
            v-for="cat in categories",
            :key="cat",
            @click="activeCategory = cat",
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
          )
            //- Khối hiển thị Tên danh mục + Số lượng Checkbox đang chọn
            div(class="flex items-center gap-2")
              span {{ cat }}
              span(
                v-if="internalSelected[cat].length > 0",
                class="bg-gray-200 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              ) {{ internalSelected[cat].length }}

            //- Icon mũi tên
            svg(xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor")
              path(fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd")
      
      //- Lớp 2: Danh sách Checkbox của nhóm đang chọn
      div(v-else)
        div(class="px-3 py-2 border-b border-gray-100 flex items-center gap-2 mb-1")
          button(@click="activeCategory = null" class="p-1 hover:bg-gray-100 rounded text-gray-500")
            svg(xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor")
              path(fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd")
          span(class="font-medium text-sm text-gray-800") {{ activeCategory }}
        
        div(class="max-h-60 overflow-y-auto")
          div(v-if="loadingOptions" class="px-4 py-4 flex justify-center")
            svg(class="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24")
              circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none")
              path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
          
          label(v-for="item in options[activeCategory]" :key="item.value" class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer")
            input(
              type="checkbox",
              :value="item.value",
              v-model="internalSelected[activeCategory]",
              @change="emitChange",
              class="w-4 h-4 text-blue-600 rounded border-gray-300"
            )
            span(class="text-sm text-gray-700") {{ item.label }}

  //- Thanh Search
  input(
    v-model="internalSearch",
    @keyup.enter="emitChange",
    type="text",
    placeholder="Search products by name...",
    class="border border-gray-300 rounded-lg px-3 py-1.5 w-72 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
  )
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const emit = defineEmits(['filter-change']);

// --- STATE ---
const isOpen = ref(false);
const activeCategory = ref(null);
const loadingOptions = ref(false);
const internalSearch = ref('');

// Đã bổ sung Categories và mở lại Collections
const categories = [ 'Collections', 'Types', 'Tags', 'Vendors'];

// Data chứa các lựa chọn Checkbox
const options = ref({
  Collections: [],
  Types: [],
  Tags: [],
  Vendors: []
});

// Lưu trữ các giá trị checkbox được chọn
const internalSelected = ref({
  Collections: [],
  Types: [],
  Tags: [],
  Vendors: []
});

// Tính tổng số filter đang chọn để hiển thị ra nút
const totalSelected = computed(() => {
  return Object.values(internalSelected.value).reduce((total, arr) => total + arr.length, 0);
});

// --- GỌI API ĐỂ LẤY DANH MỤC THẬT TỪ SHOPIFY ---
const fetchAllMetadata = async () => {
  loadingOptions.value = true;
  try {
    await window.shopify.idToken();
    const query = {
      query: `
        query {
          shop {
            productTypes(first: 250) { edges { node } }
            productTags(first: 250) { edges { node } }
            productVendors(first: 250) { edges { node } }
          }
          collections(first: 250) {
            edges { node { id title } }
          }
        }
      `
    };

    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    const { data } = await res.json();

    // Lọc và gán dữ liệu vào các Checkbox
    options.value.Types = data.shop.productTypes.edges.map(e => ({ label: e.node, value: e.node })).filter(i => i.label !== "");
    options.value.Tags = data.shop.productTags.edges.map(e => ({ label: e.node, value: e.node })).filter(i => i.label !== "");
    options.value.Vendors = data.shop.productVendors.edges.map(e => ({ label: e.node, value: e.node })).filter(i => i.label !== "");
    
    // 🔥 FIX LỖI COLLECTION: Cắt chuỗi để lấy đúng ID số truyền đi
    options.value.Collections = data.collections.edges.map(e => {
      const numericId = e.node.id.split('/').pop(); 
      return { label: e.node.title, value: numericId };
    });

  } catch (e) {
    console.error("Lỗi fetch Filter Options:", e);
  } finally {
    loadingOptions.value = false;
  }
};

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) activeCategory.value = null; // Reset về danh sách category khi đóng
};

// Gửi dữ liệu filter đang chọn sang file Products.vue
const emitChange = () => {
  emit('filter-change', {
    search: internalSearch.value,
    filters: internalSelected.value
  });
};

onMounted(() => {
  fetchAllMetadata();
});
</script>
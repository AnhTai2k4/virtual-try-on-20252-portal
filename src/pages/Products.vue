<template lang="pug">
Page
  //- ==========================================
  //- KHỐI ĐIỀU HƯỚNG TABS (ACTIONS)
  //- ==========================================
  div(class="mb-6")
    div(class="text-lg font-bold text-gray-800 mb-3 uppercase tracking-wide") Actions
    div(class="flex items-center gap-3")
      button(
        @click="activeTab = 'collections'",
        :class="activeTab === 'collections' ? 'bg-gray-800 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300'",
        class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm"
      ) Add collections
      
      button(
        @click="activeTab = 'products'",
        :class="activeTab === 'products' ? 'bg-gray-800 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300'",
        class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm"
      ) Add products

  //- ==========================================
  //- GIAO DIỆN TAB: ADD PRODUCTS
  //- ==========================================
  Card(v-if="activeTab === 'products'", padding="0", class="mb-5", style="overflow: visible !important;")
    div(class="flex items-center justify-between p-4 border-b border-gray-200")
      div(class="font-medium text-gray-700") Products ({{ products.length }})
      ProductFilter(@filter-change="handleFilterChange")

    div(v-if="isLoadingPage", class="flex justify-center items-center min-h-[350px]")
      svg(class="animate-spin h-10 w-10 text-blue-600", xmlns="http://www.w3.org/2000/svg", fill="none", viewBox="0 0 24 24")
        circle(class="opacity-25", cx="12", cy="12", r="10", stroke="currentColor", stroke-width="4")
        path(class="opacity-75", fill="currentColor", d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

    div(v-else, class="flex flex-col min-h-[250px] pb-8")
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
              span(:class="getBadgeClass(product.status)", class="px-2 py-0.5 rounded text-xs font-semibold tracking-wide") {{ product.status }}
              span {{ product.imagesCount }} images

        div(class="flex items-center gap-3")
          div(class="flex items-center gap-2")
            button(
              @click="toggleVto(product)",
              :disabled="product.isUpdating",
              class="relative inline-flex h-6 w-14 items-center rounded-full transition-colors focus:outline-none border disabled:opacity-50",
              :class="product.vtoEnabled ? 'bg-white border-green-500' : 'bg-gray-50 border-gray-300'"
            )
              span(class="absolute flex items-center justify-center w-4 h-4 rounded-full transition-transform duration-200 ease-in-out" :class="product.vtoEnabled ? 'translate-x-9 bg-green-500' : 'translate-x-1 bg-gray-300'")
              span(class="absolute text-xs font-bold w-full text-center pointer-events-none" :class="product.vtoEnabled ? 'text-green-500 pr-5' : 'text-gray-500 pl-5'") {{ product.vtoEnabled ? 'On' : 'Off' }}
            svg(v-if="product.isUpdating" class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
              circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
              path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

          //- button(@click="openTemplateModal(product)" class="px-1.5 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors") Template
          //- button(@click="openImageModal(product)" class="px-1.5 py-1 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors") Select Image
          button(v-if="product.status === 'Custom'" class="px-2 py-1.5 text-red-500 text-sm font-medium hover:underline") Reset

  //- ==========================================
  //- GIAO DIỆN TAB: ADD COLLECTIONS
  //- ==========================================
  Card(v-if="activeTab === 'collections'", padding="0", class="mb-5")
    div(class="flex items-center justify-between p-4 border-b border-gray-200")
      div(class="font-medium text-gray-700") Collections ({{ collections.length }})

    div(v-if="isLoadingCollections", class="flex justify-center items-center min-h-[350px]")
      svg(class="animate-spin h-10 w-10 text-blue-600", xmlns="http://www.w3.org/2000/svg", fill="none", viewBox="0 0 24 24")
        circle(class="opacity-25", cx="12", cy="12", r="10", stroke="currentColor", stroke-width="4")
        path(class="opacity-75", fill="currentColor", d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

    div(v-else, class="flex flex-col pb-4")
      div(
        v-for="collection in collections",
        :key="collection.id",
        class="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
      )
        div(class="flex items-center gap-4")
          div(class="w-14 h-14 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center")
            img(v-if="collection.image", :src="collection.image", class="w-full h-full object-cover", alt="Collection")
            //- Icon mặc định nếu Collection không có ảnh
            svg(v-else, class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20")
              path(fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd")
          div
            div(class="font-medium text-gray-900 text-base") {{ collection.title }}
            div(class="flex items-center gap-2 mt-1 text-sm text-gray-500")
              //- Hiển thị Badge Auto / VTO Off
              span(
                :class="getBadgeClass(collection.status)", 
                class="px-2 py-0.5 rounded text-xs font-semibold tracking-wide"
              ) {{ collection.status }}
              span {{ collection.productsCount }} products

        div(class="flex items-center gap-3")
          button(
            @click="toggleCollectionVto(collection)",
            :disabled="collection.isUpdating || collection.productsCount === 0",
            class="relative inline-flex h-6 w-14 items-center rounded-full transition-colors focus:outline-none border disabled:opacity-50",
            :class="collection.vtoEnabled ? 'bg-white border-green-500' : 'bg-gray-50 border-gray-300'"
          )
            span(class="absolute flex items-center justify-center w-4 h-4 rounded-full transition-transform duration-200 ease-in-out" :class="collection.vtoEnabled ? 'translate-x-9 bg-green-500' : 'translate-x-1 bg-gray-300'")
            span(class="absolute text-xs font-bold w-full text-center pointer-events-none" :class="collection.vtoEnabled ? 'text-green-500 pr-5' : 'text-gray-500 pl-5'") {{ collection.vtoEnabled ? 'On' : 'Off' }}
          
          svg(v-if="collection.isUpdating" class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
            circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
            path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

  //- ==========================================
  //- MODALS
  //- ==========================================
  TemplateModal(:isOpen="isTemplateModalOpen" :product="selectedProduct" :templates="templates" @close="isTemplateModalOpen = false")
  ImageModal(:isOpen="isImageModalOpen" :product="selectedProduct" @close="isImageModalOpen = false")
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import ProductFilter from '../components/ProductFilter.vue';
import TemplateModal from '../components/TemplateModal.vue';
import ImageModal from '../components/ImageModal.vue';

// --- STATE ĐIỀU HƯỚNG TABS ---
const activeTab = ref('products'); // Mặc định mở tab Products

// --- STATE SẢN PHẨM ---
const products = ref([]);
const isLoadingPage = ref(true);
const currentFilterParams = ref({ search: '', filters: {} });

// --- STATE COLLECTIONS ---
const collections = ref([]);
const isLoadingCollections = ref(false);

const templates = ref([
  { id: 1, name: 'Upper body', isNew: false, image: 'https://cdn-icons-png.flaticon.com/512/863/863684.png' },
  { id: 2, name: 'Full body', isNew: false, image: 'https://cdn-icons-png.flaticon.com/512/2806/2806085.png' },
  { id: 3, name: 'Bottom body', isNew: false, image: 'https://cdn-icons-png.flaticon.com/512/3050/3050239.png' },
  { id: 4, name: 'Eye wear', isNew: true, image: 'https://cdn-icons-png.flaticon.com/512/2618/2618361.png' },
]);

const isTemplateModalOpen = ref(false);
const isImageModalOpen = ref(false);
const selectedProduct = ref(null);

// Lắng nghe sự kiện chuyển tab: Nếu mở tab Collection lần đầu thì mới tải data để tiết kiệm API
watch(activeTab, (newTab) => {
  if (newTab === 'collections' && collections.value.length === 0) {
    fetchCollections();
  }
});

// ==========================================================
// LOGIC CHO TAB: PRODUCTS
// ==========================================================
const handleFilterChange = (params) => {
  currentFilterParams.value = params;
  fetchProducts(); 
};

const fetchProducts = async () => {
  isLoadingPage.value = true;
  try {
    await window.shopify.idToken();
    let queryParts = [];
    const { search, filters } = currentFilterParams.value;

    if (search && search.trim() !== '') queryParts.push(`title:*${search.trim()}*`);
    if (filters.Types && filters.Types.length > 0) queryParts.push(`(${filters.Types.map(t => `product_type:"${t}"`).join(' OR ')})`);
    if (filters.Tags && filters.Tags.length > 0) queryParts.push(`(${filters.Tags.map(t => `tag:"${t}"`).join(' OR ')})`);
    if (filters.Vendors && filters.Vendors.length > 0) queryParts.push(`(${filters.Vendors.map(v => `vendor:"${v}"`).join(' OR ')})`);
    // Xử lý Collection chuẩn xác:
    if (filters.Collections && filters.Collections.length > 0) {
      const collectionQueries = filters.Collections.map(id => `collection_id:${id}`);
      queryParts.push(`(${collectionQueries.join(' OR ')})`);
    }

    // Xử lý Category (Nếu bạn dùng Product Category chuẩn):
    if (filters.Categories && filters.Categories.length > 0) {
      const categoryQueries = filters.Categories.map(cat => `product_type:"${cat}"`); // Đổi trường tìm kiếm tùy theo cách bạn config
      queryParts.push(`(${categoryQueries.join(' OR ')})`);
    }

    const finalQuery = queryParts.length > 0 ? queryParts.join(' AND ') : "";

    const graphqlQuery = {
      query: `
        query getProducts($first: Int!, $searchQuery: String) {
          products(first: $first, query: $searchQuery) {
            edges {
              node {
                id title featuredImage { url }
                vtoStatus: metafield(namespace: "custom", key: "vto_enabled") { value }
                images(first: 10) { nodes { id } }
              }
            }
          }
        }
      `,
      variables: { first: 50, searchQuery: finalQuery } 
    };

    const response = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(graphqlQuery),
    });

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);

    products.value = result.data.products.edges.map(({ node }) => {
      const isEnabled = node.vtoStatus?.value === 'true';
      return {
        id: node.id, title: node.title, image: node.featuredImage?.url || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png',
        imagesCount: node.images?.nodes?.length || 0, vtoEnabled: isEnabled, status: isEnabled ? 'Auto' : 'VTO Off', isUpdating: false
      };
    });

    
  } catch (error) {
    console.error("Lỗi fetch products:", error);
    products.value = [];
  } finally {
    isLoadingPage.value = false;
  }
};

const toggleVto = async (product) => {
  if (product.isUpdating) return;
  const previousState = product.vtoEnabled;
  product.vtoEnabled = !product.vtoEnabled;
  product.status = product.vtoEnabled ? 'Auto' : 'VTO Off';
  product.isUpdating = true;

  try {
    await window.shopify.idToken();
    const graphqlQuery = {
      query: `mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { userErrors { field message } } }`,
      variables: { metafields: [{ ownerId: product.id, namespace: "custom", key: "vto_enabled", type: "boolean", value: product.vtoEnabled.toString() }] }
    };
    const response = await fetch('shopify:admin/api/2026-04/graphql.json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(graphqlQuery) });
    const result = await response.json();
    if (result.data?.metafieldsSet?.userErrors?.length > 0) throw new Error(result.data.metafieldsSet.userErrors[0].message);
    
    // Đồng bộ lại dữ liệu nếu chuyển sang tab Collection
    if(collections.value.length > 0) fetchCollections();
  } catch (error) {
    console.error("Lỗi update Metafield:", error);
    product.vtoEnabled = previousState;
    product.status = previousState ? 'Auto' : 'VTO Off';
  } finally {
    product.isUpdating = false;
  }
};

// ==========================================================
// LOGIC CHO TAB: COLLECTIONS
// ==========================================================
const fetchCollections = async () => {
  isLoadingCollections.value = true;
  try {
    await window.shopify.idToken();
    const graphqlQuery = {
      query: `
        query {
          collections(first: 50) {
            edges {
              node {
                id
                title
                image { url }
                products(first: 250) {
                  nodes {
                    id
                    vtoStatus: metafield(namespace: "custom", key: "vto_enabled") { value }
                  }
                }
              }
            }
          }
        }
      `
    };
    const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(graphqlQuery),
    });
    const result = await res.json();
    
    collections.value = result.data.collections.edges.map(({node}) => {
      const productList = node.products.nodes;
      const productIds = productList.map(p => p.id);
      
      // LOGIC MỚI: Chỉ trả về true nếu TẤT CẢ sản phẩm đều có vtoStatus là 'true'
      // Và danh sách sản phẩm phải có ít nhất 1 món (length > 0)
      const isAllEnabled = productList.length > 0 && productList.every(p => p.vtoStatus?.value === 'true');

      return {
        id: node.id,
        title: node.title,
        image: node.image?.url || null,
        productsCount: productList.length,
        productIds: productIds,
        vtoEnabled: isAllEnabled,
        status: isAllEnabled ? 'Auto' : 'VTO Off', 
        isUpdating: false
      };
    });
  } catch (err) {
    console.error("Lỗi fetch collections:", err);
  } finally {
    isLoadingCollections.value = false;
  }
};

const toggleCollectionVto = async (collection) => {
  if (collection.isUpdating) return;
  const previousState = collection.vtoEnabled;
  const previousStatus = collection.status; // <--- Lưu lại trạng thái cũ
  collection.vtoEnabled = !collection.vtoEnabled;
  collection.status = collection.vtoEnabled ? 'Auto' : 'VTO Off'; // <--- Cập nhật UI ngay lập tức
  collection.isUpdating = true;

  const newStateStr = collection.vtoEnabled.toString();

  try {
    await window.shopify.idToken();
    
    // THUẬT TOÁN BĂM NHỎ (BATCHING): Shopify chỉ cho phép update 25 metafields 1 lần
    const chunkSize = 25;
    const chunks = [];
    for (let i = 0; i < collection.productIds.length; i += chunkSize) {
      chunks.push(collection.productIds.slice(i, i + chunkSize));
    }

    // Gửi từng gói 25 sản phẩm lên Shopify
    for (const chunk of chunks) {
      const metafields = chunk.map(id => ({
        ownerId: id,
        namespace: "custom",
        key: "vto_enabled",
        type: "boolean",
        value: newStateStr
      }));

      const graphqlQuery = {
        query: `mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { userErrors { field message } } }`,
        variables: { metafields }
      };

      const res = await fetch('shopify:admin/api/2026-04/graphql.json', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(graphqlQuery)
      });
      const result = await res.json();
      if (result.data?.metafieldsSet?.userErrors?.length > 0) {
        throw new Error(result.data.metafieldsSet.userErrors[0].message);
      }
    }
    
    // Chạy ngầm việc update lại tab Products để data đồng bộ luôn
    fetchProducts();

  } catch (error) {
    console.error("Lỗi cập nhật hàng loạt:", error);
    collection.vtoEnabled = previousState;
  } finally {
    collection.isUpdating = false;
  }
};

const openTemplateModal = (product) => { selectedProduct.value = product; isTemplateModalOpen.value = true; };
const openImageModal = (product) => { selectedProduct.value = product; isImageModalOpen.value = true; };

const getBadgeClass = (status) => {
  switch (status) {
    case 'Custom': return 'bg-green-100 text-green-700';
    case 'Auto': return 'bg-blue-100 text-blue-700';
    case 'VTO Off': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

onMounted(() => {
  fetchProducts(); // Vừa vào trang thì load tab Products trước
});
</script>
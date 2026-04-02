<template lang="pug">
ui-title-bar(title="Taitta VTON - Dashboard")
Page
  Layout
    LayoutSection
      Card
        div(class="flex justify-start items-center gap-4 mb-4")
          img(src="https://cdn.shopify.com/s/files/applications/1b2264711de2bedd402f74cf579a87cf_200x200.png?v=1773998590", alt="Logo", class="rounded-full w-14 h-14 border border-gray-200 shadow-sm")
          h1(class="text-2xl font-bold") Welcome to Your Virtual Try-On Dashboard! 🎉

        div(class="mb-6")
          Text(variant="bodyLg", as="p")
            span(class="font-bold text-gray-800") See It On You Before You Buy
            |  - AI-powered Virtual Try-On that lets your customers visualize products on themselves, increasing confidence and reducing returns.
          a(href="https://anhtai-dev-store.myshopify.com", target="_blank", class="inline-block mt-2 text-blue-600 hover:text-blue-800 hover:underline font-medium") Visit Website &rarr;

        div(class="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100")
          div
            p(class="text-sm text-gray-700 mb-1 font-bold") Connected Store
            p(class="font-semibold text-gray-900") anhtai-dev-store.myshopify.com
          div(class="bg-[#E4F0FE] text-[#005BD3] px-3 py-1.5 rounded-lg text-sm font-medium") Free Trial Plan

    LayoutSection
      Banner(title="You're Almost Ready!", status="info", :action="{ content: 'Add to Theme', onAction: goToThemeEditor }")
        p Add the Virtual Try-on button to your product pages so customers can start trying on items virtually. This takes just one click.

    LayoutSection
      Card
        div(class="flex justify-between items-center mb-3")
          Text(variant="headingMd", as="h2") Usage Analytics
          Button(plain, @click="navigateTo('/analytics')") View details

        div(class="flex justify-between mb-2")
          Text(variant="bodyMd", as="span") 2 / 10 try-ons
          Text(variant="bodyMd", as="span", color="subdued") 20%

        ProgressBar(:progress="20", color="primary")

    LayoutSection
      Banner(v-if="showUpgradeBanner", title="Upgrade for More Try-Ons", status="success", @dismiss="showUpgradeBanner = false", :action="{ content: 'Upgrade', onAction: () => navigateTo('/plan') }")
        p Unlock unlimited virtual try-ons and professional AI studio features to grow your store's sales.

    LayoutSection
      Card(class="mb-5")
        div(class="mb-4")
          Text(variant="headingMd", as="h2") Quick Actions
        div(class="flex flex-wrap gap-3")
          Button(@click="navigateTo('/analytics')") 📊 View Analytics
          Button(@click="navigateTo('/plan')") 💳 Manage Plan
          Button(@click="navigateTo('/customize')") 🎨 Customize Widget
          Button(@click="navigateTo('/products')") 📦 Product Manage

    LayoutSection
      Card(class="mb-10")
        Text(variant="headingMd", as="h2") Need Help?
        Text(variant="bodyMd", as="p", class="mb-3") Our support team is here to assist you with any questions or issues.
        div(class="flex justify-between gap-3")
          Button(plain, @click="navigateTo('/support')", class="flex-1") ✉ Contact email support
          Button(plain, @click="navigateTo('/support')", class="flex-1") 🗩 Contact live chat support
          Button(plain, @click="navigateTo('/support')", class="flex-1") ❔ Help center
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Trạng thái hiển thị của Banner Upgrade
const showUpgradeBanner = ref(true);

// Hàm chuyển hướng trang nội bộ
const navigateTo = (path) => {
  router.push(path);
};

// Hàm mở Shopify Theme Editor (Sẽ xử lý logic sau)
const goToThemeEditor = () => {
  // 1. Lấy tên miền của shop từ URL (Shopify luôn âm thầm truyền biến 'shop' vào iframe của bạn)
  const urlParams = new URLSearchParams(window.location.search);
  const shopDomain = urlParams.get('shop') ; 

  // 2. Lắp ráp thành đường link Admin hoàn chỉnh trỏ thẳng vào Theme Editor
  const themeEditorUrl = `https://${shopDomain}/admin/themes/current/editor`;

  // 3. Dùng '_blank' để trình duyệt bật sang một Tab mới
  window.open(themeEditorUrl, '_blank');
};

onMounted(async () => {
  try {
    // ---------------------------------------------------------
    // BẢN THẬT (Sau này khi ghép với team BE, code sẽ như thế này):
    // const token = await shopify.idToken(); // Lấy token xác thực của Shopify
    // const response = await axios.get('https://api.oe-vton.com/admin/store-info', {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // storeDomain.value = response.data.domain;
    // currentPlan.value = response.data.plan_name;
    // ---------------------------------------------------------
    const token = await shopify.idToken(); // Lấy token xác thực của Shopify
    console.log("Token Shopify nhận được:", token);

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Laravel:", error);
    // Lưu ý: storeDomain và currentPlan cần được khai báo (ref) ở trên nếu bạn muốn sử dụng
    // storeDomain.value = 'Không thể kết nối Server';
    // currentPlan.value = 'Lỗi';
  }
});
</script>

<template lang="pug">
ui-title-bar(title="Taitta VTON - Dashboard")
Page(title="Dashboard")
  Layout(style = "margin-bottom: 2rem;")
    LayoutSection
      Card
        BlockStack(gap="400")
          InlineStack(gap="400" blockAlign="center")
            img(src="https://cdn.shopify.com/s/files/applications/1b2264711de2bedd402f74cf579a87cf_200x200.png?v=1773998590" alt="Logo" style="border-radius: 50%; width: 56px; height: 56px; border: 1px solid var(--p-color-border-disabled); box-shadow: var(--p-shadow-sm);")
            Text(variant="headingLg" as="h1") Welcome to Your Virtual Try-On Dashboard! 🎉

          BlockStack(gap="200")
            Text(variant="bodyLg" as="p")
              strong See It On You Before You Buy
              |  - AI-powered Virtual Try-On that lets your customers visualize products on themselves, increasing confidence and reducing returns.
            Link(:url="'https://' + shopDomain" external) Visit Website &rarr;

          div(style="background: var(--p-color-bg-surface-secondary); padding: var(--p-space-400); border-radius: var(--p-border-radius-200); border: 1px solid var(--p-color-border-subdued);")
            InlineStack(align="space-between" blockAlign="center")
              BlockStack(gap="100")
                Text(variant="bodySm" as="p" fontWeight="bold") Connected Store
                Text(variant="bodyMd" as="p" fontWeight="semibold") {{ shopDomain }}
              Badge(tone="info") {{ planName }} Plan

    LayoutSection
      Banner(v-if="setupSteps.addButton && setupSteps.addProduct" title="Widget Added Successfully" tone="success")
        p Perfect! The Taitta Try-On button is now live on your product pages. Your customers can start trying on items virtually right away.

      Banner(v-else title="Finish setting up Taitta VTON" tone="info")
        BlockStack(gap="400")
          InlineStack(align="space-between" blockAlign="center")
            Text(variant="bodyMd" as="p" tone="subdued") Two quick steps to activate Taitta on your storefront. Complete them in order.
            Button(variant="plain" @click="refreshSetupSteps" :loading="isRefreshingSteps" icon="RefreshIcon") Refresh

          BlockStack(gap="400")
            //- Bước 1
            InlineStack(align="space-between" blockAlign="center")
              InlineStack(gap="300" blockAlign="start")
                div(v-if="setupSteps.addButton" style="width: 28px; height: 28px; border-radius: 50%; background: #c8f5d2; display: flex; align-items: center; justify-content: center;")
                  span(style="color: #1a7f37; font-weight: 700; font-size: 14px;") ✓
                div(v-else style="width: 28px; height: 28px; border-radius: 50%; background: #e4e5e7; display: flex; align-items: center; justify-content: center;")
                  span(style="color: #202223; font-weight: 600; font-size: 13px;") 1
                BlockStack(gap="0")
                  Text(variant="bodyMd" as="p" fontWeight="medium") Add the Try-On Button
                  Text(variant="bodyMd" as="p" tone="subdued") Place the try-on button block on your product template.
              Badge(v-if="setupSteps.addButton" tone="success") Done
              Button(v-else @click="goToThemeEditor") Add Try-On Button

            //- Bước 2
            InlineStack(align="space-between" blockAlign="center")
              InlineStack(gap="300" blockAlign="start")
                div(v-if="setupSteps.addProduct" style="width: 28px; height: 28px; border-radius: 50%; background: #c8f5d2; display: flex; align-items: center; justify-content: center;")
                  span(style="color: #1a7f37; font-weight: 700; font-size: 14px;") ✓
                div(v-else style="width: 28px; height: 28px; border-radius: 50%; background: #e4e5e7; display: flex; align-items: center; justify-content: center;")
                  span(style="color: #202223; font-weight: 600; font-size: 13px;") 2
                BlockStack(gap="0")
                  Text(variant="bodyMd" as="p" fontWeight="medium") Add Button to Product
                  Text(variant="bodyMd" as="p" tone="subdued") Select products and configure the launch mode in your portal.
              Badge(v-if="setupSteps.addProduct" tone="success") Done
              Button(v-else @click="navigateTo('/products')") Manage Products

    LayoutSection
      Card
        BlockStack(gap="400")
          InlineStack(align="space-between" blockAlign="center")
            Text(variant="headingMd" as="h2") Usage Analytics
            Button(plain @click="navigateTo('/analytics')") View details

          BlockStack(gap="200")
            InlineStack(align="space-between")
              Text(variant="bodyMd" as="span") {{ usedCount }} / {{ includedQuota }} try-ons
              Text(variant="bodyMd" as="span" tone="subdued") {{ usagePercentage }}%
            ProgressBar(:progress="usagePercentage" color="primary")

    LayoutSection
      Banner(v-if="showUpgradeBanner" title="Upgrade for More Try-Ons" status="success" @dismiss="showUpgradeBanner = false" :action="{ content: 'Upgrade', onAction: () => navigateTo('/plan') }")
        p Unlock unlimited virtual try-ons and professional AI studio features to grow your store's sales.

    LayoutSection
      Card
        BlockStack(gap="400")
          Text(variant="headingMd" as="h2") Quick Actions
          InlineStack(gap="300" wrap)
            Button(@click="navigateTo('/analytics')") 📊 View Analytics
            Button(@click="navigateTo('/plan')") 💳 Manage Plan
            Button(@click="navigateTo('/customize')") 🎨 Customize Widget
            Button(@click="navigateTo('/products')") 📦 Product Manage

    LayoutSection
      Card
        BlockStack(gap="400")
          BlockStack(gap="200")
            Text(variant="headingMd" as="h2") Need Help?
            Text(variant="bodyMd" as="p") Our support team is here to assist you with any questions or issues.
          
          InlineStack(gap="300" align="start")
            Button(plain @click="navigateTo('/support')") ✉ Contact email support
            Button(plain @click="navigateTo('/support')") 🗩 Contact live chat support
            Button(plain @click="navigateTo('/support')") ❔ Help center
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchBillingUsage } from '../service/PricingService';
import { checkAddButtonStep, checkAddProductStep } from '../service/DashboardService';

const router = useRouter();

// Dữ liệu API và URL
const shopDomain = ref('');
const planName = ref('Free');
const usedCount = ref(0);
const includedQuota = ref(0);

const usagePercentage = computed(() => {
  if (includedQuota.value === 0) return 0;
  return Math.min(100, Math.round((usedCount.value / includedQuota.value) * 100));
});

// Trạng thái hiển thị của Banner Upgrade
const showUpgradeBanner = ref(true);

// Trạng thái các bước Setup Guide (chỉ còn 2 bước)
const setupSteps = ref({
  addButton: false,    // Bước 1: Đã thêm block button vào product template trong Theme Editor chưa
  addProduct: false,   // Bước 2: Đã cấu hình launch mode (add button to product) trong portal chưa
});
const isRefreshingSteps = ref(false);


// Hàm tổng hợp: Chạy cả 2 bước kiểm tra song song
const refreshSetupSteps = async () => {
  isRefreshingSteps.value = true;
  try {
    const [buttonDone, productDone] = await Promise.all([
      checkAddButtonStep(),
      checkAddProductStep()
    ]);
    setupSteps.value.addButton = buttonDone;
    setupSteps.value.addProduct = productDone;
  } catch (error) {
    console.error('Lỗi khi refresh setup steps:', error);
  } finally {
    isRefreshingSteps.value = false;
  }
};

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
  // Lấy shop domain từ URL
  const urlParams = new URLSearchParams(window.location.search);
  shopDomain.value = urlParams.get('shop') || '';

  try {
    const token = await shopify.idToken(); // Lấy token xác thực của Shopify
    console.log("Token Shopify nhận được:", token);

    // Fetch billing usage data
    const usageData = await fetchBillingUsage();
    if (usageData) {
      if (usageData.plan) {
        planName.value = usageData.plan.name || 'Free';
      }
      if (usageData.usage) {
        usedCount.value = usageData.usage.used_count || 0;
        includedQuota.value = usageData.usage.included_quota || 0;
      }
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }

  // Kiểm tra trạng thái các bước setup ngay khi trang load
  await refreshSetupSteps();
});
</script>

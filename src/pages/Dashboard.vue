<template lang="pug">
ui-title-bar(title="Staging Virtual Try On - Dashboard")
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
        p Perfect! The Virtual Try-On button is now live on your product pages. Your customers can start trying on items virtually right away.

      Banner(v-else title="Finish setting up Staging Virtual Try On" tone="info")
        //- Show Loading Spinner while fetching
        BlockStack(v-if="isRefreshingSteps" inlineAlign="center" style="padding: 16px 0; align-items: center;")
          Spinner(size="large")
          Text(variant="bodyMd" tone="subdued" style="margin-top: 4px;") Checking setup status...
          
        //- Show 2 steps when fetch is finished
        template(v-else)
          BlockStack(gap="400" )
          InlineStack(align="space-between" blockAlign="center" style="padding-bottom: 1rem;")
            Text(variant="bodyMd" as="p" tone="subdued") Two quick steps to activate Virtual Try-On on your storefront. Complete them in order.
            Button(variant="plain" @click="refreshSetupSteps" :loading="isRefreshingSteps" icon="RefreshIcon") Refresh

          BlockStack(gap="400")
            
              //- Step 1
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

              //- Step 2
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
      Banner(v-if="showUpgradeBanner" title="Upgrade for More Try-Ons" status="success" @dismiss="showUpgradeBanner = false" :action="{ content: 'Upgrade', onAction: () => navigateTo('/pricings') }")
        p Unlock unlimited virtual try-ons and professional AI studio features to grow your store's sales.

    LayoutSection
      Card
        BlockStack(gap="400")
          Text(variant="headingMd" as="h2") Quick Actions
          InlineStack(gap="300" wrap)
            Button(
              v-for="action in quickActions"
              :key="action.path"
              @click="navigateTo(action.path)"
            ) {{ action.label }}
            

    LayoutSection
      Card
        BlockStack(gap="400")
          BlockStack(gap="200")
            Text(variant="headingMd" as="h2") Need Help?
            Text(variant="bodyMd" as="p") Our support team is here to assist you with any questions or issues.
          
          InlineStack(gap="300" align="start")
            Button(
              v-for="link in helpLinks"
              :key="link.label"
              :plain="link.plain"
              @click="navigateTo(link.path)"
            ) {{ link.label }}
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchBillingUsage } from '../service/PricingService';
import { checkAddButtonStep, checkAddProductStep, fetchFirstProductHandle } from '../service/DashboardService';

const router = useRouter();

const quickActions = [
  { label: '🎨 Customize Widget', path: '/customizes' },
  { label: '📦 Product Manage', path: '/products' },
  { label: '📊 View Analytics', path: '/analytics' },
  { label: '💳 Manage Plan', path: '/pricings' }
];

const helpLinks = [
  { label: '✉ Contact email support', path: '/support', plain: true },
  { label: '🗩 Contact live chat support', path: '/support', plain: true },
  { label: '❔ Help center', path: '/document', plain: true }
];

// API and URL Data
const shopDomain = ref('');
const planName = ref('Free');
const usedCount = ref(0);
const includedQuota = ref(0);

const usagePercentage = computed(() => {
  if (includedQuota.value === 0) return 0;
  return Math.min(100, Math.round((usedCount.value / includedQuota.value) * 100));
});

// Visibility state of the Upgrade Banner
const showUpgradeBanner = ref(true);

// Setup Guide steps state (only 2 steps left)
const setupSteps = ref({
  addButton: false,    // Step 1: Has the button block been added to the product template in Theme Editor
  addProduct: false,   // Step 2: Has the launch mode (add button to product) been configured in the portal
});
const isRefreshingSteps = ref(true);


// Aggregate action: Run both check steps in parallel
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
    console.error('Error refreshing setup steps:', error);
  } finally {
    isRefreshingSteps.value = false;
  }
};

// Internal page redirect action
const navigateTo = (path) => {
  router.push(path);
};

// Action to open Shopify Theme Editor (Logic to be processed later)
const goToThemeEditor = async () => {
  // 1. Retrieve the shop domain from URL (Shopify passes the 'shop' query parameter to your iframe)
  const urlParams = new URLSearchParams(window.location.search);
  const shopDomain = urlParams.get('shop') ; 

  let previewPath = '';
  const handle = await fetchFirstProductHandle();
  if (handle) {
    previewPath = `?previewPath=${encodeURIComponent('/products/' + handle)}`;
  }

  // 2. Construct the full Admin link pointing directly to the Theme Editor
  const themeEditorUrl = `https://${shopDomain}/admin/themes/current/editor${previewPath}`;

  // 3. Use '_blank' to open the link in a new browser tab
  window.open(themeEditorUrl, '_blank');
};

onMounted(async () => {
  // Get shop domain from URL
  const urlParams = new URLSearchParams(window.location.search);
  shopDomain.value = urlParams.get('shop') || '';

  try {
    const token = await shopify.idToken(); // Get Shopify identity token
    console.log("Shopify token received:", token);

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
    console.error("Error retrieving data:", error);
  }

  // Check setup steps status immediately upon page load
  await refreshSetupSteps();
});
</script>

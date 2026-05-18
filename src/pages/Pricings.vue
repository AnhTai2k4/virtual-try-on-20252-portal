<template lang="pug">
Page(
  title="Pricing & Billing"
  :actionGroups="pageActionGroups"
)
  BlockStack(gap="600" style="margin-bottom: 2rem;")

    //- ==========================================
    //- CURRENT PLAN (Giữ nguyên)
    //- ==========================================
    Card(roundedAbove="sm")
      BlockStack(gap="400")
        InlineStack(align="space-between" blockAlign="start")
          BlockStack(gap="100")
            Text(variant="headingLg" as="h2") Current Plan
            Text(tone="subdued" as="p") You're on the {{ currentPlanData.name }} plan
          Badge(tone="success") {{ currentPlanData.quota }} credits quota

        Divider

        InlineStack(align="space-between" blockAlign="end")
          BlockStack(gap="0")
            div(v-if="isLoadingUsage" class="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1")
            Text(v-else variant="headingLg" as="div") {{ currentPlanData.remaining }}
            Text(tone="subdued" as="div") Credits Remaining

          BlockStack(gap="0" align="end")
            div(v-if="isLoadingUsage" class="h-8 w-24 bg-gray-200 rounded animate-pulse mb-1")
            Text(v-else variant="headingLg" as="div") {{ currentPlanData.name }}
            Text(tone="subdued" as="div") Current Tier

    //- ==========================================
    //- PRICING CARDS (Đã đổ dữ liệu động bằng v-for)
    //- ==========================================

    //- Skeleton Loading khi đang gọi API lấy danh sách gói
    div(v-if="isLoadingPlans" class="flex justify-center items-center py-12")
      svg(class="animate-spin h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24")
        circle(class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
        path(class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")

    //- Hiển thị Grid khi có dữ liệu
    Grid(v-else)
      GridCell(
        v-for="plan in displayPlans" 
        :key="plan.key" 
        :columnSpan="{ xs: 6, sm: 6, md: 4, lg: 4, xl: 4 }"
      )
        Card(roundedAbove="sm")
          BlockStack(gap="400" class="h-full")
            BlockStack(gap="200")
              //- Badge tự động hiển thị nếu highlighted = true
              div(v-if="plan.highlighted")
                Badge(tone="info") {{ plan.badge || 'Most Popular' }}

              Text(variant="headingXl" as="h3") {{ plan.name }}

              InlineStack(blockAlign="baseline" gap="100")
                Text(variant="heading3xl" as="span") ${{ plan.recurring_price }}
                Text(tone="subdued" as="span") / month

              //- Format số hiển thị có dấu phẩy (VD: 1,000)
              Text(tone="subdued" as="p") {{ plan.included_vto_quota.toLocaleString() }} Try-Ons

            Divider

            //- Lặp danh sách features từ API
            List(type="bullet")
              ListItem(v-for="(feature, index) in plan.features" :key="index") {{ feature }}

            div(style="margin-top: auto")
              Button(
                fullWidth
                :variant="plan.highlighted && plan.name !== currentPlanData.name ? 'primary' : undefined"
                @click="subscribePlan(plan.key)"
                :disabled="isProcessing === plan.key || plan.name === currentPlanData.name"
              )
                //- Đổi text dựa trên trạng thái gói
                span(v-if="plan.name === currentPlanData.name") Current Plan
                span(v-else) Select Plan
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { createSubscription, fetchBillingUsage, fetchBillingPlans, cancelSubscription } from '../service/PricingService';
// ==========================================
// STATE
// ==========================================
const isProcessing = ref<string | null>(null);

// State cho Current Plan
const isLoadingUsage = ref(true);
const currentPlanData = ref({
  name: 'Free Trial',
  remaining: 0,
  quota: 0,
});
// ==========================================
// CẤU HÌNH GIAO DIỆN NÚT "MORE ACTIONS"
// ==========================================
const pageActionGroups = computed(() => {
  // Nếu đang dùng Free Trial, ẩn nút More actions đi
  if (currentPlanData.value.name === 'Free Trial' || currentPlanData.value.name === 'Trial') {
    return [];
  }

  // Nếu đang dùng gói trả phí, render ra Dropdown
  return [
    {
      title: 'More actions',
      actions: [
        {
          content: 'Cancel subscription',
          destructive: true, // Thuộc tính này làm chữ có màu đỏ (Cảnh báo nguy hiểm)
          onAction: handleCancelSubscription,
        },
      ],
    },
  ];
});
// State cho danh sách Gói cước (Plans)
const isLoadingPlans = ref(true);
const plansData = ref<any[]>([]);

// Lọc bỏ gói Free/Trial để giao diện chỉ hiện các gói trả phí
const displayPlans = computed(() => {
  return plansData.value.filter(plan => !plan.is_free);
});

// ==========================================
// ACTIONS
// ==========================================
const loadUsageData = async () => {
  isLoadingUsage.value = true;
  try {
    const data = await fetchBillingUsage();
    if (data && data.plan && data.usage) {
      currentPlanData.value = {
        name: data.plan.name || 'Free Trial',
        remaining: data.usage.included_remaining || 0,
        quota: data.usage.included_quota || 0
      };
    }
  } catch (error) {
    console.error("Không thể tải dữ liệu gói cước hiện tại:", error);
  } finally {
    isLoadingUsage.value = false;
  }
};

const loadPlansData = async () => {
  isLoadingPlans.value = true;
  try {
    const data = await fetchBillingPlans();
    if (data && Array.isArray(data)) {
      plansData.value = data;
    }
  } catch (error) {
    console.error("Không thể tải danh sách gói cước:", error);
    (window as any).shopify?.toast?.show('Failed to load pricing plans', { isError: true });
  } finally {
    isLoadingPlans.value = false;
  }
};

const subscribePlan = async (planKey: string) => {
  isProcessing.value = planKey;
  try {
    const responseData = await createSubscription(planKey);
    if (responseData && responseData.confirmation_url) {
      window.top!.location.href = responseData.confirmation_url;
    } else {
      throw new Error("Missing confirmation_url in response");
    }
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    (window as any).shopify?.toast?.show('Something went wrong', { isError: true });
  } finally {
    isProcessing.value = null;
  }
};

// ==========================================
// ACTIONS
// ==========================================

// Hàm xử lý khi bấm nút Cancel
const handleCancelSubscription = async () => {
  // Hỏi lại cho chắc chắn tránh khách bấm nhầm
  const confirmCancel = confirm("Are you sure you want to cancel your current subscription? You will be downgraded to the Free plan immediately.");

  if (!confirmCancel) return;

  try {
    (window as any).shopify?.toast?.show('Canceling subscription...');

    // Gọi API xuống Node.js Backend
    await cancelSubscription();

    (window as any).shopify?.toast?.show('Subscription cancelled successfully!');

    // Tải lại dữ liệu trang để UI nhảy về gói Free Trial
    await loadUsageData();
  } catch (error) {
    console.error("Lỗi khi hủy gói:", error);
    (window as any).shopify?.toast?.show('Failed to cancel subscription', { isError: true });
  }
};

// ==========================================
// LIFECYCLE
// ==========================================
onMounted(() => {
  // Gọi đồng thời cả 2 API để tối ưu tốc độ load
  Promise.all([
    loadUsageData(),
    loadPlansData()
  ]);
});
</script>

<style scoped>
:deep(.Polaris-BlockStack.h-full) {
  height: 100%;
}
</style>
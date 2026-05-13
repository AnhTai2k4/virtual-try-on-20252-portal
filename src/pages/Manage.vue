<template lang="pug">
Page(title="Pricing & Billing")
  BlockStack(gap="600" style="margin-bottom: 2rem;")
    
    //- Current Plan
    Card(roundedAbove="sm")
      BlockStack(gap="400")
        InlineStack(align="space-between" blockAlign="start")
          BlockStack(gap="100")
            Text(variant="headingLg" as="h2") Current Plan
            Text(tone="subdued" as="p") You're on the Free Trial plan
          Badge(tone="success") 20 credits remaining
        
        Divider
        
        InlineStack(align="space-between" blockAlign="end")
          BlockStack(gap="0")
            Text(variant="headingLg" as="div") 20
            Text(tone="subdued" as="div") Credits Available
          BlockStack(gap="0" align="end")
            Text(variant="headingLg" as="div") Free Trial
            Text(tone="subdued" as="div") Current Tier

    //- Pricing Cards
    Grid
      //- Starter
      GridCell(:columnSpan="{xs: 6, sm: 6, md: 4, lg: 4, xl: 4}")
        Card(roundedAbove="sm")
          BlockStack(gap="400" class="h-full")
            BlockStack(gap="200")
              Text(variant="headingXl" as="h3") Starter
              InlineStack(blockAlign="baseline" gap="100")
                Text(variant="heading3xl" as="span") $19.99
                Text(tone="subdued" as="span") / month
              Text(tone="subdued" as="p") 100 Try-Ons

            Divider

            List(type="bullet")
              ListItem 100 AI-powered try-on credits
              ListItem Full Shopify integration
              ListItem Mobile & desktop optimized
              ListItem Basic analytics dashboard
              ListItem $0.15 per extra try-on
              ListItem Email support
              ListItem Support tier: Email

            div(style="margin-top: auto")
              Button(fullWidth @click="subscribePlan('starter')" :disabled="isProcessing === 'starter'") Select Plan

      //- Growth
      GridCell(:columnSpan="{xs: 6, sm: 6, md: 4, lg: 4, xl: 4}")
        Card(roundedAbove="sm")
          BlockStack(gap="400" class="h-full")
            BlockStack(gap="200")
              div
                Badge(tone="info") Most Popular
              Text(variant="headingXl" as="h3") Growth
              InlineStack(blockAlign="baseline" gap="100")
                Text(variant="heading3xl" as="span") $49.99
                Text(tone="subdued" as="span") / month
              Text(tone="subdued" as="p") 300 Try-Ons

            Divider

            List(type="bullet")
              ListItem 300 AI-powered try-on credits
              ListItem Everything in Starter, plus:
              ListItem Lead capture and recovery
              ListItem Advanced analytics & insights
              ListItem Priority email support
              ListItem $0.12 per extra try-on
              ListItem Set your own overage spend limit in Settings
              ListItem Support tier: Priority email

            div(style="margin-top: auto")
              Button(variant="primary" fullWidth @click="subscribePlan('growth')" :disabled="isProcessing === 'growth'") Select Plan

      //- Scale
      GridCell(:columnSpan="{xs: 6, sm: 6, md: 4, lg: 4, xl: 4}")
        Card(roundedAbove="sm")
          BlockStack(gap="400" class="h-full")
            BlockStack(gap="200")
              Text(variant="headingXl" as="h3") Pro 
              InlineStack(blockAlign="baseline" gap="100")
                Text(variant="heading3xl" as="span") $99.00
                Text(tone="subdued" as="span") / month
              Text(tone="subdued" as="p") 1.000 Try-Ons

            Divider

            List(type="bullet")
              ListItem 1,000 AI-powered try-on credits
              ListItem Everything in Growth, plus:
              ListItem Branding removal
              ListItem Dedicated account manager
              ListItem 24/7 priority support
              ListItem $0.10 per extra try-on
              ListItem Set your own overage spend limit in Settings
              ListItem Support tier: 24/7 priority

            div(style="margin-top: auto")
              Button(fullWidth @click="subscribePlan('scale')" :disabled="isProcessing === 'scale'") Select Plan
</template>
<script setup lang="ts">
import { ref } from 'vue';

const isProcessing = ref<string | null>(null);

const subscribePlan = async (planKey: string) => {
  isProcessing.value = planKey;
  try {
    const response = await fetch(`/api/billing/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey })
    });

    if (!response.ok) throw new Error("Failed to create subscription");

    const data = await response.json();

    if (data.confirmationUrl) {
      window.top!.location.href = data.confirmationUrl;
    }
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    (window as any).shopify?.toast?.show('Something went wrong', { isError: true });
    isProcessing.value = null;
  }
};
</script>

<style scoped>
/* Tuỳ chỉnh height 100% để các thẻ trong Grid có chiều cao bằng nhau */
:deep(.Polaris-BlockStack.h-full) {
  height: 100%;
}
</style>
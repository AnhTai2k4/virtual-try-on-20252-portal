<template lang="pug">
Page(title="Help Center & Documentation")
  Layout
    LayoutSection
      Card
        BlockStack(gap="400")
          Text(variant="headingLg" as="h2") Welcome to Taitta VTON Documentation
          Text(variant="bodyMd" as="p" tone="subdued") Find all the information you need to successfully install, configure, and manage the Virtual Try-On application on your Shopify store.

    LayoutSection
      Card
        BlockStack(gap="400")
          Text(variant="headingMd" as="h3") Getting Started

          div(style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--p-space-400); margin-top: var(--p-space-200);")
            //- Step 1
            div(style="background: var(--p-color-bg-surface-secondary); padding: var(--p-space-400); border-radius: var(--p-border-radius-300); border: 1px solid var(--p-color-border-subdued); transition: all 0.2s ease;")
              BlockStack(gap="300")
                div(style="width: 32px; height: 32px; border-radius: 50%; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;") 1
                BlockStack(gap="100")
                  Text(variant="headingSm" as="h4") Enable the App Embed
                  Text(variant="bodyMd" as="p" tone="subdued") Navigate to your Shopify Theme Editor (Customize) > App Embeds, find Taitta VTON, turn it on and click Save.

            //- Step 2
            div(style="background: var(--p-color-bg-surface-secondary); padding: var(--p-space-400); border-radius: var(--p-border-radius-300); border: 1px solid var(--p-color-border-subdued); transition: all 0.2s ease;")
              BlockStack(gap="300")
                div(style="width: 32px; height: 32px; border-radius: 50%; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;") 2
                BlockStack(gap="100")
                  Text(variant="headingSm" as="h4") Select Launch Mode
                  Text(variant="bodyMd" as="p" tone="subdued") Decide where the button appears (all products or specific variants) from the 
                    strong Products 
                    | page in this portal.

            //- Step 3
            div(style="background: var(--p-color-bg-surface-secondary); padding: var(--p-space-400); border-radius: var(--p-border-radius-300); border: 1px solid var(--p-color-border-subdued); transition: all 0.2s ease;")
              BlockStack(gap="300")
                div(style="width: 32px; height: 32px; border-radius: 50%; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px;") 3
                BlockStack(gap="100")
                  Text(variant="headingSm" as="h4") Customize Appearance
                  Text(variant="bodyMd" as="p" tone="subdued") Adjust colors, text, padding, and shape in the 
                    strong Customize 
                    | page to perfectly match your brand.

    LayoutSection
      Card
        BlockStack(gap="400")
          Text(variant="headingMd" as="h3") FAQs

          BlockStack(gap="300")
            //- Iterate FAQ list
            Card(v-for="(faq, index) in faqs" :key="index")
              //- FAQ card header
              div(
                @click="toggleAccordion(index)"
                style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;"
              )
                Text(as="span" variant="bodyMd" fontWeight="semibold") {{ faq.question }}
                div(
                  :style="{ transform: openAccordion === index ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', display: 'flex', alignItems: 'center' }"
                )
                  //- Small arrow on the right
                  svg(viewBox="0 0 20 20" style="width: 20px; height: 20px; fill: var(--p-color-icon-subdued);")
                    path(d="M7.646 14.354a.5.5 0 010-.708L11.293 10 7.646 6.354a.5.5 0 11.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708 0z")
                    
              //- Collapsible content
              Collapsible(
                :open="openAccordion === index"
                :id="'faq-content-' + index"
                :transition="{duration: '200ms', timingFunction: 'ease-in-out'}"
              )
                div(style="margin-top: var(--p-space-400);")
                  Text(as="p" variant="bodyMd" tone="subdued") {{ faq.answer }}

    LayoutSection(secondary)
      Card
        BlockStack(gap="400")
          Text(variant="headingMd" as="h3") Need more help?
          Text(variant="bodyMd" as="p" tone="subdued") If you couldn't find the answer to your question, our support team is available 24/7.
          Button(variant="primary" onClick="window.location.href='mailto:support@taitta.com'") Contact Support
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Page, Layout, LayoutSection, Card, BlockStack, Text, Button, Collapsible } from '@ownego/polaris-vue';

const openAccordion = ref<number | null>(null);

const toggleAccordion = (index: number) => {
  openAccordion.value = openAccordion.value === index ? null : index;
};

const faqs = [
  {
    question: "1. The Virtual Try-On button is not showing on my product page. Why?",
    answer: "Ensure that the App Embed is activated in your Theme Editor and that you have configured the correct Launch Mode in the Products tab. Also, check if the specific product or variant has VTON enabled."
  },
  {
    question: "2. How are 'Try-Ons' counted in Analytics?",
    answer: "A Try-On is counted every time a customer successfully clicks the button and generates a virtual try-on image for a product. You can track this in the Analytics page."
  },
  {
    question: "3. Can I limit the feature to logged-in customers only?",
    answer: "Yes! On the Customize page, there is an option to require customers to be logged in before they can use the Try-On feature."
  },
  {
    question: "4. What is your data retention policy for uploaded images?",
    answer: "Customer uploaded images are processed securely and deleted from our servers immediately after the try-on session ends to ensure maximum privacy."
  },
  {
    question: "5. Will I be charged immediately if I upgrade my pricing plan?",
    answer: "Yes, when you upgrade your pricing plan, Shopify will prorate the charge for the remainder of your billing cycle. You can manage your subscription in the Pricing tab."
  }
];
</script>

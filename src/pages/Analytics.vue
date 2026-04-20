<template lang="pug">
Page(title="Analytics")
  //- 1 THẺ CARD DUY NHẤT BỌC TOÀN BỘ GIAO DIỆN
  Card
    .flex.flex-col.gap-8
      
      //- =====================================
      //- DÒNG 1: THỐNG KÊ (SUMMARY)
      //- =====================================
      .grid.grid-cols-4.md_grid-cols-4.gap-6.pb-6.border-b.border-gray-200
        //- Revenue
        .flex.flex-col.gap-2
          Text(variant="headingSm" as="h3" fontWeight="medium") Revenue (Post-Try-On)
          Banner(tone="info")
            p No orders from try-on users yet.
            
        //- Conversion Rate
        .flex.flex-col.gap-2
          Text(variant="headingSm" as="h3" fontWeight="medium") Conversion Rate (Post-Try-On)
          Banner(tone="info")
            p No orders from try-on users yet.
            
        //- Button Click
        .flex.flex-col.gap-2
          Text(variant="headingSm" as="h3" fontWeight="medium") Button Click
          Banner(tone="info")
            p No click data available yet.
            
        //- Total Generations
        .flex.flex-col.gap-2
          Text(variant="headingSm" as="h3" fontWeight="medium") Total Generations
          .py-2
            Text(variant="heading3xl" as="p") 3

      //- =====================================
      //- DÒNG 2: BIỂU ĐỒ (CHARTS)
      //- =====================================
      .grid.grid-cols-1.md_grid-cols-2.gap-8.pb-6.border-b.border-gray-200
        //- Daily Try-Ons
        div
          Text(variant="headingSm" as="h3" fontWeight="medium") Daily Try-Ons
          .mt-4.h-64.bg-gray-50.border.border-dashed.border-gray-300.rounded-lg.flex.items-center.justify-center
            Text(tone="subdued") [Khu vực biểu đồ Daily Try-Ons]
            
        //- VTO Conversion Rate
        div
          Text(variant="headingSm" as="h3" fontWeight="medium") VTO conversion rate
          .mt-4.h-64.bg-gray-50.border.border-dashed.border-gray-300.rounded-lg.flex.items-center.justify-center
            Text(tone="subdued") [Khu vực biểu đồ VTO Conversion Rate]

      //- =====================================
      //- DÒNG 3: BẢNG DỮ LIỆU (DATA TABLE)
      //- =====================================
      div
        .pb-4
          Text(variant="headingMd" as="h2" fontWeight="bold") Most Tried-On Products
        
        //- Bọc DataTable trong div có viền mỏng để tách biệt nhẹ nhàng
        .border.border-gray-200.rounded-lg.overflow-hidden
          DataTable(
            :columnContentTypes="['text', 'numeric', 'numeric']"
            :headings="['Product', 'Try-Ons', '% of Total']"
            :rows="tableRows"
          )
</template>

<script setup>
import { ref } from 'vue';
import { Page, Card, Text, Banner, DataTable } from '@ownego/polaris-vue';
import { getOverviewAnalytics } from '@/service/AnalyticService';

// Dữ liệu mẫu cho bảng
const tableRows = ref([
  ['Basic T-shirt with piped seams', '1', '50.0%'],
  ['Bardot neckline crop top', '1', '50.0%']
]);

const res= await getOverviewAnalytics();
console.log('Overview Analytics:', res);
</script>

<style scoped>
.bg-gray-50 {
  background-color: #f9fafb;
}
</style>
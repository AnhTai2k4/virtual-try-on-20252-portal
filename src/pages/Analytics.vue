<template lang="pug">
Page(title="Analytics")
  
  //- =====================================
  //- TOP BAR: INFO & FILTER
  //- =====================================
  .flex.justify-between.items-center.mb-5
    p.text-sm.text-gray-500 Data updated daily (UTC).
    
    //- Dropdown chọn ngày (Khóa lại khi đang loading)
    .relative.w-40
      select(
        v-model="selectedPeriod"
        :disabled="isLoading"
        class="w-full appearance-none px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      )
        option(value="7") Last 7 days
        option(value="30") Last 30 days
        option(value="90") Last 90 days
      
      //- Icon mũi tên
      .pointer-events-none.absolute.inset-y-0.right-0.flex.items-center.px-3.text-gray-500
        svg(class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24")
          path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4")

  //- =====================================
  //- TRẠNG THÁI LOADING (HIỂN THỊ KHI GỌI API)
  //- =====================================
  div(v-if="isLoading" class="flex flex-col items-center justify-center py-32 bg-white rounded-xl shadow-sm border border-gray-200")
    svg(class="animate-spin h-8 w-8 text-gray-800 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24")
      circle(class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4")
      path(class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z")
    p(class="text-sm font-medium text-gray-500") Loading analytics data...

  //- =====================================
  //- TRẠNG THÁI DỮ LIỆU (HIỂN THỊ KHI ĐÃ CÓ DATA)
  //- =====================================
  .space-y-6(v-else)
    
    //- CARD 1: THỐNG KÊ (SUMMARY)
    Card
      .grid.grid-cols-4.py-2
        
        //- Cột 1: Order Conversion Rate
        .flex.flex-col.gap-2.pr-6
          Text(variant="headingSm" as="h3" fontWeight="medium") Order Conversion Rate 
          .py-2(v-if="orderConversionRate > 0")
            Text(variant="headingXl" as="p") {{ orderConversionRate.toFixed(1) }} %
          Banner(v-else tone="info")
            p No order conversion data available yet.
            
        //- Cột 2: Cart Conversion Rate
        .flex.flex-col.gap-2.px-6.border-l.border-gray-200
          Text(variant="headingSm" as="h3" fontWeight="medium") Cart Conversion Rate 
          .py-2(v-if="cartConversionRate > 0")
            Text(variant="headingXl" as="p") {{ cartConversionRate.toFixed(1) }} %
          Banner(v-else tone="info")
            p No cart conversion data available yet.
            
        //- Cột 3: Button Click
        .flex.flex-col.gap-2.px-6.border-l.border-gray-200
          Text(variant="headingSm" as="h3" fontWeight="medium") Button Click
          .py-2(v-if="totalRequests > 0")
            Text(variant="headingXl" as="p") {{ totalRequests }}
          Banner(v-else tone="info")
            p No click data available yet.
            
        //- Cột 4: Total Generations
        .flex.flex-col.gap-2.pl-6.border-l.border-gray-200
          Text(variant="headingSm" as="h3" fontWeight="medium") Total Generations
          .py-2
            Text(v-if="totalGenerations > 0" variant="heading3xl" as="p") {{ totalGenerations }}
            Text(v-else variant="heading3xl" as="p") 0

    //- CARD 2: BIỂU ĐỒ (CHARTS)
    Card
      .py-2
        Text(variant="headingSm" as="h3" fontWeight="medium") Daily Try-Ons
        
        .mt-4.h-64.w-full
          Line(
            v-if="chartData && chartData.labels && chartData.labels.length > 0" 
            :data="chartData" 
            :options="chartOptions"
          )
          
          div(v-else class="h-full flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50")
            Text(tone="subdued") No chart data available.

    //- CARD 3: BẢNG DỮ LIỆU (DATA TABLE)
    Card
      div
        .pb-4
          Text(variant="headingMd" as="h2" fontWeight="bold") Most Tried-On Products
        
        .border.border-gray-200.rounded-lg.overflow-hidden
          DataTable(
            :columnContentTypes="['text', 'numeric', 'numeric']"
            :headings="['Product', 'Try-Ons', '% of Total']"
            :rows="tableRows"
          )
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'; 
import { Page, Card, Text, Banner, DataTable } from '@ownego/polaris-vue';
import { getOverview, getTopProducts } from '@/service/AnalyticService';

// 1. Dùng thư viện Line thay vì Bar
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';

// 2. Đăng ký các thành phần cho biểu đồ Đường (Line)
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

// ==========================================
// STATE QUẢN LÝ DỮ LIỆU
// ==========================================
const isLoading = ref(true); // BIẾN TRẠNG THÁI LOADING
const selectedPeriod = ref('30'); // Mặc định là Last 30 days
const totalRequests = ref(0);
const totalGenerations = ref(0);
const cartConversionRate = ref(0);
const orderConversionRate = ref(0);
const tableRows = ref([]);

const chartData = ref({
  labels: [],
  datasets: []
});

// Options tối ưu cho biểu đồ đường
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, border: { dash: [5, 5] } }
  },
  interaction: {
    mode: 'nearest', axis: 'x', intersect: false
  }
});

const formatDate = (dateStr) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`; 
  }
  return dateStr;
};

// ==========================================
// HÀM GỌI API
// ==========================================
const fetchAnalytics = async () => {
  isLoading.value = true; // BẬT LOADING KHI BẮT ĐẦU
  
  try {
    chartData.value = { labels: [], datasets: [] };
    
    // Chạy song song 2 API cùng lúc để tăng tốc độ load
    const [res, topProductsRes] = await Promise.all([
      getOverview(selectedPeriod.value),
      getTopProducts(selectedPeriod.value)
    ]);
    
    // Xử lý Overview Data
    totalRequests.value = res.totals.button_click;
    totalGenerations.value = res.totals.success;
    cartConversionRate.value = res.totals.cart_conversion_rate;
    orderConversionRate.value = res.totals.order_conversion_rate;
    
    // Xử lý dữ liệu bảng
    tableRows.value = topProductsRes.map(item => {
      const percentage = totalRequests.value > 0 ? ((item.request_count / totalRequests.value) * 100).toFixed(0) : '0';
      return [item.product_name, item.request_count.toString(), `${percentage}%`];
    });
    
    // Xử lý dữ liệu biểu đồ
    const apiData = res.series;
    chartData.value = {
      labels: apiData.map(item => formatDate(item.date)),
      datasets: [
        {
          label: 'Button Clicks',
          data: apiData.map(item => item.button_click),
          borderColor: '#3B82F6', 
          backgroundColor: 'rgba(59, 130, 246, 0.1)', 
          pointBackgroundColor: '#ffffff', 
          pointBorderColor: '#3B82F6', 
          pointBorderWidth: 2,
          pointRadius: 4, 
          pointHoverRadius: 6, 
          fill: true, 
          tension: 0.4 
        }
      ]
    };
    
  } catch (error) {
    console.error("Lỗi khi tải Analytics:", error);
    // Bạn có thể show toast lỗi ở đây nếu cần
  } finally {
    isLoading.value = false; // TẮT LOADING DÙ THÀNH CÔNG HAY LỖI
  }
};

// ==========================================
// LIFECYCLE VÀ WATCHERS
// ==========================================
onMounted(() => {
  fetchAnalytics();
});

// Tự động gọi lại API khi người dùng đổi ngày
watch(selectedPeriod, () => {
  fetchAnalytics();
});
</script>
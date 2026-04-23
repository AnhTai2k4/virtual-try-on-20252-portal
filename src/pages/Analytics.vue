<template lang="pug">
Page(title="Analytics")
  //- 1 THẺ CARD DUY NHẤT BỌC TOÀN BỘ GIAO DIỆN
  Card
    .flex.flex-col.gap-8
      
      //- =====================================
      //- DÒNG 1: THỐNG KÊ (SUMMARY)
      //- =====================================
      .grid.grid-cols-4.pb-6.border-b.border-gray-200
        
        //- Revenue (Cột 1: Không có viền trái, đệm sang phải)
        .flex.flex-col.gap-2.pr-6
          Text(variant="headingSm" as="h3" fontWeight="medium") Revenue (Post-Try-On)
          Banner(tone="info")
            p No orders from try-on users yet.
            
        //- Conversion Rate (Cột 2: Có viền dọc màu xanh + đệm 2 bên)
        .flex.flex-col.gap-2.px-6.border-l.border-blue-200
          Text(variant="headingSm" as="h3" fontWeight="medium") Conversion Rate (Post-Try-On)
          Banner(tone="info")
            p No orders from try-on users yet.
            
        //- Button Click (Cột 3: Có viền dọc màu xanh + đệm 2 bên)
        .flex.flex-col.gap-2.px-6.border-l.border-blue-200
          Text(variant="headingSm" as="h3" fontWeight="medium") Button Click
          
          .py-2(v-if="totalRequests >= 0")
            Text(variant="headingxl" as="p") {{ totalRequests }}
          Banner(v-else tone="info")
            p No click data available yet.
            
        //- Total Generations (Cột 4: Có viền dọc màu xanh + đệm sang trái)
        .flex.flex-col.gap-2.pl-6.border-l.border-blue-200
          Text(variant="headingSm" as="h3" fontWeight="medium") Total Generations
          .py-2
            Text(v-if="totalGenerations >= 0" variant="heading3xl" as="p") {{ totalGenerations }}
            Text(v-else variant="heading3xl" as="p") 0

      //- =====================================
      //- DÒNG 2: BIỂU ĐỒ (CHARTS)
      //- =====================================
      .grid.grid-cols-1.md_grid-cols-2.gap-8.pb-6.border-b.border-gray-200
          
          //- Daily Try-Ons (Chuyển sang biểu đồ đường)
          div
            Text(variant="headingSm" as="h3" fontWeight="medium") Daily Try-Ons
            
            .mt-4.h-64.bg-white.border.border-gray-200.rounded-lg.p-4
              Line(
                v-if="chartData && chartData.labels && chartData.labels.length > 0" 
                :data="chartData" 
                :options="chartOptions"
              )
              
              div(v-else class="h-full flex items-center justify-center")
                Text(tone="subdued") Đang tải biểu đồ...
            
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
import { ref, onMounted } from 'vue'; 
import { Page, Card, Text, Banner, DataTable } from '@ownego/polaris-vue';
import {  getOverview, getTopProducts } from '@/service/AnalyticService';

// 1. Dùng thư viện Line thay vì Bar
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';

// 2. Đăng ký các thành phần cho biểu đồ Đường (Line)
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

// 3. Khai báo biến biểu đồ
const chartData = ref({
  labels: [],
  datasets: []
});

// Options đã được tối ưu cho biểu đồ đường
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // Ẩn chú thích vì chỉ có 1 đường
    tooltip: {
      mode: 'index',
      intersect: false,
    }
  },
  scales: {
    x: { 
      grid: { display: false } // Tắt kẻ sọc dọc
    },
    y: { 
      beginAtZero: true,
      border: { dash: [5, 5] } // Kẻ sọc ngang dạng nét đứt
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
});

const formatDate = (dateStr) => {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`; 
  }
  return dateStr;
};

const totalRequests = ref(0);
const totalGenerations = ref(0);

// Dữ liệu mẫu cho bảng
const tableRows = ref([]);

// Hàm lấy dữ liệu
const fetchAnalytics = async () => {
  try {
    const res = await getOverview();
    console.log("Overview Data:", res);
    totalRequests.value = res.totals.button_click;
    totalGenerations.value = res.totals.success;

    const topProductsRes = await getTopProducts();

    tableRows.value= topProductsRes.map(item => {
      const percentage = totalRequests.value > 0 ? ((item.request_count / totalRequests.value) * 100).toFixed(0) : '0';
      return [item.product_name, item.request_count.toString(), `${percentage}%`];
    });
    
  
    const apiData = res.series;
    console.log("API Data for Chart:", apiData);

    // Chỉ lấy button click cho biểu đồ đường
    chartData.value = {
      labels: apiData.map(item => formatDate(item.date)),
      datasets: [
        {
          label: 'Button Clicks',
          data: apiData.map(item => item.button_click),
          borderColor: '#3B82F6', // Màu xanh dương đậm (Line)
          backgroundColor: 'rgba(59, 130, 246, 0.1)', // Màu xanh mờ đổ dưới đường
          pointBackgroundColor: '#ffffff', // Nền chấm tròn
          pointBorderColor: '#3B82F6', // Viền chấm tròn
          pointBorderWidth: 2,
          pointRadius: 4, 
          pointHoverRadius: 6, 
          fill: true, // Bật tính năng tô nền mờ dưới đồ thị
          tension: 0.4 // Tạo đường cong uốn lượn
        }
      ]
    };
    
  } catch (error) {
    console.error("Lỗi khi tải Analytics:", error);
  }
};

onMounted(() => {
  fetchAnalytics();
});
</script>

<style scoped>
.bg-gray-50 {
  background-color: #f9fafb;
}
</style>
<template lang="pug">
ui-title-bar(title="Staging Virtual Try On - Analytics")
Page(title="Analytics")
  
  //- =====================================
  //- TOP BAR: INFO & FILTER
  //- =====================================
  InlineStack(align="space-between" blockAlign="center" style="margin-bottom: var(--p-space-500)")
    Text(variant="bodySm" as="p" tone="subdued") Data updated daily (UTC).
    
    InlineStack(gap="200" blockAlign="center")
      //- Choose start and end dates if custom is selected
      InlineStack(v-if="selectedPeriod === 'custom'" gap="200" blockAlign="center")
        TextField(v-model="customStartDate" type="date" label="Start date" labelHidden)
        span(style="color: var(--p-color-text-subdued)") to
        TextField(v-model="customEndDate" type="date" label="End date" labelHidden)
        Button(@click="fetchAnalytics" :disabled="isLoading") Apply
        
      div(style="width: 160px;")
        Select(
          label="Date range"
          labelHidden
          :options="dateOptions"
          v-model="selectedPeriod"
          :disabled="isLoading"
        )

  //- =====================================
  //- LOADING STATE (SHOWN DURING API CALLS)
  //- =====================================
  BlockStack(v-if="isLoading" inlineAlign="center" style="padding: 100px 0; align-items: center;")
    Spinner(size="large")
    Text(variant="bodyMd" tone="subdued") Loading analytics data...

  //- =====================================
  //- DATA STATE (SHOWN WHEN DATA IS LOADED)
  //- =====================================
  BlockStack(v-else gap="600" style="margin-bottom: 2rem;")
    
    //- CARD 1: SUMMARY
    Card
      Grid
        //- Column 1: Order Conversion Rate
        GridCell(:columnSpan="{xs: 6, sm: 6, md: 3, lg: 3, xl: 3}")
          BlockStack(gap="200" style="padding-right: var(--p-space-600);")
            Tooltip(content="Total products converted to order / Total successful try-ons")
              Text(variant="headingSm" as="span" fontWeight="medium")
                span(style="cursor: help; border-bottom: 1px dashed var(--p-color-border-subdued);") Order Conversion Rate
            div(v-if="orderConversionRate > 0" style="padding-top: var(--p-space-200); padding-bottom: var(--p-space-200);")
              Text(variant="headingXl" as="p") {{ orderConversionRate.toFixed(1) }} %
            Banner(v-else tone="info")
              p No order conversion data available yet.
            
        //- Column 2: Cart Conversion Rate
        GridCell(:columnSpan="{xs: 6, sm: 6, md: 3, lg: 3, xl: 3}")
          BlockStack(gap="200" style="padding: 0 var(--p-space-600); border-left: 1px solid var(--p-color-border-subdued);")
            Tooltip(content="Total products converted to cart / Total successful try-ons")
              Text(variant="headingSm" as="span" fontWeight="medium")
                span(style="cursor: help; border-bottom: 1px dashed var(--p-color-border-subdued);") Cart Conversion Rate
            div(v-if="cartConversionRate > 0" style="padding-top: var(--p-space-200); padding-bottom: var(--p-space-200);")
              Text(variant="headingXl" as="p") {{ cartConversionRate.toFixed(1) }} %
            Banner(v-else tone="info")
              p No cart conversion data available yet.
            
        //- Column 3: Button Click
        GridCell(:columnSpan="{xs: 6, sm: 6, md: 3, lg: 3, xl: 3}")
          BlockStack(gap="200" style="padding: 0 var(--p-space-600); border-left: 1px solid var(--p-color-border-subdued);")
            Text(variant="headingSm" as="h3" fontWeight="medium") Total Try-Ons
            div(v-if="totalRequests > 0" style="padding-top: var(--p-space-200); padding-bottom: var(--p-space-200);")
              Text(variant="headingXl" as="p") {{ totalRequests }}
            Banner(v-else tone="info")
              p No click data available yet.
            
        //- Column 4: Total Generations
        GridCell(:columnSpan="{xs: 6, sm: 6, md: 3, lg: 3, xl: 3}")
          BlockStack(gap="200" style="padding-left: var(--p-space-600); border-left: 1px solid var(--p-color-border-subdued);")
            Text(variant="headingSm" as="h3" fontWeight="medium") Total Successful Try-Ons 
            div(style="padding-top: var(--p-space-200); padding-bottom: var(--p-space-200);")
              Text(v-if="totalGenerations > 0" variant="heading3xl" as="p") {{ totalGenerations }}
              Text(v-else variant="heading3xl" as="p") 0

    //- CARD 2: CHARTS
    Card
      BlockStack(gap="400")
        Text(variant="headingSm" as="h3" fontWeight="medium") Daily Try-Ons
        
        div(style="height: 256px; width: 100%;")
          Line(
            v-if="chartData && chartData.labels && chartData.labels.length > 0" 
            :data="chartData" 
            :options="chartOptions"
          )
          
          div(v-else style="height: 100%; display: flex; align-items: center; justify-content: center; border: 1px dashed var(--p-color-border-subdued); border-radius: var(--p-border-radius-200); background: var(--p-color-bg-surface-secondary);")
            Text(tone="subdued") No chart data available.

    //- CARD 3: DATA TABLE
    Card
      BlockStack(gap="400")
        InlineStack(align="space-between" blockAlign="center")
          Text(variant="headingMd" as="h2" fontWeight="bold") Most Tried-On Products
          
          div(style="width: 250px;")
            TextField(
              v-model="searchQuery" 
              placeholder="Search product..." 
              clearButton 
              @clear-button-click="searchQuery = ''"
              autoComplete="off"
              label="Search product"
              labelHidden
            )
        
        div(style="border: 1px solid var(--p-color-border-subdued); border-radius: var(--p-border-radius-200); overflow: hidden;")
          DataTable(
            :columnContentTypes="['text', 'numeric', 'numeric']"
            :headings="['Product', 'Try-Ons', '% of Total']"
            :rows="filteredAndPaginatedRows"
          )
          
        InlineStack(align="center" blockAlign="center" gap="400" style="margin-top: var(--p-space-200)")
          Button(:disabled="currentPage <= 1" @click="handlePrevious" size="micro") &larr;
          Text(variant="bodyMd" as="span" fontWeight="medium") {{ currentPage }} / {{ totalPages || 1 }}
          Button(:disabled="currentPage >= totalPages" @click="handleNext" size="micro") &rarr;
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'; 
import { Page, Card, Text, Banner, DataTable, Tooltip, InlineStack, BlockStack, Grid, GridCell, Select, Spinner, TextField, Button } from '@ownego/polaris-vue';
import { getOverview, getTopProducts } from '@/service/AnalyticService';

// 1. Use Line library instead of Bar
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip as ChartTooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';

// 2. Register components for Line chart
ChartJS.register(Title, ChartTooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

// ==========================================
// DATA MANAGEMENT STATE
// ==========================================
const isLoading = ref(true); // LOADING STATE VARIABLE
const selectedPeriod = ref('30'); // Defaults to Last 30 days
const customStartDate = ref('');
const customEndDate = ref('');

const dateOptions = [
  {label: 'All time', value: 'all'},
  {label: 'Last 7 days', value: '7'},
  {label: 'Last 30 days', value: '30'},
  {label: 'Last 90 days', value: '90'},
  {label: 'Custom time', value: 'custom'}
];

const totalRequests = ref(0);
const totalGenerations = ref(0);
const cartConversionRate = ref(0);
const orderConversionRate = ref(0);
const tableRows = ref([]);

// Search and Pagination state
const searchQuery = ref('');
const currentPage = ref(1);

// Reset page to 1 when user types in search
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Computed data filtering
const filteredRows = computed(() => {
  if (!searchQuery.value) return tableRows.value;
  const q = searchQuery.value.toLowerCase();
  return tableRows.value.filter(row => String(row[0]).toLowerCase().includes(q));
});

// Computed total pages count
const totalPages = computed(() => {
  return Math.ceil(filteredRows.value.length / 10) || 1;
});

// Computed chunk slice for current page
const filteredAndPaginatedRows = computed(() => {
  const start = (currentPage.value - 1) * 10;
  return filteredRows.value.slice(start, start + 10);
});

// Page navigation handlers
const handlePrevious = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const handleNext = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const chartData = ref({
  labels: [],
  datasets: []
});

// Optimized options for line chart
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
// API ACTION FUNCTIONS
// ==========================================
const fetchAnalytics = async () => {
  isLoading.value = true; // ENABLE LOADING ON INITIATION
  
  try {
    chartData.value = { labels: [], datasets: [] };
    
    const params = {
      period: selectedPeriod.value,
      start_time: selectedPeriod.value === 'custom' ? customStartDate.value : undefined,
      end_time: selectedPeriod.value === 'custom' ? customEndDate.value : undefined
    };

    // Run 2 APIs concurrently to optimize loading speed
    // Add catch block for getTopProducts so chart still renders if this API fails
    const [res, topProductsRes] = await Promise.all([
      getOverview(params),
      getTopProducts(params).catch(err => {
        console.warn("Error in getTopProducts:", err);
        return [];
      })
    ]);
    
    // Process Overview Data
    totalRequests.value = res?.totals?.button_click || 0;
    totalGenerations.value = res?.totals?.success || 0;
    cartConversionRate.value = res?.totals?.cart_conversion_rate || 0;
    orderConversionRate.value = res?.totals?.order_conversion_rate || 0;
    
    // Process table rows
    tableRows.value = Array.isArray(topProductsRes) ? topProductsRes.map(item => {
      const percentage = totalRequests.value > 0 ? ((item.request_count / totalRequests.value) * 100).toFixed(0) : '0';
      return [item.product_name, item.request_count.toString(), `${percentage}%`];
    }) : [];
    
    // Process chart series
    const apiData = res?.series || [];
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
    console.error("Error loading analytics:", error);
    // Error toast can be added here if needed
  } finally {
    isLoading.value = false; // DISABLE LOADING ON SUCCESS OR FAILURE
  }
};

// ==========================================
// LIFECYCLE AND WATCHERS
// ==========================================
onMounted(() => {
  fetchAnalytics();
});

// Automatically call API when date range changes
watch(selectedPeriod, (newVal) => {
  if (newVal !== 'custom') {
    fetchAnalytics();
  } else {
    // If custom is selected, initialize default dates (last month to today) if empty
    if (!customStartDate.value || !customEndDate.value) {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      customStartDate.value = lastMonth.toISOString().split('T')[0];
      customEndDate.value = today.toISOString().split('T')[0];
    }
  }
});
</script>

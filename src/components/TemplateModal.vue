<template lang="pug">
Teleport(to="body")
  div(
    v-if="isOpen",
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm",
    @click="$emit('close')"
  )
    div(class="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 relative", @click.stop)
      div(class="flex justify-between items-center mb-6 border-b pb-4")
        h2(class="text-xl font-bold text-gray-800") Try-On Templates
        button(class="text-gray-400 hover:text-gray-800 text-2xl leading-none", @click="$emit('close')") &times;

      div(class="grid grid-cols-4 gap-6")
        div(
          v-for="temp in templates",
          :key="temp.id",
          class="border border-gray-200 rounded-xl p-4 flex flex-col items-center hover:border-blue-400 transition-colors"
        )
          div(class="h-32 w-full bg-gray-50 rounded-lg flex items-center justify-center mb-4 overflow-hidden")
            img(:src="temp.image", class="h-full object-contain", alt="Template")
          div(class="font-medium text-gray-800 mb-4 flex items-center")
            | {{ temp.name }}
            span(
              v-if="temp.isNew",
              class="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 uppercase tracking-wide"
            ) New
          button(class="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors") Use template

      div(class="text-center mt-6 text-sm text-gray-400") More templates are coming soon...
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Khai báo các dữ liệu nhận từ file cha (Products.vue)
defineProps({
  isOpen: Boolean,
  product: Object,
  templates: Array
});

// Khai báo sự kiện gửi ngược lại file cha (để đóng modal)
defineEmits(['close']);
</script>
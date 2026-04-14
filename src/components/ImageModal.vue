<template lang="pug">
Teleport(to="body")
  div(
    v-if="isOpen",
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm",
    @click="$emit('close')"
  )
    div(class="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative", @click.stop)
      div(class="flex justify-between items-center mb-6 border-b pb-4")
        h2(class="text-xl font-bold text-gray-800") Select VTO Image - 
          span(class="text-blue-600") {{ product?.title }}
        button(class="text-gray-400 hover:text-gray-800 text-2xl leading-none", @click="$emit('close')") &times;

      div(class="border border-gray-200 rounded-xl p-5 mb-6 bg-gray-50")
        div(class="font-bold flex items-center gap-2 mb-2 text-gray-800")
          span(class="text-lg") ☁️
          | Upload Custom VTO Image 
          span(class="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded font-semibold") Recommended
        p(class="text-sm text-gray-500 mb-4") Upload a garment-only image that won't appear on your product page. This image will only be used for virtual try-on.
        input(
          type="file",
          class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:border-gray-300 file:border file:text-gray-700 hover:file:bg-gray-50 cursor-pointer"
        )

      div(class="text-center text-sm text-gray-400 mb-6 relative")
        span(class="bg-white px-3 relative z-10 font-medium") OR
        div(class="absolute left-0 top-1/2 w-full h-px bg-gray-200 -z-0")

      div
        div(class="font-bold flex items-center gap-2 mb-2 text-gray-800")
          span(class="text-lg") 🖼️
          | Select from Product Images
        p(class="text-sm text-gray-500 mb-4") Choose from your existing product images. Best results with flat lay or ghost mannequin shots.

        div(class="flex gap-4")
          div(
            v-for="i in 3",
            :key="i",
            class="w-24 h-32 border-2 border-transparent rounded-lg cursor-pointer hover:border-blue-500 overflow-hidden relative group"
          )
            img(:src="product?.image", class="w-full h-full object-cover")
            div(class="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-20 transition-all")
            div(class="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-[11px] font-medium text-center py-1") Image {{ i }}

      div(class="mt-8 flex justify-end gap-3 pt-4 border-t")
        button(class="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50", @click="$emit('close')") Cancel
        button(class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-sm") Save Image
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  isOpen: Boolean,
  product: Object
});

defineEmits(['close']);
</script>
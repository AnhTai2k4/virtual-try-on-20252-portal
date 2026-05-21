<template lang="pug">
AppProvider(:i18n="locales")
  router-view

ui-nav-menu
  a(href="/", rel="home") Dashboard
  a(href="/products") Products
  a(href="/customizes") Customize
  a(href="/analytics") Analytics
  a(href="/pricings") Pricing
  a(href="/settings") Settings
  a(href="/document") Document
</template>

<script setup lang="ts">
import locales from '@ownego/polaris-vue/dist/locales/en.json';
</script>
<style lang="scss">
@use '@/scss/app.scss';
</style>

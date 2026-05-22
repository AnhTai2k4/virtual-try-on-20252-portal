<template lang="pug">
ui-save-bar(ref="saveBarRef")
  button(variant="primary" @click="saveSettings") Save
  button(@click="discardSettings") Discard

ui-title-bar(title="Staging Virtual Try On - Customize")

Page(title="Customize Appearance" )

  //- LOADING STATE
  Card(v-if="isPageLoading")
    BlockStack(gap="400" inlineAlign="center" style="padding: 80px 0; align-items: center;")
      Spinner(size="large")
      Text(variant="bodyMd" tone="subdued") Loading configuration...

  //- MAIN INTERFACE
  Layout(v-else style = "margin-bottom: 2rem;")
    //- LEFT COLUMN: SETTINGS AREA
    LayoutSection
      Card
        BlockStack(gap="400")
          //- Card Title
          Text(variant="headingMd" as="h2") Appearance

          //- 1. Background Color
          BlockStack(gap="200")
            Text(variant="bodyMd" as="label" fontWeight="medium") Background Color
            InlineStack(gap="300" blockAlign="center")
              //- Native color picker button combined with Polaris
              div(style="position: relative; width: 40px; height: 40px; border-radius: 4px; border: 1px solid #8c9196; overflow: hidden; cursor: pointer; flex-shrink: 0;")
                input(type="color" v-model="settings.bgColor" style="position: absolute; top: -8px; left: -8px; width: 56px; height: 56px; cursor: pointer; border: none; outline: none;")
              div(style="max-width: 200px;")
                TextField(v-model="settings.bgColor" autoComplete="off")
 
          //- 2. Text & Icon Color
          BlockStack(gap="200")
            Text(variant="bodyMd" as="label" fontWeight="medium") Text & Icon Color
            InlineStack(gap="300" blockAlign="center")
              div(style="position: relative; width: 40px; height: 40px; border-radius: 4px; border: 1px solid #8c9196; overflow: hidden; cursor: pointer; flex-shrink: 0;")
                input(type="color" v-model="settings.textColor" style="position: absolute; top: -8px; left: -8px; width: 56px; height: 56px; cursor: pointer; border: none; outline: none;")
              div(style="max-width: 200px;")
                TextField(v-model="settings.textColor" autoComplete="off")



          //- 4. Title Text
          TextField(
            label="Title Text"
            v-model="settings.titleText"
            helpText="Text displayed above the try-on button"
            autoComplete="off"
          )

          //- 5. Button Text
          TextField(
            label="Button Text"
            v-model="settings.buttonText"
            helpText="Text displayed on the try-on button"
            autoComplete="off"
          )

          Divider

          //- 6. Button Spacing (Padding)
          BlockStack(gap="300")
            Text(variant="headingSm" as="h3" fontWeight="medium") Button Spacing 
            InlineStack(gap="400")
              div(style="width: 128px;")
                TextField(
                  label="Top"
                  type="number"
                  v-model.number="settings.paddingTop"
                  min="0"
                  max="100"
                  suffix="px"
                  autoComplete="off"
                )
              div(style="width: 128px;")
                TextField(
                  label="Bottom"
                  type="number"
                  v-model.number="settings.paddingBottom"
                  min="0"
                  max="100"
                  suffix="px"
                  autoComplete="off"
                )

          Divider

          //- 7. Advanced Styling
          BlockStack(gap="300")
            Text(variant="headingSm" as="h3" fontWeight="medium") Button Styling

            Select(
              label="Button Shape"
              v-model="settings.buttonShape"
              :options="buttonShapeOptions"
            )

            Select(
              label="Font Family"
              v-model="settings.fontFamily"
              :options="fontFamilyOptions"
            )

            Select(
              label="Button Width"
              v-model="settings.buttonWidth"
              :options="buttonWidthOptions"
            )

          Divider

          //- 8. Footer Actions
          InlineStack(align="start")
            Button(@click="resetToDefaults") Reset to Defaults

    //- RIGHT COLUMN: PREVIEW AREA
    //- Use variant="oneThird" to make this column smaller than settings column
    LayoutSection(variant="oneThird")
      Card
        BlockStack(gap="400")

          //- Preview Title
          BlockStack(gap="100")
            Text(variant="headingMd" as="h2") Preview
            Text(variant="bodySm" tone="subdued") This is how the button will appear on product pages.

          //- Preview Frame 
          div(style="padding: 20px; border: 1px solid var(--p-color-border-subdued); border-radius: var(--p-border-radius-200); background: var(--p-color-bg-surface-secondary);")
            div(style="width: 100%; height: 160px; background: var(--p-color-bg-surface-tertiary); border-radius: var(--p-border-radius-200); margin-bottom: 16px; display: flex; align-items: center; justify-content: center; border: 1px dashed var(--p-color-border-subdued);")
              Text(variant="bodySm" tone="subdued" fontWeight="medium") Product Image

            Text(variant="bodyMd" fontWeight="bold") Example Product
            div(style="margin-bottom: 16px; margin-top: 4px;")
              Text(variant="bodyMd" tone="subdued") $49.99

            //- Wrapper area with dynamic padding
            div(:style="{ paddingTop: settings.paddingTop + 'px', paddingBottom: settings.paddingBottom + 'px' }")

              //- Title
              p(v-if="settings.titleText" style="color:#525252; font-size:14px; margin-bottom: 8px;  font-weight: 500;") {{ settings.titleText }}

              //- Button
              VtoButton(
                :btnText="settings.buttonText || 'Virtual Try-On'"
                :btnColor="settings.bgColor"
                :textColor="settings.textColor"
                :buttonShape="settings.buttonShape"
                :buttonWidth="settings.buttonWidth"
                :fontFamily="settings.fontFamily"
                :isProcessing="false"
              )
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import VtoButton from '../../sdk/src/components/VtoButton.vue';
import {
  Page, Layout, LayoutSection, Card, BlockStack, InlineStack,
  Text, TextField, Checkbox, Button, Divider, Spinner
} from '@ownego/polaris-vue';

// IMPORT FROM SERVICE FILE
import { getCustomizationSettings, updateCustomizationSettings } from '@/service/CustomizeService';

// --- OPTIONS FOR SELECTS ---
const buttonShapeOptions = [
  { label: 'Square', value: 'square' },
  { label: 'Rounded', value: 'rounded' },
  { label: 'Pill', value: 'pill' }
];

const fontFamilyOptions = [
  { label: 'Theme Default', value: 'inherit' },
  { label: 'Sans-serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' }
];

const buttonWidthOptions = [
  { label: 'Full Width', value: 'full' },
  { label: 'Fit Content', value: 'auto' }
];

// --- BASIC STATE ---
const isSaving = ref(false);
const isPageLoading = ref(true);
const shopId = ref(null);

const saveBarRef = ref(null);
const initialSettingsStr = ref("");

// Default customization settings
const settings = reactive({
  bgColor: '#000000',
  textColor: '#FFFFFF',
  buttonText: '✨ Virtual Try On ✨',
  titleText: 'See how you look good in this outfit',
  paddingTop: 16,
  paddingBottom: 16,
  buttonShape: 'rounded',
  fontFamily: 'inherit',
  buttonWidth: 'full'
});

// Action to reset to default settings
const resetToDefaults = () => {
  settings.bgColor = '#000000';
  settings.textColor = '#FFFFFF';
  settings.buttonText = '✨ Virtual Try On ✨';
  settings.titleText = 'See how you look good in this outfit';
  settings.paddingTop = 16;
  settings.paddingBottom = 16;
  settings.buttonShape = 'rounded';
  settings.fontFamily = 'inherit';
  settings.buttonWidth = 'full';
};

watch(settings, (newVal) => {
  if (isPageLoading.value) return;
  const currentStr = JSON.stringify(newVal);
  if (currentStr !== initialSettingsStr.value) {
    if (saveBarRef.value?.show) saveBarRef.value.show();
  } else {
    if (saveBarRef.value?.hide) saveBarRef.value.hide();
  }
}, { deep: true });

const discardSettings = () => {
  if (initialSettingsStr.value) {
    Object.assign(settings, JSON.parse(initialSettingsStr.value));
  }
  if (saveBarRef.value?.hide) saveBarRef.value.hide();
};

// ==========================================================
// 1. LOAD SETTINGS ACTION
// ==========================================================
const loadSettings = async () => {
  isPageLoading.value = true;
  try {
    // Single call to CustomizeService
    const data = await getCustomizationSettings();

    if (data.shopId) shopId.value = data.shopId;

    // Override Vue state if previous settings exist
    if (data.settings) {
      settings.bgColor = data.settings.bgColor || '#111111';
      settings.textColor = data.settings.textColor || '#FFFFFF';
      settings.buttonText = data.settings.buttonText || 'Virtual Try-On';
      settings.titleText = data.settings.titleText || 'See how you look good in this outfit';
      settings.paddingTop = data.settings.paddingTop !== undefined ? data.settings.paddingTop : 16;
      settings.paddingBottom = data.settings.paddingBottom !== undefined ? data.settings.paddingBottom : 16;
      settings.buttonShape = data.settings.buttonShape || 'rounded';
      settings.fontFamily = data.settings.fontFamily || 'inherit';
      settings.buttonWidth = data.settings.buttonWidth || 'full';
    }

    initialSettingsStr.value = JSON.stringify(settings);
    if (saveBarRef.value?.hide) saveBarRef.value.hide();

  } catch (error) {
    console.error("Error loading interface:", error);
  } finally {
    isPageLoading.value = false;
  }
};

// ==========================================================
// 2. SAVE SETTINGS ACTION
// ==========================================================
const saveSettings = async () => {
  if (!shopId.value) {
    console.error("Shop ID is missing, cannot save.");
    return;
  }

  isSaving.value = true;

  try {
    // Pass the state directly to the service to handle
    await updateCustomizationSettings(shopId.value, settings);
    window.shopify.toast.show('Settings saved successfully!');

    initialSettingsStr.value = JSON.stringify(settings);
    if (saveBarRef.value?.hide) saveBarRef.value.hide();

  } catch (error) {
    window.shopify.toast.show('Failed to save settings. Please try again.', { isError: true });
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  loadSettings();
});
</script>

<style scoped></style>

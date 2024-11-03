<template>
  <div
    role="application"
    aria-label="Grayscale color picker"
    class=""
  >
    <ul
      role="listbox"
      v-bind="$attrs"
    >
      <ColorItem
        v-for="color in toLowerCaseList(palette)"
        :key="color"
        :size="size"
        :color="color"
        :picked-variant="pickedVariant"
        :current-color="getColorAs('hex6')"
        @click="colorChanged(color)"
      />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import grayscale from "../data/grayscale.json";
import { ColorItemVariant } from "../utils/types";
import ColorItem from "./common/ColorItem.vue";

defineOptions({ inheritAttrs: false });
const emit = defineEmits(["update:model-value"]);

const options = withDefaults(
  defineProps<{
    modelValue?: string;
    palette?: string[];
    size?: number | string;
    pickedVariant?: ColorItemVariant;
  }>(),
  {
    modelValue: "#ffffff",
    palette: () => grayscale,
    pickedVariant: "dot",
    size: 25,
  }
);

const { modelValue, palette, size } = toRefs(options);
const { getColorAs } = useColor(modelValue);

const colorChanged = (to: string) => {
  emit('update:model-value', to);
};
</script>

<style lang="scss" scoped>
.vc-compact {
  &-color {
  }
}
</style>

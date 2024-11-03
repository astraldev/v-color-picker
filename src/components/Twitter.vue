<template>
  <div class="vc-twitter">
    <ul
      class="vc-twitter-body"
      v-bind="$attrs"
    >
      <ColorItem
        v-for="(colorItem, index) in palette"
        :key="`twitter-color-${index}-${colorItem}`"
        class="rounded"
        :color="convertColorTo(colorItem, 'hex')"
        :current-color="getColorAs('hex')"
        picked-variant="none"
        :size="size"
        :style="{
          boxShadow: `0 0 4px ${ isSameColor(colorItem) ? colorItem : 'transparent' }`,
        }"
        @click="handlerClick(colorItem)"
      />
      <li>
        <EditableInput
          v-model="hex"
          label="#"
          type="hex"
          wrapper-class="!w-fit"
          class="max-w-[9ex]"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ColorFormat } from '../composables/useColor';
import EditableInput from './common/EditableInput.vue';
import twitterColors from "../data/twitter.json";
import ColorItem from './common/ColorItem.vue';

const emit = defineEmits(["update:color"]);
const options = withDefaults(
  defineProps<{
    color: ColorFormat;
    palette?: string[];
    size?: string | number;
  }>(),
  {
    size: 30,
    pickedVariant: "bordered",
    palette: () => twitterColors,
  }
);

const { color } = toRefs(options);
const { hex, isSameColor, getColorAs } = useColor(color);
const handlerClick = (clr: string) => emit("update:color", clr);

</script>

<style lang="css">
.vc-twitter {
  @apply w-fit;
}

.vc-twitter-body {
  @apply flex flex-wrap gap-1.5;
}
</style>

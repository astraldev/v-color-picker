<template>
  <li
    role="option"
    :aria-label="'Color: ' + color"
    :aria-selected="isSelectedColor"
    :key="color"
    class="vc-color-item"
    :style="{ background: color, ...blockStyle }"
    v-bind="$attrs"
  >
    <transition class="vc-color-item-picked">
      <div
        :class="`vc-color-item-picked vc-color-item-picked--${pickedVariant}`"
        v-show="isSelectedColor"
      />
    </transition>
  </li>
</template>

<script setup lang="ts">
import { ColorItemVariant } from '../../utils/types';

const props = withDefaults(
  defineProps<{
    color: string;
    pickedVariant: ColorItemVariant;
    size?: number | string;
    currentColor: string;
  }>(),
  {
    size: 25,
    pickedVariant: "dot"
  }
);

const { size, color, currentColor } = toRefs(props);
const isSelectedColor = computed(() => color.value === currentColor.value);
const blockStyle = computed(() => {
  const _size = toPxValue(size.value);
  return { height: _size, width: _size };
});
</script>

<style lang="scss" scoped>
.vc-color-item {
  @apply grid place-items-center;
  &-picked {
    @apply mix-blend-difference;
  
    &--dot {
      @apply text-center rounded-full h-[25%] w-auto aspect-square bg-white/60;
    }
  
    &--bordered {
      @apply border-2 h-full w-full rounded border-white/60;
    }
  
    &-leave-active,
    &-enter-active {
      // TODO: Implement animations
    }
  }
}
</style>
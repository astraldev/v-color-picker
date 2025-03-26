<template>
  <div
    class="vc-slider-2d"
    :class="{
      'with-saturation': withHsvSaturation,
      'with-brightness': withHsvBrightness,
    }"
    ref="containerEl"
    @click="sliding(true)"
    @mousedown="slidingStart"
    @touchmove="sliding()"
    @touchstart="sliding()"
    @mousemove="sliding()"
    @mouseup="slidingStop"
  >
    <div class="vc-slider-2d--white" />
    <div class="vc-slider-2d--black" />
    <div
      ref="pointerEl"
      class="vc-slider-2d--pointer"
      :style="{
        left: `calc(${offset.x}% - ${width/2}px)`,
        top: `calc(${offset.y}% - ${height/2}px)`,
      }"
    >
      <div class="vc-slider-2d--circle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding, useMouseInElement } from '@vueuse/core';

const containerEl = ref<HTMLElement>();
const pointerEl = ref<HTMLElement>();

const emit = defineEmits([
  "update:x",
  "update:y",
]);

const options = withDefaults(
  defineProps<{
    x: number;
    y: number;
    xInRange?: number;
    yInRange?: number;
    withHsvSaturation?: boolean;
    withHsvBrightness?: boolean;
    invertX?: boolean;
    invertY?: boolean;
  }>(),
  {
    xInRange: 100,
    yInRange: 100,
  }
);

const { x, y, xInRange, yInRange, invertX, invertY } = toRefs(options);
const offset = reactive({ x: 0, y: 0 });
const isSliding = ref(false);

const { 
  elementX,
  elementY,
  elementWidth,
  elementHeight,
} = useMouseInElement(containerEl);

const { height, width } = useElementBounding(pointerEl);

const sliding = (force = false) => {
  const container = containerEl.value;
  if (!container || (!isSliding.value && !force)) return;
  offset.y = clamp((elementY.value / elementHeight.value) * 100);
  offset.x = clamp((elementX.value / elementWidth.value) * 100);
};

const slidingStart = () => (isSliding.value = true);
const slidingStop = () => (isSliding.value = false);


watch(
  [x, y],
  ([ x, y ]) => {
    const xResults = (x / xInRange.value * 100);
    const yResults = (y / yInRange.value * 100);

    const xValueInPercentage = invertX.value ? 100 - xResults : xResults;
    const yValueInPercentage = invertY.value ? 100 - yResults : yResults;
    if (offset.x !== xValueInPercentage) offset.x = xValueInPercentage;
    if (offset.y !== yValueInPercentage) offset.y = yValueInPercentage;
  },
  {
    immediate: true,
  }
);

watch(
  offset,
  ({ x: ofX, y: ofY }) => {
    const xBoundResults = (xInRange.value * (ofX / 100));
    const yBoundResults = (yInRange.value * (ofY / 100));
    const xInBound = invertX.value ? xInRange.value - xBoundResults : xBoundResults;
    const yInBound = invertY.value ? yInRange.value - yBoundResults : yBoundResults;
    if (x.value !== xInBound) emit("update:x", xInBound);
    if (y.value !== yInBound) emit("update:y", yInBound);
  }
);

</script>

<style lang="scss" scoped>
.vc-slider-2d {
  width: var(--vc-slider-2d-width, 200px);
  height: var(--vc-slider-2d-height, 200px);
  border: 1px solid var(--vc-slider-2d-border-color, rgb(114, 114, 114));
  border-radius: var(--vc-slider-2d-roundness, 3px);

  @apply relative overflow-clip p-1;

  &.with-saturation {
    --vc-slider-2d-white-background: linear-gradient(90deg, #fff, rgba(255,255,255,0));
  }

  &.with-brightness {
    --vc-slider-2d-black-background: linear-gradient(0deg, #000, rgba(0,0,0,0));
  }

  &--white {
    background: var(--vc-slider-2d-white-background);
  }
  
  &--black {
    background: var(--vc-slider-2d-black-background);
  }

  &--pointer {
    @apply h-0.5 w-0.5 border p-1 rounded-full grid place-items-center;
  }

  &--circle {
    @apply h-px w-px border rounded-full absolute;
  }

  &--white,
  &--black,
  &--pointer,
  &--background {
    @apply absolute;
  }

  &--white,
  &--black,
  &--background {
    @apply inset-0;
  }
}
</style>
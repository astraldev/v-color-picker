<template>
  <div
    class="vc-slider"
    :class="`vc-slider--${orientation} vc-slider-${mode}`"
  >
    <div
      class="vc-slider-container"
      role="slider"
      aria-valuemin="0"
      :aria-valuemax="inRange"
      ref="containerEl"
      @click="sliding(true)"
    >
      <div
        class="vc-slider-pointer"
        role="presentation"
        ref="pointerEl"
        :style="{ left: `${offset.x}%`, top: `${offset.y}%` }"
        @mousedown="slidingStart"
        @touchmove="sliding()"
        @touchstart="sliding()"
        @mousemove="sliding()"
        @mouseup="slidingStop"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, useMouseInElement } from '@vueuse/core';


type SliderProps = {
  percentage?: number;
  inRange?: number;
  mode?: "hue" | "saturation" | "lightness" | "none";
  orientation?: "horizontal" | "vertical"
}

const containerEl = ref<HTMLElement>();
const pointerEl  = ref<HTMLElement>();

const emit = defineEmits(["update:percentage", "sliding"]);
const options = withDefaults(
  defineProps<SliderProps>(),
  {
    inRange: 100,
    percentage: 50,
    mode: "none",
    orientation: "horizontal",
  }
);
const { orientation, inRange, percentage } = toRefs(options);

const offset = reactive({ x: 0, y: 0 });
const isSliding = ref(false);

const { 
  elementX,
  elementY,
  elementWidth,
  elementHeight,
} = useMouseInElement(containerEl);

const sliding = (force = false) => {
  const container = containerEl.value;
  if (!container || (!isSliding.value && !force)) return;
  if (orientation.value === "horizontal") {
    offset.y = 0;
    offset.x = clamp((elementX.value / elementWidth.value) * 100);
    update(offset.x);
  } else {
    offset.x = 0;
    offset.y = clamp((elementY.value / elementHeight.value) * 100);
    update(offset.y);
  }
};

const slidingStart = () => (isSliding.value = true);
const slidingStop = () => (isSliding.value = false);
const update = (value: number) => {
  const valueInBound = inRange.value * (value / 100);
  emit("update:percentage", valueInBound);
};

onClickOutside(containerEl, slidingStop);

watch(
  percentage,
  (percent) => {
    const valueInPercentage = (percent / inRange.value * 100);
    if (orientation.value === "horizontal") {
      offset.y = 0;
      offset.x = valueInPercentage;
    } else {
      offset.x = 0;
      offset.y = valueInPercentage;
    }
  }, {
    immediate: true,
  }
);

watch(
  [elementX, elementY],
  () => isSliding.value && sliding(),
);

</script>

<style lang="scss">
.vc-slider {
  position: relative;

  &, &-container {
    width: 100%;
    height: 100%;
  }

  &--horizontal {
    .vc-slider-pointer {
      height: 100%;
      width: 3px;
    }
  }
  
  &--vertical {
    .vc-slider-pointer {
      width: 100%;
      height: 3px;
    }
  }

  &:hover {
    .vc-slider-pointer {
      transform: scale(1.15);
    }
  }
}

.vc-slider-pointer {
  position: absolute;
  padding: 0;
  transition: transform 150ms ease-out;
  background-color: var(--vc-slider-pointer-background, #fff);
}
</style>

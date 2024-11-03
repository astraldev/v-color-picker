<template>
  <div
    role="application"
    aria-label="Slider color picker"
    class="vc-slider"
    :class="`vc-slider--${orientation}`"
  >
    <PercentageSlider
      class="vc-slider-hue"
      v-model:percentage="hue"
      :in-range="360"
    />
    <div
      class="vc-slider-swatches"
      role="group"
    >
      <div
        class="vc-slider-swatch"
        v-for="(swatch, index) in normalizedSwatches"
        :key="index"
        :data-index="index"
        :aria-label="'color:' + hex"
        role="button"
        :class="{
          'vc-slider-swatch-picker--active': isActive(swatch),
        }"
        :style="{
          background: 'hsl(' + hue + ', ' + swatch.s * 100 + '%, ' + swatch.l * 100 + '%)'
        }"
        @click="handleSwClick(swatch)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorFormat } from '../composables/useColor';
import { ComponentOrientations } from '../utils/types';
import PercentageSlider from './common/PercentageSlider.vue';

const DEFAULT_SATURATION = 0.5;

type ColorSwatch =
  | number[]
  | string[]
  | Array<{
    s: number;
    l: number;
  }>
  | Array<{
    saturation: number;
    lightness: number;
  }>;

const emit = defineEmits(["update:color"]);
const options = withDefaults(
  defineProps<{
    color: ColorFormat;
    swatches?: ColorSwatch;
    orientation?: ComponentOrientations;
    defaultSaturation?: number;
  }>(),
  {
    defaultSaturation: 0.5,
    orientation: "horizontal",
    swatches: () => [
      { s: DEFAULT_SATURATION, l: 0.8 },
      { s: DEFAULT_SATURATION, l: 0.65 },
      { s: DEFAULT_SATURATION, l: 0.5 },
      { s: DEFAULT_SATURATION, l: 0.35 },
      { s: DEFAULT_SATURATION, l: 0.2 }
    ],
  }
);

const { color, swatches, defaultSaturation } = toRefs(options);

const {
  hue, saturation,
  lightness, hex,
  isSameColor
} = useColor(color, c => emit("update:color", c));

const normalizedSwatches = computed(() => {
  return swatches.value.map((swatch) => {
    if (typeof swatch === "object") {
      if ("saturation" in swatch && "lightness" in swatch) {
        return { 
          s: swatch.saturation,
          l: swatch.lightness,
        };
      } else if ("s" in swatch && "l" in swatch) {
        return { s: swatch.s, l: swatch.l };
      }
    } else {
      return {
        s: defaultSaturation.value,
        l: valueInRangeOf1(swatch),
      };
    }
  }).filter(s => !!s);
});

type Swatch = typeof normalizedSwatches.value[number];

const handleSwClick = ({ s, l }: Swatch) => {
  saturation.value = s;
  lightness.value = l;
};

const isActive = ({ s, l }: Swatch) => {
  return isSameColor({ s, l, h: hue.value });
};

</script>

<style lang="scss" scoped>
.vc-slider {
  @apply w-full flex flex-col gap-0.5;

  .vc-slider-swatches {
    @apply inline-flex gap-0.5 h-full;
  }

  .vc-slider-swatch {
    @apply w-full h-full;

    &-picker {
      &--active {
        @apply relative;
      }
    }
  }


  &--horizontal {
    .vc-slider-hue {
      background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    }
  }

  &--vertical {
    .vc-slider-swatches {
      @apply flex-col; 
    }
    .vc-slider-hue {
      background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    }
  }

}
</style>

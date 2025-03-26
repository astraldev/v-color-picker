<template>
  <div
    role="application"
    aria-label="Chrome color picker"
    :class="['vc-chrome', disableAlpha ? 'vc-chrome__disable-alpha' : '']"
    :style="{ 
      '--vc-alpha-gradient': alphaGradient,
      '--vc-hue-gradient-horizontal': hueGradient.horizontal,
    }"
  >
    <div class="vc-chrome-saturation-wrap">
      <PercentageSlider2d
        v-model:x="hsva.s"
        v-model:y="hsva.v"
        :x-in-range="1"
        :y-in-range="1"
        with-hsv-brightness
        with-hsv-saturation
        :style="{ background: `hsl(${hsva.h}, 100%, 50%)`}"
        invert-y
      />
    </div>
    <div class="vc-chrome-body">
      <div class="vc-chrome-controls">
        <div class="vc-chrome-color-wrap">
          <div
            :aria-label="`current color is #${hex}`"
            class="vc-chrome-active-color"
            :style="{ background: `#${hex8}` }"
          />
          <Checkboard
            class="checkerboard rounded-full"
            v-if="!disableAlpha"
          />
        </div>

        <div class="vc-chrome-sliders">
          <div class="vc-chrome-hue-wrap">
            <PercentageSlider
              v-model:percentage="hue"
              :in-range="360"
            />
          </div>
          <div
            class="vc-chrome-alpha-wrap"
            v-if="!disableAlpha"
          >
            <PercentageSlider
              v-model:percentage="alpha"
              :in-range="1"
            />
          </div>
        </div>
      </div>

      <div
        class="vc-chrome-fields-wrap"
        v-if="!disableFields"
      >
        <div
          class="vc-chrome-fields"
          v-show="activeColorOption.value === 0"
        >
          <!-- hex -->
          <div class="vc-chrome-field">
            <EditableInput
              v-if="alpha < 1"
              type="hex8"
              label="Hex"
              v-model="hex8"
            />
            <EditableInput
              v-else
              type="hex"
              label="Hex"
              v-model="hex"
            />
          </div>
        </div>
        <div
          class="vc-chrome-fields vc-chrome-fields-rgba"
          v-show="activeColorOption.value === 1"
        >
          <!-- rgba -->
          <div class="vc-chrome-field">
            <EditableInput
              label="r"
              v-model="red"
            />
          </div>
          <div class="vc-chrome-field">
            <EditableInput
              label="g"
              v-model="green"
            />
          </div>
          <div class="vc-chrome-field">
            <EditableInput
              label="b"
              v-model="blue"
            />
          </div>
          <div
            class="vc-chrome-field"
            v-if="!disableAlpha"
          >
            <EditableInput
              label="a"
              v-model.number="alpha"
              :in-range="1"
              :step="0.05"
              :max="1"
            />
          </div>
        </div>
        <div
          class="vc-chrome-fields vc-chrome-fields-hsla"
          v-show="activeColorOption.value === 2"
        >
          <!-- hsla -->
          <div class="vc-chrome-field">
            <EditableInput
              label="h"
              type="hue"
              v-model="hue"
            />
          </div>
          <div class="vc-chrome-field">
            <EditableInput
              label="s"
              type="hsla"
              v-model="saturation"
            />
          </div>
          <div class="vc-chrome-field">
            <EditableInput
              label="l"
              type="hsla"
              v-model="lightness"
            />
          </div>
          <div
            class="vc-chrome-field"
            v-if="!disableAlpha"
          >
            <EditableInput
              label="a"
              v-model.number="alpha"
              :step="0.05"
              :max="1"
            />
          </div>
        </div>
        <!-- btn -->
        <OptionSelect
          v-model:active-option="activeColorOption"
          :options="colorTypeOptions"
          class="mt-auto !pb-2"
        >
          <svg
            class="h-4 w-4"
            version="1.1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m5.6948 14.123c-0.39052 0.3905-0.39052 1.0237 0 1.4142l4.8922 4.8874c0.7812 0.7804 2.047 0.7801 2.8278-6e-4l4.8903-4.8904c0.3906-0.3905 0.3906-1.0237 0-1.4142-0.3905-0.3905-1.0237-0.3905-1.4142 0l-4.1856 4.1856c-0.3905 0.3906-1.0237 0.3906-1.4142 0l-4.1821-4.182c-0.39052-0.3905-1.0237-0.3905-1.4142 0z"
              fill="currentColor"
            />
            <path
              d="m18.305 9.9908c0.3906-0.39052 0.3906-1.0237 0-1.4142l-4.8922-4.8874c-0.7812-0.78039-2.0469-0.78008-2.8277 7e-4l-4.8904 4.8904c-0.39053 0.39052-0.39053 1.0237 0 1.4142 0.39052 0.39053 1.0237 0.39053 1.4142 0l4.1857-4.1856c0.3905-0.39053 1.0237-0.39053 1.4142 0l4.182 4.182c0.3905 0.39053 1.0237 0.39053 1.4142 0z"
              fill="currentColor"
            />
          </svg>
        </OptionSelect>
        <!-- btn -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorFormat } from '../composables/useColor';
import Checkboard from './common/Checkboard.vue';
import EditableInput from './common/EditableInput.vue';
import OptionSelect from './common/OptionSelect.vue';
import PercentageSlider from './common/PercentageSlider.vue';
import PercentageSlider2d from './common/PercentageSlider2d.vue';

const emit = defineEmits(["update:color"]);
const options = withDefaults(
  defineProps<{
    color: ColorFormat;
    disableAlpha?: boolean;
    disableFields?: boolean;
  }>(),
  {
    disableAlpha: false,
    disableFields: false,
  }
);

const { color } = toRefs(options);
const {
  hex,
  red,
  green,
  blue,
  hsva,
  hue,
  hex8,
  saturation,
  lightness,
  alpha,
  alphaGradient,
  hueGradient,
} = useColor(
  color,
  (nc) => emit("update:color", nc)
);

const colorTypeOptions = computed(() => {
  return ["HEX", "RGBA", "HSLA"].map((val, idx) => ({ value: idx, label: val }));
});

const activeColorOption = ref(colorTypeOptions.value[0]);
</script>

<style lang="scss" scoped>
.vc-chrome {
  @apply flex flex-col border rounded-lg border-white/10;
  --vc-slider-2d-width: 100%;
  --vc-slider-2d-height: 100%;
  --vc-slider-2d-roundness: 0;

  &-saturation-wrap {
    @apply flex-grow h-40;
  }

  &-controls {
    @apply flex gap-x-4 p-2;
  }

  &-active-color {
    @apply h-full w-full;
  }

  .checkerboard {
    @apply z-[-1] inset-px;
  }

  &-color-wrap {
    @apply h-9 w-9 aspect-square rounded-full relative overflow-clip;

    .checkerboard {
      @apply rounded-full;
    }
  }

  &-fields-rgba,
  &-fields-hsla {
    @apply flex;

    .vc-chrome-field:not(:last-child) {
      :deep(.vc-editable-input-label) {
        @apply border-r border-white/10;
      }
    }

    :deep(.vc-editable-input-label) {
      @apply w-full text-center font-medium font-mono;
    }
    
    :deep(.vc-editable-input-wrapper) {
      @apply flex-col-reverse gap-y-0.5 rounded-none;
    }

    :deep(.vc-editable-input) {
      @apply w-[calc(5ex_+_8px)] text-center font-medium text-sm;
    }
  }

  &-fields-wrap {
    @apply flex p-2;
  }

  &-sliders {
    @apply flex-grow flex flex-col *:flex-1;
  }

  &-hue-wrap {
    background: var(--vc-hue-gradient-horizontal, white);
  }

  &-alpha-wrap {
    background: var(--vc-alpha-gradient, white);
    @apply relative;
  }
}
</style>

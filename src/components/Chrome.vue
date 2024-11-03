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
      <!-- <PercentageSlider v-model="saturation" /> -->
    </div>
    <div class="vc-chrome-body">
      <div class="vc-chrome-controls">
        <div class="vc-chrome-color-wrap">
          <div
            :aria-label="`current color is #${hex}`"
            class="vc-chrome-active-color"
            :style="{ background: `${getColorAs('hsl')}` }"
          />
          <Checkboard v-if="!disableAlpha" />
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
          v-show="fieldsIndex === 0"
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
          class="vc-chrome-fields"
          v-show="fieldsIndex === 1"
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
              v-model="alpha"
              :in-range="1"
            />
          </div>
        </div>
        <div
          class="vc-chrome-fields"
          v-show="fieldsIndex === 2"
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
              v-model="alpha"
              :max="1"
            />
          </div>
        </div>
        <!-- btn -->
        <div
          class="vc-chrome-toggle-btn"
          role="button"
          aria-label="Change another color definition"
          @click="incrementView"
        >
          +
        </div>
        <div
          class="vc-chrome-toggle-btn"
          role="button"
          aria-label="Change another color definition"
          @click="decrementView"
        >
          -
        </div>
        <!-- btn -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorFormat } from '../composables/useColor';
import Checkboard from './common/Checkboard.vue';
import EditableInput from './common/EditableInput.vue';
import PercentageSlider from './common/PercentageSlider.vue';

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
  hue,
  hex8,
  saturation,
  lightness,
  alpha,
  alphaGradient,
  hueGradient,
  getColorAs,
} = useColor(
  color,
  (nc) => emit("update:color", nc)
);


// ["hex", "rgba", "hsla"];
const fieldsIndex = ref(0);

const incrementView = () => {
  fieldsIndex.value = fieldsIndex.value >= 2 ? 0 : fieldsIndex.value + 1;
};

const decrementView = () => {
  fieldsIndex.value = fieldsIndex.value < 1 ? 2 : fieldsIndex.value - 1;
};

// export default {
//   name: 'Chrome',
//   mixins: [colorMixin],
//   props: {
//     disableAlpha: {
//       type: Boolean,
//       default: false
//     },
//     disableFields: {
//       type: Boolean,
//       default: false
//     }
//   },
//   components: {
//     saturation,
//     hue,
//     alpha,
//     'EditableInput': editableInput,
//     checkboard
//   },
//   data () {
//     return {
//       fieldsIndex: 0,
//       highlight: false
//     };
//   },
//   computed: {
//     hsl () {
//       const { h, s, l } = this.colors.hsl;
//       return {
//         h: h.toFixed(),
//         s: `${(s * 100).toFixed()}%`,
//         l: `${(l * 100).toFixed()}%`
//       };
//     },
//     activeColor () {
//       const rgba = this.colors.rgba;
//       return 'rgba(' + [rgba.r, rgba.g, rgba.b, rgba.a].join(',') + ')';
//     },
//     hasAlpha () {
//       return this.colors.a < 1;
//     }
//   },
//   methods: {
//     childChange (data) {
//       this.colorChange(data);
//     },
//     inputChange (data) {
//       if (!data) {
//         return;
//       }
//       if (data.hex) {
//         this.isValidHex(data.hex) && this.colorChange({
//           hex: data.hex,
//           source: 'hex'
//         });
//       } else if (data.r || data.g || data.b || data.a) {
//         this.colorChange({
//           r: data.r || this.colors.rgba.r,
//           g: data.g || this.colors.rgba.g,
//           b: data.b || this.colors.rgba.b,
//           a: data.a || this.colors.rgba.a,
//           source: 'rgba'
//         });
//       } else if (data.h || data.s || data.l) {
//         const s = data.s ? (data.s.replace('%', '') / 100) : this.colors.hsl.s;
//         const l = data.l ? (data.l.replace('%', '') / 100) : this.colors.hsl.l;

//         this.colorChange({
//           h: data.h || this.colors.hsl.h,
//           s,
//           l,
//           source: 'hsl'
//         });
//       }
//     },
//     toggleViews () {
//       if (this.fieldsIndex >= 2) {
//         this.fieldsIndex = 0;
//         return;
//       }
//       this.fieldsIndex++;
//     },
//     showHighlight () {
//       this.highlight = true;
//     },
//     hideHighlight () {
//       this.highlight = false;
//     }
//   }
// };
</script>

<style lang="css">
.vc-chrome {
  /* background: #fff; */
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3);
  box-sizing: initial;
  width: 225px;
  font-family: Menlo;
  /* background-color: #fff; */
}
.vc-chrome-controls {
  display: flex;
}
.vc-chrome-color-wrap {
  position: relative;
  width: 36px;
}
.vc-chrome-active-color {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  z-index: 1;
}
.vc-chrome-color-wrap .vc-checkerboard {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-size: auto;
}
.vc-chrome-sliders {
  flex: 1;
}
.vc-chrome-fields-wrap {
  display: flex;
  padding-top: 16px;
}
.vc-chrome-fields {
  display: flex;
  margin-left: -6px;
  flex: 1;
}
.vc-chrome-field {
  padding-left: 6px;
  width: 100%;
}
.vc-chrome-toggle-btn {
  width: 32px;
  text-align: right;
  position: relative;
}
.vc-chrome-toggle-icon {
  margin-right: -4px;
  margin-top: 12px;
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.vc-chrome-toggle-icon-highlight {
  position: absolute;
  width: 24px;
  height: 28px;
  /* background: #eee; */
  border-radius: 4px;
  top: 10px;
  left: 12px;
}
.vc-chrome-hue-wrap {
  position: relative;
  height: 10px;
  margin-bottom: 8px;
  background: var(--vc-hue-gradient-horizontal, white);
}
.vc-chrome-alpha-wrap {
  position: relative;
  height: 10px;
  background: var(--vc-alpha-gradient, white);
}
.vc-chrome-hue-wrap .vc-hue {
  border-radius: 2px;
}
.vc-chrome-alpha-wrap .vc-alpha-gradient {
  border-radius: 2px;
}
.vc-chrome-hue-wrap .vc-hue-picker, .vc-chrome-alpha-wrap .vc-alpha-picker {
  width: 12px;
  height: 12px;
  border-radius: 6px;
  transform: translate(-6px, -2px);
  background-color: rgb(248, 248, 248);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.37);
}
.vc-chrome-body {
  padding: 16px 16px 12px;
  /* background-color: #fff; */
}
.vc-chrome-saturation-wrap {
  width: 100%;
  padding-bottom: 55%;
  position: relative;
  border-radius: 2px 2px 0 0;
  overflow: hidden;
}
.vc-chrome-saturation-wrap .vc-saturation-circle {
  width: 12px;
  height: 12px;
}

.vc-chrome-fields .vc-input__input {
  font-size: 11px;
  color: #333;
  width: 100%;
  border-radius: 2px;
  border: none;
  box-shadow: inset 0 0 0 1px #dadada;
  height: 21px;
  text-align: center;
}
.vc-chrome-fields .vc-input__label {
  text-transform: uppercase;
  font-size: 11px;
  line-height: 11px;
  color: #969696;
  text-align: center;
  display: block;
  margin-top: 12px;
}

.vc-chrome__disable-alpha .vc-chrome-active-color {
  width: 18px;
  height: 18px;
}
.vc-chrome__disable-alpha .vc-chrome-color-wrap {
  width: 30px;
}
.vc-chrome__disable-alpha .vc-chrome-hue-wrap {
  margin-top: 4px;
  margin-bottom: 4px;
}
</style>

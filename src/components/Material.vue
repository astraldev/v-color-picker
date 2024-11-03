<template>
  <div
    role="application"
    aria-label="Material color picker"
    class="vc-material"
  >
    <EditableInput
      v-if="!hideHexInput"
      v-model="hex"
      label="#"
      type="hex"
      :spellcheck="false"
    />
    <span
      class="line"
      :class="{ 'h-10': hideHexInput, 'h-[4px]': !hideHexInput }"
      :style="{ backgroundColor: `#${hex}` }"
    />
    <div class="vc-material-split">
      <div class="vc-material-rgba">
        <EditableInput
          v-model="red"
          label="R"
          type="rgba"
        />
      </div>
      <div class="vc-material-rgba">
        <EditableInput
          v-model="green"
          label="G"
          type="rgba"
        />
      </div>
      <div class="vc-material-rgba">
        <EditableInput
          v-model="blue"
          label="B"
          type="rgba"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColorFormat } from '../composables/useColor';
import EditableInput from './common/EditableInput.vue';

const emit = defineEmits(["update:color"]);
const options = withDefaults(
  defineProps<{
    color: ColorFormat;
    hideHexInput?: boolean; 
  }>(),
  {
    color: () => "#fff",
    hideHexInput: false,
  }
);

const { color } = toRefs(options);
const { red, green, blue, hex } = useColor(
  color,
  newColor => emit("update:color", newColor),
);
</script>

<style lang="scss" scoped>
.vc-material {
  @apply flex flex-col rounded-md overflow-clip border-white/5 border w-min;

  .line {
    @apply flex w-full;
  }

  &-split {
    @apply inline-flex rounded overflow-clip flex-shrink-0;
  }

  :deep(.vc-editable-input-wrapper) {
    @apply rounded-none h-9;
  }
}
</style>

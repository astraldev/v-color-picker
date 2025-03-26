<template>
  <label
    class="vc-editable-input-wrapper"
    :class="wrapperClass"
  >
    <span
      v-if="label"
      class="vc-editable-input-label"
    >
      {{ label }}
    </span>
    <input
      :aria-labelledby="ariaId"
      class="vc-editable-input"
      v-model="inputValue"
      v-bind="{ ...inputSettings, ...$attrs }"
      @change="validate"
    >    
  </label>
</template>

<script lang="ts" setup>
import { InputHTMLAttributes } from 'vue';

const ariaId = useId();
type ColorInputs = "hex" | "hex3" | "hex8" | "hex4" | "hsla" | "rgba" | "none" | "hue";

defineOptions({ inheritAttrs: false });
const emit = defineEmits(["update:model-value"]);

const options = withDefaults(
  defineProps<{
    modelValue?: number | string | null;
    type?: ColorInputs;
    label?: string;
    wrapperClass?: string; 
  }>(),
  {
    modelValue: undefined,
    type: "none",
    label: undefined,
    wrapperClass: "",
  }
);

const { modelValue, type } = toRefs(options);

const inputValue = ref(modelValue.value);

const inputSettings = computed((): InputHTMLAttributes => {
  const defaults: InputHTMLAttributes = { type: typeof modelValue.value === "number" ? "number" : "text" };
  if (type.value === "hue") {
    return { ...defaults, max: 360, min: 0 };
  } else if (type.value === "hsla") {
    return { ...defaults, max: 100, min: 0, };
  } else if (type.value === "rgba") {
    return { ...defaults, min: 0, max: 255 };
  } else if (type.value in ["hex", "hex3", "hex4", "hex8"]) {
    return { ...defaults, type: "text" };
  } else return { ...defaults };
});

const parseResults = (value: string | number | undefined | null) => {
  if (value === undefined || value === null) return value;
  const intValue = parseInt(value.toString());
  
  if (Number.isNaN(intValue) && (type.value !== "none" && type.value !== "hex"))
    return modelValue.value;
  
  if (type.value === "hsla") return clamp(intValue, 0, 100);
  if (type.value === "rgba") return clamp(intValue, 0, 255);
  return value;
};

const validate = async (nv: Event) => {
  await nextTick();
  const value = (nv.target as HTMLInputElement | null)?.value;
  if (parseResults(value) !== inputValue.value) {
    inputValue.value = parseResults(value);
  }
};

watch(
  inputValue,
  (n, old) => {
    const res = parseResults(n);
    if (old === n) return;
    inputValue.value = res;
    if (res) {
      if (type.value === "hex" && !isValidHex(res.toString(), 6)) return;
      if (type.value === "hex3" && !isValidHex(res.toString(), 3)) return;
      if (type.value === "hex4" && !isValidHex(res.toString(), 4)) return;
      if (type.value === "hex8" && !isValidHex(res.toString(), 8)) return;
    }
    emit('update:model-value', res);
  },
);

watch(
  modelValue,
  (newValue) => {
    if (newValue != inputValue.value) {
      inputValue.value = parseResults(newValue);
    }
  },
  { immediate: true },
);

</script>

<style lang="scss" scoped>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button {
  appearance: none;
  margin: 0;
}

.vc-editable-input {
  @apply p-1 w-full min-w-[calc(4ex_+_8px)] h-full appearance-none bg-transparent;
  outline: none !important;
}

.vc-editable-input-label {
  @apply py-1 px-2 w-fit h-full bg-white/[0.035] grid place-items-center;
}

.vc-editable-input-wrapper {
  @apply inline-flex items-center w-fit rounded overflow-clip;
}
</style>

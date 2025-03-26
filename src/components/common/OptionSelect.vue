<template>
  <div
    class="v-option-selector"
    ref="container"
    @click="isVisible = true"
  >
    <slot>
      <span>{{ activeOption.label }}</span>
    </slot>
    <Transition name="fade-y">
      <ul
        v-if="isVisible"
        class="v-option-selector-list-wrapper"
      >
        <li
          v-for="option in options"
          :key="option.value"
          @click.stop="[$emit('update:active-option', option), closeSelector()]"
        >
          {{ option.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

type Option = {
  label: string;
  value: number | string;
}

const container = ref();
const isVisible = ref(false);

defineEmits(["update:active-option"]);

const props = defineProps<{
  activeOption: Option;
  options: Option[]
}>();

const { options, activeOption } = toRefs(props);

const closeSelector = () => {
  isVisible.value = false;
};

onClickOutside(container, closeSelector);

</script>

<style lang="scss" scoped>
.fade-y-enter,
.fade-y-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-y-enter-from {
  transform: translateY(10px);
}

.fade-y-enter-active,
.fade-y-leave-active {
  transition: opacity 0.25s, transform 0.3s;
}

.v-option-selector {
  @apply py-1 px-1 relative;

  &-list-wrapper {
    @apply absolute top-[105%] right-0 w-fit h-fit backdrop-blur-sm;
    @apply rounded border border-white/15;

    li {
      @apply py-1 px-3;
    }
  }
}
</style>
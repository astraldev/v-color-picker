<script setup lang="ts">
import Chrome from './components/Chrome.vue';
import PercentageSlider2d from './components/common/PercentageSlider2d.vue';

const color = ref("red");

const x = ref(50);
const y = ref(0);

</script>

<template>
  <div class="hue-test">
    {{ color }}
    <Chrome v-model:color="color" />

    <!-- <button @click="color = 'red'">
      Set to red
    </button>

    <button @click="color = 'pink'">
      Set to pink
    </button>

    <button @click="color = 'blue'">
      Set to blue
    </button> -->
  </div>
</template>

<style scoped>

.hue-test {
  position: relative;
  @apply flex items-center gap-5 flex-col;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

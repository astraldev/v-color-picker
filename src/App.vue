<script setup lang="ts">
import Chrome from './components/Chrome.vue';
import Checkboard from './components/common/Checkboard.vue';
import EditableInput from './components/common/EditableInput.vue';
import Compact from './components/Compact.vue';
import Material from './components/Material.vue';
import Slider from './components/Slider.vue';
import Twitter from './components/Twitter.vue';

const color = ref("red");
</script>

<template>
  <div class="hue-test">
    {{ color }}

    <Chrome v-model:color="color" />

    <button @click="color = 'red'">
      Set to red
    </button>

    <button @click="color = 'pink'">
      Set to pink
    </button>

    <button @click="color = 'blue'">
      Set to blue
    </button>
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

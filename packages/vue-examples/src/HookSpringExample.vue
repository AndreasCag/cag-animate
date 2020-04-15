<template>
  <div class="app" @mousemove="handleMouseMove">
    <div class="rectangle" :style="{ transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))` }"></div>
  </div>
</template>

<script>
import useSpring from './components/useSpring';
import { onMounted } from '@vue/composition-api';

export default {
  setup() {
    const { x, y, animate } = useSpring({
      x: 0,
      y: 0,
      animate: true,
    });

    const handleMouseMove = (event) => {
      x.value = event.x;
      y.value = event.y;
    }

    onMounted(() => {
      const handleKeyDown = (event) => {
        if (event.code === 'Space') {
          console.log('Disable animate')
          animate.value = !animate.value;
        }
      }

      window.addEventListener('keydown', handleKeyDown);
    });

    return {
      x,
      y,
      animate,
      handleMouseMove,
    };
  },
};
</script>

<style scoped>
.app {
  width: 100vw;
  height: 100vh;
}

.rectangle {
  width: 100px;
  height: 100px;
  background: green;
}
</style>

<style>
body {
  margin: 0;
}
</style>

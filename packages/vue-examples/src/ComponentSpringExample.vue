<template>
  <div class="app" @mousemove="mouseMoveHandler">
    <CagSpring :animationProps="{ x, y }" :animate="animate" v-slot="{ x: newX, y: newY }">
        <div class="rectangle" :style="{ transform: `translate(calc(${newX}px - 50%), calc(${newY}px - 50%))` }">
        </div>
    </CagSpring>
  </div>
</template>

<script>
import CagSpring from './components/CagSpring';

export default {
  components: {
    CagSpring,
  },

  data() {
    return {
      x: 0,
      y: 0,
      animate: true,
    };
  },

  methods: {
    mouseMoveHandler(event) {
      this.x = event.x;
      this.y = event.y;
    },
  },

  mounted() {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        this.animate = !this.animate;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
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

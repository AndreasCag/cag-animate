<template>
  <div id="app"
      @mousemove="mouseMoveHandler"
      >
    <img
      class="image"
      @mousedown="mouseDownHandler"
      @mouseup="mouseUpHandler"
      alt="Vue logo"
      src="./assets/logo.png"
      :style="imgStyles"
    >
  </div>
</template>

<script>
import { Spring } from '@cag-animate/core'

export default {
  name: 'App',

  data() {
    return {
      isDragging: false,
      initialX: null,
      initialY: null,
      left: 0,
      top: 0,
      dragPoints: [],
    };
  },

  computed: {
    imgStyles() {
      const { left, top } = this;

      if (!left || !top) {
        return null;
      }

      return {
        transform: `translate(${left}px, ${top}px)`
      };
    },
  },

  methods: {
    mouseDownHandler(event) {
      const { left, top, _leftSpring, _topSpring } = this;

      this.isDragging = true
      this.initialX = event.clientX - left;
      this.initialY = event.clientY - top;

      if (_leftSpring && _topSpring) {
        _leftSpring.stopAnimation();
        _topSpring.stopAnimation();
      }
    },

    mouseMoveHandler(event) {
      const { initialX, initialY, isDragging, dragPoints } = this;

      if (!isDragging) {
        return;
      }

      this.left = event.clientX - initialX;
      this.top = event.clientY - initialY;

      dragPoints.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: performance.now(),
      })
    },

    mouseUpHandler() {
      const { left, top, dragPoints } = this;

      const getSpeed = (points, field) => {
        let speedSum = 0;
        let dividerSum = 0;

        let slicedPoints = points.slice(-17);

        slicedPoints.forEach((point, idx) => {
          const prevPoint = slicedPoints[idx - 1];

          if (!prevPoint) {
            return;
          }

          // px/second
          const speed = (point[field] - prevPoint[field]) / ((point.timestamp - prevPoint.timestamp) / 1000) ;

          const alpha = 1 / ((slicedPoints.length - idx) ** 2);

          speedSum += speed * alpha;
          dividerSum += alpha;
        });

        return speedSum / dividerSum;
      };

      const leftSpeed = getSpeed(dragPoints, 'x');
      const topSpeed = getSpeed(dragPoints, 'y');

      const springConfig = {
        friction: 2,
        tension: 20,
        mass: 1,
        precision: 0.01,
      };

      // const springConfig = {
      //   friction: 10,
      //   tension: 270,
      //   mass: 1,
      //   precision: 0.01,
      // };

      const leftSpring = new Spring({
        ...springConfig,
        initialVelocity: leftSpeed,
      });
      const topSpring = new Spring({
        ...springConfig,
        initialVelocity: topSpeed,
      });

      leftSpring.startAnimation({
        from: left,
        to: 0,
        onUpdate: ({ value }) => {
          this.left = value;
        },
      });

      topSpring.startAnimation({
        from: top,
        to: 0,
        onUpdate: ({ value }) => {
          this.top = value;
        },
      });

      this._leftSpring = leftSpring;
      this._topSpring = topSpring;
      this.dragPoints = [];
      this.isDragging = false;
    },
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.image {
  -webkit-user-drag: none;
  cursor: pointer;
}
</style>

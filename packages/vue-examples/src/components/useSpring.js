// import { Spring } from '@cag-animate/core'
import { reactive, computed, ref, watch } from '@vue/composition-api';
import { Spring } from '@cag-animate/core';

export default (initialProps) => {
  const {
    animate: initialAnimate,
    ...restInitialProps
  } = initialProps;

  const actualProps = reactive(restInitialProps);

  const springs = {};
  const mirrorProps = {};

  Object.keys(initialProps).forEach(key => {
    mirrorProps[key] = computed({
      get: () => actualProps[key],
      set: val => {
        const _spring = springs[key];
        const actualValue = actualProps[key];

        if (!mirrorProps.animate.value) {
          actualProps[key] = val;

          return
        }

        let initialVelocity = 0;

        if (_spring && !_spring.isFinished) {
          _spring.animationConfig.to = val;

          return;
        }

        const spring = new Spring({
          friction: 10,
          tension: 170,
          mass: 1,
          precision: 0.01,
          initialVelocity,
        });

        spring.startAnimation({
          from: actualValue,
          to: val,
          onUpdate: ({ value }) => {
            actualProps[key] = value;
          },
        });

        springs[key] = spring;
      },
    });
  });

  mirrorProps.animate = ref(initialAnimate || true);

  watch(() => mirrorProps.animate.value, (val) => {
    if (!val) {
      Object.entries(springs).forEach(([key, spring]) => {
        spring.stopAnimation();
        actualProps[key] = spring.animationConfig.to;
      });
    }
  });

  return mirrorProps;
};

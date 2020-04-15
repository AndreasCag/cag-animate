import { Spring } from '@cag-animate/core'

const CagSpring = {
  props: {
    animationProps: {
      type: Object,
      required: true,
    },
    animate: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      actualAnimationProps: null,
    };
  },

  watch: {
    animationProps: {
      deep: true,

      handler(animationProps) {
        const { animate, actualAnimationProps, _springs } = this;

        if (!animate) {
          this.actualAnimationProps = animationProps;

          return;
        }

        Object.entries(animationProps).forEach((([key, value]) => {
          const _spring = _springs[key];
          const actualValue = actualAnimationProps[key];

          let initialVelocity = 0;

          if (_spring && !_spring.isFinished) {
            _spring.animationConfig.to = value;

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
            to: value,
            onUpdate: ({ value }) => {
              actualAnimationProps[key] = value;
            },
          });

          _springs[key] = spring;
        }));
      }
    },
    animate(val) {
      const { _springs } = this;

      if (!val) {
        Object.values(_springs).forEach((spring) => {
          spring.stopAnimation();
        })

        this.actualAnimationProps = this.animationProps;
      }
    },
  },

  created() {
    this.actualAnimationProps = this.animationProps;
    this._springs = {};
  },

  render() {
    const { $scopedSlots, actualAnimationProps } = this;

    return $scopedSlots.default(actualAnimationProps)[0];
  },
};

export default CagSpring;

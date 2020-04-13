type UpdatePayload = {
  value: number;
  isFinished?: boolean;
};

type SpringConfig = {
  // System values
  friction: number;
  tension: number;
  mass: number;
  precision: number;
  initialVelocity?: number;
};

type AnimationConfig = {
  from: number;
  to: number;
  onUpdate: (payload: UpdatePayload) => void;
};

const maxDiff = 64;

export class Spring {
  private springConfig: SpringConfig;
  private animationConfig?: AnimationConfig;

  private previousVelocity?: number;
  private previousValue?: number;
  private previousTimestamp?: number;
  private nextTick?: number;

  constructor(springConfig: SpringConfig) {
    this.springConfig = springConfig;
  }

  public startAnimation(animationConfig: AnimationConfig) {
    this.animationConfig = animationConfig;

    const doAnimation = () => {
      const isFinished = this.tick();

      if (isFinished) {
        return;
      }

      this.nextTick = window.requestAnimationFrame(doAnimation);
    };

    doAnimation();
  }

  public stopAnimation() {
    const { nextTick } = this;

    if (nextTick) {
      window.cancelAnimationFrame(nextTick);
    }
  }

  private tick() {
    const { previousTimestamp, previousVelocity, springConfig, animationConfig, previousValue } = this;

    const currentTimestamp = performance.now();
    const diff = currentTimestamp - (previousTimestamp || currentTimestamp);
    const normalizedDiff = Math.min(diff, maxDiff);

    let safeVelocity = previousVelocity || springConfig.initialVelocity || 0;
    let safeValue = previousValue || animationConfig!.from;

    for (let i = 0; i < normalizedDiff; i++) {
      const springRestoringForce = -1 * springConfig.tension * (safeValue - animationConfig!.to);
      const dampingForce = -1 * safeVelocity * springConfig.friction;
      const acceleration = (springRestoringForce + dampingForce) / springConfig.mass;

      const currentVelocity = safeVelocity + acceleration / 1000;
      const currentValue  = safeValue + currentVelocity / 1000;

      safeVelocity = currentVelocity
      safeValue = currentValue;
    }

    const isFinished = Math.abs(safeVelocity) < springConfig.precision && Math.abs(safeValue - animationConfig!.to) < springConfig.precision;

    animationConfig!.onUpdate.apply(undefined, [{
      value: safeValue,
      isFinished,
    }]);

    this.previousTimestamp = currentTimestamp;
    this.previousValue = safeValue;
    this.previousVelocity = safeVelocity;

    return isFinished;
  }
}

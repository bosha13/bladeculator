(() => {
  const TOGGLE_MIN = 16;
  const TOGGLE_MAX = 184;
  const PWM_CYCLE = 20;

  const impactPatterns = {
    selection: [{ duration: 8, intensity: 0.3 }],
    soft: [{ duration: 40, intensity: 0.5 }],
    heavy: [{ duration: 35, intensity: 1 }]
  };

  let hapticLabel = null;
  let rafId = null;

  const canVibrate = () => (
    typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
  );

  const supportsSwitchHaptics = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }
    if (typeof window.matchMedia !== 'function') {
      return false;
    }
    return window.matchMedia('(pointer: coarse)').matches;
  };

  const modulateVibration = (duration, intensity) => {
    if (intensity >= 1) return [duration];
    if (intensity <= 0) return [];

    const onTime = Math.max(1, Math.round(PWM_CYCLE * intensity));
    const offTime = PWM_CYCLE - onTime;
    const result = [];
    let remaining = duration;

    while (remaining >= PWM_CYCLE) {
      result.push(onTime, offTime);
      remaining -= PWM_CYCLE;
    }

    if (remaining > 0) {
      const remOn = Math.max(1, Math.round(remaining * intensity));
      result.push(remOn);
      const remOff = remaining - remOn;
      if (remOff > 0) {
        result.push(remOff);
      }
    }

    return result;
  };

  const toVibratePattern = (vibrations, defaultIntensity = 0.5) => {
    const result = [];

    vibrations.forEach((vibration) => {
      const intensity = Math.max(
        0,
        Math.min(1, vibration.intensity ?? defaultIntensity)
      );
      const delay = vibration.delay ?? 0;

      if (delay > 0) {
        if (result.length > 0 && result.length % 2 === 0) {
          result[result.length - 1] += delay;
        } else {
          if (result.length === 0) result.push(0);
          result.push(delay);
        }
      }

      const modulated = modulateVibration(vibration.duration, intensity);
      modulated.forEach((segment) => result.push(segment));
    });

    return result;
  };

  const ensureDOM = () => {
    if (hapticLabel || typeof document === 'undefined') return;

    hapticLabel = document.createElement('label');
    hapticLabel.style.display = 'none';
    hapticLabel.ariaHidden = 'true';

    const hapticCheckbox = document.createElement('input');
    hapticCheckbox.type = 'checkbox';
    hapticCheckbox.setAttribute('switch', '');
    hapticLabel.appendChild(hapticCheckbox);

    document.body.appendChild(hapticLabel);
  };

  const stopPattern = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const runSwitchPattern = (vibrations, defaultIntensity = 0.5, firstClickFired = false) => {
    stopPattern();

    const phases = [];
    let cumulative = 0;

    vibrations.forEach((vibration) => {
      const intensity = Math.max(
        0,
        Math.min(1, vibration.intensity ?? defaultIntensity)
      );
      const delay = vibration.delay ?? 0;

      if (delay > 0) {
        cumulative += delay;
        phases.push({ end: cumulative, isOn: false, intensity: 0 });
      }

      cumulative += vibration.duration;
      phases.push({ end: cumulative, isOn: true, intensity });
    });

    const totalDuration = cumulative;
    let startTime = 0;
    let lastToggleTime = -1;

    const loop = (time) => {
      if (startTime === 0) startTime = time;
      const elapsed = time - startTime;

      if (elapsed >= totalDuration) {
        rafId = null;
        return;
      }

      let phase = phases[0];
      for (const currentPhase of phases) {
        if (elapsed < currentPhase.end) {
          phase = currentPhase;
          break;
        }
      }

      if (phase && phase.isOn) {
        const toggleInterval = TOGGLE_MIN + (1 - phase.intensity) * TOGGLE_MAX;

        if (lastToggleTime === -1) {
          lastToggleTime = time;
          if (!firstClickFired) {
            hapticLabel.click();
            firstClickFired = true;
          }
        } else if (time - lastToggleTime >= toggleInterval) {
          hapticLabel.click();
          lastToggleTime = time;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
  };

  const triggerPattern = (name) => {
    const vibrations = impactPatterns[name];
    if (!vibrations || vibrations.length === 0) {
      return false;
    }

    if (canVibrate()) {
      return navigator.vibrate(toVibratePattern(vibrations));
    }

    if (!supportsSwitchHaptics()) {
      return false;
    }

    ensureDOM();
    if (!hapticLabel) {
      return false;
    }

    const firstDelay = vibrations[0].delay ?? 0;
    const firstClickFired = firstDelay === 0;

    if (firstClickFired) {
      hapticLabel.click();
    }

    runSwitchPattern(vibrations, 0.5, firstClickFired);
    return true;
  };

  window.appHaptics = {
    selection() {
      return Promise.resolve(triggerPattern('selection'));
    },
    soft() {
      return Promise.resolve(triggerPattern('soft'));
    },
    heavy() {
      return Promise.resolve(triggerPattern('heavy'));
    }
  };
})();

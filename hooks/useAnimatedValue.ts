import { useState, useEffect, useRef } from 'react';

type EasingFunction = (t: number) => number;

const easings: Record<string, EasingFunction> = {
  linear: (t: number) => t,
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => t * t * t,
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

interface UseAnimatedValueOptions {
  duration?: number;
  easing?: keyof typeof easings | EasingFunction;
  delay?: number;
  decimals?: number;
}

interface UseAnimatedValueReturn {
  value: number;
  displayValue: string;
  isAnimating: boolean;
}

export function useAnimatedValue(
  targetValue: number,
  options: UseAnimatedValueOptions = {}
): UseAnimatedValueReturn {
  const {
    duration = 500,
    easing = 'easeOut',
    delay = 0,
    decimals = 0,
  } = options;

  const [currentValue, setCurrentValue] = useState(targetValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startValueRef = useRef(targetValue);
  const startTimeRef = useRef<number | null>(null);

  const easingFn = typeof easing === 'function' ? easing : easings[easing] || easings.easeOut;

  useEffect(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = currentValue;
    startValueRef.current = startValue;
    startTimeRef.current = null;

    // If values are the same, no animation needed
    if (startValue === targetValue) {
      return;
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp + delay;
      }

      const elapsed = timestamp - startTimeRef.current;

      if (elapsed < 0) {
        // Still in delay period
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      setIsAnimating(true);
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const newValue = startValueRef.current + (targetValue - startValueRef.current) * easedProgress;

      setCurrentValue(newValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, delay, easingFn]);

  const displayValue = decimals > 0 
    ? currentValue.toFixed(decimals) 
    : Math.round(currentValue).toString();

  return {
    value: currentValue,
    displayValue,
    isAnimating,
  };
}

// Utility hook for animating formatted currency values
export function useAnimatedCurrency(
  targetValue: number,
  options: UseAnimatedValueOptions & { locale?: string; currency?: string } = {}
): UseAnimatedValueReturn & { formattedValue: string } {
  const { locale = 'en-IN', currency = 'INR', ...animationOptions } = options;
  const { value, displayValue, isAnimating } = useAnimatedValue(targetValue, animationOptions);

  const formattedValue = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value));

  return {
    value,
    displayValue,
    isAnimating,
    formattedValue,
  };
}

// Utility hook for animating percentage values
export function useAnimatedPercentage(
  targetValue: number,
  options: UseAnimatedValueOptions = {}
): UseAnimatedValueReturn & { formattedValue: string } {
  const { value, displayValue, isAnimating } = useAnimatedValue(targetValue, {
    decimals: 1,
    ...options,
  });

  const formattedValue = `${value.toFixed(1)}%`;

  return {
    value,
    displayValue,
    isAnimating,
    formattedValue,
  };
}

export default useAnimatedValue;

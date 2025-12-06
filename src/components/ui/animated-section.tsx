import React from 'react';
import { cn } from '@/lib/utils';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in';
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
  });

  const getAnimationClass = () => {
    const baseClass = 'transition-all duration-700 ease-out';
    const delayClass = `delay-${delay}`;

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return `${baseClass} ${delayClass} opacity-0 translate-y-8`;
        case 'fade-in':
          return `${baseClass} ${delayClass} opacity-0`;
        case 'slide-up':
          return `${baseClass} ${delayClass} opacity-0 translate-y-12`;
        case 'slide-left':
          return `${baseClass} ${delayClass} opacity-0 -translate-x-12`;
        case 'slide-right':
          return `${baseClass} ${delayClass} opacity-0 translate-x-12`;
        case 'scale-in':
          return `${baseClass} ${delayClass} opacity-0 scale-95`;
        default:
          return `${baseClass} ${delayClass} opacity-0 translate-y-8`;
      }
    }

    return `${baseClass} ${delayClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
  };

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn(getAnimationClass(), className)}
    >
      {children}
    </div>
  );
};

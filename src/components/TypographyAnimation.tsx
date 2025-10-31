import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TypographyAnimationProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'reveal' | 'typewriter' | 'fade' | 'slide';
}

export const TypographyAnimation = ({
  text,
  className = '',
  delay = 0,
  duration = 1,
  type = 'reveal'
}: TypographyAnimationProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (type === 'typewriter') {
      const timer = setTimeout(() => {
        let i = 0;
        const interval = setInterval(() => {
          setDisplayText(text.slice(0, i + 1));
          i++;
          if (i >= text.length) {
            clearInterval(interval);
            setIsComplete(true);
          }
        }, duration * 1000 / text.length);
        return () => clearInterval(interval);
      }, delay * 1000);
      return () => clearTimeout(timer);
    } else {
      setDisplayText(text);
      setIsComplete(true);
    }
  }, [text, delay, duration, type]);

  const getAnimationVariants = () => {
    switch (type) {
      case 'reveal':
        return {
          hidden: { opacity: 0, y: 20, rotateX: 90 },
          visible: { opacity: 1, y: 0, rotateX: 0 }
        };
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      case 'slide':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      className={`inline-block ${className}`}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {type === 'typewriter' ? (
        <span className="relative">
          {displayText}
          {!isComplete && <span className="animate-blink border-r-2 border-current ml-1"></span>}
        </span>
      ) : (
        text
      )}
    </motion.div>
  );
};

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

export const TextReveal = ({ children, className = '', stagger = 0.1 }: TextRevealProps) => {
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');

  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * stagger,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ARVRGraphics = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-96 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl">
      {/* 3D Rotating Cube */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        animate={{
          rotateX: mousePosition.y,
          rotateY: mousePosition.x
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="absolute w-full h-full border-2 border-primary/30 bg-primary/10 animate-ar-vr-rotate"
             style={{
               transform: 'translateZ(50px)',
               backfaceVisibility: 'hidden'
             }}>
        </div>
        <div className="absolute w-full h-full border-2 border-accent/30 bg-accent/10 animate-ar-vr-rotate"
             style={{
               transform: 'rotateY(90deg) translateZ(50px)',
               backfaceVisibility: 'hidden'
             }}>
        </div>
        <div className="absolute w-full h-full border-2 border-secondary/30 bg-secondary/10 animate-ar-vr-rotate"
             style={{
               transform: 'rotateX(90deg) translateZ(50px)',
               backfaceVisibility: 'hidden'
             }}>
        </div>
      </motion.div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-primary/20 rounded-full animate-collaborative-pulse"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 3) * 20}%`
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}

      {/* Morphing Blob */}
      <motion.div
        className="absolute bottom-10 right-10 w-24 h-24 bg-accent/20 animate-morph-blob"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* AR/VR Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h3
            className="text-2xl font-bold text-primary mb-2"
            animate={{
              textShadow: [
                '0 0 0px rgba(59, 130, 246, 0)',
                '0 0 20px rgba(59, 130, 246, 0.5)',
                '0 0 0px rgba(59, 130, 246, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AR/VR Motion Graphics
          </motion.h3>
          <motion.p
            className="text-muted-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Interactive 3D Simulations
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export const CollaborativeAnimation = () => {
  const [activeUsers, setActiveUsers] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => (prev + Math.floor(Math.random() * 3) - 1 + 5) % 8 + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {[...Array(activeUsers)].map((_, i) => (
        <motion.div
          key={i}
          className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          {String.fromCharCode(65 + i)}
        </motion.div>
      ))}
      <motion.span
        className="text-sm text-muted-foreground ml-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {activeUsers} users collaborating
      </motion.span>
    </div>
  );
};

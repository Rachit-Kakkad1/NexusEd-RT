import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * TiltCard — Premium 3D tilt card with mouse-tracking perspective,
 * animated gradient border glow, and light sweep on hover.
 * Uses pure Framer Motion + CSS, zero dependencies beyond React.
 */
export default function TiltCard({ children, className = '', style = {} }) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
    const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    function handleMouseMove(e) {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt: max ±12 degrees
        const rotateY = ((x - centerX) / centerX) * 12;
        const rotateX = ((centerY - y) / centerY) * 12;

        setTilt({ rotateX, rotateY });
        setGlowPos({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
        });
    }

    function handleMouseEnter() {
        setIsHovered(true);
    }

    function handleMouseLeave() {
        setIsHovered(false);
        setTilt({ rotateX: 0, rotateY: 0 });
        setGlowPos({ x: 50, y: 50 });
    }

    return (
        <motion.div
            ref={cardRef}
            className={`tilt-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            animate={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                scale: isHovered ? 1.03 : 1,
            }}
            transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                mass: 0.5,
            }}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                ...style,
            }}
        >
            {/* Gradient border glow follows cursor */}
            <div
                className="tilt-card__glow"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(
            circle at ${glowPos.x}% ${glowPos.y}%,
            rgba(124, 58, 237, 0.4),
            rgba(6, 182, 212, 0.2) 40%,
            transparent 70%
          )`,
                }}
            />

            {/* Light sweep */}
            <div
                className="tilt-card__shine"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(
            circle at ${glowPos.x}% ${glowPos.y}%,
            rgba(255, 255, 255, 0.06),
            transparent 50%
          )`,
                }}
            />

            {/* Content */}
            <div className="tilt-card__content" style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>
        </motion.div>
    );
}

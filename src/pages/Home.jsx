import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedLayout from '../components/AnimatedLayout';
import TiltCard from '../components/TiltCard';
import { HiAcademicCap, HiUserGroup, HiPlusCircle, HiChartBar, HiServer } from 'react-icons/hi2';
import { FiTrendingUp, FiInbox } from 'react-icons/fi';

/* ---- Animation Variants ---- */
const container = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const charVariant = {
    hidden: { opacity: 0, y: 40, rotateX: 90 },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
};

const featureStagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12, delayChildren: 1.2 },
    },
};

const featureItem = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
};

/* ---- Animated Text Component ---- */
function AnimatedText({ text, className, delay = 0 }) {
    return (
        <motion.span
            className={className}
            style={{ display: 'inline-flex', flexWrap: 'wrap', perspective: '600px' }}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: { staggerChildren: 0.03, delayChildren: delay },
                },
            }}
        >
            {text.split('').map((char, i) => (
                <motion.span
                    key={`${char}-${i}`}
                    variants={charVariant}
                    style={{
                        display: 'inline-block',
                        whiteSpace: char === ' ' ? 'pre' : 'normal',
                        transformOrigin: 'bottom center',
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </motion.span>
    );
}

/* ---- Animated Counter Component ---- */
function AnimatedNumber({ value, delay = 0 }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (value === 0) return;
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        const timer = setTimeout(() => {
            requestAnimationFrame(tick);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return <>{display}</>;
}

/* ---- Features Data ---- */
const features = [
    {
        icon: <HiUserGroup size={24} />,
        colorClass: 'feature-card__icon--purple',
        title: 'Student Directory',
        desc: 'Browse external student records fetched from a live API.',
    },
    {
        icon: <HiPlusCircle size={24} />,
        colorClass: 'feature-card__icon--cyan',
        title: 'Add Students',
        desc: 'Register new students with validated forms and instant feedback.',
    },
    {
        icon: <HiChartBar size={24} />,
        colorClass: 'feature-card__icon--pink',
        title: 'Counter Tool',
        desc: 'Interactive counter with state logic and visual feedback.',
    },
    {
        icon: <HiServer size={24} />,
        colorClass: 'feature-card__icon--green',
        title: 'Persistent Storage',
        desc: 'Student data saved locally — available across sessions.',
    },
];

/* ---- Home Page ---- */
export default function Home() {
    const [studentCount, setStudentCount] = useState(0);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('students');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setStudentCount(parsed.length);
                }
            }
        } catch {
            setStudentCount(0);
        }
    }, []);

    return (
        <AnimatedLayout>
            <div className="page">
                <div className="container">
                    <motion.section
                        className="hero"
                        initial="hidden"
                        animate="visible"
                        variants={container}
                    >
                        {/* Animated Badge */}
                        <motion.div variants={fadeUp}>
                            <motion.span
                                className="hero__badge"
                                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="hero__badge-dot" />
                                Welcome to NexusEd
                            </motion.span>
                        </motion.div>

                        {/* Character-by-Character Title Reveal */}
                        <h1 className="hero__title">
                            <span className="hero__title-line">
                                <AnimatedText text="Your Smart" className="hero__title-white" delay={0.3} />
                            </span>
                            <span className="hero__title-line">
                                <AnimatedText text="Student Portal" className="hero__title-gradient" delay={0.65} />
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <motion.p className="hero__subtitle" variants={fadeUp}>
                            Manage students, explore records, and keep your data organized —
                            powered by modern React with stunning animations.
                        </motion.p>

                        {/* Stats / Empty State */}
                        <motion.div variants={scaleUp}>
                            {studentCount > 0 ? (
                                <div className="hero__stats">
                                    <motion.div
                                        className="hero__stat-card"
                                        whileHover={{
                                            y: -6,
                                            boxShadow: '0 0 50px rgba(124,58,237,0.25)',
                                            borderColor: 'rgba(124,58,237,0.3)',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="hero__stat-icon">
                                            <HiAcademicCap size={28} />
                                        </div>
                                        <div>
                                            <div className="hero__stat-number">
                                                <AnimatedNumber value={studentCount} delay={800} />
                                            </div>
                                            <div className="hero__stat-label">
                                                Student{studentCount !== 1 ? 's' : ''} Registered
                                            </div>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        className="hero__stat-card"
                                        whileHover={{
                                            y: -6,
                                            boxShadow: '0 0 50px rgba(6,182,212,0.25)',
                                            borderColor: 'rgba(6,182,212,0.3)',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="hero__stat-icon">
                                            <FiTrendingUp size={28} />
                                        </div>
                                        <div>
                                            <div className="hero__stat-number">
                                                <AnimatedNumber value={4} delay={1000} />
                                            </div>
                                            <div className="hero__stat-label">Portal Modules</div>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <motion.div
                                    className="hero__empty"
                                    whileHover={{
                                        borderColor: 'rgba(124,58,237,0.4)',
                                        boxShadow: '0 0 30px rgba(124,58,237,0.1)',
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="hero__empty-icon">
                                        <FiInbox size={48} />
                                    </span>
                                    No students added yet.
                                </motion.div>
                            )}
                        </motion.div>

                        {/* CTA Button */}
                        {studentCount === 0 && (
                            <motion.div variants={fadeUp}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{ display: 'inline-block' }}
                                >
                                    <Link to="/add" className="cta-button">
                                        <span>Add Your First Student</span>
                                        <motion.span
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        >
                                            →
                                        </motion.span>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.section>

                    {/* Feature Cards — 3D Tilt */}
                    <motion.div
                        className="features"
                        initial="hidden"
                        animate="visible"
                        variants={featureStagger}
                    >
                        {features.map((feat) => (
                            <motion.div key={feat.title} variants={featureItem}>
                                <TiltCard className="feature-card">
                                    <div className={`feature-card__icon ${feat.colorClass}`}>
                                        {feat.icon}
                                    </div>
                                    <h3 className="feature-card__title">{feat.title}</h3>
                                    <p className="feature-card__desc">{feat.desc}</p>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </AnimatedLayout>
    );
}

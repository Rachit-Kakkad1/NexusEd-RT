import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLayout from '../components/AnimatedLayout';
import { FiMinus, FiPlus, FiRotateCcw } from 'react-icons/fi';

function getStoredCount() {
    try {
        const stored = localStorage.getItem('counter');
        if (stored !== null) {
            const num = parseInt(stored, 10);
            return Number.isFinite(num) && num >= 0 ? num : 0;
        }
    } catch {
        /* ignore */
    }
    return 0;
}

export default function Counter() {
    const [count, setCount] = useState(getStoredCount);

    useEffect(() => {
        try {
            localStorage.setItem('counter', String(count));
        } catch {
            /* storage full */
        }
    }, [count]);

    function increment() {
        setCount((prev) => prev + 1);
    }

    function decrement() {
        setCount((prev) => Math.max(0, prev - 1));
    }

    function reset() {
        setCount(0);
    }

    const isZero = count === 0;

    return (
        <AnimatedLayout>
            <div className="page">
                <div className="container">
                    <motion.header
                        className="page-header"
                        style={{ textAlign: 'center' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <h1 className="page-header__title">Counter</h1>
                        <p className="page-header__subtitle">
                            Interactive counter with state management & smooth animations
                        </p>
                    </motion.header>

                    <motion.section
                        className="counter"
                        aria-label="Counter"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                    >
                        <div className="counter__card">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={count}
                                    className={`counter__display ${isZero ? 'counter__display--zero' : 'counter__display--positive'
                                        }`}
                                    initial={{ opacity: 0, scale: 0.5, y: -20, rotateX: 45 }}
                                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                                    exit={{ opacity: 0, scale: 0.5, y: 20, rotateX: -45 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {count}
                                </motion.div>
                            </AnimatePresence>

                            <div className="counter__buttons">
                                <motion.button
                                    type="button"
                                    className="counter__btn counter__btn--decrement"
                                    onClick={decrement}
                                    disabled={isZero}
                                    aria-label="Decrement counter"
                                    whileHover={!isZero ? { y: -3, boxShadow: '0 0 40px rgba(244,63,94,0.3)' } : {}}
                                    whileTap={!isZero ? { scale: 0.92 } : {}}
                                >
                                    <FiMinus size={16} /> Decrement
                                </motion.button>

                                <motion.button
                                    type="button"
                                    className="counter__btn counter__btn--reset"
                                    onClick={reset}
                                    aria-label="Reset counter to zero"
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.92 }}
                                >
                                    <FiRotateCcw size={16} /> Reset
                                </motion.button>

                                <motion.button
                                    type="button"
                                    className="counter__btn counter__btn--increment"
                                    onClick={increment}
                                    aria-label="Increment counter"
                                    whileHover={{ y: -3, boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}
                                    whileTap={{ scale: 0.92 }}
                                >
                                    <FiPlus size={16} /> Increment
                                </motion.button>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>
        </AnimatedLayout>
    );
}

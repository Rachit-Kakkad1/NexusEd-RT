import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedLayout from '../components/AnimatedLayout';
import TiltCard from '../components/TiltCard';
import { HiEnvelope, HiPhone } from 'react-icons/hi2';
import { FiAlertTriangle } from 'react-icons/fi';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

function SkeletonCard() {
    return (
        <div className="skeleton-card" aria-hidden="true">
            <div className="skeleton-line skeleton-line--circle" />
            <div className="skeleton-line" style={{ width: '70%' }} />
            <div className="skeleton-line skeleton-line--short" />
            <div className="skeleton-line skeleton-line--short" />
        </div>
    );
}

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};

export default function Students() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchUsers() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(API_URL, { signal: controller.signal });

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();
                setUsers(data.slice(0, 6));
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Failed to fetch students.');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
        return () => controller.abort();
    }, []);

    function getInitials(name) {
        return name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    return (
        <AnimatedLayout>
            <div className="page">
                <div className="container">
                    <motion.header
                        className="page-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <h1 className="page-header__title">Students Directory</h1>
                        <p className="page-header__subtitle">
                            Fetched from the JSONPlaceholder API — first 6 records
                        </p>
                    </motion.header>

                    {/* Loading State */}
                    {loading && (
                        <div className="skeleton-grid" role="status" aria-label="Loading students">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <motion.div
                            className="error-state"
                            role="alert"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="error-state__icon">
                                <FiAlertTriangle size={48} />
                            </div>
                            <h2 className="error-state__title">Something went wrong</h2>
                            <p className="error-state__message">{error}</p>
                        </motion.div>
                    )}

                    {/* Success State */}
                    {!loading && !error && (
                        <div className="card-grid">
                            {users.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    custom={index}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <TiltCard className="card">
                                        <div className="card__avatar" aria-hidden="true">
                                            {getInitials(user.name)}
                                        </div>
                                        <h2 className="card__name">{user.name}</h2>
                                        <div className="card__info">
                                            <div className="card__info-row">
                                                <span className="card__info-icon" aria-hidden="true">
                                                    <HiEnvelope size={16} />
                                                </span>
                                                <span>{user.email}</span>
                                            </div>
                                            <div className="card__info-row">
                                                <span className="card__info-icon" aria-hidden="true">
                                                    <HiPhone size={16} />
                                                </span>
                                                <span>{user.phone}</span>
                                            </div>
                                        </div>
                                    </TiltCard>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AnimatedLayout>
    );
}

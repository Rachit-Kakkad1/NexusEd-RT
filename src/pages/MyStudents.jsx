import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedLayout from '../components/AnimatedLayout';
import TiltCard from '../components/TiltCard';
import ToastContainer, { useToast } from '../components/Toast';
import { FiTrash2, FiEdit3, FiSearch, FiUserPlus, FiInbox } from 'react-icons/fi';
import { HiEnvelope, HiPhone } from 'react-icons/hi2';

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
    }),
    exit: { opacity: 0, scale: 0.9, x: 40, transition: { duration: 0.25 } },
};

export default function MyStudents() {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { toasts, addToast, removeToast } = useToast();

    // Re-read from localStorage on mount (safety pattern)
    useEffect(() => {
        try {
            const stored = localStorage.getItem('students');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) setStudents(parsed);
            }
        } catch {
            setStudents([]);
        }
    }, []);

    function handleDelete(id) {
        const student = students.find((s) => s.id === id);
        const updated = students.filter((s) => s.id !== id);
        try {
            localStorage.setItem('students', JSON.stringify(updated));
        } catch {
            /* ignore */
        }
        setStudents(updated);
        addToast(`${student?.name || 'Student'} removed.`, 'info');
    }

    // Derived filtered list — never mutates original
    const filteredStudents = searchQuery.trim()
        ? students.filter((s) =>
            s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        )
        : students;

    function getInitial(name) {
        return name ? name.charAt(0).toUpperCase() : '?';
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
                        <h1 className="page-header__title">My Students</h1>
                        <p className="page-header__subtitle">
                            Students you've added — stored locally on your device
                        </p>
                    </motion.header>

                    {students.length > 0 && (
                        <motion.div
                            className="search-bar"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                        >
                            <FiSearch className="search-bar__icon" size={18} />
                            <input
                                type="text"
                                className="search-bar__input"
                                placeholder="Search your students by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search your students by name"
                            />
                        </motion.div>
                    )}

                    {students.length === 0 ? (
                        <motion.div
                            className="my-students-empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <FiInbox size={56} />
                            <h2>No students added yet</h2>
                            <p>Start by adding your first student.</p>
                            <Link to="/add" className="cta-button" style={{ marginTop: '1.5rem' }}>
                                <FiUserPlus size={16} /> Add Student
                            </Link>
                        </motion.div>
                    ) : filteredStudents.length === 0 ? (
                        <motion.div
                            className="empty-search"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <FiSearch size={40} />
                            <p>No students match "{searchQuery}"</p>
                        </motion.div>
                    ) : (
                        <div className="card-grid">
                            <AnimatePresence>
                                {filteredStudents.map((student, index) => (
                                    <motion.div
                                        key={student.id}
                                        custom={index}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                    >
                                        <TiltCard className="card my-student-card">
                                            <div className="card__avatar" aria-hidden="true">
                                                {getInitial(student.name)}
                                            </div>
                                            <h2 className="card__name">{student.name}</h2>
                                            <span className="my-student-card__gender">{student.gender}</span>
                                            <div className="card__info">
                                                <div className="card__info-row">
                                                    <span className="card__info-icon" aria-hidden="true">
                                                        <HiEnvelope size={16} />
                                                    </span>
                                                    <span>{student.email}</span>
                                                </div>
                                                <div className="card__info-row">
                                                    <span className="card__info-icon" aria-hidden="true">
                                                        <HiPhone size={16} />
                                                    </span>
                                                    <span>{student.phone}</span>
                                                </div>
                                            </div>
                                            <div className="my-student-card__actions">
                                                <Link
                                                    to="/add"
                                                    state={{ editStudent: student }}
                                                    className="my-student-card__action-btn my-student-card__action-btn--edit"
                                                    aria-label={`Edit ${student.name}`}
                                                >
                                                    <FiEdit3 size={14} /> Edit
                                                </Link>
                                                <motion.button
                                                    className="my-student-card__action-btn my-student-card__action-btn--delete"
                                                    onClick={() => handleDelete(student.id)}
                                                    aria-label={`Delete ${student.name}`}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FiTrash2 size={14} /> Delete
                                                </motion.button>
                                            </div>
                                        </TiltCard>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </AnimatedLayout>
    );
}

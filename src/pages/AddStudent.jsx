import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLayout from '../components/AnimatedLayout';
import ToastContainer, { useToast } from '../components/Toast';
import { FiAlertCircle, FiStar, FiTrash2, FiEdit3, FiUsers } from 'react-icons/fi';

const initialFormData = {
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
};

function validateForm(data) {
    const errors = {};
    const name = data.name.trim();
    const email = data.email.trim();
    const phone = data.phone.trim();

    if (!name) {
        errors.name = 'Name is required.';
    }

    if (!email) {
        errors.email = 'Email is required.';
    } else if (!email.includes('@') || !email.includes('.')) {
        errors.email = 'Enter a valid email (must contain "@" and ".").';
    }

    if (!phone) {
        errors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(phone)) {
        errors.phone = 'Phone must be exactly 10 digits.';
    }

    return errors;
}

export default function AddStudent() {
    const [formData, setFormData] = useState({ ...initialFormData });
    const [errors, setErrors] = useState({});
    const [students, setStudents] = useState([]);
    const [shake, setShake] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const { toasts, addToast, removeToast } = useToast();

    useEffect(() => {
        try {
            const stored = localStorage.getItem('students');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setStudents(parsed);
                }
            }
        } catch {
            setStudents([]);
        }
    }, []);

    function syncLocalStorage(updatedStudents) {
        try {
            localStorage.setItem('students', JSON.stringify(updatedStudents));
        } catch {
            addToast('Failed to save. Storage may be full.', 'error');
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === 'phone' && value !== '' && !/^\d*$/.test(value)) {
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        const trimmedData = {
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
        };

        const validationErrors = validateForm(trimmedData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        let updatedStudents;

        if (editingId) {
            // Update existing student
            updatedStudents = students.map((s) =>
                s.id === editingId ? { ...s, ...trimmedData } : s
            );
            addToast(`${trimmedData.name} updated successfully!`, 'success');
            setEditingId(null);
        } else {
            // Add new student
            const newStudent = { id: Date.now(), ...trimmedData };
            updatedStudents = [...students, newStudent];
            addToast(`${trimmedData.name} has been added!`, 'success');
        }

        syncLocalStorage(updatedStudents);
        setStudents(updatedStudents);
        setFormData({ ...initialFormData });
        setErrors({});
    }

    function handleEdit(student) {
        setEditingId(student.id);
        setFormData({
            name: student.name,
            email: student.email,
            phone: student.phone,
            gender: student.gender,
        });
        setErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleCancelEdit() {
        setEditingId(null);
        setFormData({ ...initialFormData });
        setErrors({});
    }

    function handleDelete(id) {
        const student = students.find((s) => s.id === id);
        const updatedStudents = students.filter((s) => s.id !== id);
        syncLocalStorage(updatedStudents);
        setStudents(updatedStudents);
        if (editingId === id) {
            setEditingId(null);
            setFormData({ ...initialFormData });
        }
        addToast(`${student?.name || 'Student'} removed.`, 'info');
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
                        <h1 className="page-header__title">Add Student</h1>
                        <p className="page-header__subtitle">
                            Fill in the details below to register a new student
                        </p>
                    </motion.header>

                    <div className="form-container">
                        <motion.form
                            className="form"
                            onSubmit={handleSubmit}
                            noValidate
                            initial={{ opacity: 0, y: 30, scale: 0.97 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                x: shake ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
                            }}
                            transition={{
                                duration: shake ? 0.4 : 0.5,
                                ease: shake ? 'easeInOut' : 'easeOut',
                                delay: shake ? 0 : 0.15,
                            }}
                        >
                            {editingId && (
                                <motion.div
                                    className="form__editing-banner"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <FiEdit3 size={14} />
                                    <span>Editing student — </span>
                                    <button type="button" className="form__cancel-edit" onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                </motion.div>
                            )}

                            {/* Name */}
                            <div className="form__group">
                                <label htmlFor="name" className="form__label">
                                    Name <span aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`form__input${errors.name ? ' form__input--error' : ''}`}
                                    placeholder="e.g. John Doe"
                                    autoComplete="name"
                                    aria-required="true"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                />
                                <AnimatePresence>
                                    {errors.name && (
                                        <motion.p
                                            className="form__error"
                                            id="name-error"
                                            role="alert"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FiAlertCircle size={13} /> {errors.name}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Email */}
                            <div className="form__group">
                                <label htmlFor="email" className="form__label">
                                    Email <span aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`form__input${errors.email ? ' form__input--error' : ''}`}
                                    placeholder="e.g. john@example.com"
                                    autoComplete="email"
                                    aria-required="true"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                />
                                <AnimatePresence>
                                    {errors.email && (
                                        <motion.p
                                            className="form__error"
                                            id="email-error"
                                            role="alert"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FiAlertCircle size={13} /> {errors.email}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Phone */}
                            <div className="form__group">
                                <label htmlFor="phone" className="form__label">
                                    Phone <span aria-hidden="true">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`form__input${errors.phone ? ' form__input--error' : ''}`}
                                    placeholder="e.g. 9876543210"
                                    maxLength={10}
                                    autoComplete="tel"
                                    aria-required="true"
                                    aria-invalid={!!errors.phone}
                                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                                />
                                <AnimatePresence>
                                    {errors.phone && (
                                        <motion.p
                                            className="form__error"
                                            id="phone-error"
                                            role="alert"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FiAlertCircle size={13} /> {errors.phone}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Gender */}
                            <div className="form__group">
                                <fieldset style={{ border: 'none', padding: 0 }}>
                                    <legend className="form__label">Gender</legend>
                                    <div className="form__radio-group">
                                        <label className="form__radio-label">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Male"
                                                checked={formData.gender === 'Male'}
                                                onChange={handleChange}
                                                className="form__radio-input"
                                            />
                                            Male
                                        </label>
                                        <label className="form__radio-label">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="Female"
                                                checked={formData.gender === 'Female'}
                                                onChange={handleChange}
                                                className="form__radio-input"
                                            />
                                            Female
                                        </label>
                                    </div>
                                </fieldset>
                            </div>

                            <motion.button
                                type="submit"
                                className="form__submit"
                                whileHover={{ y: -2, boxShadow: '0 0 50px rgba(124,58,237,0.3)' }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <FiStar size={16} /> {editingId ? 'Update Student' : 'Add Student'}
                            </motion.button>
                        </motion.form>

                        {/* Recently Added Students */}
                        {students.length > 0 && (
                            <motion.section
                                className="recent-students"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                aria-label="Recently added students"
                            >
                                <h2 className="recent-students__title">
                                    Recently Added ({students.length})
                                </h2>
                                <AnimatePresence>
                                    {[...students].reverse().map((student) => (
                                        <motion.div
                                            key={student.id}
                                            className={`recent-student-card${editingId === student.id ? ' recent-student-card--editing' : ''}`}
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 40, scale: 0.9 }}
                                            transition={{ duration: 0.3 }}
                                            layout
                                        >
                                            <div className="recent-student-card__avatar" aria-hidden="true">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="recent-student-card__details">
                                                <div className="recent-student-card__name">{student.name}</div>
                                                <div className="recent-student-card__meta">
                                                    <span>{student.email}</span>
                                                    <span>{student.phone}</span>
                                                    <span>{student.gender}</span>
                                                </div>
                                            </div>
                                            <div className="recent-student-card__actions">
                                                <motion.button
                                                    className="recent-student-card__btn recent-student-card__btn--edit"
                                                    onClick={() => handleEdit(student)}
                                                    aria-label={`Edit ${student.name}`}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiEdit3 size={15} />
                                                </motion.button>
                                                <motion.button
                                                    className="recent-student-card__btn recent-student-card__btn--delete"
                                                    onClick={() => handleDelete(student.id)}
                                                    aria-label={`Delete ${student.name}`}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <FiTrash2 size={15} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.section>
                        )}

                        {/* CTA to view all students */}
                        {students.length > 0 && (
                            <motion.div
                                style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link to="/my-students" className="cta-button">
                                    <FiUsers size={16} /> View All My Students
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </AnimatedLayout>
    );
}

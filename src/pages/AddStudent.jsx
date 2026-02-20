import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedLayout from '../components/AnimatedLayout';
import { FiAlertCircle, FiCheckCircle, FiStar } from 'react-icons/fi';

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
    const [successMessage, setSuccessMessage] = useState('');
    const [students, setStudents] = useState([]);
    const [shake, setShake] = useState(false);

    // Re-read localStorage on mount
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

        if (successMessage) {
            setSuccessMessage('');
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

        const newStudent = {
            id: Date.now(),
            ...trimmedData,
        };

        const updatedStudents = [...students, newStudent];
        try {
            localStorage.setItem('students', JSON.stringify(updatedStudents));
        } catch {
            setErrors({ form: 'Failed to save. Storage may be full.' });
            return;
        }

        setStudents(updatedStudents);
        setFormData({ ...initialFormData });
        setErrors({});
        setSuccessMessage(`${newStudent.name} has been added successfully!`);
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
                        <AnimatePresence>
                            {successMessage && (
                                <motion.div
                                    className="success-message"
                                    role="status"
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <FiCheckCircle size={16} /> {successMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>

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
                                <FiStar size={16} /> Add Student
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
                                            className="recent-student-card"
                                            initial={{ opacity: 0, x: -16 }}
                                            animate={{ opacity: 1, x: 0 }}
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
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.section>
                        )}
                    </div>
                </div>
            </div>
        </AnimatedLayout>
    );
}

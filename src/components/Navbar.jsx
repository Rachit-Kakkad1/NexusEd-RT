import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/students', label: 'Students' },
  { path: '/add', label: 'Add Student' },
  { path: '/counter', label: 'Counter' },
];

const navVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const linkVariants = {
  hidden: { y: -15, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.35, delay: 0.3 + i * 0.08, ease: 'easeOut' },
  }),
};

export default function Navbar() {
  return (
    <motion.nav
      className="navbar"
      role="navigation"
      aria-label="Main navigation"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Go to Home">
          <div className="navbar__logo" aria-hidden="true">N</div>
          <span className="navbar__brand-text">NexusEd</span>
        </Link>
        <ul className="navbar__links">
          {navItems.map(({ path, label }, index) => (
            <motion.li
              key={path}
              custom={index}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
            >
              <NavLink
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `navbar__link${isActive ? ' navbar__link--active' : ''}`
                }
              >
                <span>{label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.nav>
  );
}

import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import Counter from './pages/Counter';

function AnimatedBackground() {
  return (
    <div className="animated-bg" aria-hidden="true">
      <div className="animated-bg__orb animated-bg__orb--1" />
      <div className="animated-bg__orb animated-bg__orb--2" />
      <div className="animated-bg__orb animated-bg__orb--3" />
      <div className="animated-bg__particles">
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
        <div className="animated-bg__particle" />
      </div>
      <div className="animated-bg__beam" />
      <div className="animated-bg__grid" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <AnimatedBackground />
      <div id="app-content">
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/students" element={<Students />} />
              <Route path="/add" element={<AddStudent />} />
              <Route path="/counter" element={<Counter />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

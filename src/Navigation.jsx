import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaBars, FaTimes, FaHome, FaImages, FaTag, FaCalendarCheck } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef(null);
  const navRef = useRef(null);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const height = menuRef.current.scrollHeight;
      setMenuHeight(height);
    } else {
      setMenuHeight(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', name: 'Home', icon: FaHome },
    { id: 'gallery', name: 'Photos', icon: FaImages },
    { id: 'pricing', name: 'Pricing', icon: FaTag },
    { id: 'over-booking', name: 'Book Now', icon: FaCalendarCheck },
  ];

  return (
    <nav className="bg-indigo-50 fixed top-0 left-0 right-0 z-50 pb-2" ref={navRef}>
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center w-20 h-20">
            <img
              src="/GCCLogoBg.webp"
              alt="GCC Logo"
              className="w-full h-full object-contain scale-150 pt-2"
            />
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-emerald-700 p-2 rounded-md"
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className='py-2 px-3 rounded-md transition duration-300 ease-in-out flex items-center'
              >
                <item.icon className="mr-2 text-emerald-800" />
                <span className='text-emerald-800 font-semibold'>
                  {item.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={menuRef}
        style={{
          maxHeight: `${menuHeight + 10}px`,
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
          opacity: isOpen ? 1 : 0,
        }}
        className="md:hidden bg-indigo-50 shadow-md"
      >
        {navItems.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className='block py-4 px-4 text-base font-medium hover:bg-emerald-800/[.1] hover:text-emerald-800 flex items-center transition duration-300 ease-in-out'
            onClick={toggleMenu}
            style={{
              transitionDelay: `${index * 50}ms`,
              transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
              opacity: isOpen ? 1 : 0,
            }}
          >
            <item.icon className="mr-3 text-emerald-800" />
            <span className='text-emerald-800 font-semibold'>
              {item.name}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
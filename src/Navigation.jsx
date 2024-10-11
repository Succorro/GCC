import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes, FaHome, FaImages, FaTag, FaCalendarCheck } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0)
  const menuRef = useRef(null)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      const height = menuRef.current.scrollHeight;
      setMenuHeight(height);
    } else {
      setMenuHeight(0);
    }
  }, [isOpen])

  const navItems = [
    { id: 'home', name: 'Home', icon: FaHome },
    { id: 'gallery', name: 'Gallery', icon: FaImages },
    { id: 'pricing', name: 'Pricing', icon: FaTag },
    { id: 'book-now', name: 'Book Now', icon: FaCalendarCheck },
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex items-center py-4">
            <span className="font-semibold text-lg">
              <img
                src="/GabrielCarCleaning.webp"
                alt="GCC Logo"
                className='w-10'
              />
            </span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="py-4 px-2 hover:bg-gray-700 flex items-center"
              >
                <item.icon className="mr-2" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        style={{
          maxHeight: `${menuHeight}px`,
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1',
        }}
        className="md:hidden"
      >
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block py-2 px-4 text-sm hover:bg-gray-700 flex items-center"
            onClick={toggleMenu}
          >
            <item.icon className="mr-2" />
            {item.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
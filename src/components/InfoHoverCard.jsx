import React, { useState, useRef, useEffect } from 'react';
import { FaInfoCircle } from "react-icons/fa";

const InfoHoverCard = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const cardRect = cardRef.current?.getBoundingClientRect();

      if (cardRect) {
        const spacing = 8; // Gap between icon and card
        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = rect.left - (cardRect.width / 2) + (rect.width / 2);
            y = rect.top - cardRect.height - spacing;
            break;
          case 'bottom':
            x = rect.left - (cardRect.width / 2) + (rect.width / 2);
            y = rect.bottom + spacing;
            break;
          case 'left':
            x = rect.left - cardRect.width - spacing;
            y = rect.top - (cardRect.height / 2) + (rect.height / 2);
            break;
          case 'right':
            x = rect.right + spacing;
            y = rect.top - (cardRect.height / 2) + (rect.height / 2);
            break;
          default:
            x = rect.left - (cardRect.width / 2) + (rect.width / 2);
            y = rect.top - cardRect.height - spacing;
        }

        setCoords({ x, y });
      }
    }
  }, [isVisible, position]);

  return (
    <div className="inline-block relative">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center"
      >
        <FaInfoCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
      </div>

      {isVisible && (
        <div
          ref={cardRef}
          style={{
            position: 'fixed',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
          className="z-50 min-w-[200px] max-w-[280px] rounded-lg bg-white border border-gray-200 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="p-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              {content}
            </p>
          </div>
          <div
            className={`absolute w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45
              ${position === 'top' ? 'bottom-[-5px] left-1/2 ml-[-4px]' : ''}
              ${position === 'bottom' ? 'top-[-5px] left-1/2 ml-[-4px]' : ''}
              ${position === 'left' ? 'right-[-5px] top-1/2 mt-[-4px]' : ''}
              ${position === 'right' ? 'left-[-5px] top-1/2 mt-[-4px]' : ''}
            `}
          />
        </div>
      )}
    </div>
  );
};

export default InfoHoverCard;
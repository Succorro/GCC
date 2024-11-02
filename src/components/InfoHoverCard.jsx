import React, { useState } from 'react';
import { FaInfoCircle } from "react-icons/fa";

const InfoHoverCard = ({ content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="inline-block relative">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center"
      >
        <FaInfoCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-help" />
      </div>

      {isVisible && (
        <div
          className={`absolute z-50 min-w-[200px] max-w-[280px] 
            ${position === 'top' ? 'bottom-6' : ''}
            ${position === 'bottom' ? 'top-6' : ''}
            ${position === 'left' ? 'right-6' : ''}
            ${position === 'right' ? 'left-6' : ''}
            -translate-x-1/2 left-1/2
            rounded-lg bg-white border border-gray-200 shadow-lg 
            transition-opacity duration-200 opacity-100`}
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
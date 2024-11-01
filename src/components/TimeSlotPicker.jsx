const TimeSlotPicker = ({ onTimeSelect, selectedTime, time }) => {
  const handleTimeClick = (time) => {
    onTimeSelect(time);
  };

  return (
    <button
      key={time}
      onClick={() => handleTimeClick(time)}
      className={`
            px-4 py-2 
            rounded-lg 
            text-sm 
            font-medium 
            transition-colors 
            ${selectedTime === time
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-offset-2
          `}
    >
      {time}
    </button>
  );
};

export default TimeSlotPicker;
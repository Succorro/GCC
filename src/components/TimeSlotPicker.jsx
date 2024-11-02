const TimeSlotPicker = ({ onTimeSelect, selectedTime, time = '9:00', available }) => {
  const handleTimeClick = (time) => {
    onTimeSelect(time);
  };

  return (
    <button
      type="button"
      key={time}
      onClick={() => handleTimeClick(time)}
      disabled={!available}
      className={`
            px-4 py-2 
            rounded-lg 
            text-sm 
            font-medium 
            transition-colors 
            ${selectedTime === time
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
        }
            focus:outline-none 
            focus:ring-2 
            focus:ring-green-500 
            focus:ring-offset-2
          `}
    >
      {time}
    </button>
  );
};

export default TimeSlotPicker;
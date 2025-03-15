import React from 'react';

export default function Event({
  gridRow1,
  span,
  colStart,
  eventName,
  location,
  description,
  startTime,
  className,
  onDragOver,
  onDrop
}) {
  // Format time (e.g. 9.5 -> "9:30 AM")
  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Calculate end time based on start time and span
  const endTime = startTime + (span / 2); // Convert span back to hours

  // Generate a random pastel color for event background
  const getRandomPastelColor = () => {
    const colors = [
      'bg-blue-200 hover:bg-blue-300',
      'bg-pink-200 hover:bg-pink-300',
      'bg-green-200 hover:bg-green-300',
      'bg-purple-200 hover:bg-purple-300',
      'bg-yellow-200 hover:bg-yellow-300',
      'bg-red-200 hover:bg-red-300',
      'bg-indigo-200 hover:bg-indigo-300'
    ];
    
    // Use the event name to consistently get the same color for the same event
    const hash = eventName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  const eventColor = getRandomPastelColor();
  
  return (
    <li
      className={`relative mt-px ${className || ''}`}
      style={{
        gridRow: `${gridRow1} / span ${span}`,
        gridColumn: `${colStart} / span 1`
      }}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop && onDrop(e, colStart - 1, startTime)} // Adjust colStart for day index
    >
      <div
        className={`group absolute inset-1 flex flex-col overflow-hidden rounded-lg p-2 ${eventColor} text-xs leading-5 transition-all duration-200`}
      >
        <p className="text-xs font-semibold">{formatTime(startTime)} - {formatTime(endTime)}</p>
        <p className="font-semibold">{eventName}</p>
        {location && <p className="opacity-80">{location}</p>}
        {description && (
          <p className="mt-1 overflow-hidden text-ellipsis">{description}</p>
        )}
      </div>
    </li>
  );
}
import React from 'react';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  time: string;
  registration_link: string;
  details: string;
};

type ModalProps = {
  event: Event | null;
  onClose: () => void;
};

const EventModal: React.FC<ModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} // Add inline style for opacity
      onClick={onClose} // Close when clicking backdrop
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{event.title}</h2>
        <p className="text-gray-600 mb-2">
          <strong>Date:</strong> {event.date}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Time:</strong> {event.time}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Details:</strong> {event.details}
        </p>
        <a
          href={event.registration_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </a>
      </div>
    </div>
  );
};

export default EventModal;
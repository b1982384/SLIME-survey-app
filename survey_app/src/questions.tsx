import React from 'react';

const EmojiProgression = () => {
  const moods = [
    { emoji: '😠', color: 'bg-red-400', label: 'Angry' },
    { emoji: '😕', color: 'bg-orange-400', label: 'Sad' },
    { emoji: '😐', color: 'bg-yellow-400', label: 'Neutral' },
    { emoji: '🙂', color: 'bg-blue-400', label: 'Happy' },
    { emoji: '😊', color: 'bg-green-400', label: 'Joyful' }
  ];

  return (
    <div className="flex justify-center">
      {moods.map((mood, index) => (
        <div key={index} className={`p-4 ${mood.color}`}>
          <span>{mood.emoji}</span>
          <p>{mood.label}</p>
        </div>
      ))}
    </div>
  );
};

export default EmojiProgression;
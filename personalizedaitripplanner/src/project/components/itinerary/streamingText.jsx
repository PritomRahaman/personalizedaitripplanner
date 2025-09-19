import React, { useState, useEffect } from 'react';

const StreamingText = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
        if (i > text.length - 1) {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

export default StreamingText;
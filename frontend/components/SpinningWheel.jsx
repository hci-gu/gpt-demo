import React, { useEffect, useState, useRef } from 'react';

function SpinningWheel({ words, angle, onStop }) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Resize canvas to match its parent element
    const canvas = canvasRef.current;
    const parent = canvas.parentNode;
    setCanvasSize({ width: parent.clientWidth, height: parent.clientHeight });
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, [words])

  useEffect(() => {
    const canvas = canvasRef.current;
    // Draw spinning wheel on canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const total = words.reduce((sum, word) => sum + word.probability, 0);
    let startAngle = angle;
    for (const word of words) {
      const probability = word.probability / total;
      const endAngle = startAngle + probability * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = word.color || 'gray';
      ctx.fill();
      startAngle = endAngle;
    }
  }, [words, angle]);

  return (
    <canvas
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '50%',
        transformOrigin: '50% 50%',
        // transform: `rotate(${angle}rad)`
      }}
      ref={canvasRef}
      onClick={onStop}
    />
  );
}

function SpinningWheelAnimator({ words, onStop }) {
  const [angle, setAngle] = useState(0);
  const [angularVelocity, setAngularVelocity] = useState(0.1);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    setStopped(false)
  }, [words])

  useEffect(() => {
    if (angularVelocity > 0) {
      const interval = setInterval(() => {
        setAngle(angle => {
          let newAngle = angle + angularVelocity
          while(newAngle > Math.PI * 2) {
            newAngle -= Math.PI * 2;
          }
          return newAngle;
        });
      }, 50);
      return () => clearInterval(interval);
    } else {
      console.log('finding word')
      const total = words.reduce((sum, word) => sum + word.probability, 0);
      let startAngle = 0;
      for (const word of words) {
        const probability = word.probability / total;
        const endAngle = startAngle + probability * 2 * Math.PI;
        if (angle >= startAngle && angle < endAngle) {
          console.log('stop', word.word)
          onStop(word.word);
          return
        }
        startAngle = endAngle;
      }
      onStop(words[0].word);
    }
  }, [angularVelocity])

  useEffect(() => {
    // Rotate spinning wheel every 10ms
    if (!stopped) {
      setAngularVelocity(2*Math.PI/10);
    }
  }, [words, stopped]);

  function stopWheel() {
    setStopped(true);
    setAngularVelocity(0);
  }

  return (
    <SpinningWheel words={words} angle={angle} onStop={stopWheel} />
  );
}

export default SpinningWheelAnimator

import React, { useState, useEffect } from 'react';
import './Countdown.css'; 

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function calculateTimeLeft() {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  return (
    <div className="countdown" style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/source/Rick.gif)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      height: '100vh', // Ajusta la altura según sea necesario
      /* Otros estilos si los necesitas */
      
    }}>
      <div className="countdown-wrapper">
      <div className="digital-clock">
          <div className="time-section">
            <span className="time">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="label">Días</span>
          </div>
          <div className="time-section">
            <span className="time">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="label">Horas</span>
          </div>
          <div className="time-section">
            <span className="time">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="label">Minutos</span>
          </div>
          <div className="time-section">
            <span className="time">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="label">Segundos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;

import React, { useState, useEffect } from 'react';
import '../styles/countdown-timer.css';

interface CountdownTimerProps {
  endDate: Date | string;
  onExpire?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  style?: React.CSSProperties;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

const calculateTimeLeft = (endDate: Date | string): TimeLeft => {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const difference = end.getTime() - new Date().getTime();
  
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  };
  
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  } else {
    timeLeft.expired = true;
  }
  
  return timeLeft;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endDate,
  onExpire,
  className = '',
  size = 'md',
  showLabels = true,
  style
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(endDate));
  
  useEffect(() => {
    if (timeLeft.expired) {
      onExpire?.();
      return;
    }
    
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft(endDate);
      setTimeLeft(updatedTimeLeft);
      
      if (updatedTimeLeft.expired) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endDate, onExpire, timeLeft.expired]);
  
  const padWithZero = (num: number): string => {
    return num.toString().padStart(2, '0');
  };
  
  return (
    <div 
      className={`countdown-timer ${size} ${className}`} 
      style={style}
    >
      {timeLeft.expired ? (
        <div className="countdown-expired">
          Auction Ended
        </div>
      ) : (
        <div className="countdown-container">
          {timeLeft.days > 0 && (
            <div className="countdown-unit">
              <div className="countdown-value">{timeLeft.days}</div>
              {showLabels && <div className="countdown-label">Days</div>}
            </div>
          )}
          
          <div className="countdown-unit">
            <div className="countdown-value">{padWithZero(timeLeft.hours)}</div>
            {showLabels && <div className="countdown-label">Hours</div>}
          </div>
          
          <div className="countdown-unit">
            <div className="countdown-value">{padWithZero(timeLeft.minutes)}</div>
            {showLabels && <div className="countdown-label">Minutes</div>}
          </div>
          
          <div className="countdown-unit">
            <div className="countdown-value">{padWithZero(timeLeft.seconds)}</div>
            {showLabels && <div className="countdown-label">Seconds</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;

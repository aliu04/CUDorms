import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import { removeNotification } from '../store/slices/uiSlice';

const NotificationContainer: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timers = notifications.map(notification => {
      return setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, dispatch]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => dispatch(removeNotification(notification.id))}
        >
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button className="notification-close">&times;</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;

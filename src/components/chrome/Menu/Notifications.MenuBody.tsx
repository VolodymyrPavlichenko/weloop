import * as React from 'react';

import Notification from '../../elements/Notification/Notification';

export default ({ user }) => {
  return (
    <div>
      {user.notifications.map(notification => {
        return (
          <Notification
            {...notification}
            onClick={() => alert(`notif id: ${notification.id} clicked`)}
            key={notification.id}
          />
        );
      })}
    </div>
  );
};

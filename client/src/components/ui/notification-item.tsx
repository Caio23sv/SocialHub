import { NotificationWithUsers } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationItemProps {
  notification: NotificationWithUsers;
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  // Format notification date
  const formattedDate = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });
  
  const renderNotificationContent = () => {
    switch (notification.type) {
      case "like":
        return (
          <>
            <img
              src={notification.triggeredByUser.avatar}
              alt={`${notification.triggeredByUser.name}'s avatar`}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{notification.triggeredByUser.name}</span> curtiu sua foto.
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
            {notification.post && (
              <div className="w-10 h-10">
                <img
                  src={notification.post.imageUrl}
                  alt="Post thumbnail"
                  className="w-10 h-10 object-cover rounded"
                />
              </div>
            )}
          </>
        );
        
      case "comment":
        return (
          <>
            <img
              src={notification.triggeredByUser.avatar}
              alt={`${notification.triggeredByUser.name}'s avatar`}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{notification.triggeredByUser.name}</span> comentou em sua foto.
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
            {notification.post && (
              <div className="w-10 h-10">
                <img
                  src={notification.post.imageUrl}
                  alt="Post thumbnail"
                  className="w-10 h-10 object-cover rounded"
                />
              </div>
            )}
          </>
        );
        
      case "follow":
        return (
          <>
            <div className="w-10 h-10 rounded-full mr-3 bg-primary/10 flex items-center justify-center">
              <i className="ri-user-follow-line text-primary"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{notification.triggeredByUser.name}</span> começou a seguir você.
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
            <button className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
              Seguir
            </button>
          </>
        );
        
      default:
        return (
          <>
            <div className="w-10 h-10 rounded-full mr-3 bg-gray-200 flex items-center justify-center">
              <i className="ri-notification-3-line text-gray-500"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm">Nova notificação</p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
          </>
        );
    }
  };
  
  return (
    <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg">
      {renderNotificationContent()}
    </div>
  );
};

export default NotificationItem;

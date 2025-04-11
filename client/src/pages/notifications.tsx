import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import NotificationItem from "@/components/ui/notification-item";
import { NotificationWithUsers } from "@shared/schema";

const Notifications = () => {
  const [, setLocation] = useLocation();
  
  // Current user ID (in a real app, this would come from authentication)
  const currentUserId = 6; // Rafael Costa's ID
  
  // Get notifications
  const { data: notifications, isLoading } = useQuery<NotificationWithUsers[]>({
    queryKey: [`/api/users/${currentUserId}/notifications`],
  });
  
  // Group notifications by time
  const [todayNotifications, setTodayNotifications] = useState<NotificationWithUsers[]>([]);
  const [weekNotifications, setWeekNotifications] = useState<NotificationWithUsers[]>([]);
  
  useEffect(() => {
    if (notifications) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const today_notifications = [];
      const week_notifications = [];
      
      for (const notification of notifications) {
        const notificationDate = new Date(notification.createdAt);
        
        if (notificationDate >= today) {
          today_notifications.push(notification);
        } else if (notificationDate >= lastWeek) {
          week_notifications.push(notification);
        }
      }
      
      setTodayNotifications(today_notifications);
      setWeekNotifications(week_notifications);
    }
  }, [notifications]);
  
  // Mark notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: () => {
      return apiRequest("POST", `/api/users/${currentUserId}/notifications/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${currentUserId}/notifications`] });
    },
  });
  
  // Mark notifications as read when component mounts
  useEffect(() => {
    markAsReadMutation.mutate();
  }, []);
  
  const handleBack = () => {
    setLocation("/");
  };
  
  return (
    <div className="notification-panel fixed top-0 right-0 bottom-0 w-full bg-white z-40 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
        <div className="flex items-center">
          <button onClick={handleBack} className="text-gray-700">
            <i className="ri-arrow-left-line text-2xl"></i>
          </button>
          <h2 className="text-lg font-semibold ml-4">Notificações</h2>
        </div>
      </div>
      
      <div className="p-2">
        {isLoading ? (
          // Loading skeleton
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex items-center p-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/4 h-3 bg-gray-200 rounded animate-pulse mt-2"></div>
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))
        ) : (
          <>
            {todayNotifications.length > 0 && (
              <>
                <div className="text-sm font-semibold px-2 py-2 text-gray-500">Hoje</div>
                {todayNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </>
            )}
            
            {weekNotifications.length > 0 && (
              <>
                <div className="text-sm font-semibold px-2 py-2 text-gray-500 mt-4">Esta Semana</div>
                {weekNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                  />
                ))}
              </>
            )}
            
            {notifications?.length === 0 && (
              <div className="py-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <i className="ri-notification-3-line text-3xl text-gray-400"></i>
                </div>
                <p className="text-gray-500">Nenhuma notificação ainda</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;

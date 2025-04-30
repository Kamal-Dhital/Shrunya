import { useContext, useState } from "react";
import { NotificationContext } from "@/App";
import { format, formatDistanceToNow } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BellOff,
  Check,
  Info,
  X,
  CheckCheck,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

export function NotificationsPopover() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    removeNotification, 
    clearAll 
  } = useContext(NotificationContext);
  
  const [open, setOpen] = useState(false);
  
  // Mark a notification as read when user clicks on it
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Format notification time
  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than 24 hours, show relative time
    if (diff < 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // If less than a week, show day of week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return format(date, "EEEE");
    }
    
    // Otherwise, show full date
    return format(date, "MMM d, yyyy");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => setOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 md:w-96 p-0" 
        align="end"
        sideOffset={5}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => markAllAsRead()}
              >
                <CheckCheck className="mr-1 h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-xs"
              onClick={() => clearAll()}
              disabled={notifications.length === 0}
            >
              Clear all
            </Button>
          </div>
        </div>
        
        <Separator />
        
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <BellOff className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="font-medium text-muted-foreground">No notifications</h3>
            <p className="text-sm text-muted-foreground/80 mt-1">
              You're all caught up! We'll notify you when there's something new.
            </p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="flex flex-col divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`flex p-4 hover:bg-muted/50 transition-colors cursor-pointer ${notification.read ? "" : "bg-muted/20"}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 mr-2">
                    <div className="flex justify-between items-start">
                      <h5 className={`text-sm font-medium ${notification.read ? "" : "font-semibold"}`}>
                        {notification.title}
                      </h5>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatNotificationTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
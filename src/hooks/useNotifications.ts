import { useState, useEffect, useCallback } from "react";

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = "Notification" in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  }, [isSupported]);

  const sendNotification = useCallback(({ title, body, icon, tag }: NotificationOptions) => {
    if (!isSupported || permission !== "granted") return null;
    
    // Only send if document is hidden (app in background)
    if (document.visibilityState !== "hidden") return null;

    const notification = new Notification(title, {
      body,
      icon: icon || "/favicon.ico",
      tag,
      badge: "/favicon.ico",
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }, [isSupported, permission]);

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
  };
};

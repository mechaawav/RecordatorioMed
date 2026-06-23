import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const setupNotifications = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permission denied');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('recordatorios', {
        name: 'Recordatorios de Medicación',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Error setting up notifications:', error);
    return false;
  }
};

export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

export const scheduleNotificationForTime = async (medName, timeStr) => {
  try {
    await setupNotifications();

    const targetMinutes = parseTimeToMinutes(timeStr);
    if (targetMinutes === null) {
      console.error('Invalid time format:', timeStr);
      return false;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let secondsUntilNotification = (targetMinutes - currentMinutes) * 60;

    if (secondsUntilNotification <= 0) {
      secondsUntilNotification = ((24 * 60) + targetMinutes - currentMinutes) * 60;
    }

    const result = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Hora de medicación',
        body: `Tomar: ${medName}`,
        sound: true,
        badge: 1,
      },
      trigger: {
        type: 'seconds',
        seconds: Math.ceil(secondsUntilNotification),
        channelId: Platform.OS === 'android' ? 'recordatorios' : undefined,
      },
    });

    console.log(`Notification scheduled for ${timeStr} (in ${Math.ceil(secondsUntilNotification)}s):`, result);
    return result;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
};

export const cancelNotification = async (id) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
    return true;
  } catch (error) {
    console.error('Error canceling notification:', error);
    return false;
  }
};

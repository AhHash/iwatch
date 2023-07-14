import { useCallback, useEffect } from "react";
import {
  getPermissionsAsync,
  IosAuthorizationStatus,
  requestPermissionsAsync,
  cancelAllScheduledNotificationsAsync,
  scheduleNotificationAsync,
  PermissionStatus,
} from "expo-notifications";
import { useSelector } from "react-redux";

const NotificationHandler = () => {
  const commitments = useSelector((store) => store.commitments.commitments);

  const chechPermissions = useCallback(async () => {
    const { status, ios } = await getPermissionsAsync();

    if (
      ios?.status === IosAuthorizationStatus.AUTHORIZED ||
      status == PermissionStatus?.GRANTED
    ) {
      return true;
    } else {
      if (
        status == PermissionStatus?.UNDETERMINED ||
        ios?.status === IosAuthorizationStatus.PROVISIONAL ||
        ios?.status === IosAuthorizationStatus.NOT_DETERMINED
      ) {
        return !((await requestPermissionsAsync()) == PermissionStatus?.DENIED);
      } else {
        return false;
      }
    }
  });

  const scheduleNotification = useCallback(async () => {
    if (!(await chechPermissions())) {
      return;
    }

    await cancelAllScheduledNotificationsAsync();
    const trigger = new Date();
    trigger.setDate(trigger.getDate() + 3);
    try {
      const commitment =
        commitments[Math.floor(Math.random() * commitments.length)];
      if (commitment) {
        await scheduleNotificationAsync({
          content: {
            title: "It's been a while",
            body: `How about you watch: ${commitment.name}`,
          },
          trigger,
        });
      }
    } catch {}
  });

  useEffect(() => {
    scheduleNotification();
  });
};
export default NotificationHandler;

import { useEffect, useState } from "react";

const STORAGE_KEY = "seenAnnouncementIds";

function useAnnouncementNotifications(announcements) {
  const [seenIds, setSeenIds] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
    } catch {
      return [];
    }
  });

  const unreadAnnouncements = announcements.filter(
    (announcement) =>
      !seenIds.includes(announcement._id)
  );

  const markAsSeen = (id) => {
    setSeenIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      const updated = [...current, id];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const markAllAsSeen = () => {
    const ids = announcements.map(
      (announcement) => announcement._id
    );

    setSeenIds(ids);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ids)
    );
  };

  return {
    unreadAnnouncements,
    unreadCount: unreadAnnouncements.length,
    markAsSeen,
    markAllAsSeen,
  };
}

export default useAnnouncementNotifications;
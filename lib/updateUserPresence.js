// File: lib/updateUserPresence.js
import { ref, onDisconnect, set, onValue } from "firebase/database";
import { db, auth } from "@/lib/firebaseConfig";

const updateUserPresence = () => {
  const user = auth.currentUser;
  if (!user) return;

  const userStatusRef = ref(db, `status/${user.uid}`);

  const offlineStatus = { state: "offline", lastChanged: Date.now() };
  const onlineStatus = { state: "online", lastChanged: Date.now() };

  const connectedRef = ref(db, ".info/connected");
  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) return;

    // Update presence and set offline status on disconnect
    set(userStatusRef, onlineStatus);
    onDisconnect(userStatusRef).set(offlineStatus);
  });
};

export default updateUserPresence;

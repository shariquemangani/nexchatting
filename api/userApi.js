import { child, get, getDatabase, ref } from "firebase/database";

export const getUserData = async (userId, setLoggedInUser) => {
  const dbRef = ref(getDatabase());
  await get(child(dbRef, `users/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        setLoggedInUser(data);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getAlluser = async (setAllUser) => {
  const dbRef = ref(getDatabase());
  await get(child(dbRef, `users`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        const userArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAllUser(userArray);
      } else {
        console.log("No data available");
        setAllUser([]);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

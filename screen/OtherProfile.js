import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getDoc, doc} from 'firebase/firestore'; 
import { FIRESTORE_DB } from '../firestore';

const OtherProfile = ({ route }) => {
  const { userUid } = route.params;
  const [userData, setUserData] = useState(null);

  // Reference to the Firestore database
  const db = FIRESTORE_DB;

  const fetchUserData = async () => {
    try {
      const userDocRef = doc(db, 'users', userUid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If the document exists, set the user data
        const userDataFromFirebase = userDocSnapshot.data();
        setUserData(userDataFromFirebase);
      } else {
        console.log('User document not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userUid, db]);

  return (
    <View style={styles.container}>
      <Text>Other Profile Screen</Text>
      <Text>User UID: {userUid}</Text>
      {userData && (
        <>
          <Text>Username: {userData.username}</Text>
          <Text>Faculty: {userData.faculty}</Text>
          {/* Add more user data fields as needed */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OtherProfile;

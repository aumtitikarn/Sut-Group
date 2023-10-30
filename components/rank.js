import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firestore';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

function AddScore(props) {
  const { route } = props;
  const { score } = route.params; // Destructure the resetScore function
  const [scoreState, setScoreState] = useState(score);
  const navigation = useNavigation();

  useEffect(() => {
    const saveScoreToFirestore = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userId = user.uid;

        const gameCollection = collection(FIRESTORE_DB, 'game');
        const userDoc = doc(gameCollection, userId);

        const data = {
          score: score,
        };

        try {
          await setDoc(userDoc, data);
          console.log('บันทึกคะแนนสำเร็จ');

          const userCollection = collection(FIRESTORE_DB, 'users');
          const currentUserDoc = doc(userCollection, userId);

          const userDocSnapshot = await getDoc(currentUserDoc);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            if (userData) {
              const { username, profileImg } = userData;

              const gameData = {
                score: score,
                username: username,
                profileImg: profileImg,
              };

              const userGameDoc = doc(gameCollection, userId);
              await setDoc(userGameDoc, gameData);
              console.log('บันทึกข้อมูลผู้ใช้ในคอลเลคชัน "game" สำเร็จ');
            }
          }
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล:', error);
        }
      }
    };

    saveScoreToFirestore();
  }, [score]);


  return (
    <View style={styles.container}>
       <ImageBackground
    source={require('../assets/bg.png')} // Update the path to your background image
    style={styles.background}
  >
      <View style={styles.myscore}>
      <Image style={{width:250, height:250, top: 50}} source={require('../assets/bask.png')}  />
        <Text style={{ fontSize: 24 }}>คะแนนของตอนนี้</Text>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{score} 🎉</Text>
        <TouchableOpacity style={{ top: 30, width: 190, padding: 10, backgroundColor: '#F47D38', borderRadius: 10, margin: 2 }} onPress={() => {
          navigation.goBack();
        }}>
          <Text style={{ left: 60, color: 'white' }}>เล่นต่อ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ top: 30, width: 190, padding: 10, backgroundColor: '#F47D38', borderRadius: 10, margin: 2 }}>
          <Text style={{ left: 50, color: 'white' }}>อันดับผู้เล่น</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ top: 30, width: 190, padding: 10, backgroundColor: '#F47D38', borderRadius: 10, margin: 2 }} onPress={() => navigation.navigate('Home')}>
          <Text style={{ left: 40, color: 'white' }}>กลับไปหน้าหลัก</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  myscore: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: -100,
    fontSize: 24
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddScore;

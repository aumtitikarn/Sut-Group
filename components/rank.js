import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firestore';
import { collection, doc, setDoc, getDoc, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
function Rank() {
    const navigation = useNavigation();
    const [scores, setScores] = useState([]);
  
    useEffect(() => {
        // Define a reference to the "game" collection
        const gameCollection = collection(FIRESTORE_DB, 'game');
    
        // Create a query to order the documents by "score" in descending order
        const q = query(gameCollection, orderBy('score', 'desc'));
  
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          // Extract and store the data in the scores state whenever there's a change
          const scoresData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setScores(scoresData);
          console.log(scoresData);
        });
        
        // Unsubscribe when the component unmounts to avoid memory leaks
        return () => unsubscribe();
      }, []);

    return (
        <View style={styles.container}>
          <ImageBackground
            source={require('../assets/bg.png')}
            style={styles.background}
          >
            <View style={styles.myscore}>
              <Image style={{ width: 250, height: 250, top: 50, left:20 }} source={require('../assets/bask.png')} />
              <Text style={{ fontSize: 24, marginBottom: 20 }}>อันดับผู้เล่น</Text>
              {scores.slice(0, 3).map((scoreData, index) => (
                <View key={scoreData.id} style={styles.scoreItem}>
                    <View style={{top: -50}}>
                     <Avatar.Icon icon="account-circle" size={50} style={{ top: 40, left: -60 , backgroundColor:'orange'}} color={'#FFF'} />
            <Image
              source={{ uri: scoreData.profileImg }}
              style={{  borderRadius: 50, position: 'absolute', width: 50, height:50, left: -60, top: 40 }}
            />
                  <Text style={{ fontSize: 14, fontWeight: 'bold' }}>อันดับที่ {index + 1} {scoreData.username}</Text>
                  <Text style={{ fontSize: 14 }}>คะแนน: {scoreData.score}</Text>
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={{ top: 30, width: 190, padding: 10, backgroundColor: '#F47D38', borderRadius: 10, margin: 2,left:20 }}
                onPress={() => navigation.goBack()}
              >
                <Text style={{ left: 60, color: 'white' }} onPress={() => navigation.navigate('BasketGame')}>เริ่มเกม</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ top: 30, width: 190, padding: 10, backgroundColor: '#F47D38', borderRadius: 10, margin: 2,left:20  }}
                onPress={() => navigation.goBack()}
              >
                <Text style={{ left: 40, color: 'white' }}>กลับไปหน้าหลัก</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      );
    }

    const styles = StyleSheet.create({
        container: {
          paddingTop: StatusBar.currentHeight,
          height: 800
        },
        myscore: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          top: -120,
          left: -5
        },
        background: {
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        scoreItem: {
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          width: 200,
          padding: 10,
          borderRadius: 10,
          margin: 10,
          height:50,
          left: 20
        },
      });
      

export default Rank;

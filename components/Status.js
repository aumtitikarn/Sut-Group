import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { Avatar } from 'react-native-paper';
import { onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firestore';


const Status = ({ route, navigation }) => {
  const { name } = route.params;
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { profileImg } = route.params;
  const { uid } = route.params;


  useEffect(() => {
    const fetchStories = async () => {
      const storyCollectionRef = collection(FIRESTORE_DB, 'Story');
      const storyQuery = query(storyCollectionRef, where('uid', '==', uid));

      try {
        const querySnapshot = await getDocs(storyQuery);

        if (!querySnapshot.empty) {
          const storyDataList = querySnapshot.docs.map((doc) => doc.data());

          // Filter out stories older than 24 hours
          const filteredStories = storyDataList.filter(
            (story) => story.timestamp.toMillis() > Date.now() - 24 * 60 * 60 * 1000
          );

          // Sort stories based on timestamp in descending order (latest first)
          const sortedStories = filteredStories.sort(
            (a, b) => b.timestamp.toMillis() - a.timestamp.toMillis()
          );

          setStories(sortedStories);
        } else {
          console.log('No matching Story documents found for the provided uid');
        }
      } catch (error) {
        console.error('Error fetching stories:', error.message);
      }
    };

    fetchStories();
  }, [uid]);


  const formatPostTime = (timestamp) => {
    if (timestamp) {
      // ดึงค่าเวลาปัจจุบัน
      const now = new Date().getTime();
  
      // แปลง timestamp เป็น milliseconds ให้กับ JavaScript Date Object
      const postTime = new Date(timestamp.toDate());
  
      // คำนวณความต่างระหว่างเวลาปัจจุบันกับเวลาโพสต์
      const timeDifference = now - postTime.getTime();
  
      // แปลง milliseconds เป็นวินาที
      const seconds = Math.floor(timeDifference / 1000);
  
      // แปลงวินาทีเป็นนาที
      const minutes = Math.floor(seconds / 60);
  
      // แปลงนาทีเป็นชั่วโมง
      const hours = Math.floor(minutes / 60);
  
      // แปลงชั่วโมงเป็นวัน
      const days = Math.floor(hours / 24);
  
      if (days > 0) {
        return `${days} วันที่แล้ว`;
      } else if (hours > 0) {
        return `${hours} ชั่วโมงที่แล้ว`;
      } else if (minutes > 0) {
        return `${minutes} นาทีที่แล้ว`;
      } else if (seconds > 0) {
        return `${seconds} วินาทีที่แล้ว`;
      } else {
        return 'เมื่อไม่นานมานี้';
      }
    } else {
      return 'ไม่มีข้อมูลวันที่';
    }
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <StatusBar backgroundColor="black" barStyle="light-content" />
      {stories.length > 0 ? (
        <Image
          source={{ uri: stories[currentIndex].uri }}
          style={{ flex: 1, width: '100%', borderRadius: 10, borderWidth: 2 }}
        />
      ) : (
        <Text style={{ color: 'white' }}>Loading or placeholder text</Text>
      )}
      <View
        style={{
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          top: 12,
          left: 0,
          width: '90%',
        }}>
        <View
          style={{
            borderRadius: 100,
            width: 30,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Avatar.Icon
            icon="account-circle"
            size={30}
            style={{
              backgroundColor: '#1C1441',
              position: 'absolute',
            }}
            color={'#FFF'}
          />
          <Image
            source={{ uri: profileImg }}
            style={{
              borderRadius: 100,
              resizeMode: 'cover',
              width: '92%',
              height: '92%',
            }}
          />
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 15, paddingLeft: 10 }}>
              {name}
            </Text>
            {stories.length > 0 && // Check if stories array is not empty
              formatPostTime(stories[currentIndex].timestamp) !== 'ไม่มีข้อมูลวันที่' &&
              !formatPostTime(stories[currentIndex].timestamp).includes('วัน') && (
                <Text style={{ color: '#777267' }}> ● {formatPostTime(stories[currentIndex].timestamp)}</Text>
              )}
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionic
              name="close"
              style={{ fontSize: 20, color: 'white', opacity: 0.6 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginVertical: 10,
          width: '100%',
        }}>
        {/* Add navigation buttons or indicators to switch between stories */}
        <TouchableOpacity
          onPress={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex > 0 ? prevIndex - 1 : stories.length - 1
            )
          }>
          <Text style={{ color: 'white' }}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex < stories.length - 1 ? prevIndex + 1 : 0
            )
          }>
          <Text style={{ color: 'white' }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Status;
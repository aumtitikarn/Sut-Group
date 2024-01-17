import React, { useState, useEffect, useRef } from 'react';
import { View,
   Text,  
   SafeAreaView, 
   StyleSheet, 
   TextInput, 
   TouchableOpacity,
   StatusBar,
   Image,
  Platform,
  Alert, } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIRESTORE_DB, FIREBASE_STORAGE } from '../firestore';
import { addDoc,
    collection,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    onSnapshot
    } 
from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_AUTH } from '../firestore';
import { Select,Box,CheckIcon,NativeBaseProvider } from "native-base";

const Createpost = ({ navigation }) => {
  const [feed, setFeed] = useState('');
  const [like, setLike] = useState('');
  const [comment, setComment] = useState('');
  const [share, setShare] = useState('');
  const [photo, setPhoto] = useState(null);
  const [username, setUsername] = useState(''); // เก็บค่า name ของผู้ใช้ที่เข้าสู่ระบบ
  const [faculty, setFaculty] = useState(''); // เก็บค่า faculty ของผู้ใช้ที่เข้าสู่ระบบ
  const [profileImg, setProfileImg] = useState(''); 
  const [userData, setUserData] = useState({});
  const [selectedOption, setSelectedOption] = useState('allpostHome');
  const [error, setError] = useState(null);
  const db = FIRESTORE_DB;
  const storage = FIREBASE_STORAGE;
  const auth = FIREBASE_AUTH;

    const fetchUsers = async () => {
      try {
        const userUid = auth.currentUser.uid;
        const userCollectionRef = collection(db, 'users');
        const userDocRef = doc(userCollectionRef, userUid);

        // ใช้ onSnapshot เพื่อติดตามการเปลี่ยนแปลงในเอกสารของผู้ใช้
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setUserData(userData);
          }
        });

        // เพื่อคลุมครองการแบ่งปัน ต้องนำออกเมื่อคอมโพเนนต์ถูกคลุมครอง (unmounted)
        return unsubscribe;
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    useEffect(() => {
      const unsubscribe = fetchUsers();
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }, []);

  useEffect(() => {
    const userUid = auth.currentUser?.uid;
    if (userUid) {
      const userCollectionRef = collection(db, 'users');
      const userDocRef = doc(userCollectionRef, userUid);
  
      getDoc(userDocRef)
        .then((userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUsername(userData.username);
            setFaculty(userData.faculty);
            setProfileImg(userData.profileImg);
          } else {
            console.error('User document does not exist.');
          }
        })
        .catch((error) => {
          console.error('Error fetching user data: ', error);
        });
    }
  }, [auth.currentUser]);

  // ดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ


  const handlePost = async () => {
    try {
      const userUid = auth.currentUser?.uid;
      if (userUid) {
        // สร้างค่า id สำหรับเอกสาร (เช่นตามเวลาปัจจุบัน)
        const id = Date.now().toString(); // หรือวิธีอื่น ๆ ที่คุณต้องการ
  
        const postHomeCollectionRef = collection(db, 'users', userUid, 'postHome');
  
        // สร้างอ็อบเจกต์ข้อมูลโพสต์
        const post = {
          username: username,
          faculty: faculty,
          text: feed,
          timestamp: serverTimestamp(),
          userUid: userUid,
          postid: id,
          like: 0,
          // profileImg: profileImg
        };
  
        if (profileImg) {
          post.profileImg = profileImg;
        }
        
        if (photo) {
          // แก้ไขชื่อรูปภาพให้เป็น id ของโพสต์
          const fileName = `${id}.jpg`;
        
          // อัปโหลดรูปภาพไปยัง Firebase Storage
          const storageRef = ref(storage, 'photo_post/' + fileName); // ต้องใช้ ref() แทน storage.ref()
        
          const response = await fetch(photo);
          const blob = await response.blob();
        
          await uploadBytes(storageRef, blob);
        
          // อัปเดตค่า 'photo' ด้วย URI ที่อ้างอิงจาก Firebase Storage
          const downloadURL = await getDownloadURL(storageRef);
          post.photo = downloadURL;
        }
  
        // ใช้ค่า id ในชื่อคอลเลกชัน 'allpostHome'
        const allpostHomeCollectionRef = collection(db, 'allpostHome');
  
        // อัปเดตเอกสารในคอลเลกชัน 'allpostHome' ด้วยข้อมูลจาก 'post' object
        await setDoc(doc(allpostHomeCollectionRef, id), post);
        await setDoc(doc(postHomeCollectionRef, id), post);
  
        navigation.navigate('Home');
        console.log('Document written with ID: ', id);
        setFeed('');
        setPhoto(null);
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handlePostGroup = async () => {
    try {
      const userUid = auth.currentUser?.uid;
      if (userUid) {
        const id = Date.now().toString();
        const facultyDocName = getFacultyDocName(faculty);
  
        // Reference to the faculty document within the 'groupPost' collection
        const facultyDocRef = doc(db, 'groupPost', facultyDocName);
  
        const post = {
          username: username,
          faculty: faculty,
          text: feed,
          timestamp: serverTimestamp(),
          userUid: userUid,
          postid: id,
          like: 0,
        };
  
        if (profileImg) {
          post.profileImg = profileImg;
        }
  
        if (photo) {
          const fileName = `${id}.jpg`;
          const storageRef = ref(storage, 'photo_post/' + fileName);
          const response = await fetch(photo);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);
          post.photo = downloadURL;
        }
  
        // Add the post document to the specified faculty within the 'groupPost' collection
        await setDoc(doc(facultyDocRef, 'posts', id), post);
  
        navigation.navigate('Home');
        console.log('Document written with ID: ', id);
        setFeed('');
        setPhoto(null);
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    function getFacultyDocName(faculty) {
      switch (faculty) {
        case '⚗️สำนักวิชาวิทยาศาสตร์':
          return 'Science';
        case '🧭สำนักวิชาเทคโนโลยีสังคม':
          return 'Social';
        case '🌲สำนักวิชาเทคโนโลยีการเกษตร':
          return 'Agriculture';
        case '⚙️สำนักวิชาวิศวกรรมศาสตร์':
          return 'Engineer';
        case '🩺สำนักวิชาแพทย์':
          return 'Doctor';
        case '💉สำนักวิชาพยาบาลศาสตร์':
          return 'Nurse';
        case '🦷สำนักวิชาทันตแพทย์':
          return 'Dentis';
        case '🏥สำนักวิชาสาธารณสุขศาสตร์':
          return 'Publichealth';
        case '💻กลุ่มหลักสูตรศาสตร์และศิลป์ดิจิทัล':
          return 'ArtandScience';
        default:
          return '';
      }
    }
  };
 // เข้าถึงกล้อง
const camera = async () => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [10, 10],
    quality: 1,
  });

  if (!result.canceled) {
    setPhoto(result.assets[0].uri);
  }
};

// เข้าถึงคลังรูปภาพ
const openlib = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [10, 10],
    quality: 1,
  });

  console.log(result);

  if (!result.canceled) {
    setPhoto(result.assets[0].uri);
  }
};
 

  return (
    <NativeBaseProvider>
    <SafeAreaView style={styles.container}>
    <View style={{left:25, top: 5}} >
    <MaterialCommunityIcons 
      name="arrow-left"  
      size={35} style={{margin:10}} 
      onPress={() => navigation.navigate('Home')}
      />
    </View>
      <View
   style={{
      top: 10,
      left: 20, 
    }}>
    <Avatar.Icon icon="account-circle" size={80} style={{ backgroundColor:'#1C1441',}} color={'#FFF'} />
    <Image
          source={{ uri: userData.profileImg }}
          style={{ width: 80, height: 80,  borderRadius: 50, position: 'absolute' }}
        />
    </View>
     <View
   style={{
     top: -60,
      left: 110, 
    }}>
      <Box maxW="50">
          <Select
            selectedValue={selectedOption}
            minWidth="150"
            accessibilityLabel="Choose Service"
            placeholder="การมองเห็น"
            style={styles.view}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="1" />,
            }}
            mt={1}
            onValueChange={(itemValue) => setSelectedOption(itemValue)}
          >
            <Select.Item label="ทั้งหมด" value="allpostHome" />
            <Select.Item label="เฉพาะสำนักวิชา" value="groupPost" />
          </Select>
        </Box>
      <TextInput
        style={styles.input}
        placeholder="คุณกำลังคิดอะไรอยู่..."
        placeholderTextColor="Gray"
        textAlignVertical="top" 
        multiline={true}
        value={feed}
        onChangeText={(text) => setFeed(text)}
      />
    </View>
    {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginLeft: 110,top: -50, margin: 10 }} />}
    <View style={styles.iconContainer}>
    <Icon name="camera" size={20} color="#000" style={styles.icon} onPress={camera}/>
    <Icon name="image" size={20} color="#000" style={styles.icon} onPress={openlib}/>
    </View>
    <View style={{
      top: -80,
      left: 275
    }}>
     <TouchableOpacity style={styles.buttonYellow} onPress={() => {
            // Check the selected option and call the appropriate function
            if (selectedOption === 'allpostHome') {
              handlePost();
            } else if (selectedOption === 'groupPost') {
              handlePostGroup();
            }
          }}>
            <Text style={{ color: "#1C1441" }}>โพสต์</Text>
          </TouchableOpacity>
    </View>
      
    </SafeAreaView>
    </NativeBaseProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8AD1DB',
    paddingTop: StatusBar.currentHeight 
  },
   input: {
    height: 200,
    width: 275,
    borderWidth: 1,
    borderRadius:10,
    padding: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    backgroundColor: '#FFF'
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    top:-50,
    marginLeft: 105
  },
  icon: {
    marginRight: 10,
  },
   buttonYellow: {
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: '#FDF4E2',
    width: 100,
    padding:5,
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 5
  },
  selectedImage: {
    width: 200,
    height: 110,
    alignSelf: 'center', 
  },
  view: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
   borderRadius: 40,
   backgroundColor: '#FFF',
  },
});
export default Createpost;
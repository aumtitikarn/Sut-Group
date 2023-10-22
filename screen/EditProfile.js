import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image, 
    ScrollView, 
    SafeAreaView, 
    StatusBar,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE } from '../firestore'; 
import { getDoc, doc, setDoc, updateDoc, query, collection, where, getDocs, writeBatch } from 'firebase/firestore'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-paper';
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const EditProfile = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const facultyTextRef = useRef(null);
    const [newData, setNewData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [uid, setUid] = useState('');
    const [photo, setPhoto] = useState('');
    const [bigImg, setBigImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const storage = FIREBASE_STORAGE;
    const db = FIRESTORE_DB;
    const auth = FIREBASE_AUTH;

    const fetchUserData = async () => {
        const user = FIREBASE_AUTH.currentUser;
      
        if (user) {
          const userId = user.uid;
          const userDocRef = doc(FIRESTORE_DB, 'users', userId);
      
          try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserData(userData);
      
              // ตรงนี้คุณควรเรียก setProfileImg และ setBigImg โดยใช้ข้อมูลจาก Firestore
              setProfileImg(userData.profileImg);
              setBigImg(userData.bigImg);
            }
          } catch (error) {
            console.error('Error fetching user data:', error.message);
          }
      
          setIsLoading(false);
        }
      };
      
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
          uploadImage(result.assets[0].uri, 'profileImg'); // ส่ง 'profileImg' เพื่อระบุการอัปโหลดรูปภาพสำหรับ profile
        }
      };
      
      const uploadImage = async (uri, imageType) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `${uid}-${imageType}.jpg`); // ใช้ UID และ imageType ในชื่อไฟล์
    await uploadBytes(storageRef, blob);

    // หลังจากอัปโหลดสำเร็จ รับ URI จาก Storage
    const downloadURL = await getDownloadURL(storageRef);

    // อัปเดตข้อมูลของผู้ใช้ใน Firestore ด้วย URI รูปภาพใหม่
    const userRef = doc(db, 'users', auth.currentUser.uid);

    // ตรวจสอบ imageType เพื่อเลือกที่จะอัปเดต
    const updateData = {};
    updateData[imageType] = downloadURL;

    await updateDoc(userRef, updateData);

    // อัปเดต state สำหรับแสดงรูปภาพใหม่
    if (imageType === 'profileImg') {
      setProfileImg(downloadURL);
    }

    // อัปเดตข้อมูลในคอลเลคชัน allpostHome ด้วยข้อมูลใหม่
    const allPostHomeCollectionRef = collection(db, 'allpostHome');
    const allPostHomeQuery = query(allPostHomeCollectionRef, where('userUid', '==', auth.currentUser.uid));

    const allPostHomeSnapshot = await getDocs(allPostHomeQuery);
    const allPostHomeBatch = writeBatch(db);

    allPostHomeSnapshot.forEach((doc) => {
      allPostHomeBatch.update(doc.ref, updateData);
    });

    await allPostHomeBatch.commit();

    // อัปเดตข้อมูลในคอลเลคชัน postHome ด้วยข้อมูลใหม่
    const userPostHomeCollectionRef = collection(db, 'users', auth.currentUser.uid, 'postHome');

    const postHomeSnapshot = await getDocs(userPostHomeCollectionRef);
    const postHomeBatch = writeBatch(db);

    postHomeSnapshot.forEach((doc) => {
      postHomeBatch.update(doc.ref, updateData);
    });

    await postHomeBatch.commit();
  } catch (error) {
    console.error('Error uploading image: ', error);
  }
};

  const Lib = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [10, 10],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setBigImg(result.assets[0].uri);
      uploadBigImage(result.assets[0].uri);
    }
  };
  const uploadBigImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `${uid}.jpg`); // ใช้ UID ของผู้ใช้เป็นชื่อไฟล์
      await uploadBytes(storageRef, blob);

      // หลังจากอัปโหลดสำเร็จ รับ URI จาก Storage
      const downloadURL = await getDownloadURL(storageRef);

      // อัปเดตข้อมูลของผู้ใช้ใน Firestore ด้วย URI รูปภาพใหม่
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        bigImg: downloadURL, // เพิ่ม URI รูปภาพใหม่
      }, { merge: true });

      // อัปเดต state สำหรับแสดงรูปภาพใหม่
      setBigImg(downloadURL);
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
    
  const handleSaveChanges = async () => {
    try {
      const userUid = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', userUid);
  
      // สร้างอ็อบเจกต์ที่ใช้เพื่อเก็บข้อมูลที่ควรอัปเดต
      const updatedUserData = {};
  
      // ตรวจสอบและเพิ่มข้อมูลเฉพาะเมื่อมีค่าใน newData
      if (newData.username) {
        updatedUserData.username = newData.username;
      }
      if (newData.email) {
        updatedUserData.email = newData.email;
      }
      if (newData.faculty) {
        updatedUserData.faculty = newData.faculty;
      }
      if (newData.major) {
        updatedUserData.major = newData.major;
      }
  
      // ตรวจสอบว่ามีข้อมูลที่ควรอัปเดตหรือไม่
      if (Object.keys(updatedUserData).length > 0) {
        // อัปเดตข้อมูลผู้ใช้
        await updateDoc(userDocRef, updatedUserData);
  
        // อัปเดตข้อมูลในคอลเลคชัน postHome ของผู้ใช้
        const userPostHomeCollectionRef = collection(db, 'users', auth.currentUser.uid, 'postHome');
  
        const userPostHomeSnapshot = await getDocs(userPostHomeCollectionRef);
        const batch = writeBatch(db);
  
        userPostHomeSnapshot.forEach((doc) => {
          batch.update(doc.ref, updatedUserData);
        });
  
        await batch.commit();
  
        // อัปเดตข้อมูลในคอลเลคชัน allpostHome ด้วยข้อมูลใหม่
        const allPostHomeCollectionRef = collection(db, 'allpostHome');
        const allPostHomeQuery = query(allPostHomeCollectionRef, where('userUid', '==', userUid));
  
        const allPostHomeSnapshot = await getDocs(allPostHomeQuery);
        const allPostHomeBatch = writeBatch(db);
  
        allPostHomeSnapshot.forEach((doc) => {
          allPostHomeBatch.update(doc.ref, updatedUserData);
        });
  
        await allPostHomeBatch.commit();
  
        alert('Data updated');
        navigation.navigate('Profile');
      } else {
        console.error('No valid data to update');
      }
    } catch (error) {
      console.error('Error updating user data:', error.message);
    }
  };
  

      return (
        <SafeAreaView style={styles.container}>
        <View>
            <View style={{ position: 'relative' }}>
                <Image source={require('../assets/grey.jpg')} 
                    style={{ width: 450, height: 150 }}
                />
                {bigImg && (
            <Image
                source={{ uri: bigImg }}
                style={{
                width: 450,
                height: 150,
                top: 0,
                position: 'absolute',
                }}
            />
            )}
                <TouchableOpacity onPress={Lib}>
                <MaterialCommunityIcons 
                    name="pencil-outline"  
                    size={30}
                    style={{ position: 'absolute', top: -40, left: 360, color: 'black' }}
                />
                </TouchableOpacity>
                <MaterialCommunityIcons 
                    name="arrow-left-thick"  
                    size={50} style={{margin:10, position: 'absolute', color: 'black'}} 
                    onPress={() => navigation.navigate('Profile')} 
                />
            </View>
        <View style={{
              top: -50,
              left: 150
              
            }}>
                <Avatar.Icon icon="account-circle" size={100} style={{ backgroundColor:'orange' }} color={'#FFF'}/>
                {profileImg && <Image source={{ uri: profileImg }} style={{ width: 100, height: 100, Left: 150, top: 0, borderRadius: 50, position: 'absolute',}} />}
            </View>
            <TouchableOpacity onPress={openlib}>
            <MaterialCommunityIcons 
                    name="pencil-outline"  
                    size={30}
                    style={{ position: 'absolute', top: -80, left:150, color: 'black' }}
                />
            </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 20, left: 20, top:-20}}>
            แก้ไขข้อมูลส่วนตัว
        </Text>
        <TextInput
        style={styles.input}
        placeholder={`${userData.username || ''}`}
        onChangeText={(text) => setNewData({ ...newData, username: text })}
      />
       <TextInput
       style={styles.input}
        placeholder={`${userData.faculty || ''}`}
        onChangeText={(text) => setNewData({ ...newData, faculty: text })}
      />
       <TextInput
       style={styles.input}
        placeholder={`${userData.major || ''}`}
        onChangeText={(text) => setNewData({ ...newData, major: text })}
      />
      <TextInput
      style={styles.input}
        placeholder={`${userData.email || ''}`}
        onChangeText={(text) => setNewData({ ...newData, email: text })}
      />
      <TouchableOpacity style={styles.buttonYellow} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
      </TouchableOpacity>
        </View>
        </SafeAreaView>
      )
    };
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF6DE',
        flex: 1,
        paddingTop: StatusBar.currentHeight
      },
    userDataContainer: {
        top: -70,
        left: 110
    },
    userDataText: {
        fontSize: 18,
        padding: 5
    },
    input: {
        borderWidth: 1,
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginTop: 12,
        padding: 10,
        marginRight: 30,
        left: 20
      },
      buttonYellow: {
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#FFBD59',
        width: 90,
        padding: 8,
        margin: 10,
        left: 300
      },
      });
      
export default EditProfile;
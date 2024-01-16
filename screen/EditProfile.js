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
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB, FIREBASE_STORAGE } from '../firestore'; 
import { getDoc, doc, setDoc, updateDoc, query, collection, where, getDocs, writeBatch, subcollection } from 'firebase/firestore'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'react-native-paper';
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Select,Box,CheckIcon,NativeBaseProvider } from "native-base";

const EditProfile = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const facultyTextRef = useRef(null);
    const [newData, setNewData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState('');
    const [faculty, setFaculty] = useState('');
    const [bigImg, setBigImg] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [Loading, setLoading] = useState(false);
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
              setEmail(userData.email);
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
    const storageRef = ref(storage, `${userData.email}/profileImg.jpg`);
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
      alert('อัพเดทรูปโปรไฟล์เรียบร้อยแล้ว');
      setProfileImg(downloadURL);
    }

    // อัปเดตข้อมูลในคอลเลคชัน allpostHome ด้วยข้อมูลใหม่
    const userUid = auth.currentUser.uid;
    const allPostHomeCollectionRef = collection(db, 'allpostHome');
    const StoryCollectionRef = collection(db, 'Story');
    const GroupChatCollectionRef = collection(db, 'groupchat');
    const allPostShopCollectionRef = collection(db, 'allpostShop');
    const gameCollectionRef = collection(db, 'game');
    const allPostHomeQuery = query(allPostHomeCollectionRef, where('userUid', '==', auth.currentUser.uid));
    const allPostShopQuery = query(allPostShopCollectionRef, where('userUid', '==', auth.currentUser.uid));
    const gameQuery = query(gameCollectionRef, where('id', '==', userUid));
    const StoryQuery = query(StoryCollectionRef, where('uid', '==', userUid));
    const GroupChatQuery = query(GroupChatCollectionRef, where('uid', '==', userUid));
    

    const allPostHomeSnapshot = await getDocs(allPostHomeQuery);
    const GroupChatSnapshot = await getDocs(GroupChatQuery);
    const allPostShopSnapshot = await getDocs(allPostShopQuery);
    const gameSnapshot = await getDocs(gameQuery);
    const StorySnapshot = await getDocs(StoryQuery);

    const allPostHomeBatch = writeBatch(db);
    const allPostShopBatch = writeBatch(db);
    const Batch = writeBatch(db);

    const allPostHomecommentCollectionRef = collection(db, 'allpostHome');
    const allPostHomecommentQuery = query(allPostHomecommentCollectionRef);

    const allPostHomecommentSnapshot = await getDocs(allPostHomecommentQuery);

    for (const allPostHomeDoc of allPostHomecommentSnapshot.docs) {
      const commentCollectionRef = collection(allPostHomeDoc.ref, 'comment');
      const commentQuery = query(commentCollectionRef, where('userUid', '==', userUid));
      const commentSnapshot = await getDocs(commentQuery);

      commentSnapshot.forEach((doc) => {
        // ทำการอัปเดตข้อมูลใน comment collection ตามที่คุณต้องการ
        allPostHomeBatch.update(doc.ref,updateData);
      });
      const commenttCollectionRef = collection(allPostHomeDoc.ref, 'comment');
        const commenttQuery = query(commenttCollectionRef);
        const commenttSnapshot = await getDocs(commenttQuery);
      
        for (const commentDoc of commenttSnapshot.docs) {
          const replyCollectionRef = collection(commentDoc.ref, 'reply');
          const replyQuery = query(replyCollectionRef, where('userUid', '==', userUid));
          const replySnapshot = await getDocs(replyQuery);
          
          replySnapshot.forEach((replyDoc) => {
            // ทำการอัปเดตข้อมูลใน reply collection ตามที่คุณต้องการ
            allPostHomeBatch.update(replyDoc.ref, updateData);
          });
        }
    }

    GroupChatSnapshot.forEach((doc) => {
      Batch.update(doc.ref, updateData);
    });

    StorySnapshot.forEach((doc) => {
      Batch.update(doc.ref, updateData);
    });

    gameSnapshot.forEach((doc) => {
      Batch.update(doc.ref, updateData);
    });

    allPostHomeSnapshot.forEach((doc) => {
      allPostHomeBatch.update(doc.ref, updateData);
    });

    allPostShopSnapshot.forEach((doc) => {
      allPostShopBatch.update(doc.ref, updateData);
    });

    await Batch.commit();
    await allPostHomeBatch.commit();
    await allPostShopBatch.commit();

    // อัปเดตข้อมูลในคอลเลคชัน postHome ด้วยข้อมูลใหม่
    const userPostHomeCollectionRef = collection(db, 'users', auth.currentUser.uid, 'postHome');
    const userPostShopCollectionRef = collection(db, 'users', auth.currentUser.uid, 'postShop');
    const usershareCollectionRef = collection(db, 'users', auth.currentUser.uid, 'share');
    const allchatCollectionRef = collection(db, 'users', auth.currentUser.uid, 'allchat');
    const allchatQuery = query(allchatCollectionRef, where('id', '==', userUid));
    const postHomeSnapshot = await getDocs(userPostHomeCollectionRef);
    const postShopSnapshot = await getDocs(userPostShopCollectionRef);
    const usershareSnapshot = await getDocs(usershareCollectionRef);
    const allchatSnapshot = await getDocs(allchatQuery);
    const postHomeBatch = writeBatch(db);
    const postShopBatch = writeBatch(db);

    allchatSnapshot.forEach((doc) => {
      postHomeBatch.update(doc.ref, updateData);
      
    });

    usershareSnapshot.forEach((doc) => {
      postHomeBatch.update(doc.ref, updateData);
      
    });
    postHomeSnapshot.forEach((doc) => {
      postHomeBatch.update(doc.ref, updateData);
    });

    postShopSnapshot.forEach((doc) => {
      postShopBatch.update(doc.ref, updateData);
    });

    await postHomeBatch.commit();
    await postShopBatch.commit();
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
      const storageRef = ref(storage, `${userData.email}/BigImg.jpg`); // ใช้ UID ของผู้ใช้เป็นชื่อไฟล์
      await uploadBytes(storageRef, blob);

      // หลังจากอัปโหลดสำเร็จ รับ URI จาก Storage
      const downloadURL = await getDownloadURL(storageRef);

      // อัปเดตข้อมูลของผู้ใช้ใน Firestore ด้วย URI รูปภาพใหม่
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userRef, {
        bigImg: downloadURL, // เพิ่ม URI รูปภาพใหม่
      }, { merge: true });
      alert('อัพเดทรูปปกเรียบร้อยแล้ว');
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
      setLoading(true);
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
  
        // อัปเดตข้อมูลในคอลเลคชัน allpostHome ของผู้ใช้
        const allPostHomeCollectionRef = collection(db, 'allpostHome');
        const allPostShopCollectionRef = collection(db, 'allpostShop');
        const StoryCollectionRef = collection(db, 'Story');
        const gameCollectionRef = collection(db, 'game');
        const GroupChatCollectionRef = collection(db, 'groupchat');
        const userPostHomeCollectionRef = collection(db, 'users', auth.currentUser.uid, 'postHome');
        const userPostShopCollectionRef = collection(db, 'users', auth.currentUser.uid, 'postShop');
        const usershareCollectionRef = collection(db, 'users', auth.currentUser.uid, 'share');
        const allchatCollectionRef = collection(db, 'users', auth.currentUser.uid, 'allchat');

        // สร้างคิวรีเพื่อเลือกเอกสารที่ตรงกับ userUid
        const allPostHomeQuery = query(allPostHomeCollectionRef, where('userUid', '==', userUid));
        const allPostShopQuery = query(allPostShopCollectionRef, where('userUid', '==', userUid));
        const allchatShopQuery = query(allchatCollectionRef, where('id', '==', userUid));
        const gameQuery = query(gameCollectionRef, where('id', '==', userUid));
        const StoryQuery = query(StoryCollectionRef, where('uid', '==', userUid));
        const GroupChatQuery = query(GroupChatCollectionRef, where('uid', '==', userUid));

        const allPostHomeSnapshot = await getDocs(allPostHomeQuery);
        const allPostShopSnapshot = await getDocs(allPostShopQuery);
        const StoryShopSnapshot = await getDocs(StoryQuery);
        const userPostHomeSnapshot = await getDocs(userPostHomeCollectionRef);
        const userPostShopSnapshot = await getDocs(userPostShopCollectionRef);
        const usershareSnapshot = await getDocs(usershareCollectionRef);
        const allchatSnapshot = await getDocs(allchatShopQuery);
        const gameSnapshot = await getDocs(gameQuery);
        const GroupChatSnapshot = await getDocs(GroupChatQuery);
        // เลือกทุกเอกสารในคอลเลคชัน allpostHome
      const allPostHomecommentCollectionRef = collection(db, 'allpostHome');
      const allPostHomecommentQuery = query(allPostHomecommentCollectionRef);

      const allPostHomecommentSnapshot = await getDocs(allPostHomecommentQuery);

      // เลือกทุก comment collection ในทุกเอกสาร allpostHome ที่มี userUid ตรงกับผู้ใช้ปัจจุบัน
      const batch = writeBatch(db);

      for (const allPostHomeDoc of allPostHomecommentSnapshot.docs) {
        const commentCollectionRef = collection(allPostHomeDoc.ref, 'comment');
        const commentQuery = query(commentCollectionRef, where('userUid', '==', userUid));
        const commentSnapshot = await getDocs(commentQuery);
      
        commentSnapshot.forEach((commentDoc) => {
          // ทำการอัปเดตข้อมูลใน comment collection ตามที่คุณต้องการ
          batch.update(commentDoc.ref, updatedUserData);
        });

        const commenttCollectionRef = collection(allPostHomeDoc.ref, 'comment');
        const commenttQuery = query(commenttCollectionRef);
        const commenttSnapshot = await getDocs(commenttQuery);
      
        for (const commentDoc of commenttSnapshot.docs) {
          const replyCollectionRef = collection(commentDoc.ref, 'reply');
          const replyQuery = query(replyCollectionRef, where('userUid', '==', userUid));
          const replySnapshot = await getDocs(replyQuery);
          
          replySnapshot.forEach((replyDoc) => {
            // ทำการอัปเดตข้อมูลใน reply collection ตามที่คุณต้องการ
            batch.update(replyDoc.ref, updatedUserData);
          });
        }
      }


      StoryShopSnapshot.forEach((doc) => {
        batch.update(doc.ref, updatedUserData); 
        
      });

      allchatSnapshot.forEach((doc) => {
        batch.update(doc.ref, updatedUserData); 
        
      });

      GroupChatSnapshot.forEach((doc) => {
        batch.update(doc.ref, updatedUserData);
      });
  
      gameSnapshot.forEach((doc) => {
        batch.update(doc.ref, updatedUserData); 
        
      });

      usershareSnapshot.forEach((doc) => {
        batch.update(doc.ref, updatedUserData); 
        
      });
        // อัปเดตคุณสมบัติในเอกสารในคอลเลคชัน allpostHome
        allPostHomeSnapshot.forEach((doc) => {
          batch.update(doc.ref, updatedUserData);
          
        });
  
        // อัปเดตคุณสมบัติในเอกสารในคอลเลคชัน allpostShop
        allPostShopSnapshot.forEach((doc) => {
          batch.update(doc.ref, updatedUserData);
        });

        userPostHomeSnapshot.forEach((doc) => {
          batch.update(doc.ref, updatedUserData);
        });
        userPostShopSnapshot.forEach((doc) => {
          batch.update(doc.ref, updatedUserData);
        });
  
        // ทำการ commit สำหรับ Write Batch เพื่ออัปเดตคุณสมบัติในเอกสารทั้งหมด
        await batch.commit();
        setLoading(false);
        alert('อัพเดทข้อมูลเสร็จสิ้น');
        navigation.navigate('Profile');
      } else {
        console.error('No valid data to update');
      }
    } catch (error) {
      console.error('Error updating user data:', error.message);
    }
  };
      return (
        <NativeBaseProvider>
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
                    style={{ position: 'absolute', top: -40, left: 360, color: 'black', }}
                />
                </TouchableOpacity>
                <MaterialCommunityIcons 
                    name="arrow-left"  
                    size={35} style={{margin:15, position: 'absolute', color: 'black'}} 
                    onPress={() => navigation.navigate('Profile')} 
                />
            </View>
        <View style={{
              top: -50,
              left: 150
              
            }}>
                <Avatar.Icon icon="account-circle" size={80} style={{ backgroundColor:'#1C1441' }} color={'#FFF'}/>
                {profileImg && <Image source={{ uri: profileImg }} style={{ width: 80, height: 80, Left: 150, top: 0, borderRadius: 50, position: 'absolute',}} />}
            </View>
            <TouchableOpacity onPress={openlib}>
            <MaterialCommunityIcons 
                    name="pencil-outline"  
                    size={30}
                    style={{ position: 'absolute', top: -80, left:150, color: 'black' }}
                />
            </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 20, left: 20, top:-20, color: "#1C1441"}}>
            แก้ไขข้อมูลส่วนตัว
        </Text>
        <TextInput
        style={styles.input}
        placeholder={`${userData.username || ''}`}
        onChangeText={(text) => setNewData({ ...newData, username: text })}
      />
       {/* <Box maxW="300">
        <Select selectedValue={newData.faculty} minWidth="370" accessibilityLabel="Choose Service" placeholder={`${userData.faculty || ''}`} style={styles.input} _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={(itemValue) => setNewData({ ...newData, faculty: itemValue })}>
          <Select.Item label="⚗️สำนักวิชาวิทยาศาสตร์" value="⚗️สำนักวิชาวิทยาศาสตร์" />
          <Select.Item label="🧭สำนักวิชาเทคโนโลยีสังคม" value="🧭สำนักวิชาเทคโนโลยีสังคม" />
          <Select.Item label="🌲สำนักวิชาเทคโนโลยีการเกษตร" value="🌲สำนักวิชาเทคโนโลยีการเกษตร" />
          <Select.Item label="⚙️สำนักวิชาวิศวกรรมศาสตร์" value="⚙️สำนักวิชาวิศวกรรมศาสตร์" />
          <Select.Item label="🩺สำนักวิชาแพทย์" value="🩺สำนักวิชาแพทย์" />
          <Select.Item label="💉สำนักวิชาพยาบาลศาสตร์" value="💉สำนักวิชาพยาบาลศาสตร์" />
          <Select.Item label="🦷สำนักวิชาทันตแพทย์" value="🦷สำนักวิชาทันตแพทย์" />
          <Select.Item label="🏥สำนักวิชาสาธารณสุขศาสตร์" value="🏥สำนักวิชาสาธารณสุขศาสตร์" />
          <Select.Item label="💻กลุ่มหลักสูตรศาสตร์และศิลป์ดิจิทัล" value="💻กลุ่มหลักสูตรศาสตร์และศิลป์ดิจิทัล" />
        </Select>
      </Box> */}
       {/* <TextInput
       style={styles.input}
        placeholder={`${userData.major || ''}`}
        onChangeText={(text) => setNewData({ ...newData, major: text })}
      /> */}
      <TextInput
      style={styles.input}
        placeholder={`${userData.email || ''}`}
        onChangeText={(text) => setNewData({ ...newData, email: text })}
      />
      
      <TouchableOpacity style={styles.buttonYellow} onPress={handleSaveChanges}>
        <Text style={{ color: "#1C1441"}}>บันทึกข้อมูล</Text>
      </TouchableOpacity>
      <ActivityIndicator animating={Loading} size="large" color="#33FF99" style={{ left:70, top:-45}}/>
        </View>
        </SafeAreaView>
        </NativeBaseProvider>
      )
    };
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#8AD1DB',
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
        backgroundColor: '#FDF4E2',
        width: 90,
        padding: 8,
        margin: 10,
        left: 300
      },
      });
      
export default EditProfile;

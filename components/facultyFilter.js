import React, { useState, useEffect } from 'react';
import {
  Text, StyleSheet, TouchableOpacity, View, Image, ScrollView, SafeAreaView, Alert
} from 'react-native';
import { FIRESTORE_DB } from '../firestore';
import { collection, query, orderBy, onSnapshot, doc, updateDoc,getDoc, arrayUnion, arrayRemove, setDoc, deleteDoc, getDocs} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '../firestore';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Select,Box,CheckIcon,NativeBaseProvider } from "native-base";
import { useRoute } from '@react-navigation/native';



const FacultyFilter = () => {
  const [posts, setPosts] = useState([]);
  const route = useRoute();
  const { DocName } = route.params;
  const db = FIRESTORE_DB;
  const auth = FIREBASE_AUTH;
  const [faculties, setFaculties] = useState([]);
  const [isLiked, setIsLiked] = useState([]);
  const [likeCount, setLikeCount] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isShared, setIsShared] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();
  const [faculty, setFaculty] = useState('ทั้งหมด');

  useEffect(() => {

    const userUid = auth.currentUser.uid;
  const userRef = doc(db, 'users', userUid);

  const unsubscribeFaculties = onSnapshot(userRef, (docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const facultiesData = userData.faculty || []; // Assuming 'faculties' is an array field
      setFaculties([facultiesData]);
    }
  });
    const q = query(collection(db, 'groupPost', DocName, 'posts'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedPosts = [];
      const updatedIsLiked = {};
      const updatedLikeCount = {};
      const updatedIsShared = {};

      snapshot.forEach((doc) => {
        const post = { id: doc.id, ...doc.data() };
        updatedPosts.push(post);
        updatedIsLiked[post.id] = false;
        updatedLikeCount[post.id] = post.like;
  
        // ตรวจสอบว่าโพสต์ถูกแชร์ไปหรือยังและกำหนดค่าให้กับ isShared
        const isSharedByUser = post.sharedBy && post.sharedBy.includes(auth.currentUser.uid);
        updatedIsShared[post.id] = isSharedByUser;
      });

      setPosts(updatedPosts);
      setIsLiked(updatedIsLiked);
      setLikeCount(updatedLikeCount);
      setIsShared(updatedIsShared); // ตั้งค่า isShared ที่คำนวณแล้ว
    });
  

    return () => {
      unsubscribeFaculties();
      unsubscribe();
    };
  }, []);

 
  const updateLike = async (post) => {
    try {
      const userUid = auth.currentUser.uid;
      const postRef = doc(db, 'groupPost', DocName, 'posts', post.id);
      const postDoc = await getDoc(postRef);
  
      if (postDoc.exists()) {
        const likedBy = postDoc.data().likedBy || [];
  
        if (likedBy.includes(userUid)) {
          const updatedLikedBy = likedBy.filter((uid) => uid !== userUid);
          const newLikeCount = Math.max(post.like - 1, 0);
  
          const updateData = {
            likedBy: updatedLikedBy,
            like: newLikeCount,
          };
  
          await updateDoc(postRef, updateData);
  
          if (post.id in isLiked) {
            setIsLiked((currentIsLiked) => ({
              ...currentIsLiked,
              [post.id]: !currentIsLiked[post.id], // สลับค่ากลับและคาดหวังว่าไอคอนจะเปลี่ยนสี
            }));
          }
          // อัปเดตข้อมูลการไลค์ไปยังคอลเลคชัน "postHome" ใน Firestore
          await updateLikeInPostHome(userUid, post.id, updatedLikedBy, newLikeCount);
        } else {
          const updatedLikedBy = [...likedBy, userUid];
          const newLikeCount = post.like + 1;
  
          const updateData = {
            likedBy: updatedLikedBy,
            like: newLikeCount,
          };
  
          await updateDoc(postRef, updateData);
  
          if (post.id in isLiked) {
            setIsLiked((currentIsLiked) => ({
              ...currentIsLiked,
              [post.id]: true,
            }));
          }
          // อัปเดตข้อมูลการไลค์ไปยังคอลเลคชัน "postHome" ใน Firestore
          await updateLikeInPostHome(userUid, post.id, updatedLikedBy, newLikeCount);
        }
      } else {
        console.error('ไม่พบข้อมูลโพสต์: ', post.id);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการกดไลค์: ', error);
    }
  };

  const updateLikeInPostHome = async (userUid, postId, likedBy, likeCount) => {
    const postHomeRef = doc(db, 'users', userUid, 'postHome', postId);
    
    const postHomeDoc = await getDoc(postHomeRef);
    if (postHomeDoc.exists()) {
      const updateData = {
        likedBy: likedBy,
        like: likeCount,
      };

      await updateDoc(postHomeRef, updateData);
    }
  };
  
  
    
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
      return `เมื่อ ${days} วันที่แล้ว`;
    } else if (hours > 0) {
      return `เมื่อ ${hours} ชั่วโมงที่แล้ว`;
    } else if (minutes > 0) {
      return `เมื่อ ${minutes} นาทีที่แล้ว`;
    } else if (seconds > 0) {
      return `เมื่อ ${seconds} วินาทีที่แล้ว`;
    } else {
      return 'เมื่อไม่นานมานี้';
    }
  } else {
    return 'ไม่มีข้อมูลวันที่';
  }
}

const sharePost = async (userId, postId, postData) => {
  const userDocRef = doc(db, 'users', userId);
  const shareCollectionRef = collection(userDocRef, 'share');
  const postDocRef = doc(shareCollectionRef, postId);

  try {
    // เพิ่มฟิลด์ timeshare ที่เก็บเวลาและวันที่ของการแชร์
    const currentTime = new Date();
    postData.timeshare = currentTime;

    await setDoc(postDocRef, postData);
    console.log('บันทึกโพสต์ลงในคอลเลกชัน "share" เรียบร้อยแล้ว');

    // อัปเดต isShared เมื่อแชร์โพสต์สำเร็จ
    setIsShared((prevIsShared) => ({
      ...prevIsShared,
      [postId]: true,
    }));
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000); // ตรวจสอบว่า setShowAlert(false) ถูกเรียกที่ต้องการ
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการบันทึกโพสต์: ', error);
  }
};

const cancelSharePost = async (userId, postId) => {
  try {
    const userUid = auth.currentUser.uid;

    // 1. ลบโพสต์จาก "postHome" collection ใน Firestore
    const postHomeRef = doc(db, 'users', userUid, 'share', postId);
    await deleteDoc(postHomeRef);
  
    // อัปเดต isShared เมื่อยกเลิกการแชร์โพสต์สำเร็จ
    setIsShared((prevIsShared) => ({
      ...prevIsShared,
      [postId]: false,
    }));
    setShowAlert(true);
    setTimeout(() => {
      setIsShared(true);
    }, 3000); // ตรวจสอบว่า setShowAlert(false) ถูกเรียกที่ต้องการ
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบโพสต์: ', error);
  }
};



const handleSharePost = (post) => {
  const userId = auth.currentUser.uid;
  const postId = post.id;
  const isAlreadyShared = isShared[post.id]; // ตรวจสอบว่าโพสต์ถูกแชร์ไปแล้วหรือยัง
  console.log(isAlreadyShared);
  if (isAlreadyShared) {
    // ถ้าโพสต์ถูกแชร์ไปแล้วให้ยกเลิกการแชร์
    cancelSharePost(userId, postId);
  } else {
    // ถ้าโพสต์ยังไม่ถูกแชร์ให้ทำการแชร์
    sharePost(userId, postId, post);
    setShowAlert(true); // แสดง Alert
    setTimeout(() => {
      setIsShared(true); // ปิด Alert หลังจาก 2 วินาที
    }, 2000);
  }
};
const handleIconBarsPress = (post) => {
  return post.userUid === auth.currentUser?.uid;
};

const toggleDropdown = (postId) => {
  setShowDropdown((prevState) => ({
    ...prevState,
    [postId]: !prevState[postId],
  }));
};
const handleDeletePost = async (postId) => {
  try {
    const userUid = auth.currentUser.uid;

    // 1. Delete the post from the "postHome" collection in Firestore
    const postHomeRef = doc(db, 'users', userUid, 'postHome', postId);
    await deleteDoc(postHomeRef);

    // 2. Delete the post from the "allpostHome" collection in Firestore
    const allpostHomeRef = doc(db, 'groupPost', DocName, 'posts');
    await deleteDoc(allpostHomeRef);

    console.log('ลบโพสต์สำเร็จ');
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบโพสต์: ', error);
  }
};
const handleEditPost = (postId, navigation) => {
  console.log("กดแก้ไขโพสต์ที่ postId:", postId);
  navigation.navigate('EditPostHome', {postId});
};
  
const handleCreatePostPress = () => {
   
  navigation.navigate('Createpost');

};
const filteredPosts = posts.filter(post => faculty === "ทั้งหมด" || post.faculty === faculty);

const handleImagePress = (post) => {
  const isCurrentUser = post.userUid === auth.currentUser?.uid;

  if (isCurrentUser) {
    // If the profile image belongs to the current user, navigate to 'Profile'
    navigation.navigate('Profile');
  } else {
    // If the profile image does not belong to the current user, navigate to 'OtherProfile' and pass the userUid
    console.log('Navigating to OtherProfile with userUid:', post.userUid);
    navigation.navigate('OtherProfile', { userUid: post.userUid });
  }
};


return (
  <NativeBaseProvider>
  <SafeAreaView style={styles.container}>
  <Text style={{ textAlign: 'center', marginTop: 50, marginBottom: -50, fontSize: 20, fontWeight: 'bold', borderRadius:40, backgroundColor:'white',padding:10,paddingLeft:10, paddingRight:10,margin:20 }}>
    {faculties}
</Text>
    <ScrollView >
    <View
            style={{
              marginTop: 80,
            }}
            onPress={handleCreatePostPress} // เมื่อปุ่มถูกกด
          >

          {filteredPosts.map((post) => (
        <View key={post.id} style={styles.postContainer}>
          <View style={{ top: -50, left: 55 }}>
            <Avatar.Icon icon="account-circle" size={50} style={{ top: 40, left: -60 , backgroundColor: '#1C1441'}} color={'#FFF'} />
           {/* รูปโปรไฟล์  */}
            <Image
              source={{ uri: post.profileImg }}
              style={{  borderRadius: 50, position: 'absolute', width: 50, height:50, left: -60, top: 40 }}
            />
            <Text style={{ top: -5, fontWeight: 'bold' }}  onPress={() => handleImagePress(post)}>{post.username}</Text>
            <Text style={styles.userData}>{post.faculty}</Text>
            <Text style={{ color: '#777267' }}>{formatPostTime(post.timestamp)}</Text>
          </View>
          {handleIconBarsPress(post) && (
  <TouchableOpacity onPress={() => toggleDropdown(post.id)} style={{ left: 295, top: -105 }}>
    <Icon name="bars" size={23} color="#000" />
  </TouchableOpacity>
)}
{showDropdown[post.id] && handleIconBarsPress(post) && (
  <View style={styles.dropdown}>
    <TouchableOpacity  onPress={() => handleEditPost(post.id, navigation)}>
      <Text style={{ color: '#442f04' }}>แก้ไขโพสต์</Text>
    </TouchableOpacity>
    <View style={{ height: 1, backgroundColor: '#000', marginVertical: 10 }} />
    <TouchableOpacity onPress={() => handleDeletePost(post.id)}>
      <Text style={{ color: '#442f04', left: 6, top: -2 }}>ลบโพสต์</Text>
    </TouchableOpacity>
  </View>
)}
          <View style={{ top: -50, left: 30 }}>
            <Text style={styles.postText}>{post.text}</Text>
            {post.photo && (
              <Image source={{ uri: post.photo }} style={styles.postImage} />
            )}
          </View>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => updateLike(post)}>
            <Icon
            name={isLiked[post.id] ? 'heart' : 'heart'}
            size={25}
            color={isLiked[post.id] ? 'black' : 'black'} // Set the color based on the state
            style={{ marginLeft: 30 }}
            />
            </TouchableOpacity>
            <View>
              <Text style={{ left: 20 }}>{likeCount[post.id]}</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('CommentGroup', { postId: post.id,DocName: DocName, uidcom: post.userUid,navigation })} // ส่ง postId ไปยังหน้า Comment
            >
            <Icon name="comment" size={25} color="#000" style={{ marginLeft: 50, top: -3 }} />
            </TouchableOpacity>
            <TouchableOpacity
  onPress={() => handleSharePost(post)}
  style={{ marginLeft: 50, top: -2 }}>
</TouchableOpacity>
          </View>
        <View key={post.id}>
        {isShared[post.id] && (
          <View style={{ backgroundColor: '#e7ffc9', padding: 5, borderRadius: 8, shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 3, width: 160, left: 130, height:50}}>
            <Icon name="check" size={15} color="#007012" style={{top:15, left: 10}} />
            <Text style={{left:30, top: -3, color: '#007012'}}>แชร์โพสต์เรียบร้อย</Text>
          </View>
        )}
        </View>
        </View>
      ))}    
      </View>  
    </ScrollView>
  </SafeAreaView>
  </NativeBaseProvider>
);
};

const styles = StyleSheet.create({
container: {
  flex:1,
  backgroundColor: '#8AD1DB',
},
postContainer: {
  borderWidth: 2,
  borderColor: '#000',
  backgroundColor: '#FDF4E2',
  marginTop: 10,
  marginLeft: 15,
  marginRight:15,
  borderRadius: 15,
  overflow: 'hidden',
  padding: 20,
},
postImage: {
  width: 200,
  height: 200,
  resizeMode: 'cover',
  left: 30,
  top:20
},
postText: {
  fontSize: 25,
  left: -10,
  top: 15,
},
iconContainer: {
  flexDirection: 'row',
  paddingHorizontal: 20,
  alignItems: 'center',
  top: -10,
  left: 15
},
userData: {
  top: -5,
},
dropdown: {
  position: 'absolute',
  top: 30, // ปรับตำแหน่ง Dropdown ตามความเหมาะสม
  right: 0, // ปรับตำแหน่ง Dropdown ตามความเหมาะสม
  backgroundColor: '#FFF', // สีพื้นหลังของ Dropdown
  borderWidth: 1, // หรือคุณสามารถใช้ shadow แทน
  borderColor: '#000', // สีขอบของ Dropdown
  padding: 5,
  zIndex: 1, // คุณอาจต้องกำหนด zIndex เพื่อให้ Dropdown อยู่เหนือกับเนื้อหาอื่น
  borderRadius: 10,
  top: 20,
  marginRight:70,
  backgroundColor: '#fff5e2'
},
});

export default FacultyFilter;

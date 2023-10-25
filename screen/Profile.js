import * as React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, Button, SafeAreaView, ScrollView, StatusBar, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { FIREBASE_AUTH } from '../firestore';
import { useNavigation } from '@react-navigation/native';
import { signOut } from "firebase/auth";
import PostProfile from '../components/postProfile'; // Use the imported component
import UserData from '../components/userData';
import Share from '../components/Share.js';
import MyShop from '../components/myshop';

export default function TabViewExample() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'postProfile', title: 'โพสต์ของฉัน' },
    { key: 'market', title: 'สินค้าของฉัน' },
    { key: 'share', title: 'แชร์ของฉัน' },
  ]);

  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogout = async () => {
    signOut(auth).then(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }).catch((error) => {
      console.log(error.message);
    });
  };  


 const handleCreatePostPress = () => {
    navigation.navigate('Createpost');
  
  };

  const renderScene = SceneMap({
    postProfile: PostProfile, // Use lowercase 'postProfile' here
    market: MyShop,
    share: Share
  });

  const renderTabBar = (props) => (
    <View>
    <TabBar
      {...props}
      style={{ backgroundColor: '#fffae8' , padding:5}}
      labelStyle={{ color: 'black' , fontWeight: 'bold'}}
      indicatorStyle={{ backgroundColor: 'orange' }}
    />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={require('../assets/grey.jpg')} 
        style={{width: 450, height: 150}}
        />
    </View>
      <View  style={{
        top: -70, // ปรับตำแหน่งตามที่คุณต้องการ
        left: 110, // ปรับตำแหน่งตามที่คุณต้องการ
      }}>
      <UserData />
      </View>
      <View style={{
        top: -60, 
        left: 10
      }}>
      <TouchableOpacity style={styles.buttonYellow} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>แก้ไขโปรไฟล์</Text>
      </TouchableOpacity>
      </View>
      <View style={{
        top: -101,
        left: 130,
      }}>
      <TouchableOpacity style={{borderRadius: 5,
      borderWidth: 1,
      backgroundColor: '#FFBD59',
      width: 90,
      padding: 8,
      }}
      onPress={handleCreatePostPress}
      >
        <Text>สร้างโพสต์</Text>
      </TouchableOpacity>
      </View>
       <View style={{
        top: -142, 
        left: 235
      }}>
      <TouchableOpacity style={{borderRadius: 5,
      borderWidth: 1,
      backgroundColor: '#FAE86C',
      width: 70,
      padding: 8,
      top:5}} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
      </View>
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
      style={{top:-70, marginTop: -60   }}
    />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffae8',
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 100,
    padding: 8,
    margin: 5
  },
});
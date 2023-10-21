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

const UserData = ({ navigation }) => {
    const [userData, setUserData] = useState({});
    const facultyTextRef = useRef(null);
    const [newData, setNewData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [uid, setUid] = useState('');
    const [photo, setPhoto] = useState('');
    const [bigImg, setBigImg] = useState('');
    const [profileImg, setProfileImg] = useState(null);
    const storage = FIREBASE_STORAGE;
    const db = FIRESTORE_DB;
    const auth = FIREBASE_AUTH;
    return (
        <SafeAreaView style={styles.container}>
        <View>
        <MaterialCommunityIcons 
          name="arrow-left-thick"  
          size={50} style={{margin:10, top: 20}} 
         onPress={() => navigation.goBack()}
          />
        </View>
          <View
       style={{
          top: 20,
          left: 20, 
        }}>
        <Avatar.Icon icon="account-circle" size={50} />
        </View>
         <View
       style={{
         top: -30,
          left: 100, 
           margin: 5
        }}>
          <TextInput
        style={styles.input}
        placeholder={`${userData.cate || ''}`}
        onChangeText={(text) => setNewData({ ...newData, cate: text })}
      />
          
        </View>
          <View
       style={{
         top: -30,
          left: 100, 
           margin: 5
        }}>
            <TextInput
        style={styles.input}
        placeholder={`${userData.name || ''}`}
        onChangeText={(text) => setNewData({ ...newData, name: text })}
      />
        </View>
          <View
       style={{
         top: -30,
          left: 100, 
           margin: 5
        }}>
         <TextInput
        style={styles.input}
        placeholder={`${userData.prict || ''}`}
        onChangeText={(text) => setNewData({ ...newData, prict: text })}
      />
        </View>
        {photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, marginLeft: 110,top: -50, margin: 10 }} />}
        <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="camera" size={20}   color="#000" style={styles.icon} onPress={camera}/>
        <MaterialCommunityIcons name="image" size={20}   color="#000" style={styles.icon} onPress={openlib}/>
        </View>
        <View style={{
          top: -40,
          left: 275
        }}>
        
        <TouchableOpacity style={styles.buttonYellow}>
    
          <Text style={styles.buttonText} onPress={handleMarket} >บันทึกข้อมูล</Text>
    
        </TouchableOpacity>
        </View>
        </SafeAreaView>
      );
    };
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FFF6DE',
      },
       input: {
        height: 50,
        width: 275,
        borderWidth: 1,
        borderRadius:10,
        padding: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
      },
      iconContainer: {
        flexDirection: 'row', // จัดเรียงแนวนอน
        alignItems: 'center', // จัดวางไอคอนให้ตรงกลาง
        top:-20,
        marginLeft: 105
      },
      icon: {
        marginRight: 10, // ระยะห่างระหว่างไอคอน
      },
       buttonYellow: {
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: '#FFBD59',
        width: 70,
        padding:5,
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        margin: 5
      },
    });
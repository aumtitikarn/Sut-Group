import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getDatabase, ref, onValue } from 'firebase/database';

const Search = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const db = getDatabase();
  const postShopRef = ref(db, 'allpostShop');

  const loadFirestoreData = async () => {
    console.log("Search query:", searchQuery); // ตรวจสอบค่า searchQuery
    const db = getFirestore();
    const postShopCollection = collection(db, 'allpostShop');
    const q = query(postShopCollection, where('name', '==', searchQuery));
  
    const querySnapshot = await getDocs(q);
    const postShopData = [];
  
    querySnapshot.forEach((doc) => {
      postShopData.push({ id: doc.id, ...doc.data() });
    });
  
    console.log("Firestore data:", postShopData); // ตรวจสอบข้อมูลที่ถูกดึงมาจาก Firestore
    setFilteredData(postShopData);
    onSearchResults(postShopData);
  };
  

  const handleSearch = (query) => {
    setSearchQuery(query);
    loadFirestoreData();
  };

  const renderShop = ({ shop }) => (
    <TouchableOpacity key={shop.id}>
      <Text style={{ left: 20 }}>{shop.name}</Text>
    </TouchableOpacity>
  );
 onValue(postShopRef, (snapshot) => {
  const data = snapshot.val();
  // ทำบางอย่างกับข้อมูลที่ได้รับ เช่น แสดงผลหรืออัปเดต state
  console.log('Realtime Search results:', data);
  // ทำอะไรก็ตามที่คุณต้องการกับข้อมูลที่ได้รับ เช่น อัปเดต state ใน React
});
useEffect(() => {
    if (searchQuery.trim() === '') {
      // ถ้าไม่มีการพิมพ์อะไรหรือพิมพ์เป็นช่องว่างเท่านั้น ไม่ต้องทำการค้นหา
      return;
    }

    const loadFirestoreData = async () => {
      const db = getFirestore();
      const postShopCollection = collection(db, 'allpostShop');
      const q = query(postShopCollection, where('name', '==', searchQuery));

      const querySnapshot = await getDocs(q);
      const postShopData = [];

      querySnapshot.forEach((doc) => {
        postShopData.push({ id: doc.id, ...doc.data() });
      });

      setFilteredData(postShopData);
      onSearchResults(postShopData);
    };

    loadFirestoreData();
  }, [searchQuery])
 
  return (
    <View>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
  data={filteredData}
  renderShop={renderShop}
  keyExtractor={(item) => item.id.toString()}
/>
    </View>
  );
};

export default Search;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const Searchba = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const loadFirestoreData = async () => {
    const db = getFirestore();
    const postHomeCollection = collection(db, 'allpostHome');
    const q = query(postHomeCollection, where('faculty', '==', searchQuery));

    const querySnapshot = await getDocs(q);
    const postHomeData = [];

    querySnapshot.forEach((doc) => {
      postHomeData.push({ id: doc.id, ...doc.data() });
    });

    setFilteredData(postHomeData);
    onSearchResults(postHomeData);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    loadFirestoreData();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity key={item.id}>
      <Text style={{ left: 20 }}>{item.faculty}</Text>
    </TouchableOpacity>
  );
  const loalData = async () => {
    const db = getFirestore();
    const postHomeCollection = collection(db, 'allpostHome');
    const q = query(postHomeCollection, where('faculty', '==', searchQuery));
  
    const querySnapshot = await getDocs(q);
    const postHomeData = [];
  
    querySnapshot.forEach((doc) => {
      const itemName = doc.data().name; // ประเภทสินค้า
      if (itemName.includes(search)) { // ตรวจสอบว่าคำที่ค้นหาอยู่ในชื่อสินค้าหรือไม่
        postHomeData.push({ id: doc.id, ...doc.data() });
      }
    });
  
    setFilteredData(postHomeData);
  };
  return (
    <View>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
  data={filteredData}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
/>
    </View>
  );
};

export default Searchba;

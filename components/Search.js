import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const Search = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(0);

  const db = getFirestore();

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // เริ่มต้นการนับถอยหลังหลังจากที่ผู้ใช้พิมพ์เสร็จ
    setTypingTimeout(setTimeout(() => {
      loadFirestoreData();
    }, 5000)); // รอ 1 วินาทีหลังจากที่ผู้ใช้หยุดพิมพ์เพื่อค้นหา
  };

  const loadFirestoreData = async () => {
    if (searchQuery.trim() === '') {
      setFilteredData([]); // ถ้าไม่มีการพิมพ์หรือพิมพ์เป็นช่องว่างเท่านั้น กำหนดข้อมูลที่กรองเป็นรายการว่าง
      return;
    }

    try {
      const searchQ = query(collection(db, 'allpostShop'), where('name', '==', searchQuery));
      const querySnapshot = await getDocs(searchQ);
      const postShopData = [];

      querySnapshot.forEach((doc) => {
        postShopData.push({ id: doc.id, ...doc.data() });
      });

      setFilteredData(postShopData);
      onSearchResults(postShopData);
    } catch (error) {
      console.error('Error searching data:', error);
    }
  };

  const renderShop = ({ item }) => (
    <TouchableOpacity key={item.id}>
      <Text style={{ left: 20 }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
        data={filteredData}
        renderItem={renderShop}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Search;

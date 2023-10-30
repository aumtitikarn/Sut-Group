import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const Search = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const db = getFirestore();

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        loadFirestoreData();
      } else {
        setFilteredData([]);
      }
    }, 1000); // รอ 1 วินาทีหลังจากที่ผู้ใช้หยุดพิมพ์เพื่อค้นหา

    return () => {
      clearTimeout(typingTimeout); // เมื่อ useEffect ถูกเรียกใหม่ (เมื่อ searchQuery เปลี่ยน), ให้ยกเลิกการนับถอยหลัง
    };
  }, [searchQuery]);

  const loadFirestoreData = async () => {
    try {
      const searchQ = query(collection(db, 'allpostShop'), where('name', '>=', searchQuery));
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

  
  return (
    <View>
      <Searchbar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
      />

    </View>
  );
};

export default Search;

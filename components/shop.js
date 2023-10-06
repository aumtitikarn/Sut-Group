import React, {useState, useEffect} from 'react';
import { StyleSheet,  Text, SafeAreaView, ScrollView, StatusBar,FlatList, View, Image,TouchableOpacity, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setItem } from 'expo-secure-store';
import {Card, Avatar} from 'react-native-paper';
export default function App() {
    const [tdata, setTdata] = useState([]);
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(1);
    const [isListEnd, setIsListEnd] = useState(false);
    const [saveItem, setSaveItem] = useState([]);
    
    
    useEffect(() => {
        async function fetchData() {
            const result = await fetch(
                'https://it2.sut.ac.th/labexample/product.php?pageno=' + offset
            );
            const json = await result.json();
            if (json.products.length > 0) {
                setOffset(offset + 1);
                setData([...data, ...json.products]);
                setTdata([...tdata, ...json.products]);
            } else {
                setIsListEnd(true);
            }
        }
        fetchData();
    }, );
    
  const renderProduct = ({ item }) => (
        <TouchableOpacity style={styles.product}>
            <Card style={styles.card}>
                <Image source={{ uri: item.pic }} style={styles.image} />
 <Card.Title
  title="PHORNTHI"
  subtitle="สาขาเทคโนโลยีดิจิทัล"
  left={(props) => <Avatar.Icon {...props} icon="account-circle" />}
  titleStyle={{ fontSize: 15 }}
  subtitleStyle={{ fontSize: 10 }}
/>
   <View style={{
      position: 'absolute',
      top: 150, 
       borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 40,
    padding: 5,
    borderRadius: 30,
      left: 50
    }}>
      <Text style={{fontSize:10,fontWeight:'bold'}}>คอม</Text>
   
    </View>
    <View style={{
      position: 'absolute',
      top: 150,
      borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 50,
    padding: 5,
    borderRadius: 30,
    left: 100
    }}>
      <Text style={{fontSize:10,fontWeight:'bold'}}>อุปกรณ์</Text>
    </View>
        <View style={{margin :10}}>
        <Text style={{ fontWeight: 'bold',  marginLeft: 50,  }}>ของใช้</Text>
         <Text style={{ fontWeight: 'bold',  marginLeft: 50,  }}>ราคา: {item.price}</Text>
           </View>
            </Card>
        </TouchableOpacity>
    );

    // ให้แสดงเพียง 4 รายการ ID แรก
    const limitedData = data.slice(0, 4);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={limitedData}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                onEndReachedThreshold={0.1}
                onEndReached={() => {
                    if (!isListEnd) {
                        fetchData();
                    }
                }}
            />
        </SafeAreaView>
    );
}
    const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
       
    },
    product: {
        flex: 1,
        margin: 5,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        
    },
    card: {
        height: 220,
        width: 185,
        alignItems: 'center',
        borderRadius: 30,
        borderColor: 'black', 
        borderWidth: 1,
    
    },
    image: {
        width: 70,
        height: 90,
        marginRight: 20,
         marginLeft: 60,
    },

    columnWrapper: {
        justifyContent: 'space-between',
    },
});
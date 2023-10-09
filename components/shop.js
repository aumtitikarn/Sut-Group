import React, {useState} from 'react';
import { TouchableOpacity, StyleSheet, Text, View,Image } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore'; 
import { FIRESTORE_DB } from '../firestore';


export default function Shop() {
  const [dname, setDname] = useState('');
  const [tname, setTname] = useState('');
  const [pri, setPri] = useState('');
  const [shop, setShop] = useState([]); // State to store fetched posts
  const db = FIRESTORE_DB;


  const fetchShop = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'shop'));
      const shopData = [];

      querySnapshot.forEach((doc) => {
        const shopData = doc.data();
        shopData.push(shopData);
      });

      setPosts(shopData);
    } catch (error) {
      console.error('Error fetching shop: ', error);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  return (
    <View style={styles.container}>
      {shop.map((shop, index) => (
       <TouchableOpacity key={shop.id} style={styles.product} onPress={() => addProd(shop.name)}>
          <Card style={styles.card}>
          <View>
          {shop.photo && (
        <Image source={{ uri: shop.photo }} style={{ width: 100, height: 100 ,marginLeft:50}} />
        )}
          </View>
          <View style={{margin:1}}>
            <Card.Title
              style={{ height: 2 }}
              title="PHORNTHI"
              subtitle="สาขาเทตโนโลยีดิจิทัล"
              left={(props) => <Avatar.Icon {...props} icon="account-circle" />}
            />
             <Text style={{ fontSize: 16, fontWeight: 'bold' ,marginLeft:10  }}>
                {shop.cate}  {shop.name}
              </Text>
              </View>
            <View style={styles.conta}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                ราคา: {shop.price}
              </Text>
            
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
     // แยกแต่ละ Card ด้วยระยะห่าง
  },
  product: {
    margin: 10,
     // ให้แต่ละ Card มีความกว้าง 45% ของหน้าจอ
  },
  card: {
    height: 230,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  
  },
  conta: {
    fontSize: 10,
    fontWeight: 'bold',
    margin: 1,
    left: 70
  },
});

 

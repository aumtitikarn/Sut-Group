import React, {useState} from 'react';
import { TouchableOpacity, StyleSheet, Text, View,Image } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { AsyncStorage } from 'react-native';


 function shop(props) {
  const { products } = props; 
  const [saveItem, setSaveItem] = useState([]);

async function addProd(product) {
    try {
      await AsyncStorage.setItem('name', product);
      setSaveItem([...saveItem, product]);
      alert('บันทึกแล้ว' + product);
    } catch (e) {
      alert('Error');
    }
  }
  async function get(product) {
    try {
      const value = await AsyncStorage.getItem(product);
      alert(value);
    } catch (e) {
      alert('Error');
      // error reading value
    }
  }

  return (
    <View style={styles.container}>
      {products.map((product) => (
       <TouchableOpacity key={product.id} style={styles.product} onPress={() => addProd(product.name)}>
          <Card style={styles.card}>
          <View>
        <Image source={{ uri: product.pic }} style={{ width: 100, height: 100 ,marginLeft:50}} />
          </View>
          <View style={{margin:1}}>
            <Card.Title
              style={{ height: 2 }}
              title="PHORNTHI"
              subtitle="สาขาเทตโนโลยีดิจิทัล"
              left={(props) => <Avatar.Icon {...props} icon="account-circle" />}
            />
             <Text style={{ fontSize: 16, fontWeight: 'bold' ,marginLeft:10  }}>
                {product.cate}  {product.name}
              </Text>
              </View>
            <View style={styles.conta}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                ราคา: {product.price}
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

export default Cat;

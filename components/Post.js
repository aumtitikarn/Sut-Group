import * as React from 'react';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { StyleSheet, Text, SafeAreaView, ScrollView, StatusBar, View, Image,TouchableOpacity, Styles } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const MyComponent = () => (
  <View>
  <View style={{backgroundColor:'#FBE5AD', height: 180,margin :10}}>
  <Card.Title 
    title="PHORNTHI"  subtitle="#สาขาเทคโนโลยีดิจิทัล"
    left={(props) => <Avatar.Icon {...props} icon="account-circle" />} 
    />
    <Text style={{ fontWeight: 'bold', marginRight: 20, marginLeft: 40, marginTop: 20 }}>
      HELLO WORLD!!!
    </Text>
  <View style={styles.iconContainer}>
    <Icon name="heart" size={30} color="#000" style={styles.icon} />
    <Icon name="comment" size={30} color="#000" style={styles.icon} />
    <Icon name="share" size={30} color="#000" style={styles.icon} />
  </View>
    </View>
    <View style={{backgroundColor:'#FBE5AD', height: 180,margin :10}}>
  <Card.Title 
    title="PHORNTHI"
    subtitle="#สาขาเทคโนโลยีดิจิทัล"
    left={(props) => <Avatar.Icon {...props} icon="account-circle" />} 
    />
     <Text style={{ fontWeight: 'bold', marginRight: 20, marginLeft: 40, marginTop: 20 }}>
      HELLO WORLD!!!
    </Text>
     <View style={styles.iconContainer}>
    <Icon name="heart" size={30} color="#000" style={styles.icon} />
    <Icon name="comment" size={30} color="#000" style={styles.icon} />
    <Icon name="share" size={30} color="#000" style={styles.icon} />
  </View>
    </View>
    <View style={{backgroundColor:'#FBE5AD', height: 180,margin :10}}>
  <Card.Title 
    title="PHORNTHI"
    subtitle="#สาขาเทคโนโลยีดิจิทัล"
    left={(props) => <Avatar.Icon {...props} icon="account-circle" />} 
    />
     <Text style={{ fontWeight: 'bold', marginRight: 20, marginLeft: 40, marginTop: 20 }}>
      HELLO WORLD!!!
    </Text>
     <View style={styles.iconContainer}>
    <Icon name="heart" size={30} color="#000" style={styles.icon} />
    <Icon name="comment" size={30} color="#000" style={styles.icon} />
    <Icon name="share" size={30} color="#000" style={styles.icon} />
  </View>
    </View>
    <View style={{backgroundColor:'#FBE5AD', height: 180,margin :10}}>
  <Card.Title 
    title="PHORNTHI"
    subtitle="#สาขาเทคโนโลยีดิจิทัล"
    left={(props) => <Avatar.Icon {...props} icon="account-circle" />} 
    />
     <Text style={{ fontWeight: 'bold', marginRight: 20, marginLeft: 40, marginTop: 20 }}>
      HELLO WORLD!!!
    </Text>
     <View style={styles.iconContainer}>
    <Icon name="heart" size={30} color="#000" style={styles.icon} />
    <Icon name="comment" size={30} color="#000" style={styles.icon} />
    <Icon name="share" size={30} color="#000" style={styles.icon} />
  </View>
    </View>
    <View style={{backgroundColor:'#FBE5AD', height: 180,margin :10}}>
  <Card.Title 
    title="PHORNTHI"
    subtitle="#สาขาเทคโนโลยีดิจิทัล"
    left={(props) => <Avatar.Icon {...props} icon="account-circle" />} 
    />
     <Text style={{ fontWeight: 'bold', marginRight: 20, marginLeft: 40, marginTop: 20 }}>
      HELLO WORLD!!!
    </Text>
     <View style={styles.iconContainer}>
    <Icon name="heart" size={30} color="#000" style={styles.icon} />
    <Icon name="comment" size={30} color="#000" style={styles.icon} />
    <Icon name="share" size={30} color="#000" style={styles.icon} />
  </View>
    </View>
    </View>
); 
const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row', // จัดเรียงแนวนอน
    justifyContent: 'space-between', // กระจายไอคอนให้เท่ากัน
    paddingHorizontal: 20, // ระยะห่างด้านข้าง
    alignItems: 'center', // จัดวางไอคอนให้ตรงกลาง
    top:30
  },
  icon: {
    marginRight: 20, // ระยะห่างระหว่างไอคอน
  },
});

export default MyComponent;
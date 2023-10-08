import React, { useState } from 'react';
import { Avatar, Card, IconButton } from 'react-native-paper';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  Image,
  TouchableOpacity,
  Styles,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function MyComponent(props) {
  const { postts } = props;

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleMenuPress = () => {
    // ทำอะไรก็ตามที่คุณต้องการเมื่อกดไอคอนเมนู
    // ตัวอย่างเช่นแสดงเมนูหรือเรียกใช้ฟังก์ชันอื่น ๆ
    setIsMenuVisible(!isMenuVisible);
  };

  const handleEditPress = () => {
    // ทำอะไรก็ตามที่คุณต้องการเมื่อกดไอคอนแก้ไข
  };

  const handleDeletePress = () => {
    // ทำอะไรก็ตามที่คุณต้องการเมื่อกดไอคอนลบ
  };

  return (
    <View>
      {postts.map((postt) => (
        <View key={postt} style={{ margin: 10 }}>
           <View style={{ backgroundColor: '#FBE5AD', height: 180 }}>
            <Card.Title
              title="PHORNTHI"
              subtitle="#สาขาเทคโนโลยีดิจิทัล"
              left={(props) => <Avatar.Icon {...props} icon="account-circle" />}
             /> 
            <View style={{left: 280, top:-60  }} >
             <TouchableOpacity onPress={handleMenuPress}>
        <Icon name="ellipsis-v" size={20} color="#000" style={{ marginRight: 20 }} />
      </TouchableOpacity> 
      {/* แสดงเมนูหรือตัวเลือกที่ต้องการ */}
      {isMenuVisible && (
        <View style={styles.menuContainer}> 
          <TouchableOpacity onPress={handleEditPress}>
            <Icon name="edit" size={20} color="#000" style={styles.menuIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeletePress}>
            <Icon name="trash" size={20} color="#000" style={styles.menuIcon} />
          </TouchableOpacity> 
        </View>
      )}
      </View>
      <View style={{ fontWeight: 'bold', marginLeft: 30, marginTop: -20 ,fontSize: 18,}} >
            <Text style={{ fontWeight: 'bold',fontSize: 18,}} >
            {postt.name}  
            </Text>
            </View>
            <View style={styles.iconContainer}>
              <Icon name="heart" size={30} color="#000" style={styles.icon} />
              <Icon name="comment" size={30} color="#000" style={styles.icon} />
              <Icon name="share" size={30} color="#000" style={styles.icon} />
            </View>
        </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row', // จัดเรียงแนวนอน
    justifyContent: 'space-between', // กระจายไอคอนให้เท่ากัน
    paddingHorizontal: 20, // ระยะห่างด้านข้าง
    alignItems: 'center', // จัดวางไอคอนให้ตรงกลาง
    top: 30,
  },
  icon: {
    marginRight: 20, // ระยะห่างระหว่างไอคอน
  },
   menuContainer: {
   flexDirection: 'row', // จัดเรียงแนวนอน
    top:-45,
  },
  menuIcon: {
    marginLeft: 10,
  },
});

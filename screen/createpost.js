import { View, Text,  SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Home = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
    <View>
    <MaterialCommunityIcons 
      name="arrow-left-thick"  
      size={50} style={{margin:10}} 
      onPress={() => navigation.navigate('Home')} 
      />
    </View>
      <View
   style={{
      top: 10,
      left: 20, 
    }}>
    <Avatar.Icon icon="account-circle" size={80} />
    </View>
     <View
   style={{
     top: -60,
      left: 110, 
    }}>
      <TextInput
        style={styles.input}
        placeholder="คุณกำลังคิดอะไรอยู่..."
        placeholderTextColor="Gray"
        textAlignVertical="top" // Align text to the top
        multiline={true}
      />
    </View>
    <View style={styles.iconContainer}>
    <Icon name="camera" size={20} color="#000" style={styles.icon} />
    <Icon name="image" size={20} color="#000" style={styles.icon} />
    </View>
    <View style={{
      top: -80,
      left: 275
    }}>
    <TouchableOpacity style={styles.buttonYellow}>
      <Text style={styles.buttonText}>โพสต์</Text>
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
    height: 200,
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
    top:-50,
    marginLeft: 105
  },
  icon: {
    marginRight: 10, // ระยะห่างระหว่างไอคอน
  },
   buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FFBD59',
    width: 100,
    padding:5,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    margin: 5
  },
});
export default Home;
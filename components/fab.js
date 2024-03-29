import React, { useState} from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FloatingButton = () => {

  const [icon_1] = useState(new Animated.Value(40));
  const [icon_2] = useState(new Animated.Value(40));
  

  const [pop, setPop] = useState(false);
  const navigation = useNavigation();

  const popIn = () => {
    setPop(true);
    Animated.timing(icon_1, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 110,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  const popOut = () => {
    setPop(false);
    Animated.timing(icon_1, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(icon_2, {
      toValue: 40,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }

  const handleCreatePostPress = () => {
   
    navigation.navigate('Createpost');
  
  };

  const handleCameraScreen = () => {
   
    navigation.navigate('CameraScreen');
  
  };
  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.circle, { bottom: icon_1 }]}>
        <TouchableOpacity onPress={handleCreatePostPress}>
          <Icon name="pencil" size={25} color="#FFFF" />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.circle, { bottom: icon_2, right: icon_2 }]}>
        <TouchableOpacity onPress={handleCameraScreen}>
        <MaterialCommunityIcons name="camera-plus-outline" color={"white"} size={25} />
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={styles.circle}
        onPress={() => {
          pop === false ? popIn() : popOut();
        }}
      >
        <Icon name="plus" size={25} color="#FFFF" />
      </TouchableOpacity>
    </View>
  )
}

export default FloatingButton;

const styles = StyleSheet.create({
  circle: {
     backgroundColor: '#1C1441',
     width: 60,
     height: 60,
     position: 'absolute',
     bottom: 40,
     right: 40,
     borderRadius: 50,
     justifyContent: 'center',
     alignItems: 'center',
  }
})

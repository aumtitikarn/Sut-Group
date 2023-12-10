import * as React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image, Button, SafeAreaView, ScrollView, StatusBar, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { FIREBASE_AUTH } from '../firestore';
import { useNavigation } from '@react-navigation/native';
import { signOut } from "firebase/auth";
import OtherShop from '../screen/OtherShop';
import PostOther from '../components/PostOther.js';

export default function TabViewExample({ userUid }) {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'PostOther', title: 'โพสต์' },
    { key: 'market', title: 'สินค้า' },
  ]);

  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
//   console.log('Oprofile: ', userUid);

  // Define a function that returns the PostOther component with userUid prop
  const renderPostOther = () => <PostOther userUid={userUid} />;
  const renderOtherShop = () => <OtherShop userUid={userUid} />;

  const renderScene = SceneMap({
    PostOther: renderPostOther, // Use the function to render PostOther
    market: renderOtherShop,
  });

  const renderTabBar = (props) => (
    <View>
      <TabBar
        {...props}
        style={{ backgroundColor: '#FFF' }}
        labelStyle={{ color: 'black', fontWeight: 'bold', fontSize: 12 }}
        indicatorStyle={{ backgroundColor: '#1C1441' }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        style={{ top: -70, marginTop: -60 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 528,
    paddingTop: StatusBar.currentHeight,
  },
  buttonYellow: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#FDF4E2',
    width: 95,
    padding: 8,
    margin: 5,
  },
});

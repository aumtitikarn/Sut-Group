import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Button, Animated, Dimensions, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../datacard/Card';
import { ActivityIndicator} from 'react-native-paper';

// ตัวแปร wheelImages จำเป็นต้องถูกนิยามไว้ก่อนการใช้งาน

const Wheel = ({ navigation }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const translateY = useRef(new Animated.Value(0)).current;
  const [animating, setAnimating] = React.useState(false);
  
  
  const onSelectCard = (card) => {
    setSelectedCard(card);
  };

  
  const  [cards, setCards] = useState([
    { value: '0', suit: 'Hearts', imageSourceFront: require('../assets/chariot.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '1', suit: 'Diamonds', imageSourceFront: require('../assets/death.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '2', suit: 'Hearts', imageSourceFront: require('../assets/devil.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '3', suit: 'Diamonds', imageSourceFront: require('../assets/fool.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '4', suit: 'Hearts', imageSourceFront: require('../assets/hermit.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '5', suit: 'Diamonds', imageSourceFront: require('../assets/high-priestess.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '6', suit: 'Hearts', imageSourceFront: require('../assets/judgement.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '7', suit: 'Diamonds', imageSourceFront: require('../assets/justice.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '8', suit: 'Hearts', imageSourceFront: require('../assets/lover.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '9', suit: 'Diamonds', imageSourceFront: require('../assets/moon.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '10', suit: 'Hearts', imageSourceFront: require('../assets/world.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '11', suit: 'Diamonds', imageSourceFront: require('../assets/strength.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '12', suit: 'Hearts', imageSourceFront: require('../assets/emperor.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '13', suit: 'Diamonds', imageSourceFront: require('../assets/empress.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '14', suit: 'Hearts', imageSourceFront: require('../assets/hanged.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '15', suit: 'Diamonds', imageSourceFront: require('../assets/magician.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '16', suit: 'Hearts', imageSourceFront: require('../assets/star.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '17', suit: 'Diamonds', imageSourceFront: require('../assets/temperance.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '18', suit: 'Hearts', imageSourceFront: require('../assets/tower.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '19', suit: 'Diamonds', imageSourceFront: require('../assets/wheel.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '20', suit: 'Hearts', imageSourceFront: require('../assets/hierophant.png'), imageSourceBack: require('../assets/yep.png') },
    { value: '21', suit: 'Diamonds', imageSourceFront: require('../assets/sun.png'), imageSourceBack: require('../assets/yep.png') },
   
    // เพิ่มไพ่ต่อไปตามต้องการ
  ]);
  
  
  const [flippedCards, setFlippedCards] = useState([]);

  const flipCard = (index) => {
    const updatedFlippedCards = [...flippedCards];
    updatedFlippedCards[index] = !updatedFlippedCards[index];
    setFlippedCards(updatedFlippedCards);
  };

  const renderRow = (rowIndex) => {
    return (
      <View key={rowIndex} style={styles.rowContainer}>
        {Array.from({ length: 6 }).map((_, colIndex) => {
          const cardIndex = rowIndex * 6 + colIndex;
          if (cardIndex < cards.length) {
            const card = cards[cardIndex];
            const isCardSelected = selectedCard && selectedCard.value === card.value;

            // คำนวณขนาดและตำแหน่งของไพ่
            const cardSize = isCardSelected ? 100 : 70;
            const cardMargin = isCardSelected ? 0 : 10;

            return (
              <Animated.View
                key={cardIndex}
                style={[
                  styles.cardContainer,
                  {
                    width: cardSize,
                    height: cardSize + 20, // เพิ่มความสูงเพื่อเข้ากับข้อความหน้าไพ่ที่ใหญ่ขึ้น
                    margin: cardMargin,
                  },
                ]}
              >
                <Card
                  value={card.value}
                  suit={card.suit}
                  imageSourceFront={card.imageSourceFront}
                  imageSourceBack={card.imageSourceBack}
                  flipCard={() => flipCard(cardIndex)}
                  onSelect={() => onSelectCard(card)}
                  
                />
              </Animated.View>
            );
          } else {
            return <View key={colIndex} style={styles.cardContainer} />;
          }
        })}
      </View>
    );
  };
  const handleAutorenew = () => {
    // Set animating to true to show ActivityIndicator
    setAnimating(true);
  
    // สลับตำแหน่งของไพ่ในอาร์เรย์ cards ใหม่
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setFlippedCards([]);
    setSelectedCard(null);
  
    // อัปเดตสถานะด้วยไพ่ที่สลับตำแหน่งแล้ว
    setCards(shuffledCards);
  
    // Stop the ActivityIndicator after a delay (2 seconds in this case)
    setTimeout(() => {
      setAnimating(false);
    
    }, 2000); // Adjust the timeout duration as needed
  };

  const handlePrediction = () => {
    if (selectedCard) {
      // ปรับ translateY เพื่อแสดงด้านล่าง
      Animated.timing(translateY, {
        toValue: 100, // ปรับตามความต้องการ
        duration: 300,
        useNativeDriver: true,
      }).start();

      // ให้ navigation.navigate('Tarot') เมื่อ Animation เสร็จสิ้น
      setTimeout(() => {
        navigation.navigate('Tarot', { selectedCard });
      }, 300);
    }
  };

  return (
     <SafeAreaView style={styles.container}>
      
       <View style={{right:170, top: 60}} >
    <MaterialCommunityIcons 
      name="arrow-left"  
      size={35} style={{margin:10}} 
      onPress={() => navigation.navigate('Home')}
      />
      
    </View>
       <Text style={{fontSize:18,top:20}}>ดูดวงประจำวัน</Text>
       <View style={{flex:2 , top:30}}>
      <View>
       {Array.from({ length: Math.ceil(cards.length / 3) }).map((_, rowIndex) => renderRow(rowIndex))}
       
      </View> 
      </View>
      <TouchableOpacity
  style={{
    backgroundColor: selectedCard ? 'green' : 'red',
    borderRadius: 15,
    padding: 15,
    left:50,
    width:120,
    top:80
  }}
  onPress={handlePrediction}
>
  <Text style={{ color: 'white',left:25 }} >{selectedCard ? 'ทำนาย' : 'เลือกไพ่'}</Text>
</TouchableOpacity>
       <View style={{right:80, top: 30}} >
       <MaterialCommunityIcons
          name="autorenew"
          size={40}
          style={{ margin: 10 }}
          onPress= {handleAutorenew}
          
        />
       <ActivityIndicator
    animating={animating}
    size={90}
    hidesWhenStopped={true}
    style={{top:-425,left:90}}
    
  />
    </View>
    
     </SafeAreaView>
  );
 };
 
 const styles = StyleSheet.create({
  container: {
     flex: 1,
     backgroundColor: '#fff5e2',
     alignItems: 'center',
     justifyContent: 'center',
    
  },
  input: {
     left: 50,
     margin: 10,
     top: 25,
     width:90,
      
  },
  in: {
     right: 50,
     width:90,
     top:-20
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin:10
  },
  wheel: {
     width: Dimensions.get('window').width - 150,
     height: Dimensions.get('window').width - 150,
  },
  cardContainer: {
    margin: 50,
    top:10
    
  },
 });

export default Wheel;

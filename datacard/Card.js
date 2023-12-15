// Card.js
import React, { useState, useRef } from 'react';
import { TouchableOpacity, View, Image, StyleSheet, Animated,Button } from 'react-native';

const Card = ({ value, suit, imageSourceFront, imageSourceBack , onSelect}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const flipAnimation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onSelect}>
    <Animated.View style={[styles.cardImageContainer, frontAnimatedStyle]}>
      <Image source={imageSourceBack} style={styles.cardImage} />
    </Animated.View>
    <Animated.View style={[styles.cardImageContainer, styles.backCard, backAnimatedStyle]}>
      <Image source={imageSourceFront} style={styles.cardImage} />
    </Animated.View>
  
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 2,
  },
  cardImageContainer: {
    alignItems: 'center',
    backfaceVisibility: 'hidden',
  },
  cardImage: {
    width: 70,
    height: 120,
   
  },
  backCard: {
    position: 'absolute',
    top: 0,
  },
});

export default Card;

import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      await cameraRef.current.recordAsync();
      setIsRecording(true);

      // Start the interval to update the elapsed time
      intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      const video = await cameraRef.current.stopRecording();
      setIsRecording(false);
      setElapsedTime(0);

      // Clear the interval when recording stops
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      setCapturedImage(video);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={cameraRef}
      >
        <View>
          <TouchableOpacity style={styles.Flipbutton} onPress={flipCamera}>
            <MaterialCommunityIcons name="camera-flip-outline" color={'white'} size={50} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <MaterialCommunityIcons name="stop" color={'red'} size={50} />
            ) : (
              <MaterialCommunityIcons name="radiobox-marked" color={'white'} size={100} />
            )}
          </TouchableOpacity>

          {/* Display the elapsed time during video recording */}
          {isRecording && (
            <Text style={styles.elapsedTimeText}>{`Time: ${elapsedTime} seconds`}</Text>
          )}
        </View>
      </Camera>

      {capturedImage && (
        <View style={styles.previewContainer}>
          <Text style={styles.elapsedTimeText}>{`Time: ${elapsedTime} seconds`}</Text>
          <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: StatusBar.currentHeight,
    },
    camera: {
      flex: 1,
    },
    Flipbutton: {
      left: 330,
      top: 720,
      position: 'absolute',
    },
    captureButton: {
      left: 155,
      top: 700,
      position: 'absolute',
    },
    elapsedTimeText: {
      fontSize: 18,
      color: 'white',
      textAlign: 'center',
    },
    previewContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewImage: {
      width: 200,
      height: 200,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 'white',
    },
  });
  
  export default CameraScreen;
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import Createpost from '../screen/createpost';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'; 


// Mock the navigation prop
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the firebase/auth module
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'testUserId' }, // Provide a mock user for testing
  })),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ exists: false, data: () => null })),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));
jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  Font: {
    ...jest.requireActual('expo-font').Font,
    isLoaded: jest.fn().mockResolvedValue(true),
  },
}));

// Update the '@expo/vector-icons' mock
jest.mock('@expo/vector-icons', () => {
  return {
    MaterialCommunityIcons: 'MaterialCommunityIcons', // Replace with your mock component
  };
});


jest.mock('expo-image-picker', () => ({
  launchCameraAsync: jest.fn().mockResolvedValue({
    canceled: false,
    type: 'image',
    uri: 'test-image-uri',
  }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    type: 'image',
    uri: 'test-image-uri',
  }),
  MediaTypeOptions: { All: 'All' },
}));


describe('Createpost component', () => {
  test('Createpost component renders correctly', () => {
    const { getByTestId } = render(<Createpost />);
  
    // Log the rendered output for inspection
    console.log(render(<Createpost />).toJSON());
  
    // Check if certain elements are rendered
    expect(getByTestId('createpost-container')).toBeDefined();
  });
  test('Post Text', () => {
    const { getByPlaceholderText } = render(<Createpost />);

    // Get the TextInput element by its placeholder text
    const textInput = getByPlaceholderText('คุณกำลังคิดอะไรอยู่...');

    // Use fireEvent to simulate typing text
    fireEvent.changeText(textInput, 'Test input text');

    // Check if the state is updated
    expect(textInput.props.value).toBe('Test input text');
  });
  test('Post Image From Library', async () => {
    const { getByTestId } = render(<Createpost />);
    
    // Mock the result of the image picker
    const mockImagePickerResult = {
      assets: [{ uri: 'test-image-uri' }],
      canceled: false,
    };
    
    // Mock the image picker launchImageLibraryAsync function
    ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockImagePickerResult);
    
    // Find the image icon and trigger the onPress event
    const imageIcon = getByTestId('image-icon');
    fireEvent(imageIcon, 'onPress'); // Simulate a press event
    
    // Wait for the image selection to complete
    await waitFor(() => {
      console.log('Is ImagePicker.launchImageLibraryAsync called?', ImagePicker.launchImageLibraryAsync.mock.calls);
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    }); // Increase the timeout as needed
  });
  test('Post Image From Camera', async () => {
    const { getByTestId } = render(<Createpost />);
    
    // Mock the result of the image picker
    const mockImagePickerResult = {
      assets: [{ uri: 'test-image-uri' }],
      canceled: false,
    };
    
    // Mock the image picker launchImageLibraryAsync function
    ImagePicker. launchCameraAsync.mockResolvedValue(mockImagePickerResult);
    
    // Find the image icon and trigger the onPress event
    const imageIcon = getByTestId('selected-image');
    fireEvent(imageIcon, 'onPress'); // Simulate a press event
    
    // Wait for the image selection to complete
    await waitFor(() => {
      console.log('Is ImagePicker.launchImageLibraryAsync called?', ImagePicker.launchImageLibraryAsync.mock.calls);
      expect(ImagePicker. launchCameraAsync).toHaveBeenCalled();
    }); // Increase the timeout as needed
  });
});


// Createpost component renders correctly: 
//ทดสอบว่า component Createpost ถูก render ในสภาพแวดล้อมทดสอบได้อย่างถูกต้อง โดยตรวจสอบว่ามี element ที่มี testID เป็น 'createpost-container' ถูก render อยู่หรือไม่ โดยใช้ getByTestId และ expect เพื่อตรวจสอบว่ามีการ render ถูกต้อง.

// Post Text: 
//ทดสอบกรณีที่ผู้ใช้ป้อนข้อความในช่อง input text ของโพสต์ โดยใช้ getByPlaceholderText เพื่อดึง element ที่มี placeholder text เป็น 'คุณกำลังคิดอะไรอยู่...' และใช้ fireEvent.changeText เพื่อจำลองการพิมพ์ข้อความ และ expect เพื่อตรวจสอบว่า state ได้รับการอัปเดตถูกต้อง.

// Post Image From Library: 
//ทดสอบกรณีที่ผู้ใช้เลือกรูปภาพจากคลังรูปภาพ โดยใช้ ImagePicker.launchImageLibraryAsync ที่ถูก mock และ fireEvent เพื่อจำลองการกดที่ icon เพื่อเลือกรูปภาพ และใช้ waitFor เพื่อรอให้การทำงานเสร็จสมบูรณ์ และ expect เพื่อตรวจสอบว่าฟังก์ชันที่ถูกเรียกไปหรือไม่.

// Post Image From Camera: 
//ทดสอบกรณีที่ผู้ใช้ถ่ายรูปจากกล้อง โดยใช้ ImagePicker.launchCameraAsync ที่ถูก mock และ fireEvent เพื่อจำลองการกดที่ icon เพื่อถ่ายรูป และใช้ waitFor เพื่อรอให้การทำงานเสร็จสมบูรณ์ และ expect เพื่อตรวจสอบว่าฟังก์ชันที่ถูกเรียกไปหรือไม่.
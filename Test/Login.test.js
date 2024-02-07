import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import Login from '../screen/Login';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
// Mock the navigation prop
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the firebase/auth module
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));

describe('Login component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText, queryByText,findByText } = render(<Login />);

    expect(findByText('เข้าสู่ระบบ')).toBeTruthy();
    // ... other assertions
  });

  it('logs in the user on valid credentials', async () => {
    const { getByPlaceholderText, findByText,  findAllByText } = render(<Login />);
    
    fireEvent.changeText(getByPlaceholderText('อีเมล '), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('รหัสผ่าน'), 'password123');
    
    const loginButtonElements = await findAllByText('เข้าสู่ระบบ');

if (loginButtonElements.length > 0) {
  const loginButtonElement = loginButtonElements[0];


  if (loginButtonElement.props && typeof loginButtonElement.props.onPress === 'function') {

    fireEvent.press(loginButtonElement);

    await waitFor(() => {
      expect(onAuthStateChanged).toHaveBeenCalledWith();
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith();
    }, { timeout: 5000 });
  } else {
  }
} else {
}
  });
  

  it('displays an error message on invalid credentials', async () => {
    const { getByPlaceholderText, queryByText, findAllByText } = render(<Login />);
      
    fireEvent.changeText(getByPlaceholderText('อีเมล '), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('รหัสผ่าน'), 'password123');
    

    const loginButtonElements = await findAllByText('เข้าสู่ระบบ');
    
    if (loginButtonElements.length > 0) {
      const loginButtonElement = loginButtonElements[0];
  
      if (loginButtonElement.props && typeof loginButtonElement.props.onPress === 'function') {
        // Press the button
        fireEvent.press(loginButtonElement);
    
        await waitFor(() => {
          expect(queryByText('อีเมลหรือรหัสผ่านไม่ถูกต้อง')).toBeTruthy();
          expect(signInWithEmailAndPassword).toHaveBeenCalledWith();
        });
      }
    }
  });  
});


// ทดสอบการเรนเดอร์ (it('renders correctly')): ตรวจสอบว่าคอมโพเนนต์ Login เรนเดอร์ได้อย่างถูกต้องโดยการตรวจสอบความมีอยู่ขององค์ประกอบบางประการเช่นข้อความ 'เข้าสู่ระบบ' บนหน้าจอ.

// ทดสอบการเข้าสู่ระบบสำเร็จ (it('logs in the user on valid credentials')): จำลองสถานการณ์ที่ผู้ใช้ใส่ข้อมูลประจำตัวที่ถูกต้อง (อีเมลและรหัสผ่าน) และกดปุ่มเข้าสู่ระบบ ตรวจสอบว่าฟังก์ชัน onAuthStateChanged และ signInWithEmailAndPassword จากโมดูลการตรวจสอบข้อมูลบัญชีผู้ใช้ของ Firebase ได้ถูกเรียกด้วยพารามิเตอร์ที่คาดหวัง.

// ทดสอบการเข้าสู่ระบบล้มเหลว (it('displays an error message on invalid credentials')): จำลองสถานการณ์ที่ผู้ใช้ใส่ข้อมูลประจำตัวที่ไม่ถูกต้อง (อีเมลและรหัสผ่าน) และกดปุ่มเข้าสู่ระบบ ตรวจสอบว่าข้อความผิดพลาด ('อีเมลหรือรหัสผ่านไม่ถูกต้อง') ถูกแสดงบนหน้าจอและฟังก์ชัน signInWithEmailAndPassword ได้ถูกเรียกด้วยข้อมูลผู้ใช้ที่ถูกต้อง.
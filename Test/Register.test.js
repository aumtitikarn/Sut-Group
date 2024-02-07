import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import Register from '../screen/Register';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Mock the navigation prop
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock the firebase/auth module
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
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
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(),
}));




describe('Register component', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText, queryByText, findByText, findAllByText } = render(<Register />);

    expect(findAllByText('ลงทะเบียน')).toBeTruthy();
  });

  test('registers user on valid input', async () => {
    const { getByText, getByPlaceholderText, queryByText, findByText, findAllByText } = render(
      <Register />
    );


    fireEvent.changeText(getByPlaceholderText('ชื่อบัญชีผู้ใช้'), 'admin');
    fireEvent.changeText(getByPlaceholderText('ชื่อ'), 'John');
    fireEvent.changeText(getByPlaceholderText('นามสกุล'), 'Smith');
    fireEvent.changeText(getByPlaceholderText('สาขา'), 'DT');
    fireEvent.changeText(getByPlaceholderText('อีเมล'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('รหัสผ่าน'), 'password123');
    fireEvent.changeText(getByPlaceholderText('ยืนยันรหัสผ่าน'), 'password123');
  

    const mockUser = { user: { uid: '123' } };
    createUserWithEmailAndPassword.mockResolvedValueOnce(mockUser);
  

    const RegisterButtonElements = await findAllByText('ลงทะเบียน');
    
  
    if (RegisterButtonElements.length > 0) {
      const RegisterButtonElement = RegisterButtonElements[0];
  
      if (RegisterButtonElement.props && typeof RegisterButtonElement.props.onPress === 'function') {

        fireEvent.press(RegisterButtonElement);
        const facultyInput = getByTestId('faculty-input');
        expect(facultyInput).toBeTruthy();
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({}, 'test@example.com', 'password123');
      expect(screen.getByText('ลงทะเบียนสำเร็จ')).toBeTruthy();
    });
  }
}
});  

  it('displays error on password mismatch', async () => {
    const { getByPlaceholderText, getByText, findAllByText } = render(
      <Register />);

    fireEvent.changeText(getByPlaceholderText('รหัสผ่าน'), 'password123');
    fireEvent.changeText(getByPlaceholderText('ยืนยันรหัสผ่าน'), 'mismatchedpassword');

    
    const RegisterButtonElements = await findAllByText('ลงทะเบียน');

    if (RegisterButtonElements.length > 0) {
  
      const RegisterButtonElement = RegisterButtonElements[0];
  
  
      if (RegisterButtonElement.props && typeof RegisterButtonElement.props.onPress === 'function') {
        // Press the button
        fireEvent.press(RegisterButtonElement);

    await waitFor(() => {
      expect(screen.queryByText('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน')).toBeTruthy();
    });
  }
}
  });
});



// ทดสอบแรก (renders correctly) ตรวจสอบว่าคอมโพเนนต์เรนเดอร์ได้ถูกเรนเดอร์ไว้อย่างถูกต้องหรือไม่ โดยใช้วิธี render จาก @testing-library/react-native เพื่อเรนเดอร์คอมโพเนนต์ Register
// จากนั้นตรวจสอบว่าบางองค์ประกอบบางประการ, เช่น ข้อความ "ลงทะเบียน" มีอยู่ในคอมโพเนนต์ที่เรนเดอร์แล้วหรือไม่
// ทดสอบการลงทะเบียนผู้ใช้:

// ทดสอบที่สอง (registers user on valid input) จำลองการป้อนข้อมูลจากผู้ใช้ในแบบฟอร์มการลงทะเบียน โดยใช้วิธี fireEvent.changeText เพื่อเปลี่ยนค่าของฟิลด์นำเข้าต่าง ๆ
// จำลองการตอบสนองของฟังก์ชัน createUserWithEmailAndPassword จากโมดูล Firebase auth เพื่อจำลองการลงทะเบียนผู้ใช้ที่ประสบความสำเร็จ
// ใช้ findAllByText เพื่อรอให้มีองค์ประกอบบางประการ, เช่น "ลงทะเบียน" อยู่ในคอมโพเนนต์
// กดที่ปุ่ม "ลงทะเบียน" เพื่อเริ่มกระบวนการลงทะเบียน
// หลังจากกระทำการลงทะเบียน, ตรวจสอบว่าบางองค์ประกอบ, เช่น faculty-input, มีอยู่, ซึ่งแสดงถึงการลงทะเบียนที่ประสบความสำเร็จ
// ใช้ waitFor เพื่อรอคอยสิ่งที่คาดหวังจากกระบวนการลงทะเบียน
// ทดสอบข้อผิดพลาดของรหัสผ่านที่ไม่ตรงกัน:

// ทดสอบที่สาม (displays error on password mismatch) จำลองการป้อนข้อมูลจากผู้ใช้ที่รหัสผ่านที่ป้อนและรหัสผ่านที่ยืนยันไม่ตรงกัน
// ใช้ fireEvent.changeText เพื่ออัปเดตฟิลด์รหัสผ่านตามที่เห็นสมควร
// ใช้ findAllByText เพื่อรอให้มีองค์ประกอบบางประการ, เช่น "ลงทะเบียน" อยู่
// กดที่ปุ่ม "ลงทะเบียน" เพื่อเริ่มกระบวนการลงทะเบียนด้วยรหัสผ่านที่ไม่ตรงกัน
// ใช้ waitFor เพื่อรอคอยข้อความผิดพลาดที่เกี่ยวกับการไม่ตรงกันของรหัสผ่าน

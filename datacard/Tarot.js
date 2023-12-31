import React from 'react';
import { View, Text, Image, SafeAreaView,StyleSheet ,Button} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Tarot = ({ route }) => {
  const { selectedCard } = route.params;
  const navigation = useNavigation();
  
  const handleIconPress = () => {
    // ให้กดไอคอนนี้แล้วย้อนกลับไปหน้าเดิม
    navigation.goBack(); // หรือ navigation.pop();
  };

  let additionalText = '';

  // ตรวจสอบรูปที่ถูกเลือกและกำหนดข้อความเพิ่มเติม
  switch (selectedCard.value) {
    case '0':
      additionalText = 'หมายถึง ความแน่วแน่ มุ่งมั่น ขยัน ทุ่มเท เมื่อเจอไพ่ใบนี้ เพื่อน ๆ ก็ต้องทำตัวให้แข็งแกร่งยิ่งกว่าม้าศึกถึงจะประสบความสำเร็จในสิ่งที่ทำ';
      break;
    case '1':
      additionalText = 'หมายถึง การเปลี่ยนแปลง เกิดใหม่ เรื่องร้าย ๆ จะกลายเป็นดีนะคะ สิ่งต่าง ๆ ที่ว่าร้ายแรงแล้วจะเริ่มเปลี่ยนแปลงไปในทางที่ดีขึ้นทีละนิด';
      break;
    case '2':
      additionalText = 'หมายถึง การควบคุม ผูกมัด ไร้ความหวัง ระวังให้ดี เมื่อไพ่ใบนี้ปรากฏขึ้นมา เพราะเพื่อน ๆ อาจเจอกับการควบคุม ถูกผูกมัดโดยไม่เต็มใจจนทำให้หมดพลังใจและหมดความหวัง';
      break;
      case '3':
      additionalText = 'หมายถึง การเริ่มต้นอะไรใหม่ ๆ การเสี่ยงอันตราย หากว่าเปิดได้ไพ่ใบนี้แล้วล่ะก็ เส้นทางใหม่ที่เพื่อน ๆ จะเดินไปอาจมีความเสี่ยง แต่เป็นความเสี่ยงที่เพื่อน ๆ ต้องการ รู้ว่าเสี่ยงแต่คงต้องขอลอง ';
      break;
      case '4':
      additionalText = 'หมายถึง ความสันโดษ โดดเดี่ยว วิเคราะห์ เมื่อเจอไพ่ใบนี้ก็คงเลี่ยงไม่พ้นการอยู่ตัวคนเดียว การใช้เวลารักษาเยียวยาจิตใจ หรือแม้แต่การใช้เวลาเพื่อคิดวิเคราะห์สิ่งต่าง ๆ รอบตัว อย่าได้ใจร้อนทำสิ่งใดเด็ดขาด ';
      break;
      case '5':
      additionalText = 'หมายถึง ความฉลาด มีความรู้ความสามารถ เป็นตัวแทนของคนเก่งมากความสามารถ แต่มักซ่อนสิ่งนั้นเอาไว้ภายในรูปลักษณ์นิ่งเงียบที่แสดงให้ภายนอกได้เห็น ';
      break;
      case '6':
      additionalText = 'หมายถึง การตัดสินใจ โอกาสครั้งที่สอง จะมีเรื่องสำคัญมาก ๆ เข้ามาให้ต้องตัดสินใจ ต้องปล่อยอดีตให้ผ่านไปเพื่อให้สิ่งใหม่ ๆ ได้เข้ามาแทน ';
      break;
      case '7':
      additionalText = 'หมายถึง การตัดสินใจ เท่าเทียม กฎหมาย หากเปิดเจอไพ่นี้แสดงว่าเพื่อน ๆ จะได้รับความยุติธรรม มีการตัดสินใจที่ก่อให้เกิดความเท่าเทียม หรืออาจจะเจอกับเรื่องราวเกี่ยวกับกฎหมายก็ได้เช่นกัน';
      break;
      case '8':
      additionalText = 'หมายถึง ความรัก การตัดสินใจ แน่นอนว่าใบนี้ต้องหมายถึงความรัก ได้พบเจอความรัก หรือต้องตัดสินใจเลือกสิ่งใดสิ่งหนึ่ง';
      break;
      case '9':
      additionalText = 'หมายถึง ความกลัว ภาพลวงตา บางครั้งความกลัวก็อาจคืบคลานเข้ามาหาเพื่อน ๆ แบบไม่รู้ตัว แต่ไพ่อาจบอกให้พิจารณาให้ดีว่าสิ่งนั้นน่ากลัวจริง ๆ หรือเป็นเพียงภาพลวงตา ';
      break;
      case '10':
      additionalText = 'หมายถึง ความสำเร็จ ความสมบูรณ์ ถือเป็นอีกหนึ่งใบดี ๆ อีกหนึ่งใบ มีความสำเร็จเกิดขึ้น ชีวิตเติมเต็มมาก ๆ ด้วย  ';
      break;
      case '11':
      additionalText = 'หมายถึง ความแข็งแกร่ง บริหารจัดการเก่ง ไพ่นี้คือตัวแทนของหญิงสาวสุดแกร่ง มีอะไรเข้ามาก็ไม่อาจทำอะไรเธอได้ แถมยังจัดการสิ่งต่าง ๆ ได้เป็นอย่างดีอีกด้วย ';
      break;
      case '12':
      additionalText = 'หมายถึง การมีอำนาจ ชอบสั่ง และไม่ยอมใคร เพื่อน ๆ อาจอยู่ในสถานการณ์ที่ต้องยอมทำตามผู้ใหญ่ ถูกบังคับจากคนมีอำนาจมากกว่าก็เป็นได้ และยังหมายถึงความมั่นคงได้อีกด้วย ';
      break;
      case '13':
      additionalText = 'หมายถึง ความอุดมสมบูรณ์ ความเป็นแม่ เปิดได้ไพ่ใบนี้บอกเลยว่าจะเจอแต่ความสุขความสบาย เงินทองมั่งมี หรืออาจหมายถึงโอกาสตั้งครรภ์ได้ด้วย';
      break;
      case '14':
      additionalText = 'หมายถึง การรอคอย เสียสละ เพื่อน ๆ อาจได้เจอกับสถานการณ์ที่ไม่อาจตัดสินใจทำอะไรได้ ต้องอยู่นิ่ง ๆ ต้องรอคอย หรืออาจจะต้องเสียสละความสุขส่วนตัวบางอย่าง';
      break;
      case '15':
      additionalText = 'หมายถึง ความทะเยอทะยาน การลงมือทำ ไพ่บอกว่าเพื่อน ๆ เก่งมาก อยากทำอะไรก็ลุยให้เต็มที่เลย เพราะไฟในตัวมีเยอะพอ ๆ กับความสามารถ ดังนั้นลุยได้เลยไม่ต้องยั้ง ';
      break;
      case '16':
      additionalText = 'หมายถึง ความหวัง ความสงบ แม้ฟ้าจะมืดมิด แต่หากไพ่ใบนี้โผล่ขึ้นมาก็เหมือนกับมีความหวังจากดวงดาวปรากฏขึ้น ควรทำตัวให้สงบเยือกเย็นเอาไว้ ';
      break;
      case '17':
        additionalText = 'หมายถึง การต่อรอง ผสมผสาน สมดุล ไพ่อยากแนะนำให้เพื่อน ๆ สร้างความสมดุลให้ชีวิต ต้องต่อรองและยอมอ่อนข้อบ้างเพื่อให้ได้สิ่งที่ต้องการ ';
        break;
        case '18':
      additionalText = 'หมายถึง การเปลี่ยนแปลงกะทันหัน การทะเลาะเบาะแว้ง ต้องเตรียมใจให้ดี เพราะอาจเจอเรื่องไม่คาดฝัน ได้รับข่าวสารที่ไม่ทันได้เตรียมใจ หรือเกิดเรื่องบาดหมางใหญ่โตกับคนรอบตัว  ';
      break;
      case '19':
      additionalText = 'หมายถึง โชคชะตา เปลี่ยนแปลง หากไพ่ใบนี้ปรากฏขึ้น เพื่อน ๆ ต้องเตรียมตัวให้ดี เพราะมีโอกาสเกิดเรื่องที่ไม่คาดฝันได้ มีการเปลี่ยนแปลงที่เราไม่อาจขัดขวางได้ อาจจะเป็นเรื่องดีหรือไม่ดีก็ได้เช่นกัน ';
      break;
      case '20':
      additionalText = 'หมายถึง การมีความรู้ การแต่งงาน การรวมเป็นหนึ่ง พระคือตัวแทนของผู้มีความรู้และยังเป็นตัวแทนในการแต่งงานรวมเป็นครอบครัวเดียวกัน อาจหมายถึงการเป็นที่พึ่งพาของคนอื่น ๆ  ';
      break;
      case '21':
      additionalText = 'หมายถึง การเติบโต แสงสว่าง มีชีวิตชีวา ไพ่ที่เป็นตัวแทนของความร้อนแรงและสดใส และเร็ว ๆ นี้อาจมีเรื่องดี ๆ เข้ามาเซอร์ไพรส์ก็เป็นได้ ';
      break;

    // เพิ่ม case ต่อไปตามลำดับของรูปภาพที่คุณมี
    default:
      additionalText = 'มันบ่แม่นหรือมันบ่มี';
  }

  return (
    <SafeAreaView style={styles.cardContainer}>
    <View style={{top:-80}}>
      <Image source={selectedCard.imageSourceFront} style={{ width: 150, height: 250 }} />
    </View>
    <View  >
    <Text style={{fontSize:20,margin:10}}>{additionalText}</Text>
    </View>
    <View style={{top:90}}>
    <MaterialCommunityIcons
          name="autorenew"
          size={50}
          style={{ margin: 10 }}
          onPress={handleIconPress}
        />
    </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor:'#fff5e2'
    },

});


export default Tarot;

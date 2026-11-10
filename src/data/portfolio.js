export const profile = {
  name: 'นาย ธนวัต สนินัด',
  nickname: 'ฟลุ๊ค',
  introduction: 'ยินดีที่ได้รู้จัก นี่คือพื้นที่เล็ก ๆ ที่รวบรวมเรื่องราว ความสนใจ และสิ่งที่กำลังเรียนรู้ของผม',
  facts: [
    { index: '01 / EDUCATION', label: 'การศึกษา', value: 'มหาวิทยาลัยพะเยา', noteLines: ['คณะเทคโนโลยีสารสนเทศและการสื่อสาร', 'สาขาวิศวกรรมคอมพิวเตอร์'] },
    { index: '02 / OFF HOURS', label: 'งานอดิเรก', value1: 'สิ่งที่ชอบ', note1: 'ฟังเพลง เล่นเกม ออกกำลังกาย เล่นฟุตบอล ฟังพอดแคสต์', value2: 'สิ่งที่ไม่ชอบ', note2: 'ทำอาหาร ไม่กินเผ็ด ว่ายน้ำ' },
    { index: '03 / MY EDGE', label: 'จุดแข็ง', value: 'ฟรีดีไซน์', note: 'เช่น ออกแบบ · คิดไอเดีย · ลงมือทำ' },
    { index: '04 / FAVORITES', label: 'ทีมกีฬาที่ชอบ', value: '', note: 'แมนยู 5 พัล' },
  ],
}

export const workshops = [
  {
    number: '01',
    route: 'workshop-one',
    path: 'workshop/1',
    title: 'แนะนำตัว',
    description: 'ประวัติส่วนตัว การศึกษา และเรื่องราวที่ชอบ',
    kind: 'profile',
  },
  {
    number: '02',
    route: 'workshop-two',
    path: 'workshop/2',
    title: 'โปรแกรมตัดเกรด',
    description: 'กรอกคะแนนแล้วคำนวณเกรดตามช่วงคะแนนที่กำหนด',
    kind: 'grade',
  },
  {
    number: '03',
    route: 'workshop-three',
    path: 'workshop/3',
    title: 'Workshop E-commerce',
    description: 'เข้าสู่ระบบหรือสมัครสมาชิกผ่าน API ของร้านค้าออนไลน์',
  },
]

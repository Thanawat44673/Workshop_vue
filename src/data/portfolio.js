export const profile = {
  name: 'นาย ธนวัต สนินัด',
  nickname: 'ฟลุ๊ค',
  // introduction: 'ยินดีที่ได้รู้จัก',
  facts: [
    { index: '01 / EDUCATION', label: 'การศึกษา', value: 'มหาวิทยาลัยพะเยา', noteLines: ['คณะเทคโนโลยีสารสนเทศและการสื่อสาร', 'สาขาวิศวกรรมคอมพิวเตอร์'] },
    { index: '02 / OFF HOURS', label: 'งานอดิเรก', value1: 'สิ่งที่ชอบ', note1: 'ฟังเพลง เล่นเกม ออกกำลังกาย ฟุตบอล ฟังพอดแคสต์ ดูหนัง', value2: 'สิ่งที่ไม่ชอบ', note2: 'ทำอาหาร ว่ายน้ำ การเดินทางระยะไกล' },
    { index: '03 / MY EDGE', label: 'จุดแข็ง', value: 'อดทน ขยัน เรียนรู้ไว', note: 'ตั้งใจทำสิ่งที่ได้รับมอบหมาย และพร้อมเรียนรู้สิ่งใหม่อยู่เสมอ' },
    { index: '04 / FAVORITES', label: 'ทีมกีฬาที่ชอบ', note: '', teams: [
      { name: 'แมนเชสเตอร์ยูไนเต็ด', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlQ_hKLC8AghohPs58T1y0JVjxc1Ny_l_wZ4NSt7fiZw&s=10' },
      { name: 'บาเลนเซีย', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUBg7I6mz4E7b0zCbaHSyqtYDeBxEwSHosrMSbPR-5DQ&s=10' },
    ] },
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
    title: 'I Computer Store',
    description: 'เข้าสู่ระบบเพื่อใช้งานต่อหรือสมัครสมาชิกเพื่อสร้างบัญชีใหม่',
  },
]

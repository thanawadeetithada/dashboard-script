// function getTableData() {
//   // ดึงข้อมูลที่จัดระเบียบแล้วมาแสดง และจัดเรียงจากใหม่สุดไปเก่าสุด
//   const data = getCleanDataAllSheets();
//   return data.reverse(); 
// }

function getTableData() {
  // ดึงข้อมูลที่จัดระเบียบแล้วจากทุกชีต
  const data = getCleanDataAllSheets();
  
  // ส่งข้อมูลกลับไปแสดงผลตรงๆ โดยไม่ต้องใช้ .reverse() แล้ว
  // ข้อมูลจะเรียงจาก ชีต 1 -> ชีตสุดท้าย และ บน -> ล่าง ตามลำดับจริง
  return data; 
}
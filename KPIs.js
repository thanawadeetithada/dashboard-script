function getKPIData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  let totalIn = 0;
  let totalOut = 0;
  let batchSet = new Set();
  
  for (let s = 0; s < sheets.length; s++) {
    const data = sheets[s].getDataRange().getValues();
    
    // เริ่มแถวที่ 5 (index 4) เป็นต้นไป เพื่อข้ามส่วนหัวตาราง 4 แถวแรก
    for (let i = 4; i < data.length; i++) {
      const row = data[i];
      
      // ข้ามแถวที่เป็นค่าว่างเปล่าทั้งหมด
      if (row.join("").trim() === "") continue;
      
      // 1. ดึงยอดรับเข้าจาก คอลัมน์ F (index 5) ตรงๆ จากหน้าชีต โดยไม่ใช้ค่าสืบทอด
      const inVal = row[5];
      if (inVal !== "" && !isNaN(inVal) && typeof inVal === 'number') {
        totalIn += inVal;
      }
      
      // 2. ดึงยอดจ่ายออกตามจริงจาก คอลัมน์ H (index 7) ตรงๆ จากหน้าชีต
      const outVal = row[7];
      if (outVal !== "" && !isNaN(outVal) && typeof outVal === 'number') {
        totalOut += outVal;
      }
      
      // 3. เก็บรหัสล็อตแบทช์ คอลัมน์ D (index 3) เพื่อใช้นับจำนวนล็อตที่ไม่ซ้ำกัน
      const batchVal = row[3];
      if (batchVal !== "" && batchVal !== undefined && batchVal !== null) {
        batchSet.add(batchVal.toString().trim());
      }
    }
  }
  
  // คำนวณยอดคงคลังปัจจุบันรวม และ อัตราการเบิกใช้งานเชิงเปรียบเทียบ
  const balance = totalIn - totalOut;
  const mtRate = totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(1) : 0;
  
  return {
    totalIn: totalIn.toLocaleString(),
    totalOut: totalOut.toLocaleString(),
    balance: balance.toLocaleString(),
    mtRate: mtRate,
    batchCount: batchSet.size.toLocaleString()
  };
}
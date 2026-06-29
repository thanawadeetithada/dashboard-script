function getKPIData() {
  // ดึงข้อมูลที่คลีนแล้วจากทุกชีต
  const data = getCleanDataAllSheets();
  
  let totalIn = 0;
  let totalOut = 0;
  let batches = new Set();
  
  for (let i = 0; i < data.length; i++) {
    // 1. รับเข้าบรรจุภัณฑ์รวม (Sum คอลัมน์ F ทุกชีต)
    if (data[i]['รับเข้า (IN)'] !== "") totalIn += data[i]['รับเข้า (IN)'];
    
    // 2. เบิกบรรจุใช้งานรวม (Sum คอลัมน์ H ทุกชีต)
    if (data[i]['จ่ายออก (OUT)'] !== "") totalOut += data[i]['จ่ายออก (OUT)'];
    
    // 5. จำนวนล็อตนำเข้า (นับจากคอลัมน์ D)
    if (data[i]['ล็อตแบทช์'] !== "") batches.add(data[i]['ล็อตแบทช์']);
  }
  
  // 3. คงคลังปัจจุบันรวม (แทนที่จะหาคำว่า Total โค้ดจะดักคำนวณ IN - OUT ซึ่งจะได้ค่า 162 ตรงกันเป๊ะและแม่นยำกว่า)
  const balance = totalIn - totalOut;
  
  // 4. อัตราเบิกใช้งาน (MT) คิดเป็นเปอร์เซ็นต์จากปริมาณใช้งานเทียบกับรับเข้า
  const mtRate = totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(1) : 0;
  
  return {
    totalIn: totalIn,
    totalOut: totalOut,
    balance: balance,
    mtRate: mtRate,
    batchCount: batches.size
  };
}
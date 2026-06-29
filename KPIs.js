function getKPIData() {
  const data = getSheetData();
  if (data.length <= 1) return { totalIn: 0, totalOut: 0, balance: 0, mtRate: 0, batchCount: 0 };
  
  let totalIn = 0;
  let totalOut = 0;
  let batches = new Set();
  
  const headers = data[0];
  // หาตำแหน่งคอลัมน์ (ถ้าหาไม่เจอให้ใช้ตำแหน่ง Default)
  const inIdx = headers.indexOf('รับเข้า (IN)') > -1 ? headers.indexOf('รับเข้า (IN)') : 6;
  const outIdx = headers.indexOf('จ่ายออก (OUT)') > -1 ? headers.indexOf('จ่ายออก (OUT)') : 8;
  const batchIdx = headers.indexOf('ล็อตแบทช์') > -1 ? headers.indexOf('ล็อตแบทช์') : 4;

  for (let i = 1; i < data.length; i++) {
    totalIn += Number(data[i][inIdx]) || 0;
    totalOut += Number(data[i][outIdx]) || 0;
    
    let batchVal = data[i][batchIdx];
    if (batchVal && batchVal.toString().trim() !== "") {
      batches.add(batchVal.toString().trim());
    }
  }
  
  const balance = totalIn - totalOut;
  const mtRate = totalIn > 0 ? ((totalOut / totalIn) * 100).toFixed(1) : 0;
  
  return {
    totalIn: totalIn,
    totalOut: totalOut,
    balance: balance,
    mtRate: mtRate,
    batchCount: batches.size
  };
}
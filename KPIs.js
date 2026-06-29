function getKPIData() {
  const data = getCleanDataAllSheets();
  
  let totalIn = 0;
  let totalOut = 0;
  let batches = new Set();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i]['รับเข้า (IN)'] !== "") totalIn += data[i]['รับเข้า (IN)'];
    if (data[i]['จ่ายออก (OUT)'] !== "") totalOut += data[i]['จ่ายออก (OUT)'];   
    if (data[i]['ล็อตแบทช์'] !== "") batches.add(data[i]['ล็อตแบทช์']);
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
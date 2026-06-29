function getKPIData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  let totalIn = 0;
  let totalOut = 0;
  let batchSet = new Set();
  
  for (let s = 0; s < sheets.length; s++) {
    const data = sheets[s].getDataRange().getValues();
    for (let i = 4; i < data.length; i++) {
      const row = data[i];  
      if (row.join("").trim() === "") continue;   
      const inVal = row[5];
      if (inVal !== "" && !isNaN(inVal) && typeof inVal === 'number') {
        totalIn += inVal;
      }
      
      const outVal = row[7];
      if (outVal !== "" && !isNaN(outVal) && typeof outVal === 'number') {
        totalOut += outVal;
      }
      
      const batchVal = row[3];
      if (batchVal !== "" && batchVal !== undefined && batchVal !== null) {
        batchSet.add(batchVal.toString().trim());
      }
    }
  }
  
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
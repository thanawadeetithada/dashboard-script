function getTableData() {
  const data = getSheetData();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  let tableRows = [];
  
  // ข้ามบรรทัดที่ 0 (Header)
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    let rowObj = {};
    
    headers.forEach((header, index) => {
      let val = row[index];
      // ตรวจสอบข้อมูลวันที่เพื่อฟอร์แมตให้สวยงามก่อนส่งไป HTML
      if (val instanceof Date) {
        rowObj[header] = Utilities.formatDate(val, "GMT+07:00", "dd-MMM-yyyy");
      } else {
        rowObj[header] = val !== undefined && val !== null ? val.toString() : "";
      }
    });
    
    tableRows.push(rowObj);
  }
  
  // คุณสามารถใช้ .reverse() ตรงนี้ได้หากต้องการให้ข้อมูลใหม่สุดขึ้นก่อน
  return tableRows;
}
function processCsvUpload(csvContent, isAppend) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // บันทึกลงชีตที่กำลังเปิดอยู่
    const parsedData = Utilities.parseCsv(csvContent);
    
    if (parsedData.length === 0) throw new Error("ไม่พบข้อมูลในไฟล์ CSV");
    
    if (!isAppend) {
      sheet.clear();
      sheet.getRange(1, 1, parsedData.length, parsedData[0].length).setValues(parsedData);
    } else {
      const dataToAppend = parsedData.length > 1 ? parsedData.slice(1) : parsedData;
      const lastRow = sheet.getLastRow();
      
      if (lastRow === 0) {
        sheet.getRange(1, 1, parsedData.length, parsedData[0].length).setValues(parsedData);
      } else {
        sheet.getRange(lastRow + 1, 1, dataToAppend.length, dataToAppend[0].length).setValues(dataToAppend);
      }
    }
    return { status: 'success', message: 'นำเข้าข้อมูลเรียบร้อยแล้ว' };
  } catch (error) {
    return { status: 'error', message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}
function processCsvUpload(csvContent, isAppend) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0]; 
    const delimiter = csvContent.indexOf('\t') !== -1 ? '\t' : ',';
    const parsedData = Utilities.parseCsv(csvContent, delimiter);
    
    if (parsedData.length === 0) throw new Error("ไม่พบข้อมูลสำหรับอัปเดต");
    
    if (!isAppend) {
      const lastRow = Math.max(sheet.getLastRow(), 4);
      if (lastRow > 4) {
        sheet.getRange(5, 1, lastRow - 4, sheet.getLastColumn()).clearContent();
      }
      sheet.getRange(5, 1, parsedData.length, parsedData[0].length).setValues(parsedData);
    } else {
      const lastRow = Math.max(sheet.getLastRow(), 4);
      sheet.getRange(lastRow + 1, 1, parsedData.length, parsedData[0].length).setValues(parsedData);
    }
    
    return { status: 'success', message: `นำเข้าข้อมูลจำนวน ${parsedData.length} รายการ เรียบร้อยแล้ว` };
  } catch (error) {
    return { status: 'error', message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}
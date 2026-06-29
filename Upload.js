function processCsvUpload(csvContent, isAppend) {
  try {
    const sheet = getWorkingSheet();
    const parsedData = Utilities.parseCsv(csvContent);
    
    if (parsedData.length === 0) throw new Error("ไม่พบข้อมูลในไฟล์ CSV");
    
    if (!isAppend) {
      // โหมดแทนที่: ลบข้อมูลเก่าแล้วเขียนใหม่ทั้งหมด
      sheet.clear();
      sheet.getRange(1, 1, parsedData.length, parsedData[0].length).setValues(parsedData);
    } else {
      // โหมดต่อท้าย: ตัดแถวหัวตาราง (Header) ออกก่อนนำไปต่อท้าย
      const dataToAppend = parsedData.length > 1 ? parsedData.slice(1) : parsedData;
      const lastRow = sheet.getLastRow();
      
      if (lastRow === 0) {
        // ถ้าชีตยังว่างอยู่ ให้นำเข้าทั้งหมดรวม Header
        sheet.getRange(1, 1, parsedData.length, parsedData[0].length).setValues(parsedData);
      } else {
        // ต่อท้ายข้อมูลบรรทัดสุดท้าย
        sheet.getRange(lastRow + 1, 1, dataToAppend.length, dataToAppend[0].length).setValues(dataToAppend);
      }
    }
    return { status: 'success', message: 'นำเข้าข้อมูลเรียบร้อยแล้ว' };
  } catch (error) {
    return { status: 'error', message: 'เกิดข้อผิดพลาด: ' + error.toString() };
  }
}
function doGet() {
  // ดึงหน้า UI จากไฟล์ index.html
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('PM Movement Analytics')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ฟังก์ชันตัวช่วย: ดึงชีต "แท็บแรกสุด" เสมอ โดยไม่ต้องกำหนดชื่อชีต
function getWorkingSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets()[0]; // Index 0 คือชีตซ้ายสุด
}

// ฟังก์ชันตัวช่วย: ดึงข้อมูลทั้งหมดจากชีตแรก
function getSheetData() {
  const sheet = getWorkingSheet();
  if (!sheet) return [];
  return sheet.getDataRange().getValues();
}
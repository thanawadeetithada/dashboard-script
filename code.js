function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('PM Movement Analytics')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ฟังก์ชันช่วยจัดการรูปแบบวันที่
function parseDateStr(val) {
  if (!val) return "";
  if (val instanceof Date) return Utilities.formatDate(val, "GMT+07:00", "dd-MMM-yyyy");
  return val.toString();
}

// ดึงข้อมูลจาก "ทุกชีต" และจัดโครงสร้างคอลัมน์ตามไฟล์ Excel จริง
function getCleanDataAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  let allData = [];
  
  for (let s = 0; s < sheets.length; s++) {
    const data = sheets[s].getDataRange().getValues();
    
    // ข้าม 4 บรรทัดแรก (Header) เริ่มเก็บข้อมูลที่บรรทัดที่ 5 (index 4)
    for (let i = 4; i < data.length; i++) {
      let row = data[i];
      
      // ถ้าแถวว่างเปล่าทั้งหมด ให้ข้าม
      if (row.join("").trim() === "") continue;
      
      let inVal = Number(row[5]); // คอลัมน์ F (Index 5)
      let outVal = Number(row[7]); // คอลัมน์ H (Index 7)
      
      let rowObj = {
        'รหัสบรรจุภัณฑ์': row[0] ? row[0].toString().trim() : "",
        'ประเภท/ชื่อ': row[1] ? row[1].toString().trim() : "",
        'ผู้จัดจำหน่าย': row[2] ? row[2].toString().trim() : "",
        'ล็อตแบทช์': row[3] ? row[3].toString().trim() : "",       // คอลัมน์ D
        'วันผลิต': parseDateStr(row[4]),
        'รับเข้า (IN)': !isNaN(inVal) && row[5] !== "" ? inVal : "", 
        'วันที่บันทึก': parseDateStr(row[6]),
        'จ่ายออก (OUT)': !isNaN(outVal) && row[7] !== "" ? outVal : "",
        'ปลายทางบรรจุ': row[8] ? row[8].toString().trim() : "",
        'วันจัดส่ง': parseDateStr(row[9]),
        'หมายเหตุ': row[10] ? row[10].toString().trim() : ""
      };
      
      // เก็บข้อมูลเฉพาะบรรทัดที่มีการเคลื่อนไหวหรือมีล็อตนำเข้า
      if (rowObj['รับเข้า (IN)'] !== "" || rowObj['จ่ายออก (OUT)'] !== "" || rowObj['ล็อตแบทช์'] !== "") {
        allData.push(rowObj);
      }
    }
  }
  return allData;
}
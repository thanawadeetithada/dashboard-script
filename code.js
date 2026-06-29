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
    
    // ประกาศตัวแปรเพื่อ "จดจำ" ข้อมูลหลักจากบรรทัดบนสุดของล็อต (สืบทอดค่าลงมา A-G)
    let currentCode = "";
    let currentName = "";
    let currentSupplier = "";
    let currentBatch = "";
    let currentMfgDate = "";
    let currentInVal = "";
    let currentRecordDate = "";
    
    // ข้าม 4 บรรทัดแรก (Header) เริ่มเก็บข้อมูลที่บรรทัดที่ 5 (index 4)
    for (let i = 4; i < data.length; i++) {
      let row = data[i];
      
      // ถ้าแถวว่างเปล่าทั้งหมด ให้ข้าม
      if (row.join("").trim() === "") continue;
      
      // อัปเดตตัวแปรหากมีข้อมูลในเซลล์นั้นๆ (ถ้าเซลล์ว่างจะใช้ค่าเดิมจากบรรทัดก่อนหน้า)
      if (row[0] !== "") currentCode = row[0].toString().trim();
      if (row[1] !== "") currentName = row[1].toString().trim();
      if (row[2] !== "") currentSupplier = row[2].toString().trim();
      if (row[3] !== "") currentBatch = row[3].toString().trim();
      if (row[4] !== "") currentMfgDate = parseDateStr(row[4]);
      if (row[5] !== "") currentInVal = row[5];
      if (row[6] !== "") currentRecordDate = parseDateStr(row[6]);
      
      let outVal = Number(row[7]); // คอลัมน์ H (Index 7)
      let inValNum = Number(currentInVal);
      
      let rowObj = {
        'รหัสบรรจุภัณฑ์': currentCode,
        'ประเภท/ชื่อ': currentName,
        'ผู้จัดจำหน่าย': currentSupplier,
        'ล็อตแบทช์': currentBatch,
        'วันผลิต': currentMfgDate,
        'รับเข้า (IN)': currentInVal !== "" && !isNaN(inValNum) ? inValNum : "", 
        'วันที่บันทึก': currentRecordDate,
        'จ่ายออก (OUT)': row[7] !== "" && !isNaN(outVal) ? outVal : "",
        'ปลายทางบรรจุ': row[8] ? row[8].toString().trim() : "",
        'วันจัดส่ง': parseDateStr(row[9]),
        'เลขที่ใบจ่าย/remark': row[10] ? row[10].toString().trim() : "",
        'ยอดคงแบทซ์': row[11] !== "" ? row[11] : ""
      };
      
      // เก็บข้อมูลเฉพาะบรรทัดที่มีการเคลื่อนไหวหรือมีล็อตนำเข้า
      if (rowObj['รับเข้า (IN)'] !== "" || rowObj['จ่ายออก (OUT)'] !== "") {
        allData.push(rowObj);
      }
    }
  }
  return allData;
}

function getTableData() {
  // ดึงข้อมูลที่จัดระเบียบแล้วจากทุกชีต
  const data = getCleanDataAllSheets();
  
  // ส่งข้อมูลกลับไปแสดงผลตรงๆ โดยไม่ต้องใช้ .reverse() แล้ว
  // ข้อมูลจะเรียงจาก ชีต 1 -> ชีตสุดท้าย และ บน -> ล่าง ตามลำดับจริง
  return data; 
}

function getFilterOptions() {
  const data = getCleanDataAllSheets();
  
  let codes = new Set(), names = new Set(), suppliers = new Set(), batches = new Set(), dests = new Set();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i]['รหัสบรรจุภัณฑ์']) codes.add(data[i]['รหัสบรรจุภัณฑ์']);
    if (data[i]['ประเภท/ชื่อ']) names.add(data[i]['ประเภท/ชื่อ']);
    if (data[i]['ผู้จัดจำหน่าย']) suppliers.add(data[i]['ผู้จัดจำหน่าย']);
    if (data[i]['ล็อตแบทช์']) batches.add(data[i]['ล็อตแบทช์']);
    if (data[i]['ปลายทางบรรจุ']) dests.add(data[i]['ปลายทางบรรจุ']);
  }
  
  return {
    productCodes: Array.from(codes).sort(),
    productNames: Array.from(names).sort(),
    suppliers: Array.from(suppliers).sort(),
    batches: Array.from(batches).sort(),
    destinations: Array.from(dests).sort()
  };
}
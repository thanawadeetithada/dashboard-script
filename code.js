function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('PM Movement Analytics')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function parseDateStr(val) {
  if (!val) return "";
  if (val instanceof Date) return Utilities.formatDate(val, "GMT+07:00", "dd-MMM-yyyy");
  return val.toString();
}

function getCleanDataAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  let allData = [];
  
  for (let s = 0; s < sheets.length; s++) {
    const sheet = sheets[s];
    const sheetName = sheet.getName(); // ดึงชื่อชีทมาเก็บไว้
    const data = sheet.getDataRange().getValues();
    
    let currentCode = "";
    let currentName = "";
    let currentSupplier = "";
    let currentBatch = "";
    let currentMfgDate = "";
    let currentInVal = "";
    let currentRecordDate = "";
    
    for (let i = 4; i < data.length; i++) {
      let row = data[i];
      if (row.join("").trim() === "") continue;
      
      if (row[0] !== "") currentCode = row[0].toString().trim();
      if (row[1] !== "") currentName = row[1].toString().trim();
      if (row[2] !== "") currentSupplier = row[2].toString().trim();
      if (row[3] !== "") currentBatch = row[3].toString().trim();
      if (row[4] !== "") currentMfgDate = parseDateStr(row[4]);
      if (row[5] !== "") currentInVal = row[5];
      if (row[6] !== "") currentRecordDate = parseDateStr(row[6]);
      
      let outVal = Number(row[7]);
      let inValNum = Number(currentInVal);
      
      let rowObj = {
        'รหัสบรรจุภัณฑ์': currentCode,
        'ประเภท/ชื่อ': currentName, // ชื่อสินค้าดิบ เอาไว้แสดงในตาราง
        'ชื่อชีท': sheetName,      // ชื่อชีท เอาไว้ใช้ทำ Dropdown และค้นหา
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
      
      if (rowObj['รับเข้า (IN)'] !== "" || rowObj['จ่ายออก (OUT)'] !== "") {
        allData.push(rowObj);
      }
    }
  }
  return allData;
}

function getTableData() {
  return getCleanDataAllSheets(); 
}

function getFilterOptions() {
  const data = getCleanDataAllSheets();
  let codes = new Set(), names = new Set(), suppliers = new Set(), batches = new Set(), dests = new Set();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i]['รหัสบรรจุภัณฑ์']) codes.add(data[i]['รหัสบรรจุภัณฑ์']);
    if (data[i]['ชื่อชีท']) names.add(data[i]['ชื่อชีท']); // แก้ไขจาก 'ประเภท/ชื่อ' เป็น 'ชื่อชีท' เพื่อดึงชื่อชีทไปแสดงในดรอปดาวน์ตัวกรอง
    if (data[i]['ผู้จัดจำหน่าย']) suppliers.add(data[i]['ผู้จัดจำหน่าย']);
    if (data[i]['ล็อตแบทช์']) batches.add(data[i]['ล็อตแบทช์']);
    if (data[i]['ปลายทางบรรจุ']) dests.add(data[i]['ปลายทางบรรจุ']);
  }
  
  return {
    productCodes: Array.from(codes).sort(),
    productNames: Array.from(names).sort(), // ส่งรายชื่อชีทที่เรียงลำดับแล้วกลับไปให้ฝั่ง Client
    suppliers: Array.from(suppliers).sort(),
    batches: Array.from(batches).sort(),
    destinations: Array.from(dests).sort()
  };
}

function getChartData() {
  return {
    monthly: {
      labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
      inData: [1500, 2000, 1800, 2200, 1900, 2500],
      outData: [1200, 1800, 1500, 2000, 1700, 2100]
    },
    type: {
      labels: ['ถัง 20L', 'ขวด 1L', 'แกลลอน 5L', 'กล่องกระดาษ'],
      data: [45, 25, 20, 10]
    }
  };
}
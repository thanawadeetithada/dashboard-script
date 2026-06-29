function getFilterOptions() {
  const data = getSheetData();
  let options = { productCodes: [], productNames: [], suppliers: [], batches: [], destinations: [] };
  
  if (data.length <= 1) return options;
  
  const headers = data[0];
  const codeIdx = headers.indexOf('รหัสบรรจุภัณฑ์') > -1 ? headers.indexOf('รหัสบรรจุภัณฑ์') : 1;
  const nameIdx = headers.indexOf('ประเภท/ชื่อ') > -1 ? headers.indexOf('ประเภท/ชื่อ') : 2;
  const supIdx = headers.indexOf('ผู้จัดจำหน่าย') > -1 ? headers.indexOf('ผู้จัดจำหน่าย') : 3;
  const batchIdx = headers.indexOf('ล็อตแบทช์') > -1 ? headers.indexOf('ล็อตแบทช์') : 4;
  const destIdx = headers.indexOf('ปลายทางบรรจุ') > -1 ? headers.indexOf('ปลายทางบรรจุ') : 9;

  let codes = new Set(), names = new Set(), suppliers = new Set(), batches = new Set(), dests = new Set();

  for (let i = 1; i < data.length; i++) {
    if (data[i][codeIdx]) codes.add(data[i][codeIdx].toString().trim());
    if (data[i][nameIdx]) names.add(data[i][nameIdx].toString().trim());
    if (data[i][supIdx]) suppliers.add(data[i][supIdx].toString().trim());
    if (data[i][batchIdx]) batches.add(data[i][batchIdx].toString().trim());
    if (data[i][destIdx]) dests.add(data[i][destIdx].toString().trim());
  }

  // แปลง Set เป็น Array ลบค่าว่าง และเรียงลำดับตัวอักษร
  options.productCodes = Array.from(codes).filter(String).sort();
  options.productNames = Array.from(names).filter(String).sort();
  options.suppliers = Array.from(suppliers).filter(String).sort();
  options.batches = Array.from(batches).filter(String).sort();
  options.destinations = Array.from(dests).filter(String).sort();

  return options;
}
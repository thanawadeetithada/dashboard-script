function getFilterOptions() {
  const data = getCleanDataAllSheets();
  
  let codes = new Set(), names = new Set(), suppliers = new Set(), batches = new Set(), dests = new Set();
  
  for (let i = 0; i < data.length; i++) {
    if (data[i]['รหัสบรรจุภัณฑ์']) codes.add(data[i]['รหัสบรรจุภัณฑ์']);
    
    // สำคัญ: เปลี่ยนมาดึง 'ชื่อชีท' เพื่อเอาไปใส่ใน Dropdown
    if (data[i]['ชื่อชีท']) names.add(data[i]['ชื่อชีท']); 
    
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
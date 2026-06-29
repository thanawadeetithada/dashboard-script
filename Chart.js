function getChartData() {
  const data = getSheetData();
  let result = { 
    monthly: { labels: [], inData: [], outData: [] }, 
    type: { labels: [], data: [] } 
  };
  
  if (data.length <= 1) return result;
  
  const headers = data[0];
  const dateIdx = headers.indexOf('วันที่บันทึก') > -1 ? headers.indexOf('วันที่บันทึก') : 7;
  const inIdx = headers.indexOf('รับเข้า (IN)') > -1 ? headers.indexOf('รับเข้า (IN)') : 6;
  const outIdx = headers.indexOf('จ่ายออก (OUT)') > -1 ? headers.indexOf('จ่ายออก (OUT)') : 8;
  const typeIdx = headers.indexOf('ประเภท/ชื่อ') > -1 ? headers.indexOf('ประเภท/ชื่อ') : 2;

  let monthlyStats = {};
  let typeStats = {};

  for (let i = 1; i < data.length; i++) {
    // 1. ข้อมูลรายเดือน
    let rowDate = new Date(data[i][dateIdx]);
    if (!isNaN(rowDate.getTime())) {
      let monthYear = Utilities.formatDate(rowDate, "GMT+07:00", "MMM yyyy");
      if (!monthlyStats[monthYear]) monthlyStats[monthYear] = { in: 0, out: 0 };
      monthlyStats[monthYear].in += Number(data[i][inIdx]) || 0;
      monthlyStats[monthYear].out += Number(data[i][outIdx]) || 0;
    }

    // 2. ข้อมูลสัดส่วนประเภทบรรจุภัณฑ์ (ใช้ยอดรับเข้า)
    let typeName = data[i][typeIdx];
    if (typeName && typeName.toString().trim() !== "") {
      let typeStr = typeName.toString().trim();
      if (!typeStats[typeStr]) typeStats[typeStr] = 0;
      typeStats[typeStr] += Number(data[i][inIdx]) || 0; 
    }
  }

  result.monthly.labels = Object.keys(monthlyStats);
  result.monthly.inData = Object.keys(monthlyStats).map(k => monthlyStats[k].in);
  result.monthly.outData = Object.keys(monthlyStats).map(k => monthlyStats[k].out);
  
  result.type.labels = Object.keys(typeStats);
  result.type.data = Object.keys(typeStats).map(k => typeStats[k]);

  return result;
}
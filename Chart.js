function getChartData() {
  const data = getCleanDataAllSheets();
  let result = { 
    monthly: { labels: [], inData: [], outData: [] }, 
    type: { labels: [], data: [] } 
  };
  
  let monthlyStats = {};
  let typeStats = {};

  for (let i = 0; i < data.length; i++) {
    let rawDate = data[i]['วันที่บันทึก']; 
    if (rawDate !== "") {
      let d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        let monthYear = Utilities.formatDate(d, "GMT+07:00", "MMM yyyy");
        if (!monthlyStats[monthYear]) monthlyStats[monthYear] = { in: 0, out: 0 };
        if (data[i]['รับเข้า (IN)'] !== "") monthlyStats[monthYear].in += data[i]['รับเข้า (IN)'];
        if (data[i]['จ่ายออก (OUT)'] !== "") monthlyStats[monthYear].out += data[i]['จ่ายออก (OUT)'];
      }
    }

    let typeName = data[i]['ประเภท/ชื่อ'];
    if (typeName !== "") {
      if (!typeStats[typeName]) typeStats[typeName] = 0;
      if (data[i]['รับเข้า (IN)'] !== "") typeStats[typeName] += data[i]['รับเข้า (IN)'];
    }
  }

  result.monthly.labels = Object.keys(monthlyStats);
  result.monthly.inData = Object.keys(monthlyStats).map(k => monthlyStats[k].in);
  result.monthly.outData = Object.keys(monthlyStats).map(k => monthlyStats[k].out);
  
  result.type.labels = Object.keys(typeStats);
  result.type.data = Object.keys(typeStats).map(k => typeStats[k]);

  return result;
}
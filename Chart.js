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
        if (data[i]['รับเข้า (IN)'] !== "") monthlyStats[monthYear].in += Number(data[i]['รับเข้า (IN)']);
        if (data[i]['จ่ายออก (OUT)'] !== "") monthlyStats[monthYear].out += Number(data[i]['จ่ายออก (OUT)']);
      }
    }

    let typeName = data[i]['ชื่อชีท'];
    if (typeName !== "" && typeName !== undefined) {
      if (!typeStats[typeName]) typeStats[typeName] = 0;
      if (data[i]['รับเข้า (IN)'] !== "") {
        typeStats[typeName] += Number(data[i]['รับเข้า (IN)']);
      }
    }
  }

  for (let month in monthlyStats) {
    result.monthly.labels.push(month);
    result.monthly.inData.push(monthlyStats[month].in);
    result.monthly.outData.push(monthlyStats[month].out);
  }

  for (let type in typeStats) {
    result.type.labels.push(type);
    result.type.data.push(typeStats[type]);
  }

  return result;
}
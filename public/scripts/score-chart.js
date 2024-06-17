const width = 200;
const height = 200;
const margin = 20;
const radius = Math.min(width, height) / 2 - margin;

scans.forEach((scan, index) => {
  const scanResultData = scan.score;

  try {
    const color = scanResultData === 100 ? "#0275FF" : "#FF9800";

    const svg = d3.select(`#scan-result-chart-${index}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

    const data = [
      { name: "score", value: scanResultData },
      { name: "remaining", value: 100 - scanResultData }
    ];

    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(d => d.data.name === "score" ? radius + 0.7 : radius); // Slightly larger outer radius for the score arc

    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.name === "score" ? color : "#FFE0B3")
      .attr("stroke", d => d.data.name === "score" ? color : "#FFE0B3")
      .attr("stroke-width", "2px");

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("class", "scan-score")
      .attr("fill", "#5D666A")
      .text(`${scanResultData}%`);

    // Hide the table if the chart is shown
    document.getElementById(`scan-table-${index}`).style.display = "none";
  } catch (error) {
    console.error("Error creating chart:", error);
    // If there is an error, ensure the table is visible
    document.getElementById(`scan-table-${index}`).style.display = "block";
    document.getElementById(`scan-result-chart-${index}`).style.display = "none";
  }
});
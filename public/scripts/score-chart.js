let width = 200;
let height = 200;
let margin = 20;
let radius = Math.min(width, height) / 2 - margin;

// Define the icons associated with each error type
const icons = {
  "Contrast fouten": "/images/contrast-icon.svg",
  "Structurele fouten": "/images/structureel-icon.svg",
  "Ontbrekende alt-teksten": "/images/alt-teksten-icon.svg",
  "Ontbrekende aria-labels": "/images/aria-labels-icon.svg"
};

// Iterate through each scan result
scans.forEach((scan, index) => {
  const scanResultData = scan.score; // Extract the score from the scan result
  let errorData = scan.result; // Extract the error data from the scan result

  // Filter out "Ontdekte fouten" from the error data
  errorData = errorData.filter(d => d.title !== "Ontdekte fouten");

  try {
    const color = scanResultData === 100 ? "#0275FF" : "#FF9800"; // Color based on score

    // Create the SVG container for the pie chart
    const svg = d3.select(`#scan-result-chart-${index}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Prepare the pie layout
    const pie = d3.pie()
      .sort(null)
      .value(d => d.value);

    // Define the data for the pie chart
    const data = [
      { name: "score", value: scanResultData },
      { name: "remaining", value: 100 - scanResultData }
    ];

    // Define the arc for the pie slices
    const arc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(d => d.data.name === "score" ? radius + 0.7 : radius); // Slightly larger outer radius for the score arc

    // Create the pie slices
    svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.name === "score" ? color : "#FFE0B3")
      .attr("stroke", d => d.data.name === "score" ? color : "#FFE0B3")
      .attr("stroke-width", "2px");

    // Add the score text in the center of the pie chart
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

  // Create the error types chart
  try {
    let width = 800;
    let height = 300;
    let margin = 40;

    // Create the SVG container for the error chart
    const errorSvg = d3.select(`#error-chart-${index}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);
    
    // Define the X-axis scale
    const x = d3.scaleBand()
      .range([0, width - 2 * margin])
      .domain(errorData.map(d => d.title))
      .padding(0.4);
    
    // Define the Y-axis scale
    const y = d3.scaleLinear()
      .range([height - 2 * margin, 0])
      .domain([0, 50]);  // Set Y-axis range from 0 to 50
    
    // Add the X-axis to the SVG
    errorSvg.append("g")
      .attr("transform", `translate(0, ${height - 2 * margin})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(0,5)") // Adjusted transform
      .style("text-anchor", "middle");
    
    // Add the Y-axis to the SVG
    errorSvg.append("g")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("d"))); // Steps of 10

    // Create circles for each error data point
    errorSvg.selectAll("circle")
      .data(errorData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.title) + x.bandwidth() / 2)
      .attr("cy", d => y(d.amount))
      .attr("r", 5)
      .style("fill", "#0275FF");

    // Add icons for each error data point
    errorSvg.selectAll(".icon")
      .data(errorData)
      .enter()
      .append("image")
      .attr("xlink:href", d => icons[d.title])
      .attr("width", 24)
      .attr("height", 24)
      .attr("x", d => x(d.title) + x.bandwidth() / 2 - 12)
      .attr("y", d => y(d.amount) - 30);

    // Add dashed lines from each circle to the X-axis
    errorSvg.selectAll(".line")
      .data(errorData)
      .enter()
      .append("line")
      .attr("x1", d => x(d.title) + x.bandwidth() / 2)
      .attr("y1", d => y(d.amount))
      .attr("x2", d => x(d.title) + x.bandwidth() / 2)
      .attr("y2", height - 2 * margin)
      .style("stroke", "#0275FF")
      .style("stroke-width", 2)
      .style("stroke-dasharray", "5,5");

    document.getElementById(`error-table-${index}`).style.display = 'none';
  } catch (error) {
    console.error('Error creating chart:', error);
  }

  // Create the toegankelijkheids (accessibility) chart
  try {
    let width = 1100;
    let height = 400;
    let margin = 40;

    // Create the SVG container for the toegankelijkheids chart
    const toegankelijkheidsSvg = d3.select(`#toegankelijkheids-chart-${index}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);
    
    // Define the X-axis scale based on scan dates
    const x = d3.scaleBand()
      .domain(scans.map(d => d.date))
      .range([0, width - 2 * margin])
      .padding(0.1);
    
    // Define the Y-axis scale for scores
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([height - 2 * margin, 0]);
    
    // Add the X-axis to the SVG
    toegankelijkheidsSvg.append('g')
      .attr("transform", `translate(0, ${height - 2 * margin})`)
      .call(d3.axisBottom(x));

    // Add the Y-axis to the SVG
    toegankelijkheidsSvg.append('g')
      .call(d3.axisLeft(y).ticks(10).tickFormat(d => d + '%'));

    // Define the line generator for the score trend line
    const line = d3.line()
      .x(d => x(d.date) + x.bandwidth() / 2)
      .y(d => y(d.score))
      .curve(d3.curveMonotoneX);

    // Create the trend line
    toegankelijkheidsSvg.append('path')
      .datum(scans)
      .attr('fill', 'none')
      .attr('stroke', '#0275FF')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add circles at each data point
    toegankelijkheidsSvg.selectAll('circle')
      .data(scans)
      .enter()
      .append('circle')
      .attr('cx', d => x(d.date) + x.bandwidth() / 2)
      .attr('cy', d => y(d.score))
      .attr('r', 5)
      .attr('fill', '#0275FF');

    // Add text labels for each data point
    toegankelijkheidsSvg.selectAll('text.label')
      .data(scans)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.date) + x.bandwidth() / 2)
      .attr('y', d => y(d.score) - 10)
      .attr('text-anchor', 'middle')
      .text(d => d.score + '%');

    document.getElementById(`toegankelijkheids-table-${index}`).style.display = 'none';
  }
  catch (error) {
    console.error('Error creating chart:', error);
  }
});
import { select } from 'd3-selection';
import { geoMercator, geoPath } from 'd3-geo';
import { json } from 'd3-fetch'; 
import { zoom } from 'd3-zoom';

const container = select("#map-container");
const width = container.node().clientWidth;
const height = container.node().clientHeight;

const svg = container.append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = geoMercator()
    .center([8.23, 46.82])
    .scale(8000)
    .translate([width / 2, height / 2]);

// Load external data and boot
json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
  .then(function(data) {

    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
            .attr("fill", "#FEFCFE")
            .attr("d", geoPath()
                .projection(projection)
            )
            .style("stroke", "#A6A6A6");

    // Add text on the left of the map
    const text = container.append("div")
        .style("position", "absolute")
        .style("left", "20px")
        .style("top", "20px")
        .style("width", "200px")
        .style("padding", "10px")
        .style("background-color", "#fff")        
        .text("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus in libero euismod consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus in libero euismod consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus in libero euismod consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus in libero euismod consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus in libero euismod consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus in libero euismod consequat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus in libero euismod consequat.");
        
    // Remove text on scroll
    window.addEventListener("scroll", () => {
        text.style("opacity", 1 - window.pageYOffset / 400);
    });

    function addPointsToSwitzerland() {
      // Définir les coordonnées de la Suisse
      const switzerland = [    [9.594226,47.525058],[9.632932,47.347601],[9.47997,47.10281],
        [9.932448,46.920728],[10.442701,46.893546],[10.363378,46.483571],
        [9.922837,46.314899],[9.182882,46.440215],[8.966306,46.036932],
        [8.489952,46.005151],[8.31663,46.163642],[7.755992,45.82449],
        [7.273851,45.776948],[6.843593,45.991147],[6.5001,46.429673],
        [6.022609,46.27299],[6.037389,46.725779],[6.768714,47.287708],
        [6.736571,47.541801],[7.192202,47.449766],[7.466759,47.620582],
        [8.317301,47.61358],[8.522612,47.830828],[9.594226,47.525058]
      ];
    
      // Ajouter les points sur la frontière de la carte
      svg.selectAll("myCircles")
        .data(switzerland)
        .enter()
        .append("circle")
          .attr("cx", function(d, i, j) { 
            // Calculate the centroid of the segment between the current point and the next point
            const nextIndex = i === switzerland.length - 1 ? 0 : i + 1;
            const centroid = [(d[0] + switzerland[nextIndex][0]) / 2, (d[1] + switzerland[nextIndex][1]) / 2];
            return projection(centroid)[0];
          })
          .attr("cy", function(d, i, j) {
            // Calculate the centroid of the segment between the current point and the next point
            const nextIndex = i === switzerland.length - 1 ? 0 : i + 1;
            const centroid = [(d[0] + switzerland[nextIndex][0]) / 2, (d[1] + switzerland[nextIndex][1]) / 2];
            return projection(centroid)[1];
          })
          .attr("r", 5)
          .style("fill", "#A60D45")

    }
    
    addPointsToSwitzerland();
  

  });

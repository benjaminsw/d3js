var color = "steelblue";
			//passed
			var values = d3.range(1000).map(d3.randomNormal(20, 5));
			//passed
			var formatCount = d3.format(",.0f");
			//passed
			var margin = {top:20, right:30, bottom:30, left:30},
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;
			//passed
			var max = d3.max(values);
			var min = d3.min(values);
			var x = d3.scaleLinear()
					.domain([min,max])
					.range([0,width]);

			//passed
			var data = d3.histogram(values)
					.thresholds(x.ticks(20));
					//(values);
			console.log(data);
			//passed
			var yMax = d3.max(data, function(d){return d.length});
			var yMin = d3.min(data, function(d){return d.length}); 
			var colorScale = d3.scaleLinear()
							.domain([yMin, yMax])
							.range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);
			//passed
			var y = d3.scaleLinear()
					.domain([0,yMax])
					.range([height, 0]);
			//passed
			//http://stackoverflow.com/questions/40465283/what-is-d3-svg-axis-in-d3-version-4
			var xAxis = d3.axisBottom(x);
			console.log(x(data.x));
			//passed
			var svg = d3.select("body").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
			//passed
			var bar = svg.selectAll(".bar")
					.data(data)
					.enter().append("g")
					.attr("class", "bar")
					.attr("transform", function(d) {return "translate(" + x(d.x) + "," + y(d.y) + ")"; });
			//passed
					bar.append("react")
					.attr("x", 1)
					.attr("width", (x(data[0].dx) -x(0)) -1)
					.attr("height", function(d) {return height - y(d.y); })
					.attr("fill", function(d) {return colorScale(d.y);});
			//passed
					bar.append("text")
					.attr("dy", ".75em")
					.attr("y", -12)
					.attr("x", (x(data[0].dx) - x(0))/2)
					.attr("text-anchor", "middle")
					.text(function(d) {return formatCount(d.y);});
			//passed
					svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);
			//passed
			//adding refreash method to reload new data
			function refresh(values){
				//var values = d3.range(1000).map(d3.randomNormal(20,5));
				var data = d3.histogram()
				.thresholds(x.ticks(20))
				(values);

				//Reset y domain using new data
				var yMax = d3.max(data, function(d){return d.length});
				var yMin = d3.min(data, function(d){return d.length});
				y.domain([0, yMax]);
				var colorScale = d3.scaleLinear()
								.domain([yMin, yMax])
								.range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

				var bar = svg.selectAll(".bar").data(data);

				//remove object with data
				bar.exit().remove();

				bar.transition()
				.duration(1000)
				.attr("height", function(d){ return height - y(d.y); })
				.attr("fill", function(d){ return colorScale(d.y) });

				bar.select("text")
				.transition()
				.duration(1000)
				.text(function(d) {return formatCount(d.y); });
					
			}

			//Calling refreash repleatedly
			setInterval(function() {
				var values = d3.range(1000).map(d3.randomNormal(20,5));
				refresh(values);
	
			}, 2000);
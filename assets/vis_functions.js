var s = d3.scale.linear().domain([-1, 1]).range([10, 245]);

function generate_image(a, b) {
  var img = [];
  img.push(b); img.push(b); img.push(b); img.push(b);
  img.push(b); img.push(a); img.push(a); img.push(b);
  img.push(b); img.push(a); img.push(a); img.push(b);
  img.push(b); img.push(b); img.push(b); img.push(b);
  return img;
}

function img_to_canvas1(img) {
  var canvas = document.createElement("canvas");
  canvas.setAttribute("width", 4);
  canvas.setAttribute("height", 4);
  
  var ctx = canvas.getContext("2d");
  var imgData = ctx.createImageData(4, 4);
  var data = imgData.data;

  for (var i = 0; i < 4; i++) {
	for (var j = 0; j < 4; j++) {
      var value = s(img[i*4+j]);
      data[4*(i*4+j)] = value;
      data[4*(i*4+j)+1] = value;
	  data[4*(i*4+j)+2] = value;
	  data[4*(i*4+j)+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

function img_to_canvas2(img) {
  var h = Math.sqrt(img.length);
  var canvas = document.createElement("canvas");
  canvas.setAttribute("width", h);
  canvas.setAttribute("height", h);
  
  var ctx = canvas.getContext("2d");
  var imgData = ctx.createImageData(h, h);
  var data = imgData.data;

  for (var i = 0; i < h; i++) {
	for (var j = 0; j < h; j++) {
      var value = s(img[j*h+i]);
      data[4*(i*h+j)] = value;
      data[4*(i*h+j)+1] = value;
	  data[4*(i*h+j)+2] = value;
	  data[4*(i*h+j)+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

function example_images_I() {
  for (var i = 0; i < 5; i++) {
    var canvas = document.getElementById("classI_"+i);
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(generate_image(-1+0.2*i,0)),0,0,80,80);
  }
}

function example_images_J() {
  for (var i = 0; i < 5; i++) {
    var canvas = document.getElementById("classJ_"+i);
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(generate_image(0.2+0.2*i,0)),0,0,80,80);
  }
}

function fig0(){
  var width = 300;
  var height = 200;
  var x = d3.scale.linear().domain([-19.5,19.5]).range([0, width]);
  var y = d3.scale.linear().domain([13,-13]).range([0, height]);
  var h = d3.scale.linear().domain([5,-1]).range([0, height]);
  var left_digit = 2;
  var right_digit = 3;
  var requestId;
  var animationCount = 0;
  var currentIndex = 30;
  var dir = 1;
  var animationRunning = false;
  var requestId;
  
  function draw_fig0(digit0, digit1) {
    queue().defer(d3.text,"assets/data/fig0_data0_"+digit0+digit1+".csv","text/csv")
           .defer(d3.text,"assets/data/fig0_data1_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/fig0_extras_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/fig0_w_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/fig0_bins0_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/fig0_bins1_"+digit0+digit1+".csv","text/csv")
           .await(draw_all);

    function draw_all(error, text_data0, text_data1, text_extras, text_w, text_bins0, text_bins1) {
	  
      var data0 = d3.csv.parseRows(text_data0).map(function(row) {return row.map(function(value) {return +value;});});
	  var data1 = d3.csv.parseRows(text_data1).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csv.parseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});
	  var w = d3.csv.parseRows(text_w).map(function(row) {return row.map(function(value) {return +value;});});
	  var bins0 = d3.csv.parseRows(text_bins0).map(function(row) {return row.map(function(value) {return +value;});});
	  var bins1 = d3.csv.parseRows(text_bins1).map(function(row) {return row.map(function(value) {return +value;});});
	  
	  var max_dAdv = Math.round( Math.max.apply(null, extras[14]) * 10) / 10;
      var min_errTrain = Math.round( Math.min.apply(null, extras[15]) * 10) / 10;
	  
      var fig0_subfig1 = d3.select("#fig0-subfig-content1");
      if (!fig0_subfig1.select("canvas").empty()) {
	    fig0_subfig1.select("canvas").remove()
	  }
      var canvas1 = fig0_subfig1.append("canvas")
                                .attr("width", width)
                                .attr("height", height);
      var context1 = canvas1.node().getContext("2d");
      var container1 = fig0_subfig1.append("custom");
	  
      var fig0_subfig2 = d3.select("#fig0-subfig-content2");
      if (!fig0_subfig2.select("canvas").empty()) {
	    fig0_subfig2.select("canvas").remove()
	  }
      var canvas2 = fig0_subfig2.append("canvas")
                                .attr("width", width)
                                .attr("height", height);
      var context2 = canvas2.node().getContext("2d");
      var container2 = fig0_subfig2.append("custom");

	  function init_canvas1() {
        container1.selectAll("rect0")
                  .data(bins0)
	              .enter()
	              .append("rect0")
                  .attr("x", function(d, i) {return x(i * 0.5 - 18);})
		          .attr("y", function(d) {return h(0) - d[0] * 1.4 * height;})
		          .attr("width", 4.5)
				  .attr("height", function(d) {return d[0] * 1.4 * height;})
			      .attr("fillStyle", "rgba(88.07%, 61.10%, 14.21%,30%)");
				  
        container1.selectAll("rect1")
                  .data(bins1)
	              .enter()
	              .append("rect1")
                  .attr("x", function(d, i) {return x(i * 0.5 - 18);})
		          .attr("y", function(d) {return h(0) - d[0] * 1.4 * height;})
		          .attr("width", 4.5)
				  .attr("height", function(d) {return d[0] * 1.4 * height;})
			      .attr("fillStyle", "rgba(36.84%,50.68%,70.98%,30%)");
	  }
	  
      function init_canvas2() {
        container2.selectAll("circle0")
                  .data(data0)
	              .enter()
	              .append("circle0")
                  .attr("x", function (d) { return x(d[0]);})
		          .attr("y", function (d) { return y(d[currentIndex+1]);})
		          .attr("r", 0.25)
	              .attr("lineWidth", 0.75)
                  .attr("strokeStyle", "rgb(88.07%, 61.10%, 14.21%)")
			      .attr("fillStyle", "rgb(88.07%, 61.10%, 14.21%)");
  				 
	    container2.selectAll("circle1")
                  .data(data1)
		          .enter()
		          .append("circle1")
                  .attr("x", function (d) { return x(d[0]);})
		          .attr("y", function (d) { return y(d[currentIndex+1]);})
		          .attr("r", 0.25)
			      .attr("lineWidth", 0.75)
                  .attr("strokeStyle", "rgb(36.84%,50.68%,70.98%)")
			      .attr("fillStyle", "rgb(36.84%,50.68%,70.98%)");
	  }

	  function draw_canvas1() {
        //Clear canvas
        context1.beginPath();
	    context1.fillStyle = "rgb(100%,100%,100%)";
	    context1.strokeStyle = "rgb(100%,100%,100%)";
        context1.rect(0,0,canvas1.attr("width"),canvas1.attr("height"));
	    context1.fill();
	    context1.stroke();
	    context1.closePath();

		// x-axis
	    context1.beginPath();
        context1.strokeStyle = "rgb(0%,0%,0%)";
	    context1.lineWidth = 0.3;
        context1.moveTo(x(-20),h(0));
        context1.lineTo(x(20),h(0));
        context1.stroke();
	    context1.closePath();
		
        container1.selectAll("rect0")
                  .each(function(d) {
                         var node = d3.select(this);
			             context1.beginPath();
	                     context1.fillStyle = node.attr("fillStyle");
                         context1.rect(node.attr("x"), node.attr("y"), node.attr("width"), node.attr("height"));
					     context1.fill();
                         context1.closePath();
                       });
					   
        container1.selectAll("rect1")
                  .each(function(d) {
                         var node = d3.select(this);
			             context1.beginPath();
	                     context1.fillStyle = node.attr("fillStyle");
                         context1.rect(node.attr("x"), node.attr("y"), node.attr("width"), node.attr("height"));
					     context1.fill();
                         context1.closePath();
                       });
					   
		// Hyperplane
	    context1.beginPath();
        context1.strokeStyle = "rgba(100%,0%,0%,40%)";
	    context1.lineWidth = 2;
        context1.moveTo(x(0),h(-2));
        context1.lineTo(x(0),h(6));
        context1.stroke();
	    context1.closePath();
		
		// path0
	    context1.beginPath();
	    context1.lineWidth = 1.5;
        context1.strokeStyle = "rgb(36.84%,50.68%,70.98%)";
        context1.moveTo(x(-20),h(1 + 20/extras[0][currentIndex]));
        context1.lineTo(x(extras[0][currentIndex]),h(0));
		context1.lineTo(x(20),h(0));
        context1.stroke();
	    context1.closePath();
		
		// path1
	    context1.beginPath();
	    context1.lineWidth = 1.5;
        context1.strokeStyle = "rgb(88.07%, 61.10%, 14.21%)";
        context1.moveTo(x(-20),h(0));
        context1.lineTo(x(-extras[0][currentIndex]),h(0));
		context1.lineTo(x(20),h(1 + 20/extras[0][currentIndex]));
        context1.stroke();
	    context1.closePath();
		
		// tick
	    context1.beginPath();
        context1.strokeStyle = "rgb(100%,0%,0%)";
	    context1.lineWidth = 1;
        context1.moveTo(x(extras[0][currentIndex]),h(-0.05));
        context1.lineTo(x(extras[0][currentIndex]),h(0.05));
        context1.stroke();
	    context1.closePath();

		context1.font = "italic 10px Georgia, serif";
		context1.fillStyle = "rgb(100%,0%,0%)";
        context1.textAlign = "center";
        context1.fillText("1",x(extras[0][currentIndex]),h(-0.3));
		context1.fillText("|| \u00A0\u00A0 ||",x(extras[0][currentIndex]),h(-0.7));
		
		context1.font = "italic bold 10px Georgia, serif";
		context1.fillText("w",x(extras[0][currentIndex]),h(-0.7));

		context1.beginPath();
        context1.strokeStyle = "rgb(100%,0%,0%)";
	    context1.lineWidth = 1;
        context1.moveTo(x(extras[0][currentIndex] - 1.5),h(-0.4));
        context1.lineTo(x(extras[0][currentIndex] + 1.5),h(-0.4));
        context1.stroke();
	    context1.closePath();
	  }

      function draw_canvas2() {
		var theta = -Math.acos(extras[2][currentIndex]);  
		
        //Clear canvas
        context2.beginPath();
	    context2.fillStyle = "rgb(100%,100%,100%)";
	    context2.strokeStyle = "rgb(100%,100%,100%)";
        context2.rect(0,0,canvas2.attr("width"),canvas2.attr("height"));
	    context2.fill();
	    context2.stroke();
	    context2.closePath();
	
	    //Class 0
        container2.selectAll("circle0")
                  .each(function(d) {
                         var node = d3.select(this);
			             context2.beginPath();
                         context2.strokeStyle = node.attr("strokeStyle");
	                     context2.lineWidth = node.attr("lineWidth");
	                     context2.fillStyle = node.attr("fillStyle");
                         context2.arc(node.attr("x"), node.attr("y"), node.attr("r"), 0, 2 * Math.PI);
					     context2.fill();
                         context2.stroke();
                         context2.closePath();
                       });
			 
	    //Class 1
        container2.selectAll("circle1")
                  .each(function(d) {
                         var node = d3.select(this);
			             context2.beginPath();
	                     context2.strokeStyle = node.attr("strokeStyle");
		                 context2.lineWidth = node.attr("lineWidth");
	                     context2.fillStyle = node.attr("fillStyle");
                         context2.arc(node.attr("x"), node.attr("y"), node.attr("r"), 0, 2 * Math.PI);
                         context2.fill();
					     context2.stroke();
                         context2.closePath();
                       });

	    context2.translate(x(0),y(0));
	    context2.rotate(theta);
	    context2.translate(-x(0),-y(0));
		
	    //Margin
        context2.beginPath();	  
	    context2.fillStyle = "rgba(50%, 50%, 50%, 10%)";
	    context2.fillRect(x(-extras[0][currentIndex]-extras[1][currentIndex]),-200,2*Math.abs(x(extras[0][currentIndex])-x(0)),width+200);
	    context2.closePath();

		//H
	    context2.beginPath();
        context2.strokeStyle = "rgba(100%,0%,0%,30%)";
	    context2.lineWidth = 2;
        context2.moveTo(x(-extras[1][currentIndex]),-200);
        context2.lineTo(x(-extras[1][currentIndex]),width+200);
        context2.stroke();
	    context2.closePath();
		
		//w
		context2.beginPath();
        context2.strokeStyle = "rgba(100%,0%,0%,100%)";
	    context2.lineWidth = 1;
        context2.moveTo(x(-extras[1][currentIndex]),y(0));
        context2.lineTo(x(-extras[1][currentIndex])+x(3)-x(0),y(0));
        context2.stroke();
	    context2.closePath();

		context2.beginPath();
        context2.fillStyle = "rgba(100%,0%,0%,100%)";
        context2.moveTo(x(-extras[1][currentIndex])+x(3)-x(0),y(0));
        context2.lineTo(x(-extras[1][currentIndex])+x(3)-x(0)-4,y(0)+3);
		context2.lineTo(x(-extras[1][currentIndex])+x(3)-x(0)+4,y(0));
		context2.lineTo(x(-extras[1][currentIndex])+x(3)-x(0)-4,y(0)-3);
		context2.closePath();
        context2.fill();

		context2.fillStyle = "rgba(100%,0%,0%,100%)";
		context2.font = "italic bold 12.5px Georgia, serif";
        context2.fillText("\u0175",x(-extras[1][currentIndex])+x(3)-x(0)+10,y(0)+2); 
		
	    context2.translate(x(0),y(0));
	    context2.rotate(-theta);
	    context2.translate(-x(0),-y(0));
	  }

      function draw_weight_vector() {
        var thisCanvas = document.getElementById("fig0-canvas");
        var thisContext = thisCanvas.getContext("2d");
        thisContext.imageSmoothingEnabled = false;
        thisContext.drawImage(img_to_canvas2(w[currentIndex]),0,0,150,150);
      }
	  
	  function animate() {
	    draw_canvas1();
	    draw_canvas2();
		draw_weight_vector();
		
	    if (Math.round( extras[14][currentIndex] * 10) / 10 == max_dAdv)
		  d3.select("#fig0-dAdv").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	    else
		  d3.select("#fig0-dAdv").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"})
	    if (Math.round( extras[15][currentIndex] * 10) / 10 == min_errTrain)
		  d3.select("#fig0-errTrain").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	    else
		  d3.select("#fig0-errTrain").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
	  
		d3.select("#fig0-value-lambda").text(parseFloat(7-currentIndex*0.1).toFixed(1));
	    d3.select("#fig0-value-dAdv").text(parseFloat(extras[14][currentIndex]).toFixed(1));
	    d3.select("#fig0-value-errTrain").text(parseFloat(extras[15][currentIndex]).toFixed(1));
		  
		container1.selectAll("rect0")
		          .attr("y", function(d) {return h(0) - d[currentIndex] * 1.4 * height;})
			      .attr("height", function(d) {return d[currentIndex] * 1.4 * height;});

		container1.selectAll("rect1")
		          .attr("y", function(d) {return h(0) - d[currentIndex] * 1.4 * height;})
			      .attr("height", function(d) {return d[currentIndex] * 1.4 * height;});

        container2.selectAll("circle0")
	              .attr("y", function (d) {return y(d[currentIndex+1]);});

	    container2.selectAll("circle1")
	              .attr("y", function (d) {return y(d[currentIndex+1]);});
		
		if (dir == 1)
		  currentIndex++;
	    else
		  currentIndex--;
		if (currentIndex == 0) {
		  dir = 1;
		  animationCount++;
		}
		if (currentIndex == 90)
		  dir = -1;
	  
	    requestId = window.requestAnimationFrame(animate);

	  	if (animationCount==1 && currentIndex==31) {
          animationCount = 0;
          dir = 1;
		  animationRunning = false;
		  window.cancelAnimationFrame(requestId);
		}
	  }
	  
	  init_canvas1();
	  init_canvas2();
	  draw_canvas1();
	  draw_canvas2();
      draw_weight_vector();
	  d3.select("#fig0-value-lambda").text(parseFloat(7-currentIndex*0.1).toFixed(1));
	  d3.select("#fig0-value-dAdv").text(parseFloat(extras[14][currentIndex]).toFixed(1));
	  d3.select("#fig0-value-errTrain").text(parseFloat(extras[15][currentIndex]).toFixed(1));
	  
      d3.select("#play-button").on('click', function() {if (animationRunning) {
		                                                  window.cancelAnimationFrame(requestId);
														  animationCount = 0;
														  currentIndex = 30;
                                                          dir = 1;
	                                                    }
		                                                animationRunning = true;
														animate();});
    }
  }
  
  draw_fig0(left_digit, right_digit);
}

function image_space(){
  var width = 350;
  var height = 350;
  var x = d3.scale.linear().domain([-1.3,1.3]).range([0, width]);
  var y = d3.scale.linear().domain([-1.3,1.3]).range([0, height]);
  var a = 2 * Math.random() - 1;
  var b = 2 * Math.random() - 1;
  
  function draw_image(a,b) {
    var canvas = document.getElementById("image-canvas1");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(generate_image(a,b)),0,0,150,150);
  }
  
  function init_image_space() {
    var space_input = d3.select("#space-input1")
                        .append("svg")
    		  	        .attr("width", width)
			            .attr("height", height);
						
	// input rect
	var input_rect = space_input.append("g")
                                .attr("fill","rgb(100%,100%,100%)")
			                    .attr("stroke-opacity",0.3)
			                    .attr('stroke',"rgb(0%,0%,0%)");
								
	input_rect.append("rect")
			  .attr("id","input-rect")
              .attr("x", x(-1))
              .attr("y", y(-1))
              .attr("width", x(1)-x(-1))
              .attr("height", y(1)-y(-1));
	   
	input_rect.append("line")
              .attr("x1", x(0))
	          .attr("y1", y(-1))
	          .attr("x2", x(0))
	          .attr("y2", y(1));
			  
	input_rect.append("line")
              .attr("x1", x(-1))
	          .attr("y1", y(0))
	          .attr("x2", x(1))
	          .attr("y2", y(0));

    // a and b
    var ab_bars = space_input.append("g")
		                     .attr("stroke-width", 1)
	                         .attr("stroke", "rgb(0%,0%,0%)")
	                         .attr("stroke-opacity",1);
	
    ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(1))
	       .attr("x2", x(1))
	       .attr("y2", y(1));
			 
	ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(-1))
	       .attr("x2", x(-1))
	       .attr("y2", y(1));
		   
	ab_bars.append("line")
           .attr("x1", x(-0.97))
	       .attr("y1", y(-1))
	       .attr("x2", x(-1.03))
	       .attr("y2", y(-1));
		   
	ab_bars.append("line")
           .attr("x1", x(-0.97))
	       .attr("y1", y(1))
	       .attr("x2", x(-1.03))
	       .attr("y2", y(1));
		   
	ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(0.97))
	       .attr("x2", x(-1))
	       .attr("y2", y(1.03));
		   
	ab_bars.append("line")
           .attr("x1", x(1))
	       .attr("y1", y(0.97))
	       .attr("x2", x(1))
	       .attr("y2", y(1.03));
		   
    // labels
    var labels = space_input.append("g")
	                        .attr("fill", "rgb(0%,0%,0%)")
	                        .attr("text-anchor", "middle")
	                        .attr("font-family","Georgia, serif")
 	                        .attr("font-style", "italic")
	                        .attr("font-size", "15px");

    labels.append("text")
          .attr("x", x(0))
	      .attr("y", y(1.15))
		  .text("a");

    labels.append("text")
          .attr("x", x(-1))
	      .attr("y", y(1.15))
		  .text("-1");
		  
    labels.append("text")
          .attr("x", x(1))
	      .attr("y", y(1.15))
		  .text("1");
		  
    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(0.03))
		  .text("b");

    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(1.03))
		  .text("-1");
		  
    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(-0.97))
		  .text("1");
			   
	// dotted lines
    var dotted_lines = space_input.append("g")
		                          .attr("stroke-width", 1)
	                              .attr("stroke", "rgb(0%,0%,0%)")
	                              .attr("stroke-opacity",1)
								  .attr("stroke-dasharray", "3, 1");

    dotted_lines.append("line")
	            .attr("id","x-line")
                .attr("x1", x(-1.03))
	            .attr("y1", y(1)-y(b)+y(-1))
	            .attr("x2", x(a))
	            .attr("y2", y(1)-y(b)+y(-1));

    dotted_lines.append("line")
	            .attr("id","y-line")
                .attr("x1", x(a))
	            .attr("y1", y(1.03))
	            .attr("x2", x(a))
	            .attr("y2", y(1)-y(b)+y(-1));
				
	// (a,b)
    var ab_ticks = space_input.append("g")
		                      .attr("stroke-width", 1)
	                          .attr("stroke", "rgb(0%,0%,0%)")
	                          .attr("stroke-opacity",1);

    ab_ticks.append("line")
	        .attr("id","ab-ticks-x")
            .attr("x1", x(a-0.02))
	        .attr("y1", y(1)-y(b)+y(-1))
	        .attr("x2", x(a+0.02))
	        .attr("y2", y(1)-y(b)+y(-1));

    ab_ticks.append("line")
	        .attr("id","ab-ticks-y")
            .attr("x1", x(a))
	        .attr("y1", y(0.98)-y(b)+y(-1))
	        .attr("x2", x(a))
	        .attr("y2", y(1.02)-y(b)+y(-1));

    space_input.append("text")
	           .attr("id","ab-text")
	           .attr("fill", "rgb(0%,0%,0%)")
	           .attr("font-family","Georgia, serif")
 	           .attr("font-style", "italic")
			   .attr("font-weight", "bold")
	           .attr("font-size", "15px")
               .attr("x", x(a))
	           .attr("y", y(0.95)-y(b)+y(-1))
		       .text("x");
  }
			 
  function mousemove() {
    var a = 2*(d3.mouse(this)[0]-x(-1))/(x(1)-x(-1)) - 1;
	var b = 2*(y(1)-d3.mouse(this)[1])/(y(1)-y(-1)) - 1;
	
    d3.select("#x-line").attr("y1", y(1)-y(b)+y(-1))
	                   .attr("x2", x(a))
	                   .attr("y2", y(1)-y(b)+y(-1));
					   
    d3.select("#y-line").attr("x1", x(a))
	                   .attr("x2", x(a))
	                   .attr("y2", y(1)-y(b)+y(-1))
					   
    d3.select("#ab-ticks-x").attr("x1", x(a-0.02))
	                        .attr("y1", y(1)-y(b)+y(-1))
	                        .attr("x2", x(a+0.02))
	                        .attr("y2", y(1)-y(b)+y(-1));
					   
    d3.select("#ab-ticks-y").attr("x1", x(a))
	                        .attr("y1", y(0.98)-y(b)+y(-1))
	                        .attr("x2", x(a))
	                        .attr("y2", y(1.02)-y(b)+y(-1));
							
    d3.select("#ab-text").attr("x", x(a))
	                     .attr("y", y(0.95)-y(b)+y(-1));
	  
	draw_image(a,b);
  }
  
  init_image_space();
  draw_image(a,b);
  d3.select("#input-rect").on("mouseover", function() { focus.style("display", null); })
                          .on("mouseout", function() { focus.style("display", "none"); })
                          .on("mousemove", mousemove);
}

function fig1(){
  var width = 350;
  var height = 350;
  var x = d3.scale.linear().domain([-1.3, 1.3]).range([0, width]);
  var y = d3.scale.linear().domain([-1.3, 1.3]).range([0, height]);
  var init_theta = 0.66;
  var colorI = "rgb(30%,30%,30%)";
  var colorJ = "rgb(95%,95%,95%)";
  var colorBackgroundI = "rgb(60%,60%,60%)";
  var colorBackgroundJ = "rgb(80%,80%,80%)";
  var red = "rgb(90%,0%,0%)";
  
  function translate_x(theta) {return Math.min((y(-0.8)-y(0)) * Math.tan(0.00001 + Math.PI/2 * -theta), x(1)-x(0));}
  function translate_y(theta) {return Math.min((y(-0.8)-y(0)) - (x(1)-x(0)) * Math.tan(0.00001 + Math.PI/2 - Math.PI/2 * -theta), 0);}
  
  function fig1_right_init(theta){	
    var fig1_right = d3.select("#space-input2")
                       .append("svg")
		  	           .attr("width", width)
			           .attr("height", height);
			
    fig1_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", width)
              .attr("height", height);
			  
    // background
    var g_theta1 = fig1_right.append("g")
	                         .attr("id","fig1-group-theta1")
                             .attr("transform", "rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", x(-2))
            .attr("y", y(-2))
            .attr("width", x(0)-x(-2))
            .attr("height", y(2)-y(-2));
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", x(0))
            .attr("y", y(-2))
            .attr("width", x(0)-x(-2))
            .attr("height", y(2)-y(-2));
	 
	// inside axes
	fig1_right.append("line")
			  .attr("stroke-opacity",0.3)
			  .attr('stroke',"rgb(0%,0%,0%)")
              .attr("x1", x(0))
	          .attr("y1", y(-1))
	          .attr("x2", x(0))
	          .attr("y2", y(1));
			  
	fig1_right.append("line")
			  .attr("stroke-opacity",0.3)
			  .attr('stroke',"rgb(0%,0%,0%)")
              .attr("x1", x(-1))
	          .attr("y1", y(0))
	          .attr("x2", x(1))
	          .attr("y2", y(0));
			
    // classes I and J
    var line_IJ = fig1_right.append("g")
		                    .attr("stroke-width", 4)
	                        .attr("stroke-opacity",1)
							.attr("stroke-linecap", "round");
	  
    line_IJ.append("line")
           .attr("x1", x(-0.2))
	       .attr("y1", y(0))
	       .attr("x2", x(-1))
	       .attr("y2", y(0))
	       .attr("stroke", colorI);
		   
    line_IJ.append("line")
           .attr("x1", x(0.2))
	       .attr("y1", y(0))
	       .attr("x2", x(1))
	       .attr("y2", y(0))
	       .attr("stroke", colorJ);

    var text_IJ = fig1_right.append("g")
	                        .attr("text-anchor", "middle")
	                        .attr("font-family","Georgia, serif")
 	                        .attr("font-style", "normal")
 	                        .attr("font-weight", "bold")
	                        .attr("font-size", "20px");

    text_IJ.append("text")
           .attr("x", x(-0.6))
	       .attr("y", y(0.32))
           .attr("fill", colorI)
		   .text("Class ")
	       .append("tspan")
           .attr("font-style", "italic")
           .text("I");

    text_IJ.append("text")
           .attr("x", x(0.6))
	       .attr("y", y(-0.20))
           .attr("fill", colorJ)
		   .text("Class ")
	       .append("tspan")
           .attr("font-style", "italic")
           .text("J");

    var arrow_IJ = fig1_right.append("g")
	                         .attr("stroke-width", 2)
							 .attr("fill","none")
				             .attr("stroke-linecap", "round");

    arrow_IJ.append("path")
            .attr("d", " M "+x(-0.7)+" "+y(0.15)+" L "+x(-0.6)+" "+y(0.10)+" L "+x(-0.5)+" "+y(0.15))
		    .attr("stroke", colorI);

    arrow_IJ.append("path")
            .attr("d", " M "+x(0.7)+" "+y(-0.15)+" L "+x(0.6)+" "+y(-0.10)+" L "+x(0.5)+" "+y(-0.15))
		    .attr("stroke", colorJ);
			  
	// C_theta
    var g_theta2 = fig1_right.append("g")
	                         .attr("id","fig1-group-theta2")
                             .attr("transform", "rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
							 
    g_theta2.append("line")
            .attr("x1", x(0))
		    .attr("y1", y(2))
		    .attr("x2", x(0))
		    .attr("y2", y(-2))
            .attr("stroke-width", 3)
	        .attr("stroke", red)
     	    .attr("stroke-opacity",1);
		
    fig1_right.append("text")
	          .attr("id","fig1-text-theta")
              .attr("transform", "translate("+translate_x(theta)+","+translate_y(theta)+")")
              .attr("x",x(-0.20))
              .attr("y",y(0.95))
  	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill", red)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "15px")
	          .attr("opacity", 0.5)
              .text("\u2112")
	          .append("tspan")
              .attr("font-size", "10px")
              .attr("dx", "2px")
              .attr("dy", "4px")
	          .text("\u03B8");
		   
	// borders			  
	fig1_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", x(-3))
              .attr("y", y(-3))
              .attr("width", x(-1)-x(-3))
              .attr("height", y(3)-y(-3));
			  
	fig1_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", x(-3))
              .attr("y", y(-3))
              .attr("width", x(3)-x(-3))
              .attr("height", y(-1)-y(-3));
			  
	fig1_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", x(-3))
              .attr("y", y(1))
              .attr("width", x(3)-x(-3))
              .attr("height", y(1)-y(-3));
			  
	fig1_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", x(1))
              .attr("y", y(-3))
              .attr("width", x(1)-x(-3))
              .attr("height", y(3)-y(-3));
								
	fig1_right.append("rect")
			  .attr("id","input-rect")
              .attr("fill","none")
			  .attr("stroke-opacity",0.3)
			  .attr('stroke',"rgb(0%,0%,0%)")
              .attr("x", x(-1))
              .attr("y", y(-1))
              .attr("width", x(1)-x(-1))
              .attr("height", y(1)-y(-1));
	
	// w_theta
    var g_theta3 = fig1_right.append("g")
	                         .attr("id","fig1-group-theta3")
                             .attr("transform", "rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
	
    g_theta3.append("line")
            .attr("x1", x(0))
		    .attr("y1", y(0))
		    .attr("x2", x(0.975))
		    .attr("y2", y(0))
	        .attr("stroke-width", 1)
	        .attr("stroke", red);
		 
    g_theta3.append("polygon")
            .attr("points", x(0.975)+","+y(0)+" "+x(0.95)+","+y(-0.02)+" "+x(1)+","+y(0)+" "+x(0.95)+","+y(0.02))
  	        .attr("fill", "rgb(100%,0%,0%)")
  	        .attr("stroke-width", 1)
  	        .attr("stroke", red);
		 
    g_theta3.append("text")
            .attr("x", x(1.06))
	        .attr("y", y(0.03))
	        .attr("text-anchor", "start")
	        .attr("font-family","Georgia, serif")
	        .attr("fill", red)
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
            .text("w")
	        .append("tspan")
            .attr("font-size", "10px")
            .attr("dx", "2px")
            .attr("dy", "4px")
            .text("\u03B8");
			
    // a and b
    var ab_bars = fig1_right.append("g")
		                    .attr("stroke-width", 1)
	                        .attr("stroke", "rgb(0%,0%,0%)")
	                        .attr("stroke-opacity",1);
	
    ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(1))
	       .attr("x2", x(1))
	       .attr("y2", y(1));
			 
	ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(-1))
	       .attr("x2", x(-1))
	       .attr("y2", y(1));
		   
	ab_bars.append("line")
           .attr("x1", x(-0.97))
	       .attr("y1", y(-1))
	       .attr("x2", x(-1.03))
	       .attr("y2", y(-1));
		   
	ab_bars.append("line")
           .attr("x1", x(-0.97))
	       .attr("y1", y(1))
	       .attr("x2", x(-1.03))
	       .attr("y2", y(1));
		   
	ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(0.97))
	       .attr("x2", x(-1))
	       .attr("y2", y(1.03));
		   
	ab_bars.append("line")
           .attr("x1", x(1))
	       .attr("y1", y(0.97))
	       .attr("x2", x(1))
	       .attr("y2", y(1.03));
		   
    // labels
    var labels = fig1_right.append("g")
	                       .attr("fill", "rgb(0%,0%,0%)")
	                       .attr("text-anchor", "middle")
	                       .attr("font-family","Georgia, serif")
 	                       .attr("font-style", "italic")
	                       .attr("font-size", "15px");

    labels.append("text")
          .attr("x", x(0))
	      .attr("y", y(1.15))
		  .text("a");

    labels.append("text")
          .attr("x", x(-1))
	      .attr("y", y(1.15))
		  .text("-1");
		  
    labels.append("text")
          .attr("x", x(1))
	      .attr("y", y(1.15))
		  .text("1");
		  
    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(0.03))
		  .text("b");

    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(1.03))
		  .text("-1");
		  
    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(-0.97))
		  .text("1");
  }
  
  function fig1_w_theta(theta) {
    var canvas = document.getElementById("image-canvas2");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(generate_image(Math.cos(Math.PI/2 * theta), Math.sin(Math.PI/2 * theta))),0,0,150,150);
  }

  function fig1_update(theta) {
	fig1_w_theta(theta);
	d3.select("#fig1-value-theta").text(parseFloat(theta).toFixed(2));
	d3.select("#fig1-group-theta1").attr("transform","rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
	d3.select("#fig1-group-theta2").attr("transform","rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
	d3.select("#fig1-group-theta3").attr("transform","rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
	d3.select("#fig1-text-theta").attr("transform","translate("+translate_x(theta)+","+translate_y(theta)+")");
  }

  d3.select("#controler-input1").property("value", init_theta);
  d3.select("#fig1-value-theta").text(parseFloat(init_theta).toFixed(2));

  fig1_right_init(init_theta);
  fig1_w_theta(init_theta);

  d3.select("#controler-input1")
	.on("input", function() {fig1_update(this.value);});
}

function fig2(){
  var width = 350;
  var height = 350;
  var x = d3.scale.linear().domain([-1.3, 1.3]).range([0, width]);
  var y = d3.scale.linear().domain([-1.3, 1.3]).range([0, height]);
  var init_theta = 0.;
  var colorI = "rgb(30%,30%,30%)";
  var colorJ = "rgb(95%,95%,95%)";
  var colorBackgroundI = "rgb(60%,60%,60%)";
  var colorBackgroundJ = "rgb(80%,80%,80%)";
  var colorImI = "rgb(10%,10%,10%)";
  var colorImJ = "rgb(30%,30%,30%)";
  var red = "rgb(90%,0%,0%)";
  
  var x_a = -0.8, x_b = 0, y_a = 0.4, y_b = 0; //- 0.75 * Math.random() - 0.25, x_b = 0, y_a = 0.75 * Math.random() + 0.25, y_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  var ym_a = y_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var ym_b = - 2 * y_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function translate_x(theta) {return Math.min((y(-0.8)-y(0)) * Math.tan(0.00001 + Math.PI/2 * -theta), x(1)-x(0));}
  function translate_y(theta) {return Math.min((y(-0.8)-y(0)) - (x(1)-x(0)) * Math.tan(0.00001 + Math.PI/2 - Math.PI/2 * -theta), 0);}
  
  function fig2_right_init(theta){	
    var fig2_right = d3.select("#space-input3")
                       .append("svg")
		  	           .attr("width", width)
			           .attr("height", height);
			
    fig2_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", width)
              .attr("height", height);
			  
    // background
    var g_theta1 = fig2_right.append("g")
	                         .attr("id","fig2-group-theta1")
                             .attr("transform", "rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", x(-2))
            .attr("y", y(-2))
            .attr("width", x(0)-x(-2))
            .attr("height", y(2)-y(-2));
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", x(0))
            .attr("y", y(-2))
            .attr("width", x(0)-x(-2))
            .attr("height", y(2)-y(-2));
	 
	// inside axes
	fig2_right.append("line")
			  .attr("stroke-opacity",0.3)
			  .attr('stroke',"rgb(0%,0%,0%)")
              .attr("x1", x(0))
	          .attr("y1", y(-1))
	          .attr("x2", x(0))
	          .attr("y2", y(1));
			  
	fig2_right.append("line")
			  .attr("stroke-opacity",0.3)
			  .attr('stroke',"rgb(0%,0%,0%)")
              .attr("x1", x(-1))
	          .attr("y1", y(0))
	          .attr("x2", x(1))
	          .attr("y2", y(0));
			
    // classes I and J
    var line_IJ = fig2_right.append("g")
		                    .attr("stroke-width", 4)
	                        .attr("stroke-opacity",1)
							.attr("stroke-linecap", "round");
	  
    line_IJ.append("line")
           .attr("x1", x(-0.2))
	       .attr("y1", y(0))
	       .attr("x2", x(-1))
	       .attr("y2", y(0))
	       .attr("stroke", colorI);
		   
    line_IJ.append("line")
           .attr("x1", x(0.2))
	       .attr("y1", y(0))
	       .attr("x2", x(1))
	       .attr("y2", y(0))
	       .attr("stroke", colorJ);
			  
	// C_theta
    fig2_right.append("line")
	          .attr("id","fig2-group-theta2")
			  .attr("transform", "rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")")
              .attr("x1", x(0))
		      .attr("y1", y(2))
		      .attr("x2", x(0))
		      .attr("y2", y(-2))
              .attr("stroke-width", 3)
	          .attr("stroke", red)
     	      .attr("stroke-opacity",1);
		   
	// borders			  
	fig2_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", x(-3))
              .attr("y", y(-3))
              .attr("width", x(-1)-x(-3))
              .attr("height", y(3)-y(-3));
			  
	fig2_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", x(-3))
              .attr("y", y(-3))
              .attr("width", x(3)-x(-3))
              .attr("height", y(-1)-y(-3));
			  
	fig2_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", x(-3))
              .attr("y", y(1))
              .attr("width", x(3)-x(-3))
              .attr("height", y(1)-y(-3));
			  
	fig2_right.append("rect")
	          .attr("fill","rgb(100%,100%,100%)")
              .attr("x", x(1))
              .attr("y", y(-3))
              .attr("width", x(1)-x(-3))
              .attr("height", y(3)-y(-3));
								
	fig2_right.append("rect")
			  .attr("id","input-rect")
              .attr("fill","none")
			  .attr("stroke-opacity",0.3)
			  .attr('stroke',"rgb(0%,0%,0%)")
              .attr("x", x(-1))
              .attr("y", y(-1))
              .attr("width", x(1)-x(-1))
              .attr("height", y(1)-y(-1));
			
    // a and b
    var ab_bars = fig2_right.append("g")
		                    .attr("stroke-width", 1)
	                        .attr("stroke", "rgb(0%,0%,0%)")
	                        .attr("stroke-opacity",1);
	
    ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(1))
	       .attr("x2", x(1))
	       .attr("y2", y(1));
			 
	ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(-1))
	       .attr("x2", x(-1))
	       .attr("y2", y(1));
		   
	ab_bars.append("line")
           .attr("x1", x(-0.97))
	       .attr("y1", y(-1))
	       .attr("x2", x(-1.03))
	       .attr("y2", y(-1));
		   
	ab_bars.append("line")
           .attr("x1", x(-0.97))
	       .attr("y1", y(1))
	       .attr("x2", x(-1.03))
	       .attr("y2", y(1));
		   
	ab_bars.append("line")
           .attr("x1", x(-1))
	       .attr("y1", y(0.97))
	       .attr("x2", x(-1))
	       .attr("y2", y(1.03));
		   
	ab_bars.append("line")
           .attr("x1", x(1))
	       .attr("y1", y(0.97))
	       .attr("x2", x(1))
	       .attr("y2", y(1.03));
		   
    // labels
    var labels = fig2_right.append("g")
	                       .attr("fill", "rgb(0%,0%,0%)")
	                       .attr("text-anchor", "middle")
	                       .attr("font-family","Georgia, serif")
 	                       .attr("font-style", "italic")
	                       .attr("font-size", "15px");

    labels.append("text")
          .attr("x", x(0))
	      .attr("y", y(1.15))
		  .text("a");

    labels.append("text")
          .attr("x", x(-1))
	      .attr("y", y(1.15))
		  .text("-1");
		  
    labels.append("text")
          .attr("x", x(1))
	      .attr("y", y(1.15))
		  .text("1");
		  
    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(0.03))
		  .text("b");

    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(1.03))
		  .text("-1");
		  
    labels.append("text")
          .attr("x", x(-1.15))
	      .attr("y", y(-0.97))
		  .text("1");
		  
	// x y xm ym
	fig2_right.append("circle")
	          .attr("cx",x(x_a))
			  .attr("cy",y(-x_b))
			  .attr("r",3)
			  .attr("fill",colorImI);
			  
	fig2_right.append("text")
              .attr("x",x(x_a)+5)
              .attr("y",y(-x_b)+15)
  	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill",colorImI)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "12px")
              .text("x");
			  
	fig2_right.append("circle")
	          .attr("cx",x(y_a))
			  .attr("cy",y(-y_b))
			  .attr("r",3)
			  .attr("fill",colorImJ);
			  
	fig2_right.append("text")
              .attr("x",x(y_a)-5)
              .attr("y",y(-y_b)-10)
  	          .attr("text-anchor", "end")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill",colorImJ)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "12px")
              .text("y");
			  
	fig2_right.append("circle")
	          .attr("id","fig2-xm")
	          .attr("cx",x(xm_a))
			  .attr("cy",y(-xm_b))
			  .attr("r",3)
			  .attr("fill",colorImJ);
			  
	fig2_right.append("text")
	          .attr("id","fig2-xm-text")
              .attr("x",x(xm_a)+5)
              .attr("y",y(-xm_b)-10)
  	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill",colorImJ)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "12px")
              .text("x")
		      .append("tspan")
              .attr("font-size", "10px")
              .attr("dx", "1px")
              .attr("dy", "2px")
              .text("m");

	fig2_right.append("circle")
	          .attr("id","fig2-ym")
	          .attr("cx",x(ym_a))
			  .attr("cy",y(-ym_b))
			  .attr("r",3)
			  .attr("fill",colorImI);

	fig2_right.append("text")
	          .attr("id","fig2-ym-text")
              .attr("x",x(ym_a)-5)
              .attr("y",y(-ym_b)+15)
  	          .attr("text-anchor", "end")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill",colorImI)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "12px")
              .text("y")
		      .append("tspan")
              .attr("font-size", "10px")
              .attr("dx", "1px")
              .attr("dy", "2px")
              .text("m");
			  
	fig2_right.append("line")
	          .attr("id","fig2-lineI1")
              .attr("x1", x(x_a))
	          .attr("y1", y(-x_b))
	          .attr("x2", (x(x_a)+x(xm_a))/2)
	          .attr("y2", (y(-x_b)+y(-xm_b))/2)
              .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke",colorImI);
			  
	fig2_right.append("line")
	          .attr("id","fig2-lineI2")
              .attr("x1", x(xm_a))
	          .attr("y1", y(-xm_b))
	          .attr("x2", (x(x_a)+x(xm_a))/2)
	          .attr("y2", (y(-x_b)+y(-xm_b))/2)
              .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke",colorImJ);

	fig2_right.append("line")
	          .attr("id","fig2-lineJ1")
              .attr("x1", x(y_a))
	          .attr("y1", y(-y_b))
	          .attr("x2", (x(y_a)+x(ym_a))/2)
	          .attr("y2", (y(-y_b)+y(-ym_b))/2)
              .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke",colorImJ);
			  
	fig2_right.append("line")
	          .attr("id","fig2-lineJ2")
              .attr("x1", x(ym_a))
	          .attr("y1", y(-ym_b))
	          .attr("x2", (x(y_a)+x(ym_a))/2)
	          .attr("y2", (y(-y_b)+y(-ym_b))/2)
              .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke",colorImI);
  }
  
  function fig2_xy() {
    var canvas = document.getElementById("image-canvas-x");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(generate_image(x_a,x_b)),0,0,80,80);
	
    var canvas = document.getElementById("image-canvas-y");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(generate_image(y_a,y_b)),0,0,80,80);
  }
  
  function fig2_xym(theta) {
    //var canvas = document.getElementById("image-canvas-wtheta");
    //var ctx = canvas.getContext("2d");
    //ctx.imageSmoothingEnabled = false;
    //ctx.drawImage(img_to_canvas1(generate_image(Math.cos(Math.PI/2 * theta),Math.sin(Math.PI/2 * theta))),0,0,80,80);
	
    //var canvas = document.getElementById("image-canvas-minus-wtheta");
    //var ctx = canvas.getContext("2d");
    //ctx.imageSmoothingEnabled = false;
    //ctx.drawImage(img_to_canvas1(generate_image(- Math.cos(Math.PI/2 * theta),- Math.sin(Math.PI/2 * theta))),0,0,80,80);
	
    var canvas = document.getElementById("image-canvas-xm");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(generate_image(xm_a,xm_b)),0,0,80,80);
	
    var canvas = document.getElementById("image-canvas-ym");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(generate_image(ym_a,ym_b)),0,0,80,80);
  }
  
  function fig2_update(theta) {	
    xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * theta) * Math.cos(Math.PI/2 * theta));
    xm_b = - 2 * x_a * Math.cos(Math.PI/2 * theta) * Math.sin(Math.PI/2 * theta);
    ym_a = y_a * (1 - 2 * Math.cos(Math.PI/2 * theta) * Math.cos(Math.PI/2 * theta));
    ym_b = - 2 * y_a * Math.cos(Math.PI/2 * theta) * Math.sin(Math.PI/2 * theta);

	fig2_xym(theta);
	
	d3.select("#fig2-value-theta").text(parseFloat(theta).toFixed(2));
	d3.select("#fig2-group-theta1").attr("transform","rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
	d3.select("#fig2-group-theta2").attr("transform","rotate("+ (90 * -theta) +","+x(0)+","+y(0)+")");
	//d3.select("#fig2-value-dx").text(parseFloat(math.abs(2*math.dot(imxm,e_theta)/(h*h))).toFixed(2));
	//d3.select("#fig2-value-dy").text(parseFloat(math.abs(2*math.dot(imym,e_theta)/(h*h))).toFixed(2));
	
	d3.select("#fig2-xm").attr("cx",x(xm_a)).attr("cy",y(-xm_b));
	d3.select("#fig2-xm-text").attr("x",x(xm_a)+5).attr("y",y(-xm_b)-10);
	d3.select("#fig2-lineI1").attr("x2", (x(x_a)+x(xm_a))/2).attr("y2", (y(-x_b)+y(-xm_b))/2);
	d3.select("#fig2-lineI2").attr("x1", x(xm_a)).attr("y1", y(-xm_b)).attr("x2", (x(x_a)+x(xm_a))/2).attr("y2", (y(-x_b)+y(-xm_b))/2);
	d3.select("#fig2-ym").attr("cx",x(ym_a)).attr("cy",y(-ym_b));
	d3.select("#fig2-ym-text").attr("x",x(ym_a)-5).attr("y",y(-ym_b)+15);
	d3.select("#fig2-lineJ1").attr("x2", (x(y_a)+x(ym_a))/2).attr("y2", (y(-y_b)+y(-ym_b))/2);
	d3.select("#fig2-lineJ2").attr("x1", x(ym_a)).attr("y1", y(-ym_b)).attr("x2", (x(y_a)+x(ym_a))/2).attr("y2", (y(-y_b)+y(-ym_b))/2);
  }
  
  d3.select("#controler-input2").property("value", init_theta);
  d3.select("#fig2-value-theta").text(parseFloat(init_theta).toFixed(2));
  
  fig2_right_init(init_theta);
  fig2_xy();
  fig2_xym(init_theta);

  d3.select("#controler-input2")
	.on("input", function() {fig2_update(this.value);});
}

function fig2bis(h) {
  var width = 420;
  var height = 280;
  var x = d3.scale.linear().domain([-150, 150]).range([0, width]);
  var y = d3.scale.linear().domain([100, -100]).range([0, height]);
  var init_theta = 0.;
  var colorBackground = "rgb(80%,80%,80%)";
  var colorI = "rgb(25%,25%,25%)";
  var colorJ = "rgb(99%,99%,99%)";
  
  var e1 = generate_e_theta(h,0), e2 = generate_e_theta(h,1), e_theta = generate_e_theta(h,init_theta);
  var imx = generate_image(h, -1, -0.1), imy = generate_image(h, 0.1, 1);
  var imxm = math.add(imx, math.multiply(-2*math.dot(imx,e_theta)/(h*h), e_theta)), imym = math.add(imy, math.multiply(-2*math.dot(imy,e_theta)/(h*h), e_theta));
  var imx1 = x(math.dot(imx,e1)/h*100/h), imx2 = y(math.dot(imx,e2)/h*100/h), imy1 = x(math.dot(imy,e1)/h*100/h), imy2 = y(math.dot(imy,e2)/h*100/h);
  var imxm1 = x(math.dot(imxm,e1)/h*100/h), imxm2 = y(math.dot(imxm,e2)/h*100/h), imym1 = x(math.dot(imym,e1)/h*100/h), imym2 = y(math.dot(imym,e2)/h*100/h);
  
  function translate_x(theta) {return Math.min((y(100)-y(0)) * Math.tan(0.00001 + Math.PI/2 * -theta), x(133-5)-x(0));}
  function translate_y(theta) {return Math.min((y(100)-y(0)) - (x(133-5)-x(0)) * Math.tan(0.00001 + Math.PI/2 - Math.PI/2 * -theta), 0);}

  function fig2_right_init(theta){
    d3.select("#fig2-left-controler-input").property("value", init_theta);
    d3.select("#fig2-value-theta").text(parseFloat(init_theta).toFixed(2));
	d3.select("#fig2-value-dx").text(parseFloat(math.abs(2*math.dot(imxm,e_theta)/(h*h))).toFixed(2));
	d3.select("#fig2-value-dy").text(parseFloat(math.abs(2*math.dot(imym,e_theta)/(h*h))).toFixed(2));
    if (!d3.select("#fig2-right").select("svg").empty()) {
      d3.select("#fig2-right").select("svg").remove();
    }
	  
    var fig2_right = d3.select("#fig2-right")
                       .append("svg")
		  	           .attr("width", width)
			           .attr("height", height);
					   
    fig2_right.append("rect")
	          .attr("fill",colorBackground)
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", width)
              .attr("height", height);
					 
    // H1 and H2
    var line_H1H2 = fig2_right.append("g")
		                      .attr("stroke-width", 1)
	                          .attr("stroke", "rgb(0%,0%,0%)")
	                          .attr("stroke-opacity",0.5);
	
    line_H1H2.append("line")
             .attr("x1", x(-150))
	         .attr("y1", y(0))
	         .attr("x2", x(150))
	         .attr("y2", y(0));
			 
	line_H1H2.append("line")
             .attr("x1", x(0))
	         .attr("y1", y(-100))
	         .attr("x2", x(0))
	         .attr("y2", y(100))
			 
	var text_H1H2 = fig2_right.append("g")
	                          .attr("text-anchor", "start")
	                          .attr("font-family","Georgia, serif")
	                          .attr("fill", "rgb(0%,0%,0%)")
 	                          .attr("font-style", "italic")
 	                          .attr("font-weight", "bold")
	                          .attr("font-size", "15px");
							  
    text_H1H2.append("text")
             .attr("x",x(5))
		     .attr("y",y(-95))
		     .attr("font-weight", "normal")
		     .attr("opacity",0.5)
		     .text("H")
		     .append("tspan")
             .attr("font-size", "10px")
             .attr("dx", "2px")
             .attr("dy", "4px")
             .text("1");
		 
    text_H1H2.append("text")
             .attr("x",x(133))
		     .attr("y",y(5))
		     .attr("font-weight", "normal")
		     .attr("opacity",0.5)
		     .text("H")
		     .append("tspan")
             .attr("font-size", "10px")
             .attr("dx", "2px")
             .attr("dy", "4px")
             .text("2");

    // classes I and J
    var line_IJ = fig2_right.append("g")
		                    .attr("stroke-width", 4)
	                        .attr("stroke-opacity",0.75);

    line_IJ.append("line")
           .attr("x1", x(-10))
	       .attr("y1", y(0))
	       .attr("x2", x(-100))
	       .attr("y2", y(0))
	       .attr("stroke", colorI);							

    line_IJ.append("line")
           .attr("x1", x(10))
	       .attr("y1", y(0))
	       .attr("x2", x(100))
	       .attr("y2", y(0))
	       .attr("stroke", colorJ);
	
    // ticks
    var ticks = fig2_right.append("g")
	                      .attr("stroke-width", 1)
	                      .attr("stroke", "rgb(0%,0%,0%)");
				  
    ticks.append("line")
         .attr("x1", x(-100))
	     .attr("y1", y(-2))
	     .attr("x2", x(-100))
	     .attr("y2", y(2));
	   
    ticks.append("line")
         .attr("x1", x(-10))
	     .attr("y1", y(-2))
	     .attr("x2", x(-10))
	     .attr("y2", y(2));

    ticks.append("line")
         .attr("x1", x(10))
	     .attr("y1", y(-2))
	     .attr("x2", x(10))
	     .attr("y2", y(2));
	  
    ticks.append("line")
         .attr("x1", x(100))
	     .attr("y1", y(-2))
	     .attr("x2", x(100))
	     .attr("y2", y(2));

    var labels = fig2_right.append("g")
	                       .attr("text-anchor", "middle")
	                       .attr("font-family","sans-serif")
				           .attr("font-style", "italic")
				           .attr("font-size", "10px");
  
    labels.append("text")
          .attr("x", x(-100))
	      .attr("y", y(-10))
	      .text("-h");
		
    labels.append("text")
          .attr("x", x(-12))
	      .attr("y", y(-10))
	      .text("-0.1h");
		
    labels.append("text")
          .attr("x", x(12))
	      .attr("y", y(-10))
	      .text("0.1h");
		
    labels.append("text")
          .attr("x", x(100))
	      .attr("y", y(-10))
	      .text("h");

	// H_theta
    fig2_right.append("line")
	          .attr("id","fig2-line-theta")
              .attr("transform", "rotate("+ 90 * (-theta) +","+x(0)+","+y(0)+")")
              .attr("x1", x(0))
	          .attr("y1", y(-200))
	          .attr("x2", x(0))
	          .attr("y2", y(200))
              .attr("stroke-width", 1.5)
	          .attr("stroke", "rgb(100%,0%,0%)")
              .attr("stroke-opacity",0.5);

	// Label H_theta
    fig2_right.append("text")
	          .attr("id","fig2-text-theta")
              .attr("transform", "translate("+translate_x(theta)+","+translate_y(theta)+")")
              .attr("x",x(5))
              .attr("y",y(-95))
  	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill", "rgb(100%,0%,0%)")
	          .attr("font-style", "italic")
              .attr("font-weight", "normal")
	          .attr("font-size", "15px")
	          .attr("opacity", 0.5)
              .text("H")
	          .append("tspan")
              .attr("font-size", "10px")
              .attr("dx", "2px")
              .attr("dy", "4px")
	          .text("\u03B8");
	   
	// imx imxm imy imym
	fig2_right.append("circle")
	          .attr("cx",imx1)
			  .attr("cy",imx2)
			  .attr("r",3)
			  .attr("fill",colorI);
			  
	fig2_right.append("text")
              .attr("x",imx1+5)
              .attr("y",imx2+15)
  	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill",colorI)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "10px")
              .text("x");
			  
	fig2_right.append("circle")
	          .attr("cx",imy1)
			  .attr("cy",imy2)
			  .attr("r",3)
			  .attr("fill",colorJ);
			  
	fig2_right.append("text")
              .attr("x",imy1-5)
              .attr("y",imy2-10)
  	          .attr("text-anchor", "end")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill",colorJ)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "10px")
              .text("y");

	fig2_right.append("circle")
	          .attr("id","fig2-imxm")
	          .attr("cx",imxm1)
			  .attr("cy",imxm2)
			  .attr("r",3)
			  .attr("fill",colorJ);
			  
	fig2_right.append("text")
	          .attr("id","fig2-imxm-text")
              .attr("x",imxm1+5)
              .attr("y",imxm2-10)
  	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill",colorJ)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "10px")
              .text("x")
		      .append("tspan")
              .attr("font-size", "9px")
              .attr("dx", "1px")
              .attr("dy", "2px")
              .text("m");

	fig2_right.append("circle")
	          .attr("id","fig2-imym")
	          .attr("cx",imym1)
			  .attr("cy",imym2)
			  .attr("r",3)
			  .attr("fill",colorI);

	fig2_right.append("text")
	          .attr("id","fig2-imym-text")
              .attr("x",imym1-5)
              .attr("y",imym2+15)
  	          .attr("text-anchor", "end")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill",colorI)
	          .attr("font-style", "italic")
              .attr("font-weight", "bold")
	          .attr("font-size", "10px")
              .text("y")
		      .append("tspan")
              .attr("font-size", "9px")
              .attr("dx", "1px")
              .attr("dy", "2px")
              .text("m");
			  
	fig2_right.append("line")
	          .attr("id","fig2-lineI1")
              .attr("x1", imx1)
	          .attr("y1", imx2)
	          .attr("x2", (imx1+imxm1)/2)
	          .attr("y2", (imx2+imxm2)/2)
              .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke",colorI);
			  
	fig2_right.append("line")
	          .attr("id","fig2-lineI2")
              .attr("x1", imxm1)
	          .attr("y1", imxm2)
	          .attr("x2", (imx1+imxm1)/2)
	          .attr("y2", (imx2+imxm2)/2)
              .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke",colorJ);

	fig2_right.append("line")
	          .attr("id","fig2-lineJ1")
              .attr("x1", imy1)
	          .attr("y1", imy2)
	          .attr("x2", (imy1+imym1)/2)
	          .attr("y2", (imy2+imym2)/2)
              .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke",colorJ);
			  
	fig2_right.append("line")
	          .attr("id","fig2-lineJ2")
              .attr("x1", imym1)
	          .attr("y1", imym2)
	          .attr("x2", (imy1+imym1)/2)
	          .attr("y2", (imy2+imym2)/2)
              .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke",colorI);
  }
  
  function fig2_imxy(imx,imy) {
    var canvas = document.getElementById("fig2-left-canvas-x");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(imx),0,0,90,45);
	
    var canvas = document.getElementById("fig2-left-canvas-y");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(imy),0,0,90,45);
  }
  
  function fig2_imxym(e_theta,imxm,imym) {
    var canvas = document.getElementById("fig2-left-canvas-etheta");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(e_theta),0,0,90,45);
	
    var canvas = document.getElementById("fig2-left-canvas-minus-etheta");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(math.multiply(-1, e_theta)),0,0,90,45);
	
    var canvas = document.getElementById("fig2-left-canvas-xm");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(imxm),0,0,90,45);
	
    var canvas = document.getElementById("fig2-left-canvas-ym");
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img_to_canvas1(imym),0,0,90,45);
  }
  
  function fig2_update(theta) {	
    var e_theta = generate_e_theta(h,theta);
    var imxm = math.add(imx, math.multiply(-2*math.dot(imx,e_theta)/(h*h), e_theta)), imym = math.add(imy, math.multiply(-2*math.dot(imy,e_theta)/(h*h), e_theta));
    var imxm1 = x(math.dot(imxm,e1)/h*100/h), imxm2 = y(math.dot(imxm,e2)/h*100/h), imym1 = x(math.dot(imym,e1)/h*100/h), imym2 = y(math.dot(imym,e2)/h*100/h);

	fig2_imxym(e_theta,imxm,imym);
	
	d3.select("#fig2-value-theta").text(parseFloat(theta).toFixed(2));
	d3.select("#fig2-value-dx").text(parseFloat(math.abs(2*math.dot(imxm,e_theta)/(h*h))).toFixed(2));
	d3.select("#fig2-value-dy").text(parseFloat(math.abs(2*math.dot(imym,e_theta)/(h*h))).toFixed(2));
	d3.select("#fig2-line-theta").attr("transform","rotate("+ 90 * (-theta) +","+x(0)+","+y(0)+")");
	d3.select("#fig2-text-theta").attr("transform","translate("+translate_x(theta)+","+translate_y(theta)+")");
	d3.select("#fig2-imxm").attr("cx",imxm1).attr("cy",imxm2);
	d3.select("#fig2-imxm-text").attr("x",imxm1+5).attr("y",imxm2-10);
	d3.select("#fig2-lineI1").attr("x2",(imx1+imxm1)/2).attr("y2",(imx2+imxm2)/2);
	d3.select("#fig2-lineI2").attr("x2",(imx1+imxm1)/2).attr("y2",(imx2+imxm2)/2).attr("x1",imxm1).attr("y1",imxm2);
	d3.select("#fig2-imym").attr("cx",imym1).attr("cy",imym2);
	d3.select("#fig2-imym-text").attr("x",imym1-5).attr("y",imym2+15);
	d3.select("#fig2-lineJ1").attr("x2",(imy1+imym1)/2).attr("y2",(imy2+imym2)/2);
	d3.select("#fig2-lineJ2").attr("x2",(imy1+imym1)/2).attr("y2",(imy2+imym2)/2).attr("x1",imym1).attr("y1",imym2);
  }
  
  fig2_right_init(init_theta);
  fig2_imxy(imx,imy);
  fig2_imxym(e_theta,imxm,imym);

  d3.select("#fig2-left-controler-input")
	.on("input", function() {fig2_update(this.value);});

}

function loss_functions() {
  var width = 180;
  var height = 120;
  var x = d3.scale.linear().domain([-3, 3]).range([0, width]);
  var y = d3.scale.linear().domain([3, -1]).range([0, height]);
  
  var indicator_01 = d3.select("#indicator-01")
                       .append("svg")
	                   .attr("width", width)
		               .attr("height", height);
  
  indicator_01.append("line")
              .attr("x1", x(-4))
	          .attr("y1", y(0))
	          .attr("x2", x(4))
	          .attr("y2", y(0))
              .attr("stroke-width", 0.3)
	          .attr("stroke", "rgb(0%,0%,0%)")
              .attr("stroke-opacity",0.8);

  indicator_01.append("line")
              .attr("x1", x(0))
	          .attr("y1", y(-1))
	          .attr("x2", x(0))
	          .attr("y2", y(4))
              .attr("stroke-width", 0.3)
	          .attr("stroke", "rgb(0%,0%,0%)")
              .attr("stroke-opacity",0.8);
			 
  indicator_01.append("path")
		      .attr("d", "M " + x(-4) + " " + y(1) + " L " + x(0) + " " + y(1) + "M " + x(0) + " " + y(0) + " L " + x(4) + " " + y(0))
              .style("stroke", "rgb(36.84%,50.68%,70.98%)")
              .style("stroke-width", 2)
              .style("fill", "none");
			  
  indicator_01.append("line")
	          .attr("stroke-width", 1)
	          .attr("stroke", "rgb(50%,50%,50%)")
              .attr("x1", x(1))
	          .attr("y1", y(-0.05))
	          .attr("x2", x(1))
	          .attr("y2", y(0.05));
				
  indicator_01.append("text")
              .attr("x",x(1))
              .attr("y",y(-0.5))
  	          .attr("text-anchor", "middle")
	          .attr("font-family", "Georgia, serif")
	          .attr("fill", "rgb(50%,50%,50%)")
	          .attr("font-size", "10px")
              .text("1");
			  
  var hinge_loss = d3.select("#hinge-loss")
                     .append("svg")
	                 .attr("width", width)
		             .attr("height", height);
  
  hinge_loss.append("line")
            .attr("x1", x(-4))
	        .attr("y1", y(0))
	        .attr("x2", x(4))
	        .attr("y2", y(0))
            .attr("stroke-width", 0.3)
	        .attr("stroke", "rgb(0%,0%,0%)")
            .attr("stroke-opacity",0.8);

  hinge_loss.append("line")
            .attr("x1", x(0))
	        .attr("y1", y(-1))
	        .attr("x2", x(0))
	        .attr("y2", y(4))
            .attr("stroke-width", 0.3)
	        .attr("stroke", "rgb(0%,0%,0%)")
            .attr("stroke-opacity",0.8);
			 
  hinge_loss.append("path")
			.attr("d", "M " + x(-4) + " " + y(1+4) + " L " + x(1) + " " + y(0) + " L " + x(4) + " " + y(0))
            .style("stroke", "rgb(36.84%,50.68%,70.98%)")
            .style("stroke-width", 2)
            .style("fill", "none");
			  
  hinge_loss.append("line")
	        .attr("stroke-width", 1)
	        .attr("stroke", "rgb(50%,50%,50%)")
            .attr("x1", x(1))
	        .attr("y1", y(-0.05))
	        .attr("x2", x(1))
	        .attr("y2", y(0.05));
				
  hinge_loss.append("text")
            .attr("x",x(1))
            .attr("y",y(-0.5))
  	        .attr("text-anchor", "middle")
	        .attr("font-family", "Georgia, serif")
	        .attr("fill", "rgb(50%,50%,50%)")
	        .attr("font-size", "10px")
            .text("1");
			
  var line = d3.svg.line()
                   .x(function(d,i) {return x(-3.5 + i * 0.025);})
                   .y(function(d) {return y(d);});
  var softplusA = [];
  for (var i = -3.5; i < 3.5; i+= 0.025)
	softplusA.push(Math.log(1 + Math.exp(-i)));
			
  var softplus_loss = d3.select("#softplus-loss")
                        .append("svg")
	                    .attr("width", width)
		                .attr("height", height);
  
  softplus_loss.append("line")
               .attr("x1", x(-4))
	           .attr("y1", y(0))
	           .attr("x2", x(4))
	           .attr("y2", y(0))
               .attr("stroke-width", 0.3)
	           .attr("stroke", "rgb(0%,0%,0%)")
               .attr("stroke-opacity",0.8);

  softplus_loss.append("line")
               .attr("x1", x(0))
	           .attr("y1", y(-1))
	           .attr("x2", x(0))
	           .attr("y2", y(4))
               .attr("stroke-width", 0.3)
	           .attr("stroke", "rgb(0%,0%,0%)")
               .attr("stroke-opacity",0.8);
			  
  softplus_loss.append("path")
               .attr("d", line(softplusA))
               .style("stroke", "rgb(36.84%,50.68%,70.98%)")
               .style("stroke-width", 2)
               .style("fill", "none");
			   
  softplus_loss.append("line")
	           .attr("stroke-width", 1)
	           .attr("stroke", "rgb(50%,50%,50%)")
               .attr("x1", x(1))
	           .attr("y1", y(-0.05))
	           .attr("x2", x(1))
	           .attr("y2", y(0.05));
				
  softplus_loss.append("text")
               .attr("x",x(1))
               .attr("y",y(-0.5))
  	           .attr("text-anchor", "middle")
	           .attr("font-family", "Georgia, serif")
	           .attr("fill", "rgb(50%,50%,50%)")
	           .attr("font-size", "10px")
               .text("1");
}

function fig3() {
  var width = 240;
  var height = 160;
  var x = d3.scale.linear().domain([-3, 3]).range([0, width]);
  var y = d3.scale.linear().domain([3, -1]).range([0, height]);
  var init_w = 0.5;
  
  var dataA = [0., 0., 0.001, 0.001, 0.015, 0.02, 0.037, 0.089, 0.146, 0.186, 0.283, 0.419, 0.505, 0.679, 0.743, 0.706, 0.535, 0.331, 0.212, 0.054, 0.023, 0.005, 0.006, 0.003, 0., 0., 0., 0.001, 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
  var dataB = [0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.001, 0.003, 0.01, 0.019, 0.05, 0.437, 1.149, 1.504, 1.048, 0.508, 0.181, 0.06, 0.023, 0.005, 0.002, 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
  var line = d3.svg.line()
                   .x(function(d,i) {return x(-3.5 + i * 0.025);})
                   .y(function(d) {return y(d);});
  var softplusA = [];
  var softplusB = [];
  for (var i = -3.5; i < 3.5; i+= 0.025) {
	softplusA.push(Math.log(1 + Math.exp(i)));
	softplusB.push(Math.log(1 + Math.exp(-i)));
  }	

  function fig3_init() {
    d3.select("#fig3-controler-input").property("value", init_w);
    d3.select("#fig3-value-w").text(parseFloat(init_w).toFixed(2));	  
	  
    // Subfigure 1
    var fig3_subfig1 = d3.select("#fig3-subfig1")
                         .append("svg")
	                     .attr("width", width)
		                 .attr("height", height);
			  
    fig3_subfig1.append("line")
                .attr("x1", x(-4))
	            .attr("y1", y(0))
	            .attr("x2", x(4))
	            .attr("y2", y(0))
                .attr("stroke-width", 0.3)
	            .attr("stroke", "rgb(0%,0%,0%)")
                .attr("stroke-opacity",0.8);

    fig3_subfig1.append("line")
                .attr("x1", x(0))
	            .attr("y1", y(-1))
	            .attr("x2", x(0))
	            .attr("y2", y(4))
                .attr("stroke-width", 0.3)
	            .attr("stroke", "rgb(0%,0%,0%)")
                .attr("stroke-opacity",0.8);
				
    fig3_subfig1.selectAll("rect0")
                .data(dataA)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {return x(i * 0.2 - 4);})
                .attr("y", function(d) {return y(0) - d * height / 3.6;})
                .attr("width", 8)
                .attr("height", function(d) {return d * height / 3.6;})
                .style("stroke-width", 0.3)
                .style("stroke", "rgb(20%, 20%, 20%)")
                .style("fill-opacity", 0.2)
                .style("fill", "rgb(88.07%, 61.10%, 14.21%)");
			  
    fig3_subfig1.selectAll("rect1")
                .data(dataB)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {return x(i * 0.2 - 4);})
                .attr("y", function(d) {return y(0) - d * height / 3.6;})
                .attr("width", 8)
                .attr("height", function(d) {return d * height / 3.6;})
			    .style("stroke-width", 0.3)
                .style("stroke", "rgb(20%, 20%, 20%)")
			    .style("fill-opacity", 0.2)
			    .style("fill", "rgb(36.84%,50.68%,70.98%)");
				
	fig3_subfig1.append("path")
				.attr("d", "M " + x(-4) + " " + y(1) + " L " + x(0) + " " + y(1) + "M " + x(0) + " " + y(0) + " L " + x(4) + " " + y(0))
                .style("stroke", "rgb(36.84%,50.68%,70.98%)")
                .style("stroke-width", 2)
                .style("fill", "none");
				
	fig3_subfig1.append("path")
				.attr("d", "M " + x(-4) + " " + y(0) + " L " + x(0) + " " + y(0) + "M " + x(0) + " " + y(1) + " L " + x(4) + " " + y(1))
                .style("stroke", "rgb(88.07%, 61.10%, 14.21%)")
                .style("stroke-width", 2)
                .style("fill", "none");
	
    var tick1 = fig3_subfig1.append("g")
	                        .attr("id", "fig3-group1")
	                        .attr("transform", "translate(" + (x(1)-x(0)) + ",0)");
	
	tick1.append("line")
	     .attr("stroke-width", 1)
	     .attr("stroke", "rgb(50%,50%,50%)")
         .attr("x1", x(0))
	     .attr("y1", y(-0.05))
	     .attr("x2", x(0))
	     .attr("y2", y(0.05));
				
	tick1.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.3))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
	     .attr("font-size", "10px")
         .text("1");
			  
	tick1.append("line")
	     .attr("stroke-width", 1)
	     .attr("stroke", "rgb(50%,50%,50%)")
         .attr("x1", x(-0.3))
	     .attr("y1", y(-0.4))
	     .attr("x2", x(0.3))
	     .attr("y2", y(-0.4));
			  
	tick1.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.7))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
	     .attr("font-size", "10px")
         .text("|| \u00A0\u00A0 ||");
			  
	tick1.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.7))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
		 .attr("font-weight", "bold")
	     .attr("font-size", "10px")
         .text("w");

    // Subfigure 2
    var fig3_subfig2 = d3.select("#fig3-subfig2")
                         .append("svg")
	                     .attr("width", width)
	                     .attr("height", height);
			  
    fig3_subfig2.append("line")
                .attr("x1", x(-4))
	            .attr("y1", y(0))
	            .attr("x2", x(4))
	            .attr("y2", y(0))
                .attr("stroke-width", 0.3)
	            .attr("stroke", "rgb(0%,0%,0%)")
                .attr("stroke-opacity",0.8);

    fig3_subfig2.append("line")
                .attr("x1", x(0))
	            .attr("y1", y(-1))
	            .attr("x2", x(0))
	            .attr("y2", y(4))
                .attr("stroke-width", 0.3)
	            .attr("stroke", "rgb(0%,0%,0%)")
                .attr("stroke-opacity",0.8);
				
    fig3_subfig2.selectAll("rect0")
                .data(dataA)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {return x(i * 0.2 - 4);})
                .attr("y", function(d) {return y(0) - d * height / 3.6;})
                .attr("width", 8)
                .attr("height", function(d) {return d * height / 3.6;})
                .style("stroke-width", 0.3)
                .style("stroke", "rgb(20%, 20%, 20%)")
                .style("fill-opacity", 0.2)
                .style("fill", "rgb(88.07%, 61.10%, 14.21%)");
			  
    fig3_subfig2.selectAll("rect1")
                .data(dataB)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {return x(i * 0.2 - 4);})
                .attr("y", function(d) {return y(0) - d * height / 3.6;})
                .attr("width", 8)
                .attr("height", function(d) {return d * height / 3.6;})
			    .style("stroke-width", 0.3)
                .style("stroke", "rgb(20%, 20%, 20%)")
			    .style("fill-opacity", 0.2)
			    .style("fill", "rgb(36.84%,50.68%,70.98%)");
				
	fig3_subfig2.append("path")
	            .attr("id","fig3-hingeA")
				.attr("d", "M " + x(-4) + " " + y(1+4) + " L " + x(1) + " " + y(0) + " L " + x(4) + " " + y(0))
                .style("stroke", "rgb(36.84%,50.68%,70.98%)")
                .style("stroke-width", 2)
                .style("fill", "none");
				
	fig3_subfig2.append("path")
	            .attr("id","fig3-hingeB")
				.attr("d", "M " + x(-4) + " " + y(0) + " L " + x(-1) + " " + y(0) + " L " + x(4) + " " + y(1+4))
                .style("stroke", "rgb(88.07%, 61.10%, 14.21%)")
                .style("stroke-width", 2)
                .style("fill", "none");
				
    var tick2 = fig3_subfig2.append("g")
	                        .attr("id", "fig3-group2")
	                        .attr("transform", "translate(" + (x(1)-x(0)) + ",0)");
	
	tick2.append("line")
	     .attr("stroke-width", 1)
	     .attr("stroke", "rgb(50%,50%,50%)")
         .attr("x1", x(0))
	     .attr("y1", y(-0.05))
	     .attr("x2", x(0))
	     .attr("y2", y(0.05));
				
	tick2.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.3))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
	     .attr("font-size", "10px")
         .text("1");
			  
	tick2.append("line")
	     .attr("stroke-width", 1)
	     .attr("stroke", "rgb(50%,50%,50%)")
         .attr("x1", x(-0.3))
	     .attr("y1", y(-0.4))
	     .attr("x2", x(0.3))
	     .attr("y2", y(-0.4));
			  
	tick2.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.7))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
	     .attr("font-size", "10px")
         .text("|| \u00A0\u00A0 ||");
			  
	tick2.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.7))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
		 .attr("font-weight", "bold")
	     .attr("font-size", "10px")
         .text("w");
	
    // Subfigure 3
    var fig3_subfig3 = d3.select("#fig3-subfig3")
                         .append("svg")
	                     .attr("width", width)
                         .attr("height", height);
			  
    fig3_subfig3.append("line")
                .attr("x1", x(-4))
	            .attr("y1", y(0))
	            .attr("x2", x(4))
	            .attr("y2", y(0))
                .attr("stroke-width", 0.3)
	            .attr("stroke", "rgb(0%,0%,0%)")
                .attr("stroke-opacity",0.8);

    fig3_subfig3.append("line")
                .attr("x1", x(0))
	            .attr("y1", y(-1))
	            .attr("x2", x(0))
	            .attr("y2", y(4))
                .attr("stroke-width", 0.3)
	            .attr("stroke", "rgb(0%,0%,0%)")
                .attr("stroke-opacity",0.8);
				
    fig3_subfig3.selectAll("rect0")
                .data(dataA)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {return x(i * 0.2 - 4);})
                .attr("y", function(d) {return y(0) - d * height / 3.6;})
                .attr("width", 8)
                .attr("height", function(d) {return d * height / 3.6;})
                .style("stroke-width", 0.3)
                .style("stroke", "rgb(20%, 20%, 20%)")
                .style("fill-opacity", 0.2)
                .style("fill", "rgb(88.07%, 61.10%, 14.21%)");
			  
    fig3_subfig3.selectAll("rect1")
                .data(dataB)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {return x(i * 0.2 - 4);})
                .attr("y", function(d) {return y(0) - d * height / 3.6;})
                .attr("width", 8)
                .attr("height", function(d) {return d * height / 3.6;})
			    .style("stroke-width", 0.3)
                .style("stroke", "rgb(20%, 20%, 20%)")
			    .style("fill-opacity", 0.2)
			    .style("fill", "rgb(36.84%,50.68%,70.98%)");

    fig3_subfig3.append("path")
	            .attr("id","fig3-softplusB")
                .attr("d", line(softplusB))
                .style("stroke", "rgb(36.84%,50.68%,70.98%)")
                .style("stroke-width", 2)
                .style("fill", "none");				
    fig3_subfig3.append("path")
	            .attr("id","fig3-softplusA")
                .attr("d", line(softplusA))
                .style("stroke", "rgb(88.07%, 61.10%, 14.21%)")
                .style("stroke-width", 2)
                .style("fill", "none");
				
    var tick3 = fig3_subfig3.append("g")
	                        .attr("id", "fig3-group3")
	                        .attr("transform", "translate(" + (x(1)-x(0)) + ",0)");
	
	tick3.append("line")
	     .attr("stroke-width", 1)
	     .attr("stroke", "rgb(50%,50%,50%)")
         .attr("x1", x(0))
	     .attr("y1", y(-0.05))
	     .attr("x2", x(0))
	     .attr("y2", y(0.05));
				
	tick3.append("text")
         .attr("x", x(0))
         .attr("y", y(-0.3))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
	     .attr("font-size", "10px")
         .text("1");
			  
	tick3.append("line")
	     .attr("stroke-width", 1)
	     .attr("stroke", "rgb(50%,50%,50%)")
         .attr("x1", x(-0.3))
	     .attr("y1", y(-0.4))
	     .attr("x2", x(0.3))
	     .attr("y2", y(-0.4));
			  
	tick3.append("text")
         .attr("x", x(0))
         .attr("y",y(-0.7))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
	     .attr("font-size", "10px")
         .text("|| \u00A0\u00A0 ||");
			  
	tick3.append("text")
         .attr("x", x(0))
         .attr("y",y(-0.7))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Georgia, serif")
	     .attr("fill", "rgb(50%,50%,50%)")
		 .attr("font-weight", "bold")
	     .attr("font-size", "10px")
         .text("w");
  }
  
  function fig3_update(norm_w) {
    var softplusA = [];
    var softplusB = [];
    for (var i = -3.5; i < 3.5; i+= 0.025) {
	  softplusA.push(Math.log(1 + Math.exp(Math.pow(10,norm_w) * i)));
	  softplusB.push(Math.log(1 + Math.exp(- Math.pow(10,norm_w) * i)));
    }
	  
   d3.select("#fig3-value-w").text(parseFloat(norm_w).toFixed(2));   
   d3.select("#fig3-hingeA").attr("d", "M " + x(-4) + " " + y(1 + Math.pow(10,norm_w) * 4) + " L " + x(1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(4) + " " + y(0));
   d3.select("#fig3-hingeB").attr("d", "M " + x(-4) + " " + y(0) + " L " + x(-1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(4) + " " + y(1 + Math.pow(10,norm_w) * 4));
   d3.select("#fig3-softplusA").attr("d", line(softplusA));
   d3.select("#fig3-softplusB").attr("d", line(softplusB));
   d3.select("#fig3-group1").attr("transform", "translate(" + (x(1 / Math.pow(10,norm_w)) - x(0)) + ", 0)");
   d3.select("#fig3-group2").attr("transform", "translate(" + (x(1 / Math.pow(10,norm_w)) - x(0)) + ", 0)");
   d3.select("#fig3-group3").attr("transform", "translate(" + (x(1 / Math.pow(10,norm_w)) - x(0)) + ", 0)");
  }
		  
  fig3_init();
  fig3_update(init_w);

  d3.select("#fig3-controler-input")
    .on("input", function() {fig3_update(this.value);});
}

function fig4() {
  var width = 430;
  var height = 280;
  var x = d3.scale.linear().domain([-21,21]).range([0, width]);
  var y = d3.scale.linear().domain([14,-14]).range([0, height]);
  var left_digit = 2;
  var right_digit = 3;
  var init_reg_index = 0;
  var animationRunning = false;
  var requestId;

  function update_buttons(left_digit, right_digit) {
    for (i=0; i<=left_digit; i++) {
	  d3.select('#right-input-'+i).style('visibility', 'hidden');
      d3.select('#right-label-'+i).style('visibility', 'hidden');
    }
    for (i=left_digit+1; i<=9; i++) {
	  d3.select('#right-input-'+i).style('visibility', 'visible');
      d3.select('#right-label-'+i).style('visibility', 'visible');
    }
    for (i=0; i<=right_digit-1; i++) {
	  d3.select('#left-input-'+i).style('visibility', 'visible');
      d3.select('#left-label-'+i).style('visibility', 'visible');
    }
    for (i=right_digit; i<=9; i++) {
	  d3.select('#left-input-'+i).style('visibility', 'hidden');
      d3.select('#left-label-'+i).style('visibility', 'hidden');
    }
  }
  
  function draw_fig4(digit0, digit1) {	
    queue().defer(d3.text,"assets/data/data0_"+digit0+digit1+".csv","text/csv")
           .defer(d3.text,"assets/data/data1_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/extras_"+digit0+digit1+".csv","text/csv")
           .defer(d3.text,"assets/data/w_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/x_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/xm_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/y_"+digit0+digit1+".csv","text/csv")
		   .defer(d3.text,"assets/data/ym_"+digit0+digit1+".csv","text/csv")
           .await(draw_all);

    function draw_all(error, text_data0, text_data1, text_extras, text_w, text_x, text_xm, text_y, text_ym) { //
      var data0 = d3.csv.parseRows(text_data0).map(function(row) {return row.map(function(value) {return +value;});});
	  var data1 = d3.csv.parseRows(text_data1).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csv.parseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});	// m b w1 w2 x1 x2 y1 y2 xm1 xm2 ym1 ym2
	  var w = d3.csv.parseRows(text_w).map(function(row) {return row.map(function(value) {return +value;});});
	  var imx = d3.csv.parseRows(text_x).map(function(row) {return row.map(function(value) {return +value;});});
	  var imxm = d3.csv.parseRows(text_xm).map(function(row) {return row.map(function(value) {return +value;});});
	  var imy = d3.csv.parseRows(text_y).map(function(row) {return row.map(function(value) {return +value;});});
	  var imym = d3.csv.parseRows(text_ym).map(function(row) {return row.map(function(value) {return +value;});});

	  var max_dAdv = Math.round( Math.max.apply(null, extras[14]) * 10) / 10;
      var min_errTrain = Math.round( Math.min.apply(null, extras[15]) * 10) / 10;
	  var min_errTest = Math.round( Math.min.apply(null, extras[16]) * 10) / 10;
	  
      var fig4_right = d3.select("#fig4-right-content");
      if (!fig4_right.select("canvas").empty()) {
	    fig4_right.select("canvas").remove()
	  }
      var canvas = fig4_right.append("canvas")
                             .attr("width", width)
                             .attr("height", height);
      var context = canvas.node().getContext("2d");  
      var container = fig4_right.append("custom");
	  var reg_index = init_reg_index;
	  var input_time;

	  function init_canvas() {	
        container.selectAll("circle0")
                 .data(data0)
	             .enter()
	             .append("circle0")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[80-reg_index+1]);})
		         .attr("r", 0.6)
	             .attr("lineWidth", 0.6)
                 .attr("strokeStyle", "rgb(88.07%, 61.10%, 14.21%,25%)")
			     .attr("fillStyle", "rgb(88.07%, 61.10%, 14.21%,25%)");
  				 
	    container.selectAll("circle1")
                 .data(data1)
		         .enter()
		         .append("circle1")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[80-reg_index+1]);})
		         .attr("r", 0.6)
			     .attr("lineWidth", 0.6)
                 .attr("strokeStyle", "rgb(36.84%,50.68%,70.98%,25%)")
			     .attr("fillStyle", "rgb(36.84%,50.68%,70.98%,25%)");
	  }

      function draw_canvas() {
        var theta = -Math.acos(extras[2][80-reg_index]);
	  
        //Clear canvas
        context.beginPath();
	    context.fillStyle = "rgb(100%,100%,100%)";
	    context.strokeStyle = "rgb(80%,80%,80%)";
        context.rect(0,0,canvas.attr("width"),canvas.attr("height"));
	    context.fill();
	    context.stroke();
	    context.closePath();
	
	    //Class 0
        container.selectAll("circle0")
                 .each(function(d) {
                         var node = d3.select(this);
			             context.beginPath();
                         context.strokeStyle = node.attr("strokeStyle");
	                     context.lineWidth = node.attr("lineWidth");
	                     context.fillStyle = node.attr("fillStyle");
                         context.arc(node.attr("x"), node.attr("y"), node.attr("r"), 0, 2 * Math.PI);
					     context.fill();
                         context.stroke();
                         context.closePath();
                       });
			 
	    //Class 1
        container.selectAll("circle1")
                 .each(function(d) {
                         var node = d3.select(this);
			             context.beginPath();
	                     context.strokeStyle = node.attr("strokeStyle");
		                 context.lineWidth = node.attr("lineWidth");
	                     context.fillStyle = node.attr("fillStyle");
                         context.arc(node.attr("x"), node.attr("y"), node.attr("r"), 0, 2 * Math.PI);
                         context.fill();
					     context.stroke();
                         context.closePath();
                       });

	    context.translate(x(0),y(0));
	    context.rotate(theta);
	    context.translate(-x(0),-y(0));
		
	    //Margin
        context.beginPath();	  
	    context.fillStyle = "rgba(50%, 50%, 50%, 10%)";
	    context.fillRect(x(-extras[0][80-reg_index]-extras[1][80-reg_index]),-200,2*(x(extras[0][80-reg_index])-x(0)),width+200);
	    context.closePath();
		
		//H
	    context.beginPath();
        context.strokeStyle = "rgba(100%,0%,0%,30%)";
	    context.lineWidth = 2;
        context.moveTo(x(-extras[1][80-reg_index]),-200);
        context.lineTo(x(-extras[1][80-reg_index]),width+200);
        context.stroke();
	    context.closePath();
		
		//w
		context.beginPath();
        context.strokeStyle = "rgba(100%,0%,0%,100%)";
	    context.lineWidth = 1;
        context.moveTo(x(-extras[1][80-reg_index]),y(0));
        context.lineTo(x(-extras[1][80-reg_index])+x(3)-x(0),y(0));
        context.stroke();
	    context.closePath();
		
		context.beginPath();
        context.fillStyle = "rgba(100%,0%,0%,100%)";
        context.moveTo(x(-extras[1][80-reg_index])+x(3)-x(0),y(0));
        context.lineTo(x(-extras[1][80-reg_index])+x(3)-x(0)-4,y(0)+3);
		context.lineTo(x(-extras[1][80-reg_index])+x(3)-x(0)+4,y(0));
		context.lineTo(x(-extras[1][80-reg_index])+x(3)-x(0)-4,y(0)-3);
		context.closePath();
        context.fill();
		
		context.fillStyle = "rgba(100%,0%,0%,100%)";
		context.font = "italic bold 12px Georgia, serif";
        context.fillText("\u0175",x(-extras[1][80-reg_index])+x(3)-x(0)+10,y(0)+3); 
		
	    context.translate(x(0),y(0));
	    context.rotate(-theta);
	    context.translate(-x(0),-y(0));
		
	    // imx imxm imy imym
		context.lineWidth = 0.75;
	    context.strokeStyle = "rgb(78.07%,51.10%,4.21%)";
	    context.fillStyle = "rgb(78.07%,51.10%,4.21%)";
		
		context.beginPath();
        context.arc(x(extras[4][80-reg_index]), y(extras[5][80-reg_index]), 2, 0, 2 * Math.PI);
        context.fill();
		context.stroke();
        context.closePath();
		
		context.beginPath();
        context.arc(x(extras[10][80-reg_index]), y(extras[11][80-reg_index]), 2, 0, 2 * Math.PI);
        context.fill();
		context.stroke();
        context.closePath();
		
		context.font = "italic bold 10px Georgia, serif";
        context.fillText("x",x(extras[4][80-reg_index])-3, y(extras[5][80-reg_index])+12);
        context.fillText("y",x(extras[10][80-reg_index])-3, y(extras[11][80-reg_index])+12);
		context.font = "italic 9px Georgia, serif";
		context.fillText("m",x(extras[10][80-reg_index])+4, y(extras[11][80-reg_index])+15);
		
	    context.strokeStyle = "rgb(26.84%,40.68%,60.98%)";
	    context.fillStyle = "rgb(26.84%,40.68%,60.98%)";
		
		context.beginPath();
        context.arc(x(extras[6][80-reg_index]), y(extras[7][80-reg_index]), 2, 0, 2 * Math.PI);
        context.fill();
		context.stroke();
        context.closePath();

		context.beginPath();
        context.arc(x(extras[8][80-reg_index]), y(extras[9][80-reg_index]), 2, 0, 2 * Math.PI);
        context.fill();
		context.stroke();
        context.closePath();
		
		context.font = "italic bold 10px Georgia, serif";
		context.fillText("y",x(extras[8][80-reg_index])-3, y(extras[9][80-reg_index])-8);
		context.fillText("x",x(extras[6][80-reg_index])-3, y(extras[7][80-reg_index])-8);
        context.font = "italic 9px Georgia, serif";
		context.fillText("m",x(extras[6][80-reg_index])+4, y(extras[7][80-reg_index])-5);
		
        context.strokeStyle = "rgb(88.07%,61.10%,14.21%)";
		context.setLineDash([3, 1]);
	    context.lineWidth = 1;
		context.beginPath();
        context.moveTo(x(extras[4][80-reg_index]),y(extras[5][80-reg_index]));
        context.lineTo(x((extras[4][80-reg_index]+extras[6][80-reg_index])/2),y((extras[5][80-reg_index]+extras[7][80-reg_index])/2));
        context.moveTo(x(extras[10][80-reg_index]),y(extras[11][80-reg_index]));
        context.lineTo(x((extras[8][80-reg_index]+extras[10][80-reg_index])/2),y((extras[9][80-reg_index]+extras[11][80-reg_index])/2));
        context.stroke();
	    context.closePath();

        context.strokeStyle = "rgb(36.84%,50.68%,70.98%)";		
		context.beginPath();
        context.moveTo(x(extras[6][80-reg_index]),y(extras[7][80-reg_index]));
        context.lineTo(x((extras[4][80-reg_index]+extras[6][80-reg_index])/2),y((extras[5][80-reg_index]+extras[7][80-reg_index])/2));
        context.moveTo(x(extras[8][80-reg_index]),y(extras[9][80-reg_index]));
        context.lineTo(x((extras[8][80-reg_index]+extras[10][80-reg_index])/2),y((extras[9][80-reg_index]+extras[11][80-reg_index])/2));
        context.stroke();
	    context.closePath();
		
		context.setLineDash([]);
	  }	

      function draw_digits() {
        var thisCanvas = document.getElementById("fig4-left-canvas-imx");
        var thisContext = thisCanvas.getContext("2d");
        thisContext.imageSmoothingEnabled = false;
        thisContext.drawImage(img_to_canvas2(imx[80-reg_index]),0,0,90,90);
		
        var thisCanvas = document.getElementById("fig4-left-canvas-imy");
        var thisContext = thisCanvas.getContext("2d");
        thisContext.imageSmoothingEnabled = false;
        thisContext.drawImage(img_to_canvas2(imy[80-reg_index]),0,0,90,90);
		
        var thisCanvas = document.getElementById("fig4-left-canvas-w");
        var thisContext = thisCanvas.getContext("2d");
        thisContext.imageSmoothingEnabled = false;
        thisContext.drawImage(img_to_canvas2(w[80-reg_index]),0,0,90,90);
		
        var thisCanvas = document.getElementById("fig4-left-canvas-minus-w");
        var thisContext = thisCanvas.getContext("2d");
        thisContext.imageSmoothingEnabled = false;
        thisContext.drawImage(img_to_canvas2(math.multiply(-1, w[80-reg_index])),0,0,90,90);
		
        var thisCanvas = document.getElementById("fig4-left-canvas-imxm");
        var thisContext = thisCanvas.getContext("2d");
        thisContext.imageSmoothingEnabled = false;
        thisContext.drawImage(img_to_canvas2(imxm[80-reg_index]),0,0,90,90);
		
        var thisCanvas = document.getElementById("fig4-left-canvas-imym");
        var thisContext = thisCanvas.getContext("2d");
        thisContext.imageSmoothingEnabled = false;
        thisContext.drawImage(img_to_canvas2(imym[80-reg_index]),0,0,90,90);
	  }

	  function update() {
        container.selectAll("circle0")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});

	    container.selectAll("circle1")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});
				 
	    if (Math.round( extras[14][80-reg_index] * 10) / 10 == max_dAdv)
		  d3.select("#fig4-left-dAdv").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	    else
		  d3.select("#fig4-left-dAdv").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
	    if (Math.round( extras[15][80-reg_index] * 10) / 10 == min_errTrain)
		  d3.select("#fig4-left-errTrain").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	    else
		  d3.select("#fig4-left-errTrain").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
	    if (Math.round( extras[16][80-reg_index] * 10) / 10 == min_errTest)
		  d3.select("#fig4-left-errTest").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	    else
		  d3.select("#fig4-left-errTest").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
				 
		d3.select("#fig4-value-lambda").text(parseFloat(-1+reg_index*0.1).toFixed(1));
	    d3.select("#fig4-value-dx").text(parseFloat(extras[12][80-reg_index]).toFixed(1));
	    d3.select("#fig4-value-dy").text(parseFloat(extras[13][80-reg_index]).toFixed(1));
	    d3.select("#fig4-value-dAdv").text(parseFloat(extras[14][80-reg_index]).toFixed(1));
	    d3.select("#fig4-value-errTrain").text(parseFloat(extras[15][80-reg_index]).toFixed(1));
	    d3.select("#fig4-value-errTest").text(parseFloat(extras[16][80-reg_index]).toFixed(1));
	  }
	  
	  function animate() {
	    draw_canvas();
		draw_digits();
		
	    requestId = window.requestAnimationFrame(animate);
		
		if (Date.now() - input_time > 10000) {
          animationRunning = false;
          window.cancelAnimationFrame(requestId);
        }
	  }
	  
	  if (Math.round( extras[14][80-reg_index] * 10) / 10 == max_dAdv)
		d3.select("#fig4-left-dAdv").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	  else
		d3.select("#fig4-left-dAdv").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"})
	  if (Math.round( extras[15][80-reg_index] * 10) / 10 == min_errTrain)
		d3.select("#fig4-left-errTrain").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	  else
		d3.select("#fig4-left-errTrain").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
	  if (Math.round( extras[16][80-reg_index] * 10) / 10 == min_errTest)
		d3.select("#fig4-left-errTest").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	  else
		d3.select("#fig4-left-errTest").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
	  
	  d3.select("#fig4-value-lambda").text(parseFloat(-1+reg_index*0.1).toFixed(1));
	  d3.select("#fig4-value-dx").text(parseFloat(extras[12][80-reg_index]).toFixed(1));
	  d3.select("#fig4-value-dy").text(parseFloat(extras[13][80-reg_index]).toFixed(1));
	  d3.select("#fig4-value-dAdv").text(parseFloat(extras[14][80-reg_index]).toFixed(1));
	  d3.select("#fig4-value-errTrain").text(parseFloat(extras[15][80-reg_index]).toFixed(1));
	  d3.select("#fig4-value-errTest").text(parseFloat(extras[16][80-reg_index]).toFixed(1));
	  draw_digits();
	  init_canvas();
	  draw_canvas();
	
	  var input = d3.select("#fig4-left-controler-input");
	  input.property("value", init_reg_index);
	  input.on("input", function() {if (!animationRunning) {
			                          animationRunning = true;
			                          requestId = window.requestAnimationFrame(animate);
		                            }
									input_time = Date.now();
		                            reg_index = +this.value;
									update();});
    }
  }
  
  d3.select('#left-input-'+left_digit).property('checked', true);
  d3.select('#right-input-'+right_digit).property('checked', true);
  update_buttons(left_digit,right_digit);
  draw_fig4(left_digit, right_digit);
  
  d3.selectAll('input[name="left-digit"]').on('click', function() {if (animationRunning) {
                                                                     animationRunning = false;
                                                                     window.cancelAnimationFrame(requestId);
                                                                   }
	                                                               left_digit = +this.value;
                                                                   update_buttons(left_digit,right_digit);
																   draw_fig4(left_digit, right_digit);});
  d3.selectAll('input[name="right-digit"]').on('click', function() {if (animationRunning) {
                                                                     animationRunning = false;
                                                                     window.cancelAnimationFrame(requestId);
                                                                   }
	                                                                right_digit = +this.value;
                                                                    update_buttons(left_digit,right_digit);
																	draw_fig4(left_digit, right_digit);});
																	
  d3.select("#button-0vs1").on('click', function() {if (animationRunning) {
                                                      animationRunning = false;
                                                      window.cancelAnimationFrame(requestId);
                                                    }
													left_digit = 0;
	                                                right_digit = 1;
                                                    d3.select('#left-input-'+left_digit).property('checked', true);
                                                    d3.select('#right-input-'+right_digit).property('checked', true); 
                                                    update_buttons(left_digit,right_digit);
													draw_fig4(left_digit, right_digit);});
											
  d3.select("#button-7vs9").on('click', function() {if (animationRunning) {
                                                      animationRunning = false;
                                                      window.cancelAnimationFrame(requestId);
                                                    }
													left_digit = 7;
	                                                right_digit = 9;
                                                    d3.select('#left-input-'+left_digit).property('checked', true);
                                                    d3.select('#right-input-'+right_digit).property('checked', true); 
                                                    update_buttons(left_digit,right_digit);
													draw_fig4(left_digit, right_digit);});
}


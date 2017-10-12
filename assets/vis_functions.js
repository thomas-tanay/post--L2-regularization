function abstract_fig(){
  var width = 816;
  var height = 233;
  var x = d3.scaleLinear().domain([-19.5,19.5]).range([0, height*3/2]);
  var y = d3.scaleLinear().domain([13,-13]).range([0, height]);
  var left_digit = 2;
  var right_digit = 3;
  var left_color = d3.interpolateBlues(0.3); //rgb(181, 212, 233)
  var right_color = d3.interpolateBlues(0.7); //rgb(47, 126, 188)
  var orange = "rgb(255,102,0)";
  var light_left_color = "rgb(218, 233, 244)"; //"rgb(85%,85%,85%)";// "rgb(229, 240, 247)";
  var light_right_color = "rgb(150, 190, 221)"; //"rgb(85%,85%,85%)";// "rgb(182, 210, 232)";
  var light_orange = "rgb(255,224,204)";//"rgb(255,244,237)";
  var reg_index = 40;
  var animationRunning = false;
  var requestId;
  
  var mean2 = new Image();
  var mean3 = new Image();
  mean2.src = "assets/mean2.png";
  mean3.src = "assets/mean3.png";
  
  function draw_fig(digit0, digit1) {
    d3.queue().defer(d3.text,"assets/data/fig0_data0_"+digit0+digit1+".csv")
              .defer(d3.text,"assets/data/fig0_data1_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/fig0_extras_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/fig0_w_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/fig0_bins0_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/fig0_bins1_"+digit0+digit1+".csv")
              .await(draw_all);

    function draw_all(error, text_data0, text_data1, text_extras, text_w, text_bins0, text_bins1) {
	  
      var data0 = d3.csvParseRows(text_data0).map(function(row) {return row.map(function(value) {return +value;});});
	  var data1 = d3.csvParseRows(text_data1).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csvParseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});
	  var w = d3.csvParseRows(text_w).map(function(row) {return row.map(function(value) {return +value;});});
	  var bins0 = d3.csvParseRows(text_bins0).map(function(row) {return row.map(function(value) {return +value;});});
	  var bins1 = d3.csvParseRows(text_bins1).map(function(row) {return row.map(function(value) {return +value;});});
	  
	  var max_dAdv = Math.round( Math.max.apply(null, extras[14]) * 10) / 10;
      var min_errTrain = Math.round( Math.min.apply(null, extras[15]) * 10) / 10;
	  
      var fig = d3.select("#abstract-fig");
	  fig.style("position","relative");
	  
      var layer1 = fig.append("svg")
	                  .style("position","absolute")
                      .attr("width", 3/2*height)
                      .attr("height", height)
					  .style("top", "0px")
					  .style("left", (width-height*3/2)/2 + "px");
	  
      var layer2 = fig.append("canvas")
					  .style("position","absolute")
                      .attr("width", 3/2*height)
                      .attr("height", height)
					  .style("top", "0px")
					  .style("left", (width-height*3/2)/2 + "px");
	  var ctx_layer2 = layer2.node().getContext("2d");
	  
      var layer3 = fig.append("svg")
	                  .style("position","absolute")
                      .attr("width", 3/2*height)
                      .attr("height", height)
					  .style("top", "0px")
					  .style("left", (width-height*3/2)/2 + "px");
					  
      var layer4 = fig.append("canvas")
					  .style("position","absolute")
                      .attr("width", width)
                      .attr("height", height)
					  .style("top", "0px")
					  .style("left", "0px");
	  var ctx_layer4 = layer4.node().getContext("2d");
	  
      var layer5 = fig.append("svg")
	                  .style("position","absolute")
                      .attr("width", width)
                      .attr("height", height)
					  .style("top", "0px")
					  .style("left", "0px");
	  
      var container = fig.append("custom");
	  
      var im_size = 90;
      var mean2_x = 0, mean3_x = 0;
      for(var i=0; i < 1500; i++){
        mean2_x += data0[i][0];
		mean3_x += data1[i][0];
      }
	  mean_x = (mean3_x-mean2_x)/3000;
      mean2_x = (width-height*3/2)/2 + x(-mean_x);
	  mean3_x = (width-height*3/2)/2 + x(mean_x);
		
	  var mean2_y = y(0), mean3_y = y(0);
	  var mean2_im_x = (width - height*3/2)/4, mean2_im_y = height/2;  
	  var mean3_im_x = height*3/2 + 3*(width - height*3/2)/4, mean3_im_y = height/2;
	  
	  var theta = -Math.acos(extras[2][80-reg_index]);
	  
	  function init_canvas() {	
        container.selectAll("circle0")
                 .data(data0)
	             .enter()
	             .append("circle0")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[80-reg_index+1]);})
		         .attr("r", 1)
	             .attr("lineWidth", 0.6)
                 .attr("strokeStyle", left_color)
			     .attr("fillStyle", left_color);
  				 
	    container.selectAll("circle1")
                 .data(data1)
		         .enter()
		         .append("circle1")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[80-reg_index+1]);})
		         .attr("r", 1)
			     .attr("lineWidth", 0.6)
                 .attr("strokeStyle", right_color)
			     .attr("fillStyle", right_color);
	  }
	  
	  function draw_layer1() {
        layer1.append("rect")
              .attr("fill","rgb(98%,98%,98%)")
			  .attr("x", 0)
              .attr("y", 0)
              .attr("width", 3/2*height)
              .attr("height", height);
		
		/*	  
        // grid
        var x1_array = [-19.5, -19.5, -13, -6.5, 6.5, 13];
        var y1_array = [6.5, -6.5, 13, 13, 13, 13];
        var x2_array = [19.5, 19.5, -13, -6.5, 6.5, 13];
        var y2_array = [6.5, -6.5, -13, -13, -13, -13];
  
        for (var i = 0; i < 6; i++) {
	      layer1.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", x(x1_array[i]))
	            .attr("y1", y(y1_array[i]))
	            .attr("x2", x(x2_array[i]))
	            .attr("y2", y(y2_array[i]));
        }
		
        layer1.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", x(-19.5))
	          .attr("y1", y(0))
	          .attr("x2", x(19.5))
	          .attr("y2", y(0));
			  
        layer1.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", x(0))
	          .attr("y1", y(13))
	          .attr("x2", x(0))
	          .attr("y2", y(-13));
	  */
	  }

      function draw_layer2() {
        ctx_layer2.clearRect(0, 0, 3/2*height, height);
	
	    //Class 0
        container.selectAll("circle0")
                 .each(function(d) {
                         var node = d3.select(this);
			             ctx_layer2.beginPath();
                         ctx_layer2.strokeStyle = node.attr("strokeStyle");
	                     ctx_layer2.lineWidth = node.attr("lineWidth");
	                     ctx_layer2.fillStyle = node.attr("fillStyle");
                         ctx_layer2.arc(node.attr("x"), node.attr("y"), node.attr("r"), 0, 2 * Math.PI);
					     ctx_layer2.fill();
                         ctx_layer2.stroke();
                         ctx_layer2.closePath();
                       });
			 
	    //Class 1
        container.selectAll("circle1")
                 .each(function(d) {
                         var node = d3.select(this);
			             ctx_layer2.beginPath();
	                     ctx_layer2.strokeStyle = node.attr("strokeStyle");
		                 ctx_layer2.lineWidth = node.attr("lineWidth");
	                     ctx_layer2.fillStyle = node.attr("fillStyle");
                         ctx_layer2.arc(node.attr("x"), node.attr("y"), node.attr("r"), 0, 2 * Math.PI);
                         ctx_layer2.fill();
					     ctx_layer2.stroke();
                         ctx_layer2.closePath();
                       });
	  }

      function draw_layer3() {
	    layer3.append("rect")
	          .attr("id","abstract-margin")
              .attr("transform", "rotate("+ (90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	          .attr("fill", "rgba(0,0,0,0.07)")
              .attr("x", x(-mean_x*extras[2][80-reg_index]))
              .attr("y", -200)
              .attr("width", 2*(x(mean_x*extras[2][80-reg_index])-x(0)))
              .attr("height", width+200);
		  
	    layer3.append("line")
	          .attr("id","abstract-boundary")
              .attr("transform", "rotate("+ (90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	          .attr("stroke",orange)
			  .attr("stroke-width",2.5)
              .attr("x1", x(-extras[1][80-reg_index]))
              .attr("y1", -200)
              .attr("x2", x(-extras[1][80-reg_index]))
              .attr("y2", width+200);
	  }
	  
	  function draw_layer4() {
		//background left right
        ctx_layer4.beginPath();
		ctx_layer4.fillStyle = light_left_color;
        ctx_layer4.rect(0, 0, (width - height*3/2)/2, height);
		ctx_layer4.fill();
	    ctx_layer4.closePath();
		
        ctx_layer4.beginPath();
		ctx_layer4.fillStyle = light_right_color;
        ctx_layer4.rect((width - height*3/2)/2 + height*3/2, 0, (width - height*3/2)/2, height);
		ctx_layer4.fill();
	    ctx_layer4.closePath();
		
		//mean image
	    ctx_layer4.beginPath();
		ctx_layer4.fillStyle = "rgb(100%,100%,100%)";
	    ctx_layer4.lineWidth = 1;
        ctx_layer4.arc(mean2_im_x, mean2_im_y, 0.6*im_size, 0, 2 * Math.PI);
        ctx_layer4.fill();
        ctx_layer4.closePath();
		
	    ctx_layer4.beginPath();
		ctx_layer4.fillStyle = "rgb(100%,100%,100%)";
	    ctx_layer4.lineWidth = 1;
        ctx_layer4.arc(mean3_im_x, mean3_im_y, 0.6*im_size, 0, 2 * Math.PI);
        ctx_layer4.fill();
        ctx_layer4.closePath();
		
        ctx_layer4.drawImage(mean2, mean2_im_x - im_size/2, mean2_im_y - im_size/2, im_size, im_size);
		ctx_layer4.drawImage(mean3, mean3_im_x - im_size/2, mean3_im_y - im_size/2, im_size, im_size);
		
	    ctx_layer4.beginPath();
        ctx_layer4.strokeStyle = light_left_color;
	    ctx_layer4.lineWidth = 10;
        ctx_layer4.arc(mean2_im_x, mean2_im_y, 0.6*im_size + 5, 0, 2 * Math.PI);
        ctx_layer4.stroke();
        ctx_layer4.closePath();
		
	    ctx_layer4.beginPath();
        ctx_layer4.strokeStyle = light_right_color;
	    ctx_layer4.lineWidth = 10;
        ctx_layer4.arc(mean3_im_x, mean3_im_y, 0.6*im_size + 5, 0, 2 * Math.PI);
        ctx_layer4.stroke();
        ctx_layer4.closePath();
	  }

	  function draw_layer5() {
	    layer5.append("circle")
	           .attr("cx", mean2_x)
		       .attr("cy", mean2_y)
		       .attr("r", 3.5)
			   .attr("stroke-width", 1.5)
			   .attr("stroke", "rgb(30%,30%,30%)")
		       .attr("fill", "rgb(100%,100%,100%)");
			   
	    layer5.append("circle")
	           .attr("cx", mean3_x)
		       .attr("cy", mean3_y)
		       .attr("r", 3.5)
			   .attr("stroke-width", 1.5)
			   .attr("stroke", "rgb(30%,30%,30%)")
		       .attr("fill", "rgb(100%,100%,100%)");
			   
	    layer5.append("circle")
	           .attr("cx", mean2_im_x)
		       .attr("cy", mean2_im_y)
		       .attr("r", 0.6*im_size)
			   .attr("stroke-width", 2)
			   .attr("stroke", "rgb(30%,30%,30%)")
			   .attr("fill", "none");
			   
	    layer5.append("circle")
	           .attr("cx", mean3_im_x)
		       .attr("cy", mean3_im_y)
		       .attr("r", 0.6*im_size)
			   .attr("stroke-width", 2)
			   .attr("stroke", "rgb(30%,30%,30%)")
			   .attr("fill", "none");
			   
	    layer5.append("line")
	          .attr("stroke", "rgb(30%,30%,30%)")
			  .attr("stroke-width", 1.5)
			  .style("stroke-dasharray", ("6, 3"))
              .attr("x1", mean2_im_x + 0.6*im_size)
              .attr("y1", mean2_im_y)
              .attr("x2", mean2_x - 3.5)
              .attr("y2", mean2_y);
			  
	    layer5.append("line")
	          .attr("stroke", "rgb(30%,30%,30%)")
			  .attr("stroke-width", 1.5)
			  .style("stroke-dasharray", ("6, 3"))
              .attr("x1", mean3_im_x - 0.6*im_size)
              .attr("y1", mean3_im_y)
              .attr("x2", mean3_x + 3.5)
              .attr("y2", mean3_y);
		
		layer5.append("polygon")
		      .attr("points", (mean3_x+3.5) +","+ y(0) +" "+ (mean3_x+3.5+10) +","+ (y(0)+4) +" "+ (mean3_x+3.5+6) +","+ y(0) +" "+(mean3_x+3.5+10) +","+ (y(0)-4))
  	          .attr("stroke-width", 1)
  	          .attr("stroke", "rgb(30%,30%,30%)")
			  .attr("fill", "rgb(30%,30%,30%)");
			  
		layer5.append("polygon")
		      .attr("points", (mean2_x-3.5) +","+ y(0) +" "+ (mean2_x-3.5-10) +","+ (y(0)+4) +" "+ (mean2_x-3.5-6) +","+ y(0) +" "+(mean2_x-3.5-10) +","+ (y(0)-4))
  	          .attr("stroke-width", 1)
  	          .attr("stroke", "rgb(30%,30%,30%)")
			  .attr("fill", "rgb(30%,30%,30%)");
	  }
	  
	  function update() {
		theta = -Math.acos(extras[2][80-reg_index]);
		  
        container.selectAll("circle0")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});

	    container.selectAll("circle1")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});
		
		d3.select("#abstract-margin")
          .attr("transform", "rotate("+ (90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
          .attr("x", x(-mean_x*extras[2][80-reg_index]))
          .attr("width", 2*(x(mean_x*extras[2][80-reg_index])-x(0)));
		  
		d3.select("#abstract-boundary")
          .attr("transform", "rotate("+ (90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
          .attr("x1", x(-extras[1][80-reg_index]))
          .attr("x2", x(-extras[1][80-reg_index]))
		  
	    //if (Math.round( extras[15][80-reg_index] * 10) / 10 == min_errTrain)
		//  d3.select("#abstract_err_train").style("font-weight","bold")
		//	                              .style("color",orange);
	    //else
		//  d3.select("#abstract_err_train").style("font-weight","normal")
		//	                              .style("color","rgba(60%,60%,60%)");			 
	    //if (Math.round( extras[14][80-reg_index] * 10) / 10 == max_dAdv)
		//  d3.select("#abstract_adv_distance").style("font-weight","bold")
		//	                                 .style("color",orange);
	    //else
		//  d3.select("#abstract_adv_distance").style("font-weight","normal")
		//	                                 .style("color","rgba(60%,60%,60%)");	
				 
	    d3.select("#abstract_err_train").text(" Training error:\u00A0\u00A0" + parseFloat(extras[15][80-reg_index]).toFixed(1) + "%");
	    d3.select("#abstract_adv_distance").text("Adversarial distance:\u00A0\u00A0" + parseFloat(extras[14][80-reg_index]).toFixed(1));
	  }
	  
	  function animate() {
	    draw_layer2();
		
	    requestId = window.requestAnimationFrame(animate);
		
		if (Date.now() - input_time > 10000) {
          animationRunning = false;
          window.cancelAnimationFrame(requestId);
        }
	  }
	  
	  init_canvas();
	  draw_layer1();
	  draw_layer2();
	  draw_layer3();
	  draw_layer4();
	  draw_layer5();
	  
	  d3.select("#abstract_err_train").text(" Training error:\u00A0\u00A0" + parseFloat(extras[15][80-reg_index]).toFixed(1) + "%");
	  d3.select("#abstract_adv_distance").text("Adversarial distance:\u00A0\u00A0" + parseFloat(extras[14][80-reg_index]).toFixed(1));
	  
	  var input = d3.select("#abstract-input");
	  input.property("value", reg_index);
	  input.on("input", function() {if (!animationRunning) {
			                          animationRunning = true;
			                          requestId = window.requestAnimationFrame(animate);
		                            }
									input_time = Date.now();
		                            reg_index = +this.value;
									update();});
	}
  }
  
  draw_fig(left_digit, right_digit);
}

function Carell_Deschanel(){
  var width = 648;
  var height = 340;
  
  var im_size = 110;
  var margin1 = 160;
  var margin2 = 170;
  var margin3 = 75;
  var margin4 = 370;
  var top_margin = 40;
  
  var background = d3.select("#Carell-Deschanel")
                     .append("svg")
    	   	  	     .attr("width", width)
			         .attr("height", height);
					 
  background.append("svg:image")
            .attr('x', 0)
            .attr('y', margin1/2 + top_margin)
            .attr('width', im_size)
			.attr('height', im_size)
            .attr("xlink:href","assets/Carell_pert.png")

 background.append("svg:image")
            .attr('x', margin2)
            .attr('y', top_margin)
            .attr('width', im_size)
			.attr('height', im_size)
            .attr("xlink:href","assets/Carell_im.png")
			
  background.append("svg:image")
            .attr('x', margin2)
            .attr('y', margin1 + top_margin)
            .attr('width', im_size)
			.attr('height', im_size)
            .attr("xlink:href","assets/Carell_adv.png")
			
 background.append("svg:image")
            .attr('x', 350 + margin2)
            .attr('y', top_margin)
            .attr('width', im_size)
			.attr('height', im_size)
            .attr("xlink:href","assets/Steve_Carell.png")
			
  background.append("svg:image")
            .attr('x', 350 + margin2)
            .attr('y', margin1 + top_margin)
            .attr('width', im_size)
			.attr('height', im_size)
            .attr("xlink:href","assets/Zooey_Deschanel.png")

  var bracket = background.append("g")
                          .attr("fill", "none")
	                      .attr('stroke',"rgb(0%,0%,0%)")
			              .attr("stroke-opacity", 1)
			              .attr("stroke-width", 1);
  
  var space_bracket = 30;
  var path = d3.path();
      path.moveTo(margin2, im_size/2 + top_margin);
	  path.arcTo(margin2 - space_bracket, im_size/2 + top_margin, margin2 - space_bracket, im_size/2 + 15 + top_margin, 15);
	  path.arcTo(margin2 - space_bracket, margin1 + im_size/2 + top_margin, margin2 - space_bracket + 15, margin1 + im_size/2 + top_margin, 15);
	  path.lineTo(margin2 - 3, margin1 + im_size/2 + top_margin);

  bracket.append("path")
         .attr("d", path.toString());
		 
  var path = d3.path();
      path.moveTo(margin4 + 5, -5 + top_margin);
	  path.lineTo(margin4, -5 + top_margin);
	  path.lineTo(margin4, im_size + 5 + top_margin);
	  path.lineTo(margin4 + 5, im_size + 5 + top_margin);
	  
  bracket.append("path")
         .attr("d", path.toString());
		 
  var path = d3.path();
      path.moveTo(margin4 + 250, -5 + top_margin);
	  path.lineTo(margin4 + 250 + 5, -5 + top_margin);
	  path.lineTo(margin4 + 250 + 5, im_size + 5 + top_margin);
	  path.lineTo(margin4 + 250, im_size + 5 + top_margin);
	  
  bracket.append("path")
         .attr("d", path.toString());
		 
  var path = d3.path();
      path.moveTo(margin4 + 5, margin1 - 5 + top_margin);
	  path.lineTo(margin4, margin1 - 5 + top_margin);
	  path.lineTo(margin4, im_size + margin1 + 5 + top_margin);
	  path.lineTo(margin4 + 5, im_size + margin1 + 5 + top_margin);
	  
  bracket.append("path")
         .attr("d", path.toString());
		 
  var path = d3.path();
      path.moveTo(margin4 + 250, margin1 - 5 + top_margin);
	  path.lineTo(margin4 + 250 + 5, margin1 - 5 + top_margin);
	  path.lineTo(margin4 + 250 + 5, im_size + margin1 + 5 + top_margin);
	  path.lineTo(margin4 + 250, im_size + margin1 + 5 + top_margin);
	  
  bracket.append("path")
         .attr("d", path.toString());
						 
  bracket.append("line")
         .attr("x1", margin2 + im_size)
	     .attr("y1", im_size/2 + top_margin)
	     .attr("x2", margin2 + im_size + margin3)
	     .attr("y2", im_size/2 + top_margin);
		 
  bracket.append("line")
         .attr("x1", margin2 + im_size)
	     .attr("y1", margin1 + im_size/2 + top_margin)
	     .attr("x2", margin2 + im_size + margin3)
	     .attr("y2", margin1 + im_size/2 + top_margin);
						 
  bracket.append("polygon")
	     .attr("fill", "rgb(0%,0%,0%)")
         .attr("points", margin2 + "," + (margin1 + im_size/2 + top_margin) + " " +
	                     (margin2 - 7) + "," + (margin1 + im_size/2 + 3 + top_margin) + " " + 
				         (margin2 - 7) + "," + (margin1 + im_size/2 - 3 + top_margin));
						 
  bracket.append("polygon")
	     .attr("fill", "rgb(0%,0%,0%)")
         .attr("points", (margin2 + im_size + margin3) + "," + (im_size/2 + top_margin) + " " +
	                     (margin2 + im_size + margin3 - 7) + "," + (im_size/2 + 3 + top_margin) + " " + 
				         (margin2 + im_size + margin3 - 7) + "," + (im_size/2 - 3 + top_margin));
						 
  bracket.append("polygon")
	     .attr("fill", "rgb(0%,0%,0%)")
         .attr("points", (margin2 + im_size + margin3) + "," + (margin1 + im_size/2 + top_margin) + " " +
	                     (margin2 + im_size + margin3 - 7) + "," + (margin1 + im_size/2 + 3 + top_margin) + " " + 
				         (margin2 + im_size + margin3 - 7) + "," + (margin1 + im_size/2 - 3 + top_margin));
						 
  bracket.append("circle")
         .attr("fill","rgb(100%,100%,100%)")
         .attr("cx", margin2 - space_bracket)
		 .attr("cy", im_size/2 + margin1/2 + top_margin)
		 .attr("r", 15);
		 
  bracket.append("line")
         .attr("x1", margin2 - space_bracket + 6)
         .attr("y1", im_size/2 + margin1/2 + top_margin)
         .attr("x2", margin2 - space_bracket - 6)
         .attr("y2", im_size/2 + margin1/2 + top_margin)
		 
  bracket.append("line")
         .attr("x1", margin2 - space_bracket)
         .attr("y1", im_size/2 + margin1/2 + top_margin + 6)
         .attr("x2", margin2 - space_bracket)
         .attr("y2", im_size/2 + margin1/2 + top_margin - 6)
						 
  // black labels
  var black_labels = background.append("g")
	                           .attr("fill", "rgb(0%,0%,0%)")
	                           .attr("font-family","Roboto")
	                           .attr("font-size", "15px");

  black_labels.append("text")
	          .attr("text-anchor", "middle")
              .attr("x", margin2 + im_size/2)
	          .attr("y", top_margin - 10)
	          .text("Who is this?");
							   
  black_labels.append("text")
	          .attr("text-anchor", "middle")
              .attr("x", margin4 + 85)
	          .attr("y", im_size/2 + top_margin - 7)
	          .text("Steve Carell");
			  
  black_labels.append("text")
	          .attr("text-anchor", "middle")
              .attr("x", margin4 + 85)
	          .attr("y", im_size/2 + top_margin + 17)
	          .text("(score: 0.966)");
			  
  black_labels.append("text")
	          .attr("text-anchor", "middle")
              .attr("x", margin2 + im_size/2)
	          .attr("y", margin1 + top_margin - 10)
	          .text("Who is this?");
			  
  black_labels.append("text")
	          .attr("text-anchor", "middle")
              .attr("x", margin4 + 85)
	          .attr("y", margin1 + im_size/2 + top_margin - 7)
	          .text("Zooey Deschanel");
			  
  black_labels.append("text")
	          .attr("text-anchor", "middle")
              .attr("x", margin4 + 85)
	          .attr("y", margin1 + im_size/2 + top_margin + 17)
	          .text("(score: 0.968)");
			  
  // gray labels
  var gray_labels = background.append("g")
	                          .attr("fill", "rgb(60%,60%,60%)")
	                          .attr("font-family","Roboto")
	                          .attr("font-size", "13px");
}

function toy_problem1(){
  var width = 648;
  var height = 370;
  var space_x = 30;
  var space_y = 50;
  var space_size = 270;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  
  var im_x = 360;
  var im_y = 50;
  var im_size = 120;
  
  var text_x = 520;
  var text_y = 50;
  
  var a = 0.2;
  var b = -0.5;
  
  function init_toy_problem(){
	
	// background
    var background = d3.select("#toy-problem1")
                       .append("svg")
    	   	  	       .attr("width", width)
			           .attr("height", height);
							
    background.append("rect")
              .attr("fill","rgb(95%,95%,95%)")
			  .attr("x", space_x)
              .attr("y", space_y)
              .attr("width", space_size)
              .attr("height", space_size);

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image
    background.append("rect")
	          .attr("id","toy-problem1-background-rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((b+1)/2))
			  .attr("x", im_x)
              .attr("y", im_y)
              .attr("width", im_size)
              .attr("height", im_size);
			
    background.append("rect")
	          .attr("id","toy-problem1-central-rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((a+1)/2))
			  .attr("x", im_x + im_size/3)
              .attr("y", im_y + im_size/3)
              .attr("width", im_size/3)
              .attr("height", im_size/3);
			
    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
                .attr("font-style", "italic")
                .attr("x", space_x + space_scale(0))
	            .attr("y", space_y + space_scale(1.18))
		        .text("a");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .attr("x", space_x + space_scale(-1.15))
                .attr("y", space_y + space_scale(0.03))
                .text("b");
									
    black_labels.append("text")
	            .attr("text-anchor", "start")
	            .attr("font-style", "italic")
                .attr("x", text_x)
	            .attr("y", text_y + 5)
		        .text("a");
    black_labels.append("text")
	            .attr("text-anchor", "start")
	            .attr("font-style", "italic")
                .attr("x", text_x)
	            .attr("y", text_y + 84)
                .text("b");
				
    black_labels.append("text")
	            .attr("text-anchor", "start")
                .attr("x", space_x)
	            .attr("y", space_y - 20)
		        .text("Image space [-1,1]")
	            .append("tspan")
                .attr("font-size", "11px")
                .attr("dx", "3px")
                .attr("dy", "-8px")
	            .text("2");

    black_labels.append("text")
	            .attr("text-anchor", "start")
                .attr("x", im_x)
                .attr("y", im_y - 20)
                .text("Image ")
	            .append("tspan")
                .attr("font-style", "italic")
                .text("x = (a, b)");
				
    black_labels.append("text")
	            .attr("text-anchor", "middle")
				.attr("font-size", "13px")
	            .attr("id","toy-problem1-labela")
                .attr("x", im_x + im_size/2)
	            .attr("y", im_y + im_size/2 + 5)
		        .text(parseFloat(a).toFixed(1));
				
    black_labels.append("text")
	            .attr("text-anchor", "middle")
				.attr("font-size", "13px")
	            .attr("id","toy-problem1-labelb")
                .attr("x", im_x + im_size/2 + 40)
	            .attr("y", im_y + im_size/2 + 5)
                .text(parseFloat(b).toFixed(1));
	
	// gray labels
    var gray_labels = background.append("g")
	                            .attr("fill", "rgb(60%,60%,60%)")
	                            .attr("font-family","Roboto")
	                            .attr("font-size", "13px");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("1");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(1.025))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(-0.975))
		       .text("1");
			  
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", text_x)
	           .attr("y", text_y + 5)
		       .text("\u00A0\u00A0\u00A0 is the blue");
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", text_x)
	           .attr("y", text_y + 25)
		       .text("level of the");
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", text_x)
	           .attr("y", text_y + 45)
		       .text("inner square");
			 
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", text_x)
	           .attr("y", text_y + 84)
		       .text("\u00A0\u00A0\u00A0 is the blue");
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", text_x)
	           .attr("y", text_y + 104)
		       .text("level of the");
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", text_x)
	           .attr("y", text_y + 124)
		       .text("outer square");
			
    // bracket
    var bracket = background.append("g")
                            .attr("fill", "none")
	                        .attr('stroke',"rgb(0%,0%,0%)")
			                .attr("stroke-opacity", 1)
			                .attr("stroke-width", 1);
  
    bracket.append("line")
           .attr("x1", im_x - 5)
	       .attr("y1", im_y - 5)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y - 5);
		 
    bracket.append("line")
           .attr("x1", im_x - 5)
	       .attr("y1", im_y + im_size + 5)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y + im_size + 5);
		 
    bracket.append("line")
           .attr("x1", im_x - 10)
	       .attr("y1", im_y - 5)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y + im_size + 5);
		 
    var path = d3.path();
        path.moveTo(im_x - 10, im_y + im_size/2);
		path.bezierCurveTo(im_x - 10 - 90, im_y + im_size/2, space_x + space_scale(a) + 90, space_y + space_scale(-b), space_x + space_scale(a), space_y + space_scale(-b));

    bracket.append("path")
	       .attr("id","toy-problem1-path")
           .attr("d", path.toString());
		   
    bracket.append("polygon")
	       .attr("id","toy-problem1-polygon")
	       .attr("fill", "rgb(0%,0%,0%)")
           .attr("points", (space_x + space_scale(a) + 5) + "," + (space_y + space_scale(-b)) + " " +
		                   (space_x + space_scale(a) + 10) + "," + (space_y + space_scale(-b) + 2) + " " + 
						   (space_x + space_scale(a) + 10) + "," + (space_y + space_scale(-b) - 2));
		   
	bracket.append("circle")
	       .attr("id","toy-problem1-circle")
	       .attr("cx", space_x + space_scale(a))
		   .attr("cy", space_y + space_scale(-b))
		   .attr("r", 5)
		   .attr("fill", "rgb(95%,95%,95%)");
		   
    var path = d3.path();
        path.moveTo(text_x - 7, text_y + 2);
	    path.quadraticCurveTo(im_x + im_size/2, text_y + 2, im_x + im_size/2, im_y + im_size/2 - 18);
		
    bracket.append("path")
           .attr("d", path.toString());
		   
    bracket.append("polygon")
	       .attr("fill", "rgb(0%,0%,0%)")
           .attr("points", (im_x + im_size/2) + "," + (im_y + im_size/2 - 18 + 5) + " " +
		                   (im_x + im_size/2 + 2) + "," + (im_y + im_size/2 - 18) + " " + 
						   (im_x + im_size/2 - 2) + "," + (im_y + im_size/2 - 18));
		   
    var path = d3.path();
        path.moveTo(text_x - 7, text_y + 80);
	    path.quadraticCurveTo(im_x + im_size/2 + 40, text_y + 95, im_x + im_size/2 + 40, im_y + im_size/2 + 18);
		
    bracket.append("path")
           .attr("d", path.toString());
		   
    bracket.append("polygon")
	       .attr("fill", "rgb(0%,0%,0%)")
           .attr("points", (im_x + im_size/2 + 40) + "," + (im_y + im_size/2 + 18 - 5) + " " +
		                   (im_x + im_size/2 + 40 + 2) + "," + (im_y + im_size/2 + 18) + " " + 
						   (im_x + im_size/2 + 40 - 2) + "," + (im_y + im_size/2 + 18));	   
  }
  
  function mousemove() {
    a = Math.max(Math.min(2 * (d3.mouse(this)[0]-space_x)/space_size - 1, 1), -1);
	b = Math.max(Math.min(- 2 * (d3.mouse(this)[1]-space_y)/space_size + 1, 1), -1);
	
    var path = d3.path();
        path.moveTo(im_x - 10, im_y + im_size/2);
		path.bezierCurveTo(im_x - 10 - 90, im_y + im_size/2, space_x + space_scale(a) + 90, space_y + space_scale(-b), space_x + space_scale(a), space_y + space_scale(-b));	

	d3.select("#toy-problem1-path")
	  .attr("d", path.toString());
	
    d3.select("#toy-problem1-polygon")
	  .attr("points", (space_x + space_scale(a) + 5) + "," + (space_y + space_scale(-b)) + " " +
		              (space_x + space_scale(a) + 10) + "," + (space_y + space_scale(-b) + 2) + " " + 
					  (space_x + space_scale(a) + 10) + "," + (space_y + space_scale(-b) - 2));
	  
	d3.select("#toy-problem1-circle")
	  .attr("cx", space_x + space_scale(a))
	  .attr("cy", space_y + space_scale(-b));
	  
	d3.select("#toy-problem1-background-rect")
      .attr("fill", d3.interpolateBlues((b+1)/2));
	  
	d3.select("#toy-problem1-central-rect")
      .attr("fill", d3.interpolateBlues((a+1)/2));
	  
	d3.select("#toy-problem1-text")
      .attr("x", space_x + space_scale(a))
	  .attr("y", space_y + space_scale(-b) + 20)
      .text("("+parseFloat(a).toFixed(1)+", "+parseFloat(b).toFixed(1)+")");
	 
	d3.select("#toy-problem1-labela")
      .text(parseFloat(a).toFixed(1));
	d3.select("#toy-problem1-labelb")
      .text(parseFloat(b).toFixed(1));
  }
  
  init_toy_problem();
  d3.select("#toy-problem1-circle").call(d3.drag().on("drag", mousemove));
}

function toy_problem2(){
  var width = 648;
  var height = 340;
  var space_x = 30;
  var space_y = 30;
  var space_size = 270;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  
  var im_x = 360;
  var im_y = 30;
  var im_size = 45;
  
  function init_toy_problem(){
	
	// background
    var background = d3.select("#toy-problem2")
                       .append("svg")
    	   	  	       .attr("width", width)
			           .attr("height", height);

    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
	                            .attr("id","toy-problem3-image-space")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
							
    image_space.append("rect")
               .attr("fill","rgb(95%,95%,95%)")
			   .attr("opacity",1)
			   .attr("x", 0)
               .attr("y", 0)
               .attr("width", space_size)
               .attr("height", space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 9)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 7)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 9)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 7)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));
			   
    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));
			  
    // image
	for (var i = 0; i < 5; i++) {
      background.append("rect")
	            .attr("id","toy-problem1-background-rect")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.1)
			    .attr("stroke-width", 1)
                .attr("fill", d3.interpolateBlues(0.5))
			    .attr("x", im_x + (im_size + 10)*i)
                .attr("y", im_y + 20)
                .attr("width", im_size)
                .attr("height", im_size);
      background.append("rect")
	            .attr("id","toy-problem1-central-rect")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.1)
			    .attr("stroke-width", 1)
                .attr("fill", d3.interpolateBlues(0.1*i))
			    .attr("x", im_x + (im_size + 10)*i + im_size/3)
                .attr("y", im_y + 20 + im_size/3)
                .attr("width", im_size/3)
                .attr("height", im_size/3);
				
      background.append("rect")
	            .attr("id","toy-problem1-background-rect")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.1)
			    .attr("stroke-width", 1)
                .attr("fill", d3.interpolateBlues(0.5))
			    .attr("x", im_x + (im_size + 10)*i)
                .attr("y", im_y + 150 + 20)
                .attr("width", im_size)
                .attr("height", im_size);
      background.append("rect")
	            .attr("id","toy-problem1-central-rect")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.1)
			    .attr("stroke-width", 1)
                .attr("fill", d3.interpolateBlues(0.6 + 0.1*i))
			    .attr("x", im_x + (im_size + 10)*i + im_size/3)
                .attr("y", im_y + 150 + 20 + im_size/3)
                .attr("width", im_size/3)
                .attr("height", im_size/3);
	}
			  
    // bracket
    var bracket = background.append("g")
                            .attr("fill", "none")
	                        .attr('stroke',"rgb(0%,0%,0%)")
			                .attr("stroke-opacity", 1)
			                .attr("stroke-width", 1);
    
	// I
    bracket.append("line")
           .attr("x1", im_x - 5)
	       .attr("y1", im_y + 15)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y + 15);
		 
    bracket.append("line")
           .attr("x1", im_x - 5)
	       .attr("y1", im_y + 15 + im_size + 10)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y + 15 + im_size + 10);
		 
    bracket.append("line")
           .attr("x1", im_x - 10)
	       .attr("y1", im_y + 15)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y + 15 + im_size + 10);
		   
    bracket.append("line")
           .attr("x1", im_x + 5*(im_size + 10))
	       .attr("y1", im_y + 15)
	       .attr("x2", im_x + 5*(im_size + 10) - 5)
	       .attr("y2", im_y + 15);
		 
    bracket.append("line")
           .attr("x1", im_x + 5*(im_size + 10) - 5)
	       .attr("y1", im_y + 15 + im_size + 10)
	       .attr("x2", im_x + 5*(im_size + 10))
	       .attr("y2", im_y + 15 + im_size + 10);
		 
    bracket.append("line")
           .attr("x1", im_x + 5*(im_size + 10))
	       .attr("y1", im_y + 15)
	       .attr("x2", im_x + 5*(im_size + 10))
	       .attr("y2", im_y + 15 + im_size + 10);
		   
    var path = d3.path();
        path.moveTo(im_x - 10, im_y + 15 + (im_size + 10)/2);
		path.arcTo(space_x + 53.75, im_y + 15 + (im_size + 10)/2, space_x + 53.75, im_y + 15 + (im_size + 10)/2 + 75, 75);

    bracket.append("path")
           .attr("d", path.toString());
		   
    bracket.append("polygon")
	       .attr("fill", "rgb(0%,0%,0%)")
           .attr("points", (space_x + space_scale(-0.6)) + "," + (space_y + space_scale(0) - 15) + " " +
		                   (space_x + space_scale(-0.6) + 2) + "," + (space_y + space_scale(0) - 5 - 15) + " " + 
						   (space_x + space_scale(-0.6) - 2) + "," + (space_y + space_scale(0) - 5 - 15));
	
    // J	
    bracket.append("line")
           .attr("x1", im_x - 5)
	       .attr("y1", im_y + 150 + 15)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y + 150 + 15);
		 
    bracket.append("line")
           .attr("x1", im_x - 5)
	       .attr("y1", im_y + 150 + 15 + im_size + 10)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y + 150 + 15 + im_size + 10);
		 
    bracket.append("line")
           .attr("x1", im_x - 10)
	       .attr("y1", im_y + 150 + 15)
	       .attr("x2", im_x - 10)
	       .attr("y2", im_y + 150 + 15 + im_size + 10);
		   
    bracket.append("line")
           .attr("x1", im_x + 5*(im_size + 10))
	       .attr("y1", im_y + 150 + 15)
	       .attr("x2", im_x + 5*(im_size + 10) - 5)
	       .attr("y2", im_y + 150 + 15);
		 
    bracket.append("line")
           .attr("x1", im_x + 5*(im_size + 10) - 5)
	       .attr("y1", im_y + 150 + 15 + im_size + 10)
	       .attr("x2", im_x + 5*(im_size + 10))
	       .attr("y2", im_y + 150 + 15 + im_size + 10);
		 
    bracket.append("line")
           .attr("x1", im_x + 5*(im_size + 10))
	       .attr("y1", im_y + 150 + 15)
	       .attr("x2", im_x + 5*(im_size + 10))
	       .attr("y2", im_y + 150 + 15 + im_size + 10);
		   
    var path = d3.path();
        path.moveTo(im_x - 10, im_y + 150 + 15 + (im_size + 10)/2);
		path.arcTo(space_x + 216.1, im_y + 150 + 15 + (im_size + 10)/2, space_x + 216.1, im_y + 150 + 15 + (im_size + 10)/2 - 40, 40);

    bracket.append("path")
           .attr("d", path.toString());
		   
    bracket.append("polygon")
	       .attr("fill", "rgb(0%,0%,0%)")
           .attr("points", (space_x + space_scale(0.6)) + "," + (space_y + space_scale(0) + 15) + " " +
		                   (space_x + space_scale(0.6) + 2) + "," + (space_y + space_scale(0) + 5 + 15) + " " + 
						   (space_x + space_scale(0.6) - 2) + "," + (space_y + space_scale(0) + 5 + 15));
			
    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
                .attr("font-style", "italic")
                .attr("x", space_x + space_scale(0))
	            .attr("y", space_y + space_scale(1.18))
		        .text("a");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .attr("x", space_x + space_scale(-1.15))
                .attr("y", space_y + space_scale(0.03))
                .text("b");
				
	black_labels.append("text")
	            .attr("text-anchor", "start")
                .attr("x", im_x)
                .attr("y", im_y + 5)
                .text("Class ")
	            .append("tspan")
                .attr("font-style", "italic")
	            .text("I");
				
	black_labels.append("text")
	            .attr("text-anchor", "start")
                .attr("x", im_x)
                .attr("y", im_y + 150 + 5)
                .text("Class ")
	            .append("tspan")
                .attr("font-style", "italic")
	            .text("J");
	
	// gray labels
    var gray_labels = background.append("g")
	                            .attr("fill", "rgb(60%,60%,60%)")
	                            .attr("font-family","Roboto")
	                            .attr("font-size", "13px");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("1");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(1.025))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(-0.975))
		       .text("1");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", im_x)
	           .attr("y", im_y + 90)
		       .text("The set of all images with");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", im_x)
	           .attr("y", im_y + 110)
		       .text("a \u2208 [-1, -0.2] \u00A0\u00A0\u00A0 b = 0");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", im_x)
	           .attr("y", im_y + 150 + 90)
		       .text("The set of all images with");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", im_x)
	           .attr("y", im_y + 150 + 110)
		       .text("a \u2208 [0.2, 1] \u00A0\u00A0\u00A0 b = 0");
  }
  
  init_toy_problem();
}

function toy_problem3(){
  var width = 648;
  var height = 340;
  var space_x = 30;
  var space_y = 30;
  var space_size = 270;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  var colorBackgroundI = "rgb(95%,95%,95%)";
  var colorBackgroundJ = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";
  
  var theta_x = 360;
  var theta_y = 30;
  var init_theta = 0.5;
  
  function translate_x(theta) {return Math.min((space_scale(-0.8)-space_scale(0)) * Math.tan(0.00001 + Math.PI/2 * -theta), space_size/2);}
  function translate_y(theta) {return Math.min((space_scale(-0.8)-space_scale(0)) - space_size/2 * Math.tan(0.00001 + Math.PI/2 - Math.PI/2 * -theta), 0);}
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#toy-problem3");
	fig.style("position","relative");
	   
	// background
    var background = fig.append("svg")
    	   	  	        .attr("width", width)
			            .attr("height", height)
					    .style("position","static")
					    .style("top", "0px")
					    .style("left", "0px");
						
    // controler
	fig.append("input")
	   .attr("id","toy-problem3-input")
	   .attr("type","range")
	   .attr("min",0)
	   .attr("max",0.99)
	   .attr("step",0.01)
	   .attr("value", theta)
	   .style("position","absolute")
	   .style("top", "90px")
	   .style("left", "350px");

    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
	                            .attr("id","toy-problem3-image-space")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
			   
    // L_theta 1
    var g_theta1 = image_space.append("g")
	                          .attr("id","toy-problem3-g-theta1")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", space_scale(-2))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", space_scale(0))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 9)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 7)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 9)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 7)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));
			   
	// L_theta 2
    var g_theta2 = image_space.append("g")
	                          .attr("id","toy-problem3-g-theta2")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)-3)
		    .attr("y1", space_scale(2))
		    .attr("x2", space_scale(0)-3)
		    .attr("y2", space_scale(0.08))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundI)
     	    .attr("stroke-opacity",1);
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)+3)
		    .attr("y1", space_scale(-0.08))
		    .attr("x2", space_scale(0)+3)
		    .attr("y2", space_scale(-2))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundJ)
     	    .attr("stroke-opacity",1);

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));

    // L_theta
	image_space.append("line")
	           .attr("id","toy-problem3-L-theta")
			   .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")")
               .attr("x1", space_scale(0))
		       .attr("y1", space_scale(2))
		       .attr("x2", space_scale(0))
		       .attr("y2", space_scale(-2))
               .attr("stroke-width", 2.5)
	           .attr("stroke", orange)
     	       .attr("stroke-opacity",1);

	// L_theta text
    image_space.append("text")
	           .attr("id","toy-problem3-text-theta")
               .attr("transform", "translate("+translate_x(theta)+","+translate_y(theta)+")")
               .attr("x",space_scale(-0.20))
               .attr("y",space_scale(0.95))
  	           .attr("text-anchor", "start")
	           .attr("font-family", "Georgia, serif")
	           .attr("fill", orange)
	           .attr("font-style", "italic")
               .attr("font-weight", "bold")
	           .attr("font-size", "15px")
	           .attr("opacity", 1)
               .text("\u2112")
	           .append("tspan")
               .attr("font-size", "10px")
               .attr("dx", "2px")
               .attr("dy", "4px")
	           .text("\u03B8");		   
						  
    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
                .attr("font-style", "italic")
                .attr("x", space_x + space_scale(0))
	            .attr("y", space_y + space_scale(1.18))
		        .text("a");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .attr("x", space_x + space_scale(-1.15))
                .attr("y", space_y + space_scale(0.03))
                .text("b");
				
    black_labels.append("text")
	            .attr("id","toy-problem3-theta-text")
	            .attr("text-anchor", "start")
                .attr("x", theta_x)
                .attr("y", theta_y + 30)
                .text("\u03B8 = " + parseFloat(theta).toFixed(2) + " \u03C0/2");
	
	// gray labels
    var gray_labels = background.append("g")
	                            .attr("fill", "rgb(60%,60%,60%)")
	                            .attr("font-family","Roboto")
	                            .attr("font-size", "13px");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("1");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(1.025))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(-0.975))
		       .text("1");
			   
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", theta_x)
	           .attr("y", theta_y + 130)
		       .text("The linear classifier ")
			   .append("tspan")
			   .attr("font-family", "Georgia, serif")
			   .attr("font-weight", "bold")
			   .attr("font-style", "italic")
			   .text("\u2112")
	           .append("tspan")
               .attr("font-size", "10px")
               .attr("dx", "2px")
               .attr("dy", "4px")
	           .text("\u03B8 ")
			   .append("tspan")
	           .attr("font-family","Roboto")
	           .attr("font-size", "15px")
			   .attr("font-weight", "normal")
			   .attr("font-style", "normal")
			   .attr("dx", "2px")
			   .attr("dy", "-4px")
			   .text(" defined by its");	
			    
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", theta_x)
	           .attr("y", theta_y + 150)
		       .text("normal weight vector ")
			   .append("tspan")
			   .attr("font-family", "Georgia, serif")
			   .attr("font-weight", "bold")
			   .attr("font-style", "italic")
			   .text("w")
	           .append("tspan")
               .attr("font-size", "10px")
               .attr("dx", "2px")
               .attr("dy", "4px")
	           .text("\u03B8 ")
	           .append("tspan")
			   .attr("font-size", "15px")
			   .attr("font-family","Roboto")
			   .attr("font-weight", "normal")
			   .attr("font-style", "normal")
               .attr("dx", "2px")
               .attr("dy", "-4px")
	           .text(" = (cos \u03B8, sin \u03B8)");
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", theta_x)
	           .attr("y", theta_y + 170)
		       .text("separates ")
			   .append("tspan")
			   .attr("font-style", "italic")
			   .text("I\u00A0")
			   .append("tspan")
			   .attr("font-style", "normal")
			   .text(" and ")
			   .append("tspan")
			   .attr("font-style", "italic")
			   .text("J\u00A0")
			   .append("tspan")
			   .attr("font-style", "normal")
			   .text(" for all \u03B8 in [0, \u03C0/2)");

    var gray_labels = image_space.append("g")
	                             .attr("fill", "rgb(60%,60%,60%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");
								
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_scale(-0.6))
	           .attr("y", space_scale(0.2))
		       .text("Class ")
			   .append("tspan")
               .attr("font-style", "italic")
	           .text("I");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_scale(0.6))
	           .attr("y", space_scale(-0.13))
		       .text("Class ")
			   .append("tspan")
               .attr("font-style", "italic")
	           .text("J");
	
			   
	// w_theta
    var g_theta3 = image_space.append("g")
	                          .attr("id","toy-problem3-g-theta3")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
    g_theta3.append("line")
            .attr("x1", space_scale(0))
		    .attr("y1", space_scale(0))
		    .attr("x2", space_scale(0.475))
		    .attr("y2", space_scale(0))
	        .attr("stroke-width", 2)
			.attr("stroke-dasharray", "5, 3")
	        .attr("stroke", orange);
		 
    g_theta3.append("polygon")
            .attr("points", space_scale(0.475)+","+space_scale(0)+" "+space_scale(0.45)+","+space_scale(-0.035)+" "+space_scale(0.5)+","+space_scale(0)+" "+space_scale(0.45)+","+space_scale(0.035))
  	        .attr("fill", "rgb(100%,0%,0%)")
  	        .attr("stroke-width", 1)
  	        .attr("stroke", orange);
		 
    g_theta3.append("text")
            .attr("x", space_scale(0.63))
	        .attr("y", space_scale(0.025))
	        .attr("text-anchor", "middle")
	        .attr("font-family","Georgia, serif")
	        .attr("fill", orange)
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
            .text("w")
	        .append("tspan")
            .attr("font-size", "10px")
            .attr("dx", "2px")
            .attr("dy", "4px")
            .text("\u03B8");	
  }
  
  function toy_problem_update(theta) {
	d3.select("#toy-problem3-g-theta1").attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
    d3.select("#toy-problem3-g-theta2").attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	d3.select("#toy-problem3-g-theta3").attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	d3.select("#toy-problem3-L-theta").attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	d3.select("#toy-problem3-text-theta").attr("transform", "translate("+translate_x(theta)+","+translate_y(theta)+")");
	d3.select("#toy-problem3-theta-text").text("\u03B8 = " + parseFloat(theta).toFixed(2) + " \u03C0/2");
	}

  init_toy_problem(init_theta);
  
  d3.select("#toy-problem3-input")
	.on("input", function() {toy_problem_update(this.value);});
}

function projected_image(){
  var width = 130;
  var height = 130;
  var space_x = 5;
  var space_y = 5;
  var space_size = 120;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  var colorBackgroundI = "rgb(95%,95%,95%)";
  var colorBackgroundJ = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";

  var init_theta = 0.5;
  
  var x_a = -0.8, x_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#projected-mirror-input1");
	   
	// background
    var background = fig.append("svg")
    	   	  	        .attr("width", width)
			            .attr("height", height);

    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
			   
    // L_theta 1
    var g_theta1 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", space_scale(-2))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", space_scale(0))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 6)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 6)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));

    // L_theta
	image_space.append("line")
			   .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")")
               .attr("x1", space_scale(0))
		       .attr("y1", space_scale(2))
		       .attr("x2", space_scale(0))
		       .attr("y2", space_scale(-2))
               .attr("stroke-width", 2.5)
	           .attr("stroke", orange)
     	       .attr("stroke-opacity",1);	   
						  
    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");
				
	black_labels.append("text")
                .attr("x", space_x + space_scale(x_a))
                .attr("y", space_y + space_scale(-x_b)+17)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x");
			  
	black_labels.append("text")
	            .attr("x", space_x + (space_scale(xm_a)+space_scale(x_a))/2 + 17)
	            .attr("y", space_y + (space_scale(-xm_b)+space_scale(-x_b))/2)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x")
		        .append("tspan")
                .attr("font-size", "10px")
                .attr("dx", "1px")
                .attr("dy", "2px")
                .text("p");
			
	// x xp
	image_space.append("circle")
	           .attr("cx",space_scale(x_a))
			   .attr("cy",space_scale(-x_b))
			   .attr("r",3.5)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("circle")
	           .attr("cx", (space_scale(xm_a)+space_scale(x_a))/2)
	           .attr("cy", (space_scale(-xm_b)+space_scale(-x_b))/2)
			   .attr("r",3.5)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("line")
               .attr("x1", space_scale(x_a))
	           .attr("y1", space_scale(-x_b))
	           .attr("x2", (space_scale(xm_a)+space_scale(x_a))/2)
	           .attr("y2", (space_scale(-xm_b)+space_scale(-x_b))/2)
               .attr("stroke-width", 1)
			   .attr("stroke-dasharray", "2, 1")
	           .attr("stroke","rgb(0%,0%,0%)");
  }
  
  init_toy_problem(init_theta);
}

function mirror_image(){
  var width = 130;
  var height = 130;
  var space_x = 5;
  var space_y = 5;
  var space_size = 120;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  var colorBackgroundI = "rgb(95%,95%,95%)";
  var colorBackgroundJ = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";

  var init_theta = 0.5;
  
  var x_a = -0.8, x_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#projected-mirror-input2");
	   
	// background
    var background = fig.append("svg")
    	   	  	        .attr("width", width)
			            .attr("height", height);

    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
			   
    // L_theta 1
    var g_theta1 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", space_scale(-2))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", space_scale(0))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 6)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 6)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));

    // L_theta
	image_space.append("line")
			   .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")")
               .attr("x1", space_scale(0))
		       .attr("y1", space_scale(2))
		       .attr("x2", space_scale(0))
		       .attr("y2", space_scale(-2))
               .attr("stroke-width", 2.5)
	           .attr("stroke", orange)
     	       .attr("stroke-opacity",1);	   
						  
    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");
				
	black_labels.append("text")
                .attr("x", space_x + space_scale(x_a))
                .attr("y", space_y + space_scale(-x_b)+17)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x");
			  
	black_labels.append("text")
                .attr("x", space_x + space_scale(xm_a)+17)
                .attr("y", space_y + space_scale(-xm_b))
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x")
		        .append("tspan")
                .attr("font-size", "10px")
                .attr("dx", "1px")
                .attr("dy", "2px")
                .text("m");
			
	// x xm
	image_space.append("circle")
	           .attr("cx",space_scale(x_a))
			   .attr("cy",space_scale(-x_b))
			   .attr("r",3.5)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("circle")
	           .attr("cx",space_scale(xm_a))
			   .attr("cy",space_scale(-xm_b))
			   .attr("r",3.5)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("line")
               .attr("x1", space_scale(x_a))
	           .attr("y1", space_scale(-x_b))
	           .attr("x2", space_scale(xm_a))
	           .attr("y2", space_scale(-xm_b))
               .attr("stroke-width", 1)
			   .attr("stroke-dasharray", "2, 1")
	           .attr("stroke","rgb(0%,0%,0%)");
  }
  
  init_toy_problem(init_theta);
}

function toy_problem4(){
  var width = 648;
  var height = 340;
  var space_x = 30;
  var space_y = 30;
  var space_size = 270;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  var colorBackgroundI = "rgb(95%,95%,95%)";
  var colorBackgroundJ = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";
  
  var im_x = 360;
  var im_y = 150;
  var im_size = 120;
  
  var theta_x = 360;
  var theta_y = 30;
  var init_theta = 0.5;
  
  function translate_x(theta) {return Math.min((space_scale(-0.8)-space_scale(0)) * Math.tan(0.00001 + Math.PI/2 * -theta), space_size/2);}
  function translate_y(theta) {return Math.min((space_scale(-0.8)-space_scale(0)) - space_size/2 * Math.tan(0.00001 + Math.PI/2 - Math.PI/2 * -theta), 0);}
  
  var x_a = -0.8, x_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#toy-problem4");
	fig.style("position","relative");
	   
	// background
    var background = fig.append("svg")
    	   	  	        .attr("width", width)
			            .attr("height", height)
					    .style("position","static")
					    .style("top", "0px")
					    .style("left", "0px");
						
    // controler
	fig.append("input")
	   .attr("id","toy-problem4-input")
	   .attr("type","range")
	   .attr("min",0)
	   .attr("max",0.99)
	   .attr("step",0.01)
	   .attr("value", theta)
	   .style("position","absolute")
	   .style("top", "90px")
	   .style("left", "350px");

    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
	                            .attr("id","toy-problem4-image-space")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
			   
    // L_theta 1
    var g_theta1 = image_space.append("g")
	                          .attr("id","toy-problem4-g-theta1")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", space_scale(-2))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", space_scale(0))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 9)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 7)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 9)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 7)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));
			   
	// L_theta 2
    var g_theta2 = image_space.append("g")
	                          .attr("id","toy-problem4-g-theta2")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)-3)
		    .attr("y1", space_scale(2))
		    .attr("x2", space_scale(0)-3)
		    .attr("y2", space_scale(0.08))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundI)
     	    .attr("stroke-opacity",1);
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)+3)
		    .attr("y1", space_scale(-0.08))
		    .attr("x2", space_scale(0)+3)
		    .attr("y2", space_scale(-2))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundJ)
     	    .attr("stroke-opacity",1);

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));

    // L_theta
	image_space.append("line")
	           .attr("id","toy-problem4-L-theta")
			   .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")")
               .attr("x1", space_scale(0))
		       .attr("y1", space_scale(2))
		       .attr("x2", space_scale(0))
		       .attr("y2", space_scale(-2))
               .attr("stroke-width", 2.5)
	           .attr("stroke", orange)
     	       .attr("stroke-opacity",1);

	// L_theta text
    image_space.append("text")
	           .attr("id","toy-problem4-text-theta")
               .attr("transform", "translate("+translate_x(theta)+","+translate_y(theta)+")")
               .attr("x",space_scale(-0.20))
               .attr("y",space_scale(0.95))
  	           .attr("text-anchor", "start")
	           .attr("font-family", "Georgia, serif")
	           .attr("fill", orange)
	           .attr("font-style", "italic")
               .attr("font-weight", "bold")
	           .attr("font-size", "15px")
	           .attr("opacity", 1)
               .text("\u2112")
	           .append("tspan")
               .attr("font-size", "10px")
               .attr("dx", "2px")
               .attr("dy", "4px")
	           .text("\u03B8");		   
						  
    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
                .attr("font-style", "italic")
                .attr("x", space_x + space_scale(0))
	            .attr("y", space_y + space_scale(1.18))
		        .text("a");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .attr("x", space_x + space_scale(-1.15))
                .attr("y", space_y + space_scale(0.03))
                .text("b");
				
	black_labels.append("text")
                .attr("x", space_x + space_scale(x_a))
                .attr("y", space_y + space_scale(-x_b)+17)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x");
			  
	black_labels.append("text")
	            .attr("id","toy-problem4-xm-text")
                .attr("x", space_x + space_scale(xm_a))
                .attr("y", space_y + space_scale(-xm_b)-12)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x")
		        .append("tspan")
                .attr("font-size", "10px")
                .attr("dx", "1px")
                .attr("dy", "2px")
                .text("m");
				
    black_labels.append("text")
	            .attr("id","toy-problem4-theta-text")
	            .attr("text-anchor", "start")
                .attr("x", theta_x)
                .attr("y", theta_y + 30)
                .text("\u03B8 = " + parseFloat(theta).toFixed(2) + " \u03C0/2");
	
	// gray labels
    var gray_labels = background.append("g")
	                            .attr("fill", "rgb(60%,60%,60%)")
	                            .attr("font-family","Roboto")
	                            .attr("font-size", "13px");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("1");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(1.025))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(-0.975))
		       .text("1");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
			   .attr("font-size", "15px")
               .attr("x", im_x + im_size/2)
               .attr("y", im_y + im_size + 23)
               .text("Image ")
		       .append("tspan")
               .attr("font-style", "italic")
               .text("x");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
			   .attr("font-size", "15px")
               .attr("x", im_x + im_size/2 + im_size + 20)
               .attr("y", im_y + im_size + 23)
               .text("Mirror image ")
		       .append("tspan")
               .attr("font-style", "italic")
               .text("x")
		       .append("tspan")
               .attr("font-size", "10px")
               .attr("dx", "1px")
               .attr("dy", "2px")
               .text("m");
			
	// x xm
	image_space.append("circle")
	           .attr("cx",space_scale(x_a))
			   .attr("cy",space_scale(-x_b))
			   .attr("r",4)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("circle")
	           .attr("id","toy-problem4-xm")
	           .attr("cx",space_scale(xm_a))
			   .attr("cy",space_scale(-xm_b))
			   .attr("r",4)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("line")
	           .attr("id","toy-problem4-lineI")
               .attr("x1", space_scale(x_a))
	           .attr("y1", space_scale(-x_b))
	           .attr("x2", space_scale(xm_a))
	           .attr("y2", space_scale(-xm_b))
               .attr("stroke-width", 1)
			   .attr("stroke-dasharray", "3, 1")
	           .attr("stroke","rgb(0%,0%,0%)");
			  
	// w_theta
    var g_theta3 = image_space.append("g")
	                          .attr("id","toy-problem4-g-theta3")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
    g_theta3.append("line")
            .attr("x1", space_scale(0))
		    .attr("y1", space_scale(0))
		    .attr("x2", space_scale(0.475))
		    .attr("y2", space_scale(0))
	        .attr("stroke-width", 2)
			.attr("stroke-dasharray", "5, 3")
	        .attr("stroke", orange);
		 
    g_theta3.append("polygon")
            .attr("points", space_scale(0.475)+","+space_scale(0)+" "+space_scale(0.45)+","+space_scale(-0.035)+" "+space_scale(0.5)+","+space_scale(0)+" "+space_scale(0.45)+","+space_scale(0.035))
  	        .attr("fill", "rgb(100%,0%,0%)")
  	        .attr("stroke-width", 1)
  	        .attr("stroke", orange);
		 
    g_theta3.append("text")
            .attr("x", space_scale(0.63))
	        .attr("y", space_scale(0.025))
	        .attr("text-anchor", "middle")
	        .attr("font-family","Georgia, serif")
	        .attr("fill", orange)
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
            .text("w")
	        .append("tspan")
            .attr("font-size", "10px")
            .attr("dx", "2px")
            .attr("dy", "4px")
            .text("\u03B8");
			
    // images
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((x_b+1)/2))
			  .attr("x", im_x)
              .attr("y", im_y)
              .attr("width", im_size)
              .attr("height", im_size);
			
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((x_a+1)/2))
			  .attr("x", im_x + im_size/3)
              .attr("y", im_y + im_size/3)
              .attr("width", im_size/3)
              .attr("height", im_size/3);
			  
    background.append("rect")
	          .attr("id","toy-problem4-background-rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((xm_b+1)/2))
			  .attr("x", im_x + im_size + 20)
              .attr("y", im_y)
              .attr("width", im_size)
              .attr("height", im_size);
			
    background.append("rect")
	          .attr("id","toy-problem4-central-rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((xm_a+1)/2))
			  .attr("x", im_x + im_size/3 + im_size + 20)
              .attr("y", im_y + im_size/3)
              .attr("width", im_size/3)
              .attr("height", im_size/3);
  }
  
  function toy_problem_update(theta) {
    xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * theta) * Math.cos(Math.PI/2 * theta));
    xm_b = - 2 * x_a * Math.cos(Math.PI/2 * theta) * Math.sin(Math.PI/2 * theta);
	  
	d3.select("#toy-problem4-g-theta1").attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
    d3.select("#toy-problem4-g-theta2").attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	d3.select("#toy-problem4-g-theta3").attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	d3.select("#toy-problem4-L-theta").attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	d3.select("#toy-problem4-text-theta").attr("transform", "translate("+translate_x(theta)+","+translate_y(theta)+")");
	d3.select("#toy-problem4-theta-text").text("\u03B8 = " + parseFloat(theta).toFixed(2) + " \u03C0/2");
	d3.select("#toy-problem4-xm").attr("cx",space_scale(xm_a)).attr("cy",space_scale(-xm_b));
	d3.select("#toy-problem4-xm-text").attr("x",space_x + space_scale(xm_a)).attr("y",space_y + space_scale(-xm_b)-10);
	d3.select("#toy-problem4-lineI").attr("x2", space_scale(xm_a)).attr("y2", space_scale(-xm_b));
	d3.select("#toy-problem4-background-rect").attr("fill", d3.interpolateBlues((xm_b+1)/2));
	d3.select("#toy-problem4-central-rect").attr("fill", d3.interpolateBlues((xm_a+1)/2));
	}

  init_toy_problem(init_theta);
  
  d3.select("#toy-problem4-input")
	.on("input", function() {toy_problem_update(this.value);});
}

function images_x1_xm1(){
  var width = 250;
  var height = 130;
  var space_x = 5;
  var space_y = 5;
  var space_size = 120;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  var colorBackgroundI = "rgb(95%,95%,95%)";
  var colorBackgroundJ = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";
  
  var init_theta = 0.;
  
  var im_x = 25;
  var im_y = 65;
  var im_size = 45;
  
  var x_a = -0.8, x_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#x-xm-small-theta");
  
    // background
    var background = fig.append("svg")
    	   	  	        .attr("width", width)
	  		            .attr("height", height)
					    .style("position","static")
					    .style("top", "0px")
					    .style("left", "0px");
					  
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
			   
    // L_theta 1
    var g_theta1 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", space_scale(-2))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", space_scale(0))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 6)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 6)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));

    // L_theta
	image_space.append("line")
			   .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")")
               .attr("x1", space_scale(0))
		       .attr("y1", space_scale(2))
		       .attr("x2", space_scale(0))
		       .attr("y2", space_scale(-2))
               .attr("stroke-width", 2)
	           .attr("stroke", orange)
     	       .attr("stroke-opacity",1);

    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "13px");
				
	black_labels.append("text")
                .attr("x", space_x + space_scale(x_a))
                .attr("y", space_y + space_scale(-x_b)+17)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x");
			  
	black_labels.append("text")
                .attr("x", space_x + space_scale(xm_a))
                .attr("y", space_y + space_scale(-xm_b)-12)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x")
		        .append("tspan")
                .attr("font-size", "10px")
                .attr("dx", "1px")
                .attr("dy", "2px")
                .text("m");
				
	// gray labels
    var gray_labels = background.append("g")
	                            .attr("fill", "rgb(60%,60%,60%)")
	                            .attr("font-family","Roboto")
	                            .attr("font-size", "15px");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", im_x + space_size + im_size/2)
               .attr("y", im_y + im_size + 15)
               .attr("font-style", "italic")
               .text("x");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", im_x + space_size + im_size/2 + im_size + 15)
               .attr("y", im_y + im_size + 15)
               .attr("font-style", "italic")
               .text("x")
		       .append("tspan")
               .attr("font-size", "10px")
               .attr("dx", "1px")
               .attr("dy", "2px")
               .text("m");
			
	// x xm
	image_space.append("circle")
	           .attr("cx",space_scale(x_a))
			   .attr("cy",space_scale(-x_b))
			   .attr("r",3.5)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("circle")
	           .attr("cx",space_scale(xm_a))
			   .attr("cy",space_scale(-xm_b))
			   .attr("r",3.5)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("line")
               .attr("x1", space_scale(x_a))
	           .attr("y1", space_scale(-x_b))
	           .attr("x2", space_scale(xm_a))
	           .attr("y2", space_scale(-xm_b))
               .attr("stroke-width", 1)
			   .attr("stroke-dasharray", "2, 1")
	           .attr("stroke","rgb(0%,0%,0%)");			   
	
    // images			  
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((x_b+1)/2))
			  .attr("x", im_x + space_size)
              .attr("y", im_y)
              .attr("width", im_size)
              .attr("height", im_size);
			
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((x_a+1)/2))
			  .attr("x", im_x + im_size/3 + space_size)
              .attr("y", im_y + im_size/3)
              .attr("width", im_size/3)
              .attr("height", im_size/3);
			  
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((xm_b+1)/2))
			  .attr("x", im_x + im_size + 10 + space_size)
              .attr("y", im_y)
              .attr("width", im_size)
              .attr("height", im_size);
			
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((xm_a+1)/2))
			  .attr("x", im_x + im_size/3 + im_size + 10 + space_size)
              .attr("y", im_y + im_size/3)
              .attr("width", im_size/3)
              .attr("height", im_size/3);
  }
  
  init_toy_problem(init_theta)
}

function images_x2_xm2(){
  var width = 250;
  var height = 130;
  var space_x = 5;
  var space_y = 5;
  var space_size = 120;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  var colorBackgroundI = "rgb(95%,95%,95%)";
  var colorBackgroundJ = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";
  
  var init_theta = 0.99;
  
  var im_x = 25;
  var im_y = 65;
  var im_size = 45;
  
  var x_a = -0.8, x_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#x-xm-large-theta");
  
    // background
    var background = fig.append("svg")
    	   	  	        .attr("width", width)
	  		            .attr("height", height)
					    .style("position","static")
					    .style("top", "0px")
					    .style("left", "0px");
					  
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
			   
    // L_theta 1
    var g_theta1 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", space_scale(-2))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", space_scale(0))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 6)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 6)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));
			   
	// L_theta 2
    var g_theta2 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)-3)
		    .attr("y1", space_scale(2))
		    .attr("x2", space_scale(0)-3)
		    .attr("y2", space_scale(0.08))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundI)
     	    .attr("stroke-opacity",1);
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)+3)
		    .attr("y1", space_scale(-0.08))
		    .attr("x2", space_scale(0)+3)
		    .attr("y2", space_scale(-2))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundJ)
     	    .attr("stroke-opacity",1);

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));

    // L_theta
	image_space.append("line")
			   .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")")
               .attr("x1", space_scale(0))
		       .attr("y1", space_scale(2))
		       .attr("x2", space_scale(0))
		       .attr("y2", space_scale(-2))
               .attr("stroke-width", 2)
	           .attr("stroke", orange)
     	       .attr("stroke-opacity",1);

    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "13px");
				
	black_labels.append("text")
                .attr("x", space_x + space_scale(x_a))
                .attr("y", space_y + space_scale(-x_b)+17)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x");
			  
	black_labels.append("text")
                .attr("x", space_x + space_scale(xm_a))
                .attr("y", space_y + space_scale(-xm_b)-12)
  	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .text("x")
		        .append("tspan")
                .attr("font-size", "10px")
                .attr("dx", "1px")
                .attr("dy", "2px")
                .text("m");
				
	// gray labels
    var gray_labels = background.append("g")
	                            .attr("fill", "rgb(60%,60%,60%)")
	                            .attr("font-family","Roboto")
	                            .attr("font-size", "15px");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", im_x + space_size + im_size/2)
               .attr("y", im_y + im_size + 15)
               .attr("font-style", "italic")
               .text("x");
			   
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", im_x + space_size + im_size/2 + im_size + 15)
               .attr("y", im_y + im_size + 15)
               .attr("font-style", "italic")
               .text("x")
		       .append("tspan")
               .attr("font-size", "10px")
               .attr("dx", "1px")
               .attr("dy", "2px")
               .text("m");
			
	// x xm
	image_space.append("circle")
	           .attr("cx",space_scale(x_a))
			   .attr("cy",space_scale(-x_b))
			   .attr("r",3.5)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("circle")
	           .attr("cx",space_scale(xm_a))
			   .attr("cy",space_scale(-xm_b))
			   .attr("r",3.5)
			   .attr("fill","rgb(0%,0%,0%)");
			  
	image_space.append("line")
               .attr("x1", space_scale(x_a))
	           .attr("y1", space_scale(-x_b))
	           .attr("x2", space_scale(xm_a))
	           .attr("y2", space_scale(-xm_b))
               .attr("stroke-width", 1)
			   .attr("stroke-dasharray", "2, 1")
	           .attr("stroke","rgb(0%,0%,0%)");			   
	
    // images			  
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((x_b+1)/2))
			  .attr("x", im_x + space_size)
              .attr("y", im_y)
              .attr("width", im_size)
              .attr("height", im_size);
			
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((x_a+1)/2))
			  .attr("x", im_x + im_size/3 + space_size)
              .attr("y", im_y + im_size/3)
              .attr("width", im_size/3)
              .attr("height", im_size/3);
			  
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((xm_b+1)/2))
			  .attr("x", im_x + im_size + 10 + space_size)
              .attr("y", im_y)
              .attr("width", im_size)
              .attr("height", im_size);
			
    background.append("rect")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.1)
			  .attr("stroke-width", 1)
              .attr("fill", d3.interpolateBlues((xm_a+1)/2))
			  .attr("x", im_x + im_size/3 + im_size + 10 + space_size)
              .attr("y", im_y + im_size/3)
              .attr("width", im_size/3)
              .attr("height", im_size/3);
  }
  
  init_toy_problem(init_theta)
}

function toy_problem5(){
  var width = 648;
  var height = 340;
  var space_x = 30;
  var space_y = 30;
  var space_size = 270;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  
  var im_x = 360;
  var im_y = 35;
  var im_size = 45;
  
  function init_toy_problem(){
	
	// background
    var background = d3.select("#toy-problem5")
                       .append("svg")
    	   	  	       .attr("width", width)
			           .attr("height", height);

    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
	                            .attr("id","toy-problem3-image-space")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
							
    image_space.append("rect")
               .attr("fill","rgb(95%,95%,95%)")
			   .attr("opacity",1)
			   .attr("x", 0)
               .attr("y", 0)
               .attr("width", space_size)
               .attr("height", space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 9)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 7)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 9)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 7)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));
			   
    // noisy data point
	var p_a = 0.07, p_b = -0.07;
	image_space.append("circle")
	           .attr("cx",space_scale(p_a))
			   .attr("cy",space_scale(-p_b))
			   .attr("r",4.5)
			   .attr("fill", "rgb(50%,50%,50%)");
			   
	image_space.append("circle")
	           .attr("cx",space_scale(p_a))
			   .attr("cy",space_scale(-p_b))
			   .attr("r",3.5)
			   .attr("fill", d3.interpolateBlues(0.3));
			   
    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));
			   
    // bracket
    var bracket = background.append("g")
                            .attr("fill", "none")
	                        .attr('stroke',"rgb(0%,0%,0%)")
			                .attr("stroke-opacity", 1)
			                .attr("stroke-width", 1);
    
	// I		   
    var path = d3.path();
        path.moveTo(im_x - 10, space_y + space_scale(0) - 50);
		path.arcTo(space_x + space_scale(-0.6), space_y + space_scale(0) - 50, space_x + space_scale(-0.6), space_y + space_scale(0) - 20, 30);

    bracket.append("path")
           .attr("d", path.toString());
		   
    bracket.append("polygon")
	       .attr("fill", "rgb(0%,0%,0%)")
           .attr("points", (space_x + space_scale(-0.6)) + "," + (space_y + space_scale(0) - 15) + " " +
		                   (space_x + space_scale(-0.6) + 2) + "," + (space_y + space_scale(0) - 5 - 15) + " " + 
						   (space_x + space_scale(-0.6) - 2) + "," + (space_y + space_scale(0) - 5 - 15));
	
	// J
    var path = d3.path();
        path.moveTo(im_x - 10, space_y + space_scale(0));
		path.lineTo(space_x + space_scale(1) + 10, space_y + space_scale(0));
		
    bracket.append("path")
           .attr("d", path.toString());
		   
    bracket.append("polygon")
	       .attr("fill", "rgb(0%,0%,0%)")
           .attr("points", (space_x + space_scale(1) + 5) + "," + (space_y + space_scale(0)) + " " +
		                   (space_x + space_scale(1) + 10) + "," + (space_y + space_scale(0) - 2) + " " + 
						   (space_x + space_scale(1) + 10) + "," + (space_y + space_scale(0) + 2));
	
    // p	
    var path = d3.path();
        path.moveTo(im_x - 10, space_y + space_scale(0) + 50);
		path.arcTo(space_x + space_scale(0.07), space_y + space_scale(0) + 50, space_x + space_scale(0.07), space_y + space_scale(0) + 23, 27);

    bracket.append("path")
           .attr("d", path.toString());
		   
    bracket.append("polygon")
	       .attr("fill", "rgb(0%,0%,0%)")
           .attr("points", (space_x + space_scale(0.07)) + "," + (space_y + space_scale(0.07) + 8) + " " +
		                   (space_x + space_scale(0.07) + 2) + "," + (space_y + space_scale(0.07) + 5 + 8) + " " + 
						   (space_x + space_scale(0.07) - 2) + "," + (space_y + space_scale(0.07) + 5 + 8));
			
    // black labels
    var black_labels = background.append("g")
	                             .attr("fill", "rgb(0%,0%,0%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
                .attr("font-style", "italic")
                .attr("x", space_x + space_scale(0))
	            .attr("y", space_y + space_scale(1.18))
		        .text("a");

    black_labels.append("text")
	            .attr("text-anchor", "middle")
	            .attr("font-style", "italic")
                .attr("x", space_x + space_scale(-1.15))
                .attr("y", space_y + space_scale(0.03))
                .text("b");
				
	black_labels.append("text")
	            .attr("text-anchor", "start")
                .attr("x", im_x)
                .attr("y", im_y + 20)
                .text("Training set containing:");
	
	// gray labels
    var gray_labels = background.append("g")
	                            .attr("fill", "rgb(60%,60%,60%)")
	                            .attr("font-family","Roboto")
	                            .attr("font-size", "13px");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(1))
	           .attr("y", space_y + space_scale(1.18))
		       .text("1");

    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(1.025))
		       .text("-1");
		  
    gray_labels.append("text")
	           .attr("text-anchor", "middle")
               .attr("x", space_x + space_scale(-1.15))
	           .attr("y", space_y + space_scale(-0.975))
		       .text("1");
			   
	gray_labels.append("text")
	            .attr("text-anchor", "start")
				.attr("font-size", "15px")
                .attr("x", im_x)
                .attr("y", space_y + space_scale(0) - 50 + 4)
                .text("A large number of images in class ")
				.append("tspan")
				.attr("font-style","italic")
				.text("I");
				
	gray_labels.append("text")
	            .attr("text-anchor", "start")
				.attr("font-size", "15px")
                .attr("x", im_x)
                .attr("y", space_y + space_scale(0) + 4)
                .text("A large number of images in class ")
				.append("tspan")
				.attr("font-style","italic")
				.text("J");
				
	gray_labels.append("text")
	            .attr("text-anchor", "start")
				.attr("font-size", "15px")
                .attr("x", im_x)
                .attr("y", space_y + space_scale(0) + 50 + 4)
                .text("The data point ")
				.append("tspan")
				.attr("font-style","italic")
				.attr("fill", "rgb(0%,0%,0%)")
				.text("p ")
				.append("tspan")
				.attr("font-style","normal")
				.attr("fill", "rgb(60%,60%,60%)")
				.text("wrongly labelled in class ")
				.append("tspan")
				.attr("font-style","italic")
				.text("I");
  }
  
  init_toy_problem();
}

function noisy_data1(){
  var width = 130;
  var height = 130;
  var space_x = 5;
  var space_y = 5;
  var space_size = 120;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  var colorBackgroundI = "rgb(95%,95%,95%)";
  var colorBackgroundJ = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";

  var init_theta = 0.95;
  
  var x_a = -0.8, x_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#noisy-data-input1");
	   
	// background
    var background = fig.append("svg")
    	   	  	        .attr("width", width)
			            .attr("height", height);

    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
			   
    // L_theta 1
    var g_theta1 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", space_scale(-2))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", space_scale(0))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 6)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 6)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));

	// L_theta 2
    var g_theta2 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)-3)
		    .attr("y1", space_scale(2))
		    .attr("x2", space_scale(0)-3)
		    .attr("y2", space_scale(0.08))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundI)
     	    .attr("stroke-opacity",1);
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)+3)
		    .attr("y1", space_scale(-0.08))
		    .attr("x2", space_scale(0)+3)
		    .attr("y2", space_scale(-2))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundJ)
     	    .attr("stroke-opacity",1);
			
    // noisy data point
	var p_a = 0.07, p_b = -0.07;
	image_space.append("circle")
	           .attr("cx",space_scale(p_a))
			   .attr("cy",space_scale(-p_b))
			   .attr("r",3)
			   .attr("fill", "rgb(50%,50%,50%)");
			   
	image_space.append("circle")
	           .attr("cx",space_scale(p_a))
			   .attr("cy",space_scale(-p_b))
			   .attr("r",2.5)
			   .attr("fill", d3.interpolateBlues(0.3));

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));

    // L_theta
	image_space.append("line")
			   .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")")
               .attr("x1", space_scale(0))
		       .attr("y1", space_scale(2))
		       .attr("x2", space_scale(0))
		       .attr("y2", space_scale(-2))
               .attr("stroke-width", 2.5)
	           .attr("stroke", orange)
     	       .attr("stroke-opacity",1);	   
				
    // gray labels	
    var gray_labels = image_space.append("g")
	                             .attr("fill", "rgb(60%,60%,60%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");
				
	gray_labels.append("text")
  	           .attr("text-anchor", "middle")
               .attr("x",space_scale(p_a)+10)
               .attr("y",space_scale(-p_b)+14)
               .text("p");
  }
  
  init_toy_problem(init_theta);
}

function noisy_data2(){
  var width = 130;
  var height = 130;
  var space_x = 5;
  var space_y = 5;
  var space_size = 120;
  var space_scale = d3.scaleLinear().domain([-1.,1.]).range([0, space_size]);
  var colorBackgroundI = "rgb(95%,95%,95%)";
  var colorBackgroundJ = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";

  var init_theta = 0.;
  
  var x_a = -0.8, x_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#noisy-data-input2");
	   
	// background
    var background = fig.append("svg")
    	   	  	        .attr("width", width)
			            .attr("height", height);

    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, 1.05, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, -1, -1, -1];
  
    for (var i = 0; i < 8; i++) {
	  background.append("line")
	            .attr('stroke',"rgb(0%,0%,0%)")
			    .attr("stroke-opacity",0.075)
			    .attr("stroke-width", 1)
                .attr("x1", space_x + space_scale(x1_array[i]))
	            .attr("y1", space_y + space_scale(y1_array[i]))
	            .attr("x2", space_x + space_scale(x2_array[i]))
	            .attr("y2", space_y + space_scale(y2_array[i]));
    }
  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(0))
	          .attr("y1", space_y + space_scale(-1))
	          .attr("x2", space_x + space_scale(0))
	          .attr("y2", space_y + space_scale(1.05));
			  
    background.append("line")
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1)
              .attr("x1", space_x + space_scale(-1.05))
	          .attr("y1", space_y + space_scale(0))
	          .attr("x2", space_x + space_scale(1))
	          .attr("y2", space_y + space_scale(0));
			  
    // image space
    var image_space = background.append("svg")
                                .attr("x",space_x)
			                    .attr("y",space_y)
    		                    .attr("width", space_size)
			                    .attr("height", space_size);
			   
    // L_theta 1
    var g_theta1 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
	
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundI)
            .attr("x", space_scale(-2))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			  
	g_theta1.append("rect")
	        .attr("fill",colorBackgroundJ)
            .attr("x", space_scale(0))
            .attr("y", space_scale(-2))
            .attr("width", space_size)
            .attr("height", 2*space_size);
			   
    // classes I and J
    image_space.append("line")
	           .attr("stroke-width", 6)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(50%,50%,50%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
			   .attr("stroke-linecap", "round")
               .attr("x1", space_scale(-0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(-1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.3));
		   
    image_space.append("line")
	           .attr("stroke-width", 6)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", "rgb(30%,30%,30%)");
			  
    image_space.append("line")
	           .attr("stroke-width", 5)
		       .attr("stroke-linecap", "round")
               .attr("x1", space_scale(0.2))
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(1))
	           .attr("y2", space_scale(0))
	           .attr("stroke", d3.interpolateBlues(0.7));

	// L_theta 2
    var g_theta2 = image_space.append("g")
                              .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")");
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)-3)
		    .attr("y1", space_scale(2))
		    .attr("x2", space_scale(0)-3)
		    .attr("y2", space_scale(0.08))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundI)
     	    .attr("stroke-opacity",1);
							 
    g_theta2.append("line")
            .attr("x1", space_scale(0)+3)
		    .attr("y1", space_scale(-0.08))
		    .attr("x2", space_scale(0)+3)
		    .attr("y2", space_scale(-2))
            .attr("stroke-width", 6)
	        .attr("stroke", colorBackgroundJ)
     	    .attr("stroke-opacity",1);
			
    // noisy data point
	var p_a = 0.07, p_b = -0.07;
	image_space.append("circle")
	           .attr("cx",space_scale(p_a))
			   .attr("cy",space_scale(-p_b))
			   .attr("r",3)
			   .attr("fill", "rgb(50%,50%,50%)");
			   
	image_space.append("circle")
	           .attr("cx",space_scale(p_a))
			   .attr("cy",space_scale(-p_b))
			   .attr("r",2.5)
			   .attr("fill", d3.interpolateBlues(0.3));

    // grid
    var x1_array = [-1.05, -1.05, -1.05, -1.05, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y1_array = [1, 0.5, -0.5, -1, 1.05, 1.05, -0.035, 1.05, -0.035, 1.05];
    var x2_array = [1, 1, 1, 1, -1, -0.5, -0.5, 0.5, 0.5, 1];
    var y2_array = [1, 0.5, -0.5, -1, -1, 0.035, -1, 0.035, -1, -1];
  
    for (var i = 0; i < 10; i++) {
	  image_space.append("line")
	             .attr('stroke',"rgb(0%,0%,0%)")
			     .attr("stroke-opacity",0.075)
			     .attr("stroke-width", 1)
                 .attr("x1", space_scale(x1_array[i]))
	             .attr("y1", space_scale(y1_array[i]))
	             .attr("x2", space_scale(x2_array[i]))
	             .attr("y2", space_scale(y2_array[i]));
    }
  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(0))
	           .attr("y1", space_scale(-1))
	           .attr("x2", space_scale(0))
	           .attr("y2", space_scale(1.05));
			  
    image_space.append("line")
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1)
               .attr("x1", space_scale(-0.2) + 4)
	           .attr("y1", space_scale(0))
	           .attr("x2", space_scale(0.2) - 4)
	           .attr("y2", space_scale(0));

    // L_theta
	image_space.append("line")
			   .attr("transform", "rotate("+ (90 * -theta) +","+ space_scale(0) +","+ space_scale(0) +")")
               .attr("x1", space_scale(0))
		       .attr("y1", space_scale(2))
		       .attr("x2", space_scale(0))
		       .attr("y2", space_scale(-2))
               .attr("stroke-width", 2.5)
	           .attr("stroke", orange)
     	       .attr("stroke-opacity",1);	   
				
    // gray labels	
    var gray_labels = image_space.append("g")
	                             .attr("fill", "rgb(60%,60%,60%)")
	                             .attr("font-family","Roboto")
	                             .attr("font-size", "15px");
				
	gray_labels.append("text")
  	           .attr("text-anchor", "middle")
               .attr("x",space_scale(p_a)+10)
               .attr("y",space_scale(-p_b)+14)
               .text("p");
  }
  
  init_toy_problem(init_theta);
}

function loss_functions() {
  var width = 180;
  var height = 120;
  var x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
  var y = d3.scaleLinear().domain([3, -1]).range([0, height]);
  
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
			
  var line = d3.line()
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

function large_norm_w() {
  var width = 180;
  var height = 120;
  var x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
  var y = d3.scaleLinear().domain([3, -1]).range([0, height]);
  var norm_w = 1.5;
  
  var dataA = [0., 0., 0.001, 0.001, 0.015, 0.02, 0.037, 0.089, 0.146, 0.186, 0.283, 0.419, 0.505, 0.679, 0.743, 0.706, 0.535, 0.331, 0.212, 0.054, 0.023, 0.005, 0.006, 0.003, 0., 0., 0., 0.001, 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
  var dataB = [0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.001, 0.003, 0.01, 0.019, 0.05, 0.437, 1.149, 1.504, 1.048, 0.508, 0.181, 0.06, 0.023, 0.005, 0.002, 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
  
  function fig3_init() {
    var fig3_subfig2 = d3.select("#value-w-input1")
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
                .attr("width", 5)
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
                .attr("width", 5)
                .attr("height", function(d) {return d * height / 3.6;})
			    .style("stroke-width", 0.3)
                .style("stroke", "rgb(20%, 20%, 20%)")
			    .style("fill-opacity", 0.2)
			    .style("fill", "rgb(36.84%,50.68%,70.98%)");
				
	fig3_subfig2.append("path")
				.attr("d", "M " + x(-4) + " " + y(1 + Math.pow(10,norm_w) * 4) + " L " + x(1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(4) + " " + y(0))
                .style("stroke", "rgb(36.84%,50.68%,70.98%)")
                .style("stroke-width", 2)
                .style("fill", "none");
				
	fig3_subfig2.append("path")
				.attr("d", "M " + x(-4) + " " + y(0) + " L " + x(-1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(4) + " " + y(1 + Math.pow(10,norm_w) * 4))
                .style("stroke", "rgb(88.07%, 61.10%, 14.21%)")
                .style("stroke-width", 2)
                .style("fill", "none");
  }
  fig3_init();
}

function small_norm_w() {
  var width = 180;
  var height = 120;
  var x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
  var y = d3.scaleLinear().domain([3, -1]).range([0, height]);
  var norm_w = -1;
  
  var dataA = [0., 0., 0.001, 0.001, 0.015, 0.02, 0.037, 0.089, 0.146, 0.186, 0.283, 0.419, 0.505, 0.679, 0.743, 0.706, 0.535, 0.331, 0.212, 0.054, 0.023, 0.005, 0.006, 0.003, 0., 0., 0., 0.001, 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
  var dataB = [0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.001, 0.003, 0.01, 0.019, 0.05, 0.437, 1.149, 1.504, 1.048, 0.508, 0.181, 0.06, 0.023, 0.005, 0.002, 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
  
  function fig3_init() {
    var fig3_subfig2 = d3.select("#value-w-input2")
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
                .attr("width", 5)
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
                .attr("width", 5)
                .attr("height", function(d) {return d * height / 3.6;})
			    .style("stroke-width", 0.3)
                .style("stroke", "rgb(20%, 20%, 20%)")
			    .style("fill-opacity", 0.2)
			    .style("fill", "rgb(36.84%,50.68%,70.98%)");
				
	fig3_subfig2.append("path")
				.attr("d", "M " + x(-4) + " " + y(1 + Math.pow(10,norm_w) * 4) + " L " + x(1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(4) + " " + y(0))
                .style("stroke", "rgb(36.84%,50.68%,70.98%)")
                .style("stroke-width", 2)
                .style("fill", "none");
				
	fig3_subfig2.append("path")
				.attr("d", "M " + x(-4) + " " + y(0) + " L " + x(-1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(4) + " " + y(1 + Math.pow(10,norm_w) * 4))
                .style("stroke", "rgb(88.07%, 61.10%, 14.21%)")
                .style("stroke-width", 2)
                .style("fill", "none");
  }
  fig3_init();
}

function fig3() {
  var width = 240;
  var height = 160;
  var x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
  var y = d3.scaleLinear().domain([3, -1]).range([0, height]);
  var init_w = 0.5;
  
  var dataA = [0., 0., 0.001, 0.001, 0.015, 0.02, 0.037, 0.089, 0.146, 0.186, 0.283, 0.419, 0.505, 0.679, 0.743, 0.706, 0.535, 0.331, 0.212, 0.054, 0.023, 0.005, 0.006, 0.003, 0., 0., 0., 0.001, 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
  var dataB = [0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.001, 0.003, 0.01, 0.019, 0.05, 0.437, 1.149, 1.504, 1.048, 0.508, 0.181, 0.06, 0.023, 0.005, 0.002, 0., 0., 0., 0., 0., 0., 0., 0., 0., 0.];
  var line = d3.line()
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
    d3.select("#fig3-value-w").text(parseFloat(init_w-0.5).toFixed(2));	  
	  
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
	  
   d3.select("#fig3-value-w").text(parseFloat(norm_w-0.5).toFixed(2));   
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

function img_to_canvas2(img) {
  var s = d3.scaleLinear().domain([-1, 1]).range([10, 245]);
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

function fig4() {
  var width = 420;
  var height = 280;
  var x = d3.scaleLinear().domain([-21,21]).range([0, width]);
  var y = d3.scaleLinear().domain([14,-14]).range([0, height]);
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
    d3.queue().defer(d3.text,"assets/data/data0_"+digit0+digit1+".csv")
              .defer(d3.text,"assets/data/data1_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/extras_"+digit0+digit1+".csv")
              .defer(d3.text,"assets/data/w_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/x_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/xm_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/y_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/ym_"+digit0+digit1+".csv")
              .await(draw_all);

    function draw_all(error, text_data0, text_data1, text_extras, text_w, text_x, text_xm, text_y, text_ym) { //
      var data0 = d3.csvParseRows(text_data0).map(function(row) {return row.map(function(value) {return +value;});});
	  var data1 = d3.csvParseRows(text_data1).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csvParseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});	// m b w1 w2 x1 x2 y1 y2 xm1 xm2 ym1 ym2
	  var w = d3.csvParseRows(text_w).map(function(row) {return row.map(function(value) {return +value;});});
	  var imx = d3.csvParseRows(text_x).map(function(row) {return row.map(function(value) {return +value;});});
	  var imxm = d3.csvParseRows(text_xm).map(function(row) {return row.map(function(value) {return +value;});});
	  var imy = d3.csvParseRows(text_y).map(function(row) {return row.map(function(value) {return +value;});});
	  var imym = d3.csvParseRows(text_ym).map(function(row) {return row.map(function(value) {return +value;});});

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


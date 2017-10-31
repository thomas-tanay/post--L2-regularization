function abstract_fig(){
  var width = 816;
  var space_width = 408;
  var height = 2/3*space_width+1;
  var x = d3.scaleLinear().domain([-24,24]).range([0, height*3/2]);
  var y = d3.scaleLinear().domain([16,-16]).range([0, height]);
  var left_digit = 2;
  var right_digit = 3;
  var left_color = d3.interpolateBlues(0.3); //rgb(181, 212, 233)
  var right_color = d3.interpolateBlues(0.7); //rgb(47, 126, 188)
  var orange = "rgb(255,102,0)";
  var side_boxes_color = "rgb(95%, 95%, 95%)";
  var reg_index = 40;
  var animationRunning = false;
  var requestId;
  
  function draw_fig(digit0, digit1) {
    d3.queue().defer(d3.text,"assets/data/data0_"+digit0+digit1+".csv")
              .defer(d3.text,"assets/data/data1_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/extras_"+digit0+digit1+".csv")
              .await(draw_all);

    function draw_all(error, text_data0, text_data1, text_extras) {
	  
      var data0 = d3.csvParseRows(text_data0).map(function(row) {return row.map(function(value) {return +value;});});
	  var data1 = d3.csvParseRows(text_data1).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csvParseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});
	  
      var fig = d3.select("#abstract-fig")
				  .style("position","relative");
	  
      var layer1 = fig.append("svg")
	                  .style("position","absolute")
					  .style("top", "0px")
					  .style("left", (width-space_width)/2 + "px")
                      .attr("width", space_width)
                      .attr("height", height);
	  
      var layer2 = fig.append("canvas")
					  .style("position","absolute")
					  .style("top", "0px")
					  .style("left", (width-space_width)/2 + "px")
                      .attr("width", space_width)
                      .attr("height", height);
	  var ctx_layer2 = layer2.node().getContext("2d");
	  
      var layer3 = fig.append("svg")
	                  .style("position","absolute")
					  .style("top", "0px")
					  .style("left", (width-space_width)/2 + "px")
                      .attr("width", space_width)
                      .attr("height", height);
      var d_adv_line = layer3.append("line");
      var d_adv_arrow1 = layer3.append("path");
      var d_adv_arrow2 = layer3.append("path");
      var d_adv_text =layer3.append("text");
	  
      var layer4 = fig.append("svg")
	                  .style("position","absolute")
					  .style("top", "0px")
					  .style("left", "0px")
                      .attr("width", width)
                      .attr("height", height);
	  
      var container = fig.append("custom");
	  
      var im_size = 90;
      var mean2_x = 0, mean3_x = 0;
      for(var i=0; i < 1500; i++){
        mean2_x += data0[i][0];
		mean3_x += data1[i][0];
      }
	  mean_x = (mean3_x-mean2_x)/3000;
      mean2_x = (width-space_width)/2 + x(-mean_x);
	  mean3_x = (width-space_width)/2 + x(mean_x);
		
	  var mean2_y = y(0), mean3_y = y(0);
	  var mean2_im_x = (width - space_width)/4, mean2_im_y = height/2;  
	  var mean3_im_x = space_width + 3*(width - space_width)/4, mean3_im_y = height/2;
	  
	  var theta = extras[0][80-reg_index];
	  
	  function init_canvas() {	
        container.selectAll("circle0")
                 .data(data0)
	             .enter()
	             .append("circle0")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[80-reg_index+1]);})
		         .attr("r", 0.75)
	             .attr("lineWidth", 0.6)
                 .attr("strokeStyle", left_color)
			     .attr("fillStyle", left_color);
  				 
	    container.selectAll("circle1")
                 .data(data1)
		         .enter()
		         .append("circle1")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[80-reg_index+1]);})
		         .attr("r", 0.75)
			     .attr("lineWidth", 0.6)
                 .attr("strokeStyle", right_color)
			     .attr("fillStyle", right_color);
	  }
	  
	  function draw_layer1() {
        layer1.append("rect")
              .attr("fill","rgb(98%,98%,98%)")
			  .attr("x", 0)
              .attr("y", 0)
              .attr("width", space_width)
              .attr("height", height);
	  }

      function draw_layer2() {
        ctx_layer2.clearRect(0, 0, space_width, height);
	
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
	          .attr("id","abstract-d-adv-margin")
              .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	          .attr("fill", "rgba(0,0,0,0.07)")
              .attr("x", x(-mean_x*Math.cos(theta)))
              .attr("y", -200)
              .attr("width", 2*(x(mean_x*Math.cos(theta))-x(0)))
              .attr("height", width+200);
		
		var d_adv_width = 2*mean_x*Math.cos(theta);
		var anchor_x = -mean_x + 13*Math.tan(theta);
		var anchor_y = -13;
        d_adv_line.attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
	              .attr("stroke","rgb(40%,40%,40%)")
		          .attr("stroke-width",0.5)
		          .style("stroke-dasharray", ("2, 1"))
                  .attr("x1", x(anchor_x))
                  .attr("y1", y(anchor_y))
                  .attr("x2", x(anchor_x + d_adv_width))
                  .attr("y2", y(anchor_y));
				  
        d_adv_arrow1.attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
			        .attr("d","M "+ (x(anchor_x)+5) +" "+ (y(anchor_y)+3) +" L "+ x(anchor_x) +" "+ y(anchor_y) +" L "+ (x(anchor_x)+5) +" "+ (y(anchor_y)-3))
                    .style("stroke-width", 0.5)
                    .style("stroke", "rgb(40%,40%,40%)")
                    .style("fill", "none");
			  
        d_adv_arrow2.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
			        .attr("d","M "+ (x(anchor_x+d_adv_width)-5) +" "+ (y(anchor_y)+3) +" L "+ x(anchor_x+d_adv_width) +" "+ y(anchor_y) +" L "+ (x(anchor_x+d_adv_width)-5) +" "+ (y(anchor_y)-3))
                    .style("stroke-width", 0.5)
                    .style("stroke", "rgb(40%,40%,40%)")
                    .style("fill", "none");
					
        d_adv_text.attr("fill", "rgb(60%,60%,60%)")
	              .attr("font-family","Roboto")
	              .attr("font-size", "13px")
	              .attr("text-anchor", "end")
			      .attr("font-style", "italic")
                  .attr("x", x(anchor_x)-10)
	              .attr("y", y(anchor_y)+10)
		          .text("2 d")
	              .append("tspan")
                  .attr("font-size", "10px")
                  .attr("dx", "1px")
                  .attr("dy", "4px")
	              .text("adv");
			   
	    layer3.append("line")
	          .attr("id","abstract-boundary")
              .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	          .attr("stroke",orange)
			  .attr("stroke-width",2.5)
              .attr("x1", x(-extras[1][80-reg_index]))
              .attr("y1", -200)
              .attr("x2", x(-extras[1][80-reg_index]))
              .attr("y2", width+200);
	  }

	  function draw_layer4() {
        layer4.append("rect")
              .attr("fill",side_boxes_color)
			  .attr("x", 1)
              .attr("y", 0)
              .attr("width", (width - space_width)/2)
              .attr("height", height);
			  
        layer4.append("rect")
              .attr("fill",side_boxes_color)
			  .attr("x", (width - space_width)/2 + space_width - 1)
              .attr("y", 0)
              .attr("width", (width - space_width)/2 + 1)
              .attr("height", height);
			 
        layer4.append("rect")
              .attr("fill","none")
			   .attr("stroke-width", 1.5)
			   .attr("stroke", "rgb(60%,60%,60%)")
			  .attr("x", (width - space_width)/2 - 1)
              .attr("y", -5)
              .attr("width", space_width)
              .attr("height", height+10);
			  
	    layer4.append("circle")
	           .attr("cx", mean2_im_x)
		       .attr("cy", mean2_im_y)
		       .attr("r", 0.6*im_size)
			   .attr("stroke-width", 1)
			   .attr("stroke", "rgb(30%,30%,30%)")
		       .attr("fill", "rgb(100%,100%,100%)");
			  
	    layer4.append("circle")
	           .attr("cx", mean3_im_x)
		       .attr("cy", mean3_im_y)
		       .attr("r", 0.6*im_size)
			   .attr("stroke-width", 1)
			   .attr("stroke", "rgb(30%,30%,30%)")
		       .attr("fill", "rgb(100%,100%,100%)");
		  
		layer4.append("image")
		      .attr("x",mean2_im_x - im_size/2)
			  .attr("y",mean2_im_y - im_size/2)
			  .attr("width", im_size)
			  .attr("height", im_size)
			  .attr("xlink:href","assets/mean2_white.png")
			  
		layer4.append("image")
		      .attr("x",mean3_im_x - im_size/2)
			  .attr("y",mean3_im_y - im_size/2)
			  .attr("width", im_size)
			  .attr("height", im_size)
			  .attr("xlink:href","assets/mean3_white.png")
		
	    layer4.append("circle")
	           .attr("cx", mean2_im_x)
		       .attr("cy", mean2_im_y)
		       .attr("r", 0.6*im_size + 5)
			   .attr("stroke-width", 10)
			   .attr("stroke", side_boxes_color)
		       .attr("fill", "none");
		
	    layer4.append("circle")
	           .attr("cx", mean3_im_x)
		       .attr("cy", mean3_im_y)
		       .attr("r", 0.6*im_size + 5)
			   .attr("stroke-width", 10)
			   .attr("stroke", side_boxes_color)
		       .attr("fill", "none");
		  
	    layer4.append("circle")
	           .attr("cx", mean2_x)
		       .attr("cy", mean2_y)
		       .attr("r", 3.5)
			   .attr("stroke-width", 1.5)
			   .attr("stroke", "rgb(30%,30%,30%)")
		       .attr("fill", "rgb(100%,100%,100%)");
			   
	    layer4.append("circle")
	           .attr("cx", mean3_x)
		       .attr("cy", mean3_y)
		       .attr("r", 3.5)
			   .attr("stroke-width", 1.5)
			   .attr("stroke", "rgb(30%,30%,30%)")
		       .attr("fill", "rgb(100%,100%,100%)");
			   
	    layer4.append("circle")
	           .attr("cx", mean2_im_x)
		       .attr("cy", mean2_im_y)
		       .attr("r", 0.6*im_size)
			   .attr("stroke-width", 2)
			   .attr("stroke", "rgb(30%,30%,30%)")
			   .attr("fill", "none");
			   
	    layer4.append("circle")
	           .attr("cx", mean3_im_x)
		       .attr("cy", mean3_im_y)
		       .attr("r", 0.6*im_size)
			   .attr("stroke-width", 2)
			   .attr("stroke", "rgb(30%,30%,30%)")
			   .attr("fill", "none");
			   
	    layer4.append("line")
	          .attr("stroke", "rgb(30%,30%,30%)")
			  .attr("stroke-width", 1.5)
			  .style("stroke-dasharray", ("6, 3"))
              .attr("x1", mean2_im_x + 0.6*im_size)
              .attr("y1", mean2_im_y)
              .attr("x2", mean2_x - 3.5)
              .attr("y2", mean2_y);
			  
	    layer4.append("line")
	          .attr("stroke", "rgb(30%,30%,30%)")
			  .attr("stroke-width", 1.5)
			  .style("stroke-dasharray", ("6, 3"))
              .attr("x1", mean3_im_x - 0.6*im_size)
              .attr("y1", mean3_im_y)
              .attr("x2", mean3_x + 3.5)
              .attr("y2", mean3_y);
		
		layer4.append("polygon")
		      .attr("points", (mean3_x+3.5) +","+ y(0) +" "+ (mean3_x+3.5+10) +","+ (y(0)+4) +" "+ (mean3_x+3.5+6) +","+ y(0) +" "+(mean3_x+3.5+10) +","+ (y(0)-4))
  	          .attr("stroke-width", 1)
  	          .attr("stroke", "rgb(30%,30%,30%)")
			  .attr("fill", "rgb(30%,30%,30%)");
			  
		layer4.append("polygon")
		      .attr("points", (mean2_x-3.5) +","+ y(0) +" "+ (mean2_x-3.5-10) +","+ (y(0)+4) +" "+ (mean2_x-3.5-6) +","+ y(0) +" "+(mean2_x-3.5-10) +","+ (y(0)-4))
  	          .attr("stroke-width", 1)
  	          .attr("stroke", "rgb(30%,30%,30%)")
			  .attr("fill", "rgb(30%,30%,30%)");
	  }
	  
	  function update() {
		theta = extras[0][80-reg_index];
		  
        container.selectAll("circle0")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});

	    container.selectAll("circle1")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});
		
		d3.select("#abstract-d-adv-margin")
          .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
          .attr("x", x(-mean_x*Math.cos(theta)))
          .attr("width", 2*(x(mean_x*Math.cos(theta))-x(0)));
		
		var d_adv_width = 2*mean_x*Math.cos(theta);
       	var anchor_x = -mean_x + 13*Math.tan(theta);
		var anchor_y = -13;
		if (anchor_x > 20) {
		  anchor_x = 20;
		  anchor_y = - (mean_x+20)/Math.tan(theta);
		}
        d_adv_line.attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
                  .attr("x1", x(anchor_x))
                  .attr("y1", y(anchor_y))
                  .attr("x2", x(anchor_x + d_adv_width))
                  .attr("y2", y(anchor_y));
				  
        d_adv_arrow1.attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
			        .attr("d","M "+ (x(anchor_x)+5) +" "+ (y(anchor_y)+3) +" L "+ x(anchor_x) +" "+ y(anchor_y) +" L "+ (x(anchor_x)+5) +" "+ (y(anchor_y)-3));
			  
        d_adv_arrow2.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
			        .attr("d","M "+ (x(anchor_x+d_adv_width)-5) +" "+ (y(anchor_y)+3) +" L "+ x(anchor_x+d_adv_width) +" "+ y(anchor_y) +" L "+ (x(anchor_x+d_adv_width)-5) +" "+ (y(anchor_y)-3));

        d_adv_text.attr("x", x(anchor_x)-10)
	              .attr("y", y(anchor_y)+10);
		  
		d3.select("#abstract-boundary")
          .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
          .attr("x1", x(-extras[1][80-reg_index]))
          .attr("x2", x(-extras[1][80-reg_index]))	
				 
	    d3.select("#abstract_err_train").text("\u00A0\u00A0" + parseFloat(extras[4][80-reg_index]).toFixed(1) + "%");
	    d3.select("#abstract_adv_distance").text("\u00A0\u00A0" + parseFloat(extras[3][80-reg_index]).toFixed(1));
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
	  
	  d3.select("#abstract_err_train").text("\u00A0\u00A0" + parseFloat(extras[4][80-reg_index]).toFixed(1) + "%");
	  d3.select("#abstract_adv_distance").text("\u00A0\u00A0" + parseFloat(extras[3][80-reg_index]).toFixed(1));
	  
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
			   
	gray_labels.append("text")
	           .attr("text-anchor", "middle")
	           .attr("id","toy-problem1-text")
               .attr("x", space_x + space_scale(a))
	           .attr("y", space_y + space_scale(-b) + 20)
               .text("("+parseFloat(a).toFixed(1)+", "+parseFloat(b).toFixed(1)+")");
			
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
  var height = 350;
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
  var height = 350;
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
  
  function translate_x(theta) {return Math.min((space_scale(-0.8)-space_scale(0)) * Math.tan(Math.PI/2 * -theta), space_size/2);}
  function translate_y(theta) {return Math.min((space_scale(-0.8)-space_scale(0)) - space_size/2 / Math.tan(Math.PI/2 * -theta), 0);}
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#toy-problem3");
	fig.style("position","relative");
	   
	// background
    var background = fig.append("svg")
	                    .style("position","absolute")
	                    .style("top", "0px")
	                    .style("left", "0px")
    	   	  	        .attr("width", width)
			            .attr("height", height);
						
    // controler
	fig.append("input")
	   .style("position","absolute")
	   .style("top", "90px")
	   .style("left", "350px")
	   .attr("id","toy-problem3-input")
	   .attr("type","range")
	   .attr("min",0)
	   .attr("max",0.99)
	   .attr("step",0.01)
	   .attr("value", theta);

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
		       .text("The line ")
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
			   .text(" defined by its normal");	
			    
	gray_labels.append("text")
	           .attr("text-anchor", "start")
			   .attr("font-size", "15px")
               .attr("x", theta_x)
	           .attr("y", theta_y + 150)
		       .text("weight vector ")
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
  	        .attr("fill", orange)
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
  var height = 350;
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
  
  function translate_x(theta) {return Math.min((space_scale(-0.8)-space_scale(0)) * Math.tan(Math.PI/2 * -theta), space_size/2);}
  function translate_y(theta) {return Math.min((space_scale(-0.8)-space_scale(0)) - space_size/2 / Math.tan(Math.PI/2 * -theta), 0);}
  
  var x_a = -0.8, x_b = 0;
  var xm_a = x_a * (1 - 2 * Math.cos(Math.PI/2 * init_theta) * Math.cos(Math.PI/2 * init_theta));
  var xm_b = - 2 * x_a * Math.cos(Math.PI/2 * init_theta) * Math.sin(Math.PI/2 * init_theta);
  
  function init_toy_problem(theta){
	  
    var fig = d3.select("#toy-problem4");
	fig.style("position","relative");
	   
	// background
    var background = fig.append("svg")
	                    .style("position","absolute")
	                    .style("top", "0px")
	                    .style("left", "0px")
    	   	  	        .attr("width", width)
			            .attr("height", height);
						
    // controler
	fig.append("input")
	   .style("position","absolute")
	   .style("top", "90px")
	   .style("left", "350px")
	   .attr("id","toy-problem4-input")
	   .attr("type","range")
	   .attr("min",0)
	   .attr("max",0.99)
	   .attr("step",0.01)
	   .attr("value", theta);

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
  	        .attr("fill", orange)
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
  var height = 350;
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
				.text("wrongly labelled in ")
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
			   .attr("font-style", "italic")
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
			   .attr("font-style", "italic")
               .attr("x",space_scale(p_a)+10)
               .attr("y",space_scale(-p_b)+14)
               .text("p");
  }
  
  init_toy_problem(init_theta);
}

function sx() {
  var width = 201;
  var height = 134;
  var x = d3.scaleLinear().domain([-3, 3]).range([0, width]);
  var y = d3.scaleLinear().domain([3, -0.5]).range([0, height/2]);
  var left_color = d3.interpolateBlues(0.3);
  var right_color = d3.interpolateBlues(0.7);
  var light_left_color = "rgb(95%,95%,95%)";
  var light_right_color = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";

  var dataA = [0,0,0,0,0,0,0,0,0,0,0,0.002,0.005,0.023,0.06,0.181,0.508,1.048,1.504,1.149,0.437,0.05,0.019,0.01,0.003,0.001,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var dataB = [0,0,0,0,0,0,0,0,0,0.001,0,0,0,0.003,0.006,0.005,0.023,0.054,0.212,0.331,0.535,0.706,0.743,0.679,0.505,0.419,0.283,0.186,0.146,0.089,0.037,0.02,0.015,0.001,0.001,0,0,0,0,0];
			   
  var plot = d3.select("#sx")
               .append("svg")
    	   	   .attr("width", width)
			   .attr("height", height);
					 
  plot.append("rect")
      .attr("fill","rgb(98%,98%,98%)")
	  .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);
  
  plot.append("line")
      .attr("x1", x(-4))
	  .attr("y1", y(0))
	  .attr("x2", x(4))
	  .attr("y2", y(0))
	  .attr('stroke',"rgb(0%,0%,0%)")
	  .attr("stroke-opacity",0.2)
	  .attr("stroke-width", 1);
	   
  plot.append("line")
      .attr("x1", x(-4))
	  .attr("y1", y(0)+height/2)
	  .attr("x2", x(4))
	  .attr("y2", y(0)+height/2)
	  .attr('stroke',"rgb(0%,0%,0%)")
	  .attr("stroke-opacity",0.2)
	  .attr("stroke-width", 1);
	   
  plot.selectAll("rect0")
      .data(dataA)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {return x(i * 0.2 - 4);})
      .attr("y", function(d) {return y(0) - d * height / 4;})
      .attr("width", 6.5)
      .attr("height", function(d) {return d * height / 4;})
      .style("stroke-width", 0.3)
      .style("stroke", "rgb(30%, 30%, 30%)")
      .style("fill-opacity", 1)
      .style("fill", left_color);
	   
  plot.selectAll("rect0")
      .data(dataB)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {return x(i * 0.2 - 4);})
      .attr("y", function(d) {return y(0) - d * height / 4 + height/2;})
      .attr("width", 6.5)
      .attr("height", function(d) {return d * height / 4;})
      .style("stroke-width", 0.3)
      .style("stroke", "rgb(10%, 10%, 10%)")
      .style("fill-opacity", 1)
      .style("fill", right_color);

  plot.append("line")
      .attr("x1", x(0))
	  .attr("y1", y(-5))
	  .attr("x2", x(0))
	  .attr("y2", y(5))
	  .attr('stroke',orange)
	  .attr("stroke-opacity",1)
	  .attr("stroke-width", 2.5);
			  
  // gray labels
  var gray_labels = plot.append("g")
	                    .attr("fill", "rgb(60%,60%,60%)")
	                    .attr("font-family","Roboto")
	                    .attr("font-size", "13px");
								
  gray_labels.append("text")
	         .attr("text-anchor", "middle")
             .attr("x", width/5)
	         .attr("y", height/5)
	         .text("Class ")
	         .append("tspan")
		     .attr("font-style", "italic")
			 .text("I");
			   
  gray_labels.append("text")
	         .attr("text-anchor", "middle")
             .attr("x", 4*width/5)
	         .attr("y", 3.5*height/5)
	         .text("Class ")
	         .append("tspan")
			 .attr("font-style", "italic")
			 .text("J");
}

function ysx() {
  var width = 201;
  var height = 134;
  var x = d3.scaleLinear().domain([-6, 6]).range([0, width]);
  var y = d3.scaleLinear().domain([6, -1]).range([0, height]);
  var left_color = d3.interpolateBlues(0.3);
  var right_color = d3.interpolateBlues(0.7);
  var light_left_color = "rgb(95%,95%,95%)";
  var light_right_color = "rgb(85%,85%,85%)";
  var orange = "rgb(255,102,0)";

  var dataA = [0,0,0,0,0,0,0,0,0,0,0,0.002,0.005,0.023,0.06,0.181,0.508,1.048,1.504,1.149,0.437,0.05,0.019,0.01,0.003,0.001,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var dataB = [0,0,0,0,0,0,0,0,0,0.001,0,0,0,0.003,0.006,0.005,0.023,0.054,0.212,0.331,0.535,0.706,0.743,0.679,0.505,0.419,0.283,0.186,0.146,0.089,0.037,0.02,0.015,0.001,0.001,0,0,0,0,0];
  var data = [dataA.slice().reverse(), dataB];
  data = data[0].map(function(col, i) { return data.map(function(row) { return row[i] })});
			   
  var plot = d3.select("#ysx")
               .append("svg")
    	   	   .attr("width", width)
			   .attr("height", height);
					 
  plot.append("rect")
      .attr("fill","rgb(98%,98%,98%)")
	  .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);
  
  plot.append("line")
      .attr("x1", x(-8))
	  .attr("y1", y(0))
	  .attr("x2", x(8))
	  .attr("y2", y(0))
	  .attr('stroke',"rgb(0%,0%,0%)")
	  .attr("stroke-opacity",0.2)
	  .attr("stroke-width", 1);
	   
  plot.selectAll("rect0")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {return x(i * 0.4 - 8);})
      .attr("y", function(d) {return y(0) - d[1] * height / 4 - d[0] * height / 4;})
      .attr("width", 6.5)
      .attr("height", function(d) {return d[0] * height / 4;})
      .style("stroke-width", 0.3)
      .style("stroke", "rgb(30%, 30%, 30%)")
      .style("fill-opacity", 1)
      .style("fill", left_color);
	   
  plot.selectAll("rect1")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {return x(i * 0.4 - 8);})
      .attr("y", function(d) {return y(0) - d[1] * height / 4;})
      .attr("width", 6.5)
      .attr("height", function(d) {return d[1] * height / 4;})
      .style("stroke-width", 0.3)
      .style("stroke", "rgb(10%, 10%, 10%)")
      .style("fill-opacity", 1)
      .style("fill", right_color);
	   
  plot.append("line")
      .attr("x1", x(0))
	  .attr("y1", y(-2))
	  .attr("x2", x(0))
	  .attr("y2", y(8))
	  .attr('stroke', orange)
	  .attr("stroke-opacity", 1)
	  .attr("stroke-width", 2.5);
			  
  // gray labels
  var gray_labels = plot.append("g")
	                    .attr("fill", "rgb(60%,60%,60%)")
	                    .attr("font-family","Roboto")
	                    .attr("font-size", "13px");
								
  gray_labels.append("text")
	         .attr("text-anchor", "middle")
             .attr("x", width/5)
	         .attr("y", height/5)
	         .text("mis-");
			
  gray_labels.append("text")
	         .attr("text-anchor", "middle")
             .attr("x", width/5)
	         .attr("y", height/5+20)
	         .text("classified");
			 
  gray_labels.append("text")
	         .attr("text-anchor", "middle")
             .attr("x", width/5)
	         .attr("y", height/5+40)
	         .text("data");
			   
  gray_labels.append("text")
	         .attr("text-anchor", "middle")
             .attr("x", 4*width/5)
	         .attr("y", height/5)
	         .text("correctly");
			 
  gray_labels.append("text")
	         .attr("text-anchor", "middle")
             .attr("x", 4*width/5)
	         .attr("y", height/5+20)
	         .text("classified");
			 
  gray_labels.append("text")
	         .attr("text-anchor", "middle")
             .attr("x", 4*width/5)
	         .attr("y", height/5+40)
	         .text("data");
}

function fysx() {
  var width = 201;
  var height = 134;
  var x = d3.scaleLinear().domain([-6, 6]).range([0, width]);
  var y = d3.scaleLinear().domain([6, -1]).range([0, height]);
  var left_color = d3.interpolateBlues(0.3);
  var right_color = d3.interpolateBlues(0.7);
  var light_left_color = "rgb(90%,90%,90%)";
  var light_right_color = "rgb(80%,80%,80%)";
  var blue = d3.interpolateBlues(0.7);
  var orange = "rgb(255,102,0)";

  var dataA = [0,0,0,0,0,0,0,0,0,0,0,0.002,0.005,0.023,0.06,0.181,0.508,1.048,1.504,1.149,0.437,0.05,0.019,0.01,0.003,0.001,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var dataB = [0,0,0,0,0,0,0,0,0,0.001,0,0,0,0.003,0.006,0.005,0.023,0.054,0.212,0.331,0.535,0.706,0.743,0.679,0.505,0.419,0.283,0.186,0.146,0.089,0.037,0.02,0.015,0.001,0.001,0,0,0,0,0];
  var data = [dataA.slice().reverse(), dataB];
  data = data[0].map(function(col, i) { return data.map(function(row) { return row[i] })});
			   
  var plot = d3.select("#fysx")
               .append("svg")
    	   	   .attr("width", width)
			   .attr("height", height);
					 
  plot.append("rect")
      .attr("fill","rgb(98%,98%,98%)")
	  .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);
  
  plot.append("line")
      .attr("x1", x(-8))
	  .attr("y1", y(0))
	  .attr("x2", x(8))
	  .attr("y2", y(0))
	  .attr('stroke',"rgb(0%,0%,0%)")
	  .attr("stroke-opacity",0.2)
	  .attr("stroke-width", 1);
	   
  plot.selectAll("rect0")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {return x(i * 0.4 - 8);})
      .attr("y", function(d) {return y(0) - d[1] * height / 4 - d[0] * height / 4;})
      .attr("width", 6.5)
      .attr("height", function(d) {return d[0] * height / 4;})
      .style("stroke-width", 0.3)
      .style("stroke", "rgb(30%, 30%, 30%)")
      .style("fill-opacity", 1)
      .style("fill", light_left_color);
	   
  plot.selectAll("rect1")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {return x(i * 0.4 - 8);})
      .attr("y", function(d) {return y(0) - d[1] * height / 4;})
      .attr("width", 6.5)
      .attr("height", function(d) {return d[1] * height / 4;})
      .style("stroke-width", 0.3)
      .style("stroke", "rgb(10%, 10%, 10%)")
      .style("fill-opacity", 1)
      .style("fill", light_right_color);
	   
  plot.append("line")
      .attr("x1", x(0))
	  .attr("y1", y(-2))
	  .attr("x2", x(0))
	  .attr("y2", y(8))
	  .attr('stroke', orange)
	  .attr("stroke-opacity", 1)
	  .attr("stroke-width", 2.5);
	  
  plot.append("path")
	  .attr("d", "M " + x(-8) + " " + y(1) + " L " + x(0) + " " + y(1) + "M " + x(0) + " " + y(0) + " L " + x(8) + " " + y(0))
      .style("stroke", blue)
      .style("stroke-width", 2)
      .style("fill", "none");
			  
  plot.append("text")
	  .attr("fill", blue)
	  .attr("font-family","Roboto")
	  .attr("font-size", "15px")
	  .attr("text-anchor", "middle")
	  .attr("font-style","italic")
      .attr("x", x(-5.5))
	  .attr("y", y(1.5))
	  .text("f");
}

function loss_functions() {
  var width = 201;
  var height = 134;
  var x = d3.scaleLinear().domain([-6, 6]).range([0, width]);
  var y = d3.scaleLinear().domain([6, -1]).range([0, height]);
  var blue = d3.interpolateBlues(0.7);
  
  var indicator_01 = d3.select("#indicator-01")
                       .append("svg")
	                   .attr("width", width)
		               .attr("height", height);
					   
  indicator_01.append("rect")
              .attr("fill","rgb(98%,98%,98%)")
			  .attr("x", 0)
              .attr("y", 0)
              .attr("width", width+1)
              .attr("height", height+1);
  
  indicator_01.append("line")
              .attr("x1", x(-8))
	          .attr("y1", y(0))
	          .attr("x2", x(8))
	          .attr("y2", y(0))
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1);

  indicator_01.append("line")
              .attr("x1", x(0))
	          .attr("y1", y(-2))
	          .attr("x2", x(0))
	          .attr("y2", y(8))
	          .attr('stroke',"rgb(0%,0%,0%)")
			  .attr("stroke-opacity",0.2)
			  .attr("stroke-width", 1);
			 
  indicator_01.append("path")
		      .attr("d", "M " + x(-8) + " " + y(1) + " L " + x(0) + " " + y(1) + "M " + x(0) + " " + y(0) + " L " + x(8) + " " + y(0))
              .style("stroke", blue)
              .style("stroke-width", 2)
              .style("fill", "none");
			  
  indicator_01.append("line")
	          .attr("stroke-width", 1)
	          .attr("stroke", blue)
              .attr("x1", x(1))
	          .attr("y1", y(-0.1))
	          .attr("x2", x(1))
	          .attr("y2", y(0.1));
				
  indicator_01.append("text")
              .attr("x",x(1))
              .attr("y",y(-0.7))
  	          .attr("text-anchor", "middle")
	          .attr("font-family","Roboto")
	          .attr("font-size", "10px")
	          .attr("fill", blue)
              .text("1");
			  
  var hinge_loss = d3.select("#hinge-loss")
                     .append("svg")
	                 .attr("width", width)
		             .attr("height", height);
					 
  hinge_loss.append("rect")
            .attr("fill","rgb(98%,98%,98%)")
			.attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height);
  
  hinge_loss.append("line")
            .attr("x1", x(-8))
	        .attr("y1", y(0))
	        .attr("x2", x(8))
	        .attr("y2", y(0))
	        .attr('stroke',"rgb(0%,0%,0%)")
		    .attr("stroke-opacity",0.2)
			.attr("stroke-width", 1);

  hinge_loss.append("line")
            .attr("x1", x(0))
	        .attr("y1", y(-2))
	        .attr("x2", x(0))
	        .attr("y2", y(8))
	        .attr('stroke',"rgb(0%,0%,0%)")
			.attr("stroke-opacity",0.2)
			.attr("stroke-width", 1);
			 
  hinge_loss.append("path")
			.attr("d", "M " + x(-8) + " " + y(1+8) + " L " + x(1) + " " + y(0) + " L " + x(8) + " " + y(0))
            .style("stroke", blue)
            .style("stroke-width", 2)
            .style("fill", "none");
			  
  hinge_loss.append("line")
	        .attr("stroke-width", 1)
	        .attr("stroke", blue)
            .attr("x1", x(1))
	        .attr("y1", y(-0.1))
	        .attr("x2", x(1))
	        .attr("y2", y(0.1));
				
  hinge_loss.append("text")
            .attr("x",x(1))
            .attr("y",y(-0.7))
  	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("font-size", "10px")
	        .attr("fill", blue)
            .text("1");
			
  var line = d3.line()
               .x(function(d,i) {return x(-6.5 + i * 0.05);})
               .y(function(d) {return y(d);});
  var softplusA = [];
  for (var i = -6.5; i < 6.5; i+= 0.05)
	softplusA.push(Math.log(1 + Math.exp(-i)));
			
  var softplus_loss = d3.select("#softplus-loss")
                        .append("svg")
	                    .attr("width", width)
		                .attr("height", height);
						
  softplus_loss.append("rect")
               .attr("fill","rgb(98%,98%,98%)")
			   .attr("x", 0)
               .attr("y", 0)
               .attr("width", width)
               .attr("height", height);
  
  softplus_loss.append("line")
               .attr("x1", x(-8))
	           .attr("y1", y(0))
	           .attr("x2", x(8))
	           .attr("y2", y(0))
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1);

  softplus_loss.append("line")
               .attr("x1", x(0))
	           .attr("y1", y(-2))
	           .attr("x2", x(0))
	           .attr("y2", y(8))
	           .attr('stroke',"rgb(0%,0%,0%)")
			   .attr("stroke-opacity",0.2)
			   .attr("stroke-width", 1);
			  
  softplus_loss.append("path")
               .attr("d", line(softplusA))
               .style("stroke", blue)
               .style("stroke-width", 2)
               .style("fill", "none");
			   
  softplus_loss.append("line")
	           .attr("stroke-width", 1)
	           .attr("stroke", blue)
               .attr("x1", x(1))
	           .attr("y1", y(-0.1))
	           .attr("x2", x(1))
	           .attr("y2", y(0.1));
				
  softplus_loss.append("text")
               .attr("x",x(1))
               .attr("y",y(-0.7))
  	           .attr("text-anchor", "middle")
	           .attr("font-family","Roboto")
	           .attr("font-size", "10px")
	           .attr("fill", blue)
               .text("1");
}

function scaling_parameter() {
  var width = 648;
  var height = 140;
  var pos_x = 362.5;
  var pos_y = 60;
  
  var bracket_width = 45, bracket_height = 5, arrow_length = 30;
	
  var svg = d3.select("#equation-svg1")
              .append("svg")
	          .attr("width", width)
		      .attr("height", height);
					   
  svg.append("path")
	 .attr("d", "M " + pos_x + " " + pos_y + " L " + pos_x + " " + (pos_y+bracket_height) + "L " + (pos_x+bracket_width) + " " + (pos_y+bracket_height) + " L " + (pos_x+bracket_width) + " " + pos_y)
     .style("stroke", "rgb(60%,60%,60%)")
     .style("stroke-width", 1)
     .style("fill", "none");
	 
  svg.append("line")
	 .attr("x1", pos_x+bracket_width/2)
	 .attr("y1", pos_y+bracket_height)
	 .attr("x2", pos_x+bracket_width/2)
	 .attr("y2", pos_y+arrow_length)
     .style("stroke", "rgb(60%,60%,60%)")
     .style("stroke-width", 1)
     .style("fill", "none");
	 
  svg.append("polygon")
	 .attr("fill", "rgb(60%,60%,60%)")
     .attr("points", (pos_x+bracket_width/2-3) + "," + (pos_y+arrow_length) + " " +
		             (pos_x+bracket_width/2+3) + "," + (pos_y+arrow_length) + " " + 
				     (pos_x+bracket_width/2) + "," + (pos_y+arrow_length+6));
			  
  svg.append("text")
	 .attr("fill", "rgb(60%,60%,60%)")
	 .attr("font-family","Roboto")
	 .attr("font-size", "13px")
	 .attr("text-anchor", "middle")
     .attr("x", pos_x+bracket_width/2)
	 .attr("y", pos_y+arrow_length+20)
	 .text("scaling parameter for ")
	 .append("tspan")
	 .attr("font-style","italic")
	 .text("f");
}

function scaling_f() {
  var width = 201;
  var height = 134;
  var x = d3.scaleLinear().domain([-6, 6]).range([0, width]);
  var y = d3.scaleLinear().domain([6, -1]).range([0, height]);
  var init_w = 0.;
  var blue = d3.interpolateBlues(0.7);
  var orange = "rgb(255,102,0)";
  var light_left_color = "rgb(90%,90%,90%)";
  var light_right_color = "rgb(80%,80%,80%)";
  
  var dataA = [0,0,0,0,0,0,0,0,0,0,0,0.002,0.005,0.023,0.06,0.181,0.508,1.048,1.504,1.149,0.437,0.05,0.019,0.01,0.003,0.001,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var dataB = [0,0,0,0,0,0,0,0,0,0.001,0,0,0,0.003,0.006,0.005,0.023,0.054,0.212,0.331,0.535,0.706,0.743,0.679,0.505,0.419,0.283,0.186,0.146,0.089,0.037,0.02,0.015,0.001,0.001,0,0,0,0,0];
  var data = [dataA.slice().reverse(), dataB];
  data = data[0].map(function(col, i) { return data.map(function(row) { return row[i] })});
  
  var line = d3.line()
               .x(function(d,i) {return x(-8 + i * 0.05);})
               .y(function(d) {return y(d);});
  var softplus = [];
  for (var i = -8; i < 8; i+= 0.05)
	softplus.push(Math.log(1 + Math.exp(-i)));

  function init() {
    d3.select("#scaling-f-controler-input").property("value", init_w);
    d3.select("#scaling-f-value-w").text(parseFloat(init_w).toFixed(2));	  
	  
    // Subfigure 1
    var subfig1 = d3.select("#scaling-f-subfig1")
                    .append("svg")
	                .attr("width", width)
		            .attr("height", height);
						 
    subfig1.append("rect")
           .attr("fill","rgb(98%,98%,98%)")
		   .attr("x", 0)
           .attr("y", 0)
           .attr("width", width)
           .attr("height", height);
  
    subfig1.append("line")
           .attr("x1", x(-8))
	       .attr("y1", y(0))
	       .attr("x2", x(8))
	       .attr("y2", y(0))
	       .attr('stroke',"rgb(0%,0%,0%)")
		   .attr("stroke-opacity",0.2)
		   .attr("stroke-width", 1);
				
    subfig1.selectAll("rect0")
           .data(data)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {return x(i * 0.4 - 8);})
           .attr("y", function(d) {return y(0) - d[1] * height / 4 - d[0] * height / 4;})
           .attr("width", 6.5)
           .attr("height", function(d) {return d[0] * height / 4;})
           .style("stroke-width", 0.3)
           .style("stroke", "rgb(30%, 30%, 30%)")
           .style("fill-opacity", 1)
           .style("fill", light_left_color);
	   
    subfig1.selectAll("rect1")
           .data(data)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {return x(i * 0.4 - 8);})
           .attr("y", function(d) {return y(0) - d[1] * height / 4;})
           .attr("width", 6.5)
           .attr("height", function(d) {return d[1] * height / 4;})
           .style("stroke-width", 0.3)
           .style("stroke", "rgb(10%, 10%, 10%)")
           .style("fill-opacity", 1)
           .style("fill", light_right_color);
		   
    subfig1.append("line")
           .attr("x1", x(0))
	       .attr("y1", y(-2))
	       .attr("x2", x(0))
	       .attr("y2", y(8))
	       .attr('stroke', orange)
	       .attr("stroke-opacity", 1)
	       .attr("stroke-width", 2.5);
				
	subfig1.append("path")
		   .attr("d", "M " + x(-8) + " " + y(1) + " L " + x(0) + " " + y(1) + "M " + x(0) + " " + y(0) + " L " + x(8) + " " + y(0))
           .style("stroke", blue)
           .style("stroke-width", 2)
           .style("fill", "none");
	
    var tick1 = subfig1.append("g")
	                   .attr("id", "scaling-f-group1")
	                   .attr("transform", "translate(" + (x(1)-x(0)) + ",0)");
	
	tick1.append("line")
	     .attr("stroke-width", 0.5)
	     .attr("stroke", blue)
         .attr("x1", x(0))
	     .attr("y1", y(-0.1))
	     .attr("x2", x(0))
	     .attr("y2", y(0.1));
				
	tick1.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.4))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Roboto")
	     .attr("fill", blue)
	     .attr("font-size", "8px")
         .text("1");
			  
	tick1.append("line")
	     .attr("stroke-width", 0.5)
	     .attr("stroke", blue)
         .attr("x1", x(-0.3))
	     .attr("y1", y(-0.45))
	     .attr("x2", x(0.3))
	     .attr("y2", y(-0.45));
			  
	tick1.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.85))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Roboto")
	     .attr("fill", blue)
	     .attr("font-size", "9px")
         .text("||")
		 .append("tspan")
		 .attr("font-weight", "bold")
		 .text("w")
		 .append("tspan")
		 .attr("font-weight", "normal")
		 .text("||");

    // Subfigure 2
    var subfig2 = d3.select("#scaling-f-subfig2")
                    .append("svg")
	                .attr("width", width)
	                .attr("height", height);
			  
    subfig2.append("rect")
           .attr("fill","rgb(98%,98%,98%)")
		   .attr("x", 0)
           .attr("y", 0)
           .attr("width", width)
           .attr("height", height);
  
    subfig2.append("line")
           .attr("x1", x(-8))
	       .attr("y1", y(0))
	       .attr("x2", x(8))
	       .attr("y2", y(0))
	       .attr('stroke',"rgb(0%,0%,0%)")
		   .attr("stroke-opacity",0.2)
		   .attr("stroke-width", 1);

    subfig2.append("line")
           .attr("x1", x(0))
	       .attr("y1", y(-2))
	       .attr("x2", x(0))
	       .attr("y2", y(8))
	       .attr('stroke',"rgb(0%,0%,0%)")
		   .attr("stroke-opacity",0.2)
		   .attr("stroke-width", 1);
				
    subfig2.selectAll("rect0")
           .data(data)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {return x(i * 0.4 - 8);})
           .attr("y", function(d) {return y(0) - d[1] * height / 4 - d[0] * height / 4;})
           .attr("width", 6.5)
           .attr("height", function(d) {return d[0] * height / 4;})
           .style("stroke-width", 0.3)
           .style("stroke", "rgb(30%, 30%, 30%)")
           .style("fill-opacity", 1)
           .style("fill", light_left_color);
	   
    subfig2.selectAll("rect1")
           .data(data)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {return x(i * 0.4 - 8);})
           .attr("y", function(d) {return y(0) - d[1] * height / 4;})
           .attr("width", 6.5)
           .attr("height", function(d) {return d[1] * height / 4;})
           .style("stroke-width", 0.3)
           .style("stroke", "rgb(10%, 10%, 10%)")
           .style("fill-opacity", 1)
           .style("fill", light_right_color);
		   
    subfig2.append("line")
           .attr("x1", x(0))
	       .attr("y1", y(-2))
	       .attr("x2", x(0))
	       .attr("y2", y(8))
	       .attr('stroke', orange)
	       .attr("stroke-opacity", 1)
	       .attr("stroke-width", 2.5);
				
	subfig2.append("path")
	       .attr("id","scaling-f-hinge")
		   .attr("d", "M " + x(-8) + " " + y(1+8) + " L " + x(1) + " " + y(0) + " L " + x(8) + " " + y(0))
           .style("stroke", blue)
           .style("stroke-width", 2)
           .style("fill", "none");
				
    var tick2 = subfig2.append("g")
	                   .attr("id", "scaling-f-group2")
	                   .attr("transform", "translate(" + (x(1)-x(0)) + ",0)");
	
	tick2.append("line")
	     .attr("stroke-width", 0.5)
	     .attr("stroke", blue)
         .attr("x1", x(0))
	     .attr("y1", y(-0.1))
	     .attr("x2", x(0))
	     .attr("y2", y(0.1));
				
	tick2.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.4))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Roboto")
	     .attr("fill", blue)
	     .attr("font-size", "8px")
         .text("1");
			  
	tick2.append("line")
	     .attr("stroke-width", 0.5)
	     .attr("stroke", blue)
         .attr("x1", x(-0.3))
	     .attr("y1", y(-0.45))
	     .attr("x2", x(0.3))
	     .attr("y2", y(-0.45));
			  
	tick2.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.85))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Roboto")
	     .attr("fill", blue)
	     .attr("font-size", "9px")
         .text("||")
		 .append("tspan")
		 .attr("font-weight", "bold")
		 .text("w")
		 .append("tspan")
		 .attr("font-weight", "normal")
		 .text("||");
	
    // Subfigure 3
    var subfig3 = d3.select("#scaling-f-subfig3")
                    .append("svg")
	                .attr("width", width)
                    .attr("height", height);
			  
    subfig3.append("rect")
           .attr("fill","rgb(98%,98%,98%)")
		   .attr("x", 0)
           .attr("y", 0)
           .attr("width", width+1)
           .attr("height", height+1);
  
    subfig3.append("line")
           .attr("x1", x(-8))
	       .attr("y1", y(0))
	       .attr("x2", x(8))
	       .attr("y2", y(0))
	       .attr('stroke',"rgb(0%,0%,0%)")
		   .attr("stroke-opacity",0.2)
		   .attr("stroke-width", 1);

    subfig3.append("line")
           .attr("x1", x(0))
	       .attr("y1", y(-2))
	       .attr("x2", x(0))
	       .attr("y2", y(8))
	       .attr('stroke',"rgb(0%,0%,0%)")
		   .attr("stroke-opacity",0.2)
		   .attr("stroke-width", 1);
				
    subfig3.selectAll("rect0")
           .data(data)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {return x(i * 0.4 - 8);})
           .attr("y", function(d) {return y(0) - d[1] * height / 4 - d[0] * height / 4;})
           .attr("width", 6.5)
           .attr("height", function(d) {return d[0] * height / 4;})
           .style("stroke-width", 0.3)
           .style("stroke", "rgb(30%, 30%, 30%)")
           .style("fill-opacity", 1)
           .style("fill", light_left_color);
	   
    subfig3.selectAll("rect1")
           .data(data)
           .enter()
           .append("rect")
           .attr("x", function(d, i) {return x(i * 0.4 - 8);})
           .attr("y", function(d) {return y(0) - d[1] * height / 4;})
           .attr("width", 6.5)
           .attr("height", function(d) {return d[1] * height / 4;})
           .style("stroke-width", 0.3)
           .style("stroke", "rgb(10%, 10%, 10%)")
           .style("fill-opacity", 1)
           .style("fill", light_right_color);
				
    subfig3.append("line")
           .attr("x1", x(0))
	       .attr("y1", y(-2))
	       .attr("x2", x(0))
	       .attr("y2", y(8))
	       .attr('stroke', orange)
	       .attr("stroke-opacity", 1)
	       .attr("stroke-width", 2.5);

    subfig3.append("path")
	       .attr("id","scaling-f-softplus")
           .attr("d", line(softplus))
           .style("stroke", blue)
           .style("stroke-width", 2)
           .style("fill", "none");				
				
    var tick3 = subfig3.append("g")
	                   .attr("id", "scaling-f-group3")
	                   .attr("transform", "translate(" + (x(1)-x(0)) + ",0)");
	
	tick3.append("line")
	     .attr("stroke-width", 0.5)
	     .attr("stroke", blue)
         .attr("x1", x(0))
	     .attr("y1", y(-0.1))
	     .attr("x2", x(0))
	     .attr("y2", y(0.1));
				
	tick3.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.4))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Roboto")
	     .attr("fill", blue)
	     .attr("font-size", "8px")
         .text("1");
			  
	tick3.append("line")
	     .attr("stroke-width", 0.5)
	     .attr("stroke", blue)
         .attr("x1", x(-0.3))
	     .attr("y1", y(-0.45))
	     .attr("x2", x(0.3))
	     .attr("y2", y(-0.45));
			  
	tick3.append("text")
         .attr("x",x(0))
         .attr("y",y(-0.85))
  	     .attr("text-anchor", "middle")
	     .attr("font-family", "Roboto")
	     .attr("fill", blue)
	     .attr("font-size", "9px")
         .text("||")
		 .append("tspan")
		 .attr("font-weight", "bold")
		 .text("w")
		 .append("tspan")
		 .attr("font-weight", "normal")
		 .text("||");
  }
  
  function update(norm_w) {
    var softplus = [];
    for (var i = -8; i < 8; i+= 0.05)
	  softplus.push(Math.log(1 + Math.exp(- Math.pow(10,norm_w) * i)));
	  
   d3.select("#scaling-f-value-w").text(parseFloat(norm_w).toFixed(2));   
   d3.select("#scaling-f-hinge").attr("d", "M " + x(-8) + " " + y(1 + Math.pow(10,norm_w) * 8) + " L " + x(1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(8) + " " + y(0));
   d3.select("#scaling-f-softplus").attr("d", line(softplus));
   d3.select("#scaling-f-group1").attr("transform", "translate(" + (x(1 / Math.pow(10,norm_w)) - x(0)) + ", 0)");
   d3.select("#scaling-f-group2").attr("transform", "translate(" + (x(1 / Math.pow(10,norm_w)) - x(0)) + ", 0)");
   d3.select("#scaling-f-group3").attr("transform", "translate(" + (x(1 / Math.pow(10,norm_w)) - x(0)) + ", 0)");
  }
		  
  init();
  update(init_w);

  d3.select("#scaling-f-controler-input")
    .on("input", function() {update(this.value);});
}

function large_norm_w() {
  var width = 201;
  var height = 134;
  var x = d3.scaleLinear().domain([-6, 6]).range([0, width]);
  var y = d3.scaleLinear().domain([6, -1]).range([0, height]);
  var blue = d3.interpolateBlues(0.7);
  var orange = "rgb(255,102,0)";
  var light_left_color = "rgb(90%,90%,90%)";
  var light_right_color = "rgb(80%,80%,80%)";
  var norm_w = 1.5;
  
  var dataA = [0,0,0,0,0,0,0,0,0,0,0,0.002,0.005,0.023,0.06,0.181,0.508,1.048,1.504,1.149,0.437,0.05,0.019,0.01,0.003,0.001,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var dataB = [0,0,0,0,0,0,0,0,0,0.001,0,0,0,0.003,0.006,0.005,0.023,0.054,0.212,0.331,0.535,0.706,0.743,0.679,0.505,0.419,0.283,0.186,0.146,0.089,0.037,0.02,0.015,0.001,0.001,0,0,0,0,0];
  var data = [dataA.slice().reverse(), dataB];
  data = data[0].map(function(col, i) { return data.map(function(row) { return row[i] })});
  
  var fig = d3.select("#value-w-input1")
              .append("svg")
	          .attr("width", width)
	          .attr("height", height);
			  
  fig.append("rect")
     .attr("fill","rgb(98%,98%,98%)")
	 .attr("x", 0)
     .attr("y", 0)
     .attr("width", width)
     .attr("height", height);
			  
  fig.append("line")
     .attr("x1", x(-8))
	 .attr("y1", y(0))
	 .attr("x2", x(8))
	 .attr("y2", y(0))
	 .attr('stroke',"rgb(0%,0%,0%)")
	 .attr("stroke-opacity",0.2)
	 .attr("stroke-width", 1);

				
  fig.selectAll("rect0")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(i * 0.4 - 8);})
     .attr("y", function(d) {return y(0) - d[1] * height / 4 - d[0] * height / 4;})
     .attr("width", 6.5)
     .attr("height", function(d) {return d[0] * height / 4;})
     .style("stroke-width", 0.3)
     .style("stroke", "rgb(30%, 30%, 30%)")
     .style("fill-opacity", 1)
     .style("fill", light_left_color);
	   
  fig.selectAll("rect1")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(i * 0.4 - 8);})
     .attr("y", function(d) {return y(0) - d[1] * height / 4;})
     .attr("width", 6.5)
     .attr("height", function(d) {return d[1] * height / 4;})
     .style("stroke-width", 0.3)
     .style("stroke", "rgb(10%, 10%, 10%)")
     .style("fill-opacity", 1)
     .style("fill", light_right_color);
	 
  fig.append("line")
     .attr("x1", x(0))
	 .attr("y1", y(-2))
	 .attr("x2", x(0))
	 .attr("y2", y(8))
	 .attr('stroke', orange)
	 .attr("stroke-opacity", 1)
     .attr("stroke-width", 2.5);
				
  fig.append("path")
     .attr("d", "M " + x(-8) + " " + y(1 + Math.pow(10,norm_w) * 8) + " L " + x(1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(8) + " " + y(0))
     .style("stroke", blue)
     .style("stroke-width", 2)
     .style("fill", "none");
}

function small_norm_w() {
  var width = 201;
  var height = 134;
  var x = d3.scaleLinear().domain([-6, 6]).range([0, width]);
  var y = d3.scaleLinear().domain([6, -1]).range([0, height]);
  var blue = d3.interpolateBlues(0.7);
  var orange = "rgb(255,102,0)";
  var light_left_color = "rgb(90%,90%,90%)";
  var light_right_color = "rgb(80%,80%,80%)";
  var norm_w = -1.5;
  
  var dataA = [0,0,0,0,0,0,0,0,0,0,0,0.002,0.005,0.023,0.06,0.181,0.508,1.048,1.504,1.149,0.437,0.05,0.019,0.01,0.003,0.001,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  var dataB = [0,0,0,0,0,0,0,0,0,0.001,0,0,0,0.003,0.006,0.005,0.023,0.054,0.212,0.331,0.535,0.706,0.743,0.679,0.505,0.419,0.283,0.186,0.146,0.089,0.037,0.02,0.015,0.001,0.001,0,0,0,0,0];
  var data = [dataA.slice().reverse(), dataB];
  data = data[0].map(function(col, i) { return data.map(function(row) { return row[i] })});
  
  var fig = d3.select("#value-w-input2")
              .append("svg")
	          .attr("width", width)
	          .attr("height", height);
			  
  fig.append("rect")
     .attr("fill","rgb(98%,98%,98%)")
	 .attr("x", 0)
     .attr("y", 0)
     .attr("width", width)
     .attr("height", height);
			  
  fig.append("line")
     .attr("x1", x(-8))
	 .attr("y1", y(0))
	 .attr("x2", x(8))
	 .attr("y2", y(0))
	 .attr('stroke',"rgb(0%,0%,0%)")
	 .attr("stroke-opacity",0.2)
	 .attr("stroke-width", 1);

				
  fig.selectAll("rect0")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(i * 0.4 - 8);})
     .attr("y", function(d) {return y(0) - d[1] * height / 4 - d[0] * height / 4;})
     .attr("width", 6.5)
     .attr("height", function(d) {return d[0] * height / 4;})
     .style("stroke-width", 0.3)
     .style("stroke", "rgb(30%, 30%, 30%)")
     .style("fill-opacity", 1)
     .style("fill", light_left_color);
	   
  fig.selectAll("rect1")
     .data(data)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {return x(i * 0.4 - 8);})
     .attr("y", function(d) {return y(0) - d[1] * height / 4;})
     .attr("width", 6.5)
     .attr("height", function(d) {return d[1] * height / 4;})
     .style("stroke-width", 0.3)
     .style("stroke", "rgb(10%, 10%, 10%)")
     .style("fill-opacity", 1)
     .style("fill", light_right_color);
	 
  fig.append("line")
     .attr("x1", x(0))
	 .attr("y1", y(-2))
	 .attr("x2", x(0))
	 .attr("y2", y(8))
	 .attr('stroke', orange)
	 .attr("stroke-opacity", 1)
     .attr("stroke-width", 2.5);
				
  fig.append("path")
     .attr("d", "M " + x(-8) + " " + y(1 + Math.pow(10,norm_w) * 8) + " L " + x(1 / Math.pow(10,norm_w)) + " " + y(0) + " L " + x(8) + " " + y(0))
     .style("stroke", blue)
     .style("stroke-width", 2)
     .style("fill", "none");
}

function regularized_loss() {
  var width = 648;
  var height = 120;
  
  var pos_x1 = 285, pos_y1 = 50, bracket_width1 = 80, bracket_height1 = 5, arrow_length1 = 25;
  var pos_x2 = 395, pos_y2 = 50, bracket_width2 = 70, bracket_height2 = 5, arrow_length2 = 25;
	
  var svg = d3.select("#equation-svg2")
              .append("svg")
	          .attr("width", width)
		      .attr("height", height);
  
  // 1  
  svg.append("path")
	 .attr("d", "M " + pos_x1 + " " + pos_y1 + " L " + pos_x1 + " " + (pos_y1+bracket_height1) + "L " + (pos_x1+bracket_width1) + " " + (pos_y1+bracket_height1) + " L " + (pos_x1+bracket_width1) + " " + pos_y1)
     .style("stroke", "rgb(60%,60%,60%)")
     .style("stroke-width", 1)
     .style("fill", "none");
	 
  svg.append("line")
	 .attr("x1", pos_x1+bracket_width1/2)
	 .attr("y1", pos_y1+bracket_height1)
	 .attr("x2", pos_x1+bracket_width1/2)
	 .attr("y2", pos_y1+arrow_length1)
     .style("stroke", "rgb(60%,60%,60%)")
     .style("stroke-width", 1)
     .style("fill", "none");
	 
  svg.append("polygon")
	 .attr("fill", "rgb(60%,60%,60%)")
     .attr("points", (pos_x1+bracket_width1/2-3) + "," + (pos_y1+arrow_length1) + " " +
		             (pos_x1+bracket_width1/2+3) + "," + (pos_y1+arrow_length1) + " " + 
				     (pos_x1+bracket_width1/2) + "," + (pos_y1+arrow_length1+6));
			  
  svg.append("text")
	 .attr("fill", "rgb(60%,60%,60%)")
	 .attr("font-family","Roboto")
	 .attr("font-size", "13px")
	 .attr("text-anchor", "middle")
     .attr("x", pos_x1+bracket_width1/2-2)
	 .attr("y", pos_y1+arrow_length1+20)
	 .text("empirical risk");
	 
  // 2
  svg.append("path")
	 .attr("d", "M " + pos_x2 + " " + pos_y2 + " L " + pos_x2 + " " + (pos_y2+bracket_height2) + "L " + (pos_x2+bracket_width2) + " " + (pos_y2+bracket_height2) + " L " + (pos_x2+bracket_width2) + " " + pos_y2)
     .style("stroke", "rgb(60%,60%,60%)")
     .style("stroke-width", 1)
     .style("fill", "none");
	 
  svg.append("line")
	 .attr("x1", pos_x2+bracket_width2/2)
	 .attr("y1", pos_y2+bracket_height2)
	 .attr("x2", pos_x2+bracket_width2/2)
	 .attr("y2", pos_y2+arrow_length2)
     .style("stroke", "rgb(60%,60%,60%)")
     .style("stroke-width", 1)
     .style("fill", "none");
	 
  svg.append("polygon")
	 .attr("fill", "rgb(60%,60%,60%)")
     .attr("points", (pos_x2+bracket_width2/2-3) + "," + (pos_y2+arrow_length2) + " " +
		             (pos_x2+bracket_width2/2+3) + "," + (pos_y2+arrow_length2) + " " + 
				     (pos_x2+bracket_width2/2) + "," + (pos_y2+arrow_length2+6));
			  
  svg.append("text")
	 .attr("fill", "rgb(60%,60%,60%)")
	 .attr("font-family","Roboto")
	 .attr("font-size", "13px")
	 .attr("text-anchor", "middle")
     .attr("x", pos_x2+bracket_width2/2+15)
	 .attr("y", pos_y2+arrow_length2+20)
	 .text("L2 regularization");
}

function d_adv() {
  var width = 648;
  var height = 202;
  var plot_w = 300;
  var plot_h = 200;
  var orange = "rgb(255,102,0)";
  
  var x = d3.scaleLinear().domain([-17, 19]).range([0, plot_w]);
  var y = d3.scaleLinear().domain([16, -8]).range([0, plot_h]);

  var fig = d3.select("#d-adv-fig");
	   
  var svg = fig.append("svg")
	           .style("top", "1px")
	           .style("left", "1px")
    	   	   .attr("width", plot_w)
	  		   .attr("height", plot_h);
			  
  svg.append("rect")
     .attr("fill","rgb(98%,98%,98%)")
	 .attr("x", 0)
     .attr("y", 0)
     .attr("width", plot_w)
     .attr("height", plot_h);
  
  var mean0_x = -10, mean0_y = 0;
  svg.append("circle")
     .attr("cx", x(mean0_x))
	 .attr("cy", y(mean0_y))
	 .attr("r", 2.5)
	 .attr("fill", "rgb(0%,0%,0%)");
			 
  svg.append("text")
     .attr("text-anchor", "middle")
	 .attr("font-family","Roboto")
	 .attr("fill", "rgb(0%,0%,0%)")
	 .attr("font-weight", "bold")
 	 .attr("font-style", "italic")
	 .attr("font-size", "15px")
	 .attr("x", x(mean0_x))
	 .attr("y", y(mean0_y) + 20)
     .text("i");

  var mean1_x = 10, mean1_y = 0;		
  svg.append("circle")
     .attr("cx", x(mean1_x))
	 .attr("cy", y(mean1_y))
	 .attr("r", 2.5)
	 .attr("fill", "rgb(0%,0%,0%)");
			 
  svg.append("text")
     .attr("text-anchor", "middle")
	 .attr("font-family","Roboto")
	 .attr("fill", "rgb(0%,0%,0%)")
	 .attr("font-weight", "bold")
 	 .attr("font-style", "italic")
	 .attr("font-size", "15px")
	 .attr("x", x(mean1_x))
	 .attr("y", y(mean1_y) - 15)
     .text("j");
	 
  var theta = Math.PI/3;
  svg.append("rect")
     .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	 .attr("fill", "rgba(0,0,0,0.07)")
     .attr("x", x(mean0_x*Math.cos(theta)))
     .attr("y", -500)
     .attr("width", 2*(x(mean1_x*Math.cos(theta))-x(0)))
     .attr("height", plot_w+1000);
  
  var d_adv_width = 2*mean1_x*Math.cos(theta);
  svg.append("line")
     .attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(mean0_x) +","+ y(mean0_y) +")")
	 .attr("stroke","rgb(40%,40%,40%)")
	 .attr("stroke-width",0.5)
	 .style("stroke-dasharray", ("2, 1"))
     .attr("x1", x(mean0_x))
     .attr("y1", y(mean0_y))
     .attr("x2", x(mean0_x + d_adv_width))
     .attr("y2", y(mean0_y));
	 
  svg.append("path")
	 .attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(mean0_x) +","+ y(mean0_y) +")")
	 .attr("d","M "+ (x(mean0_x)+5) +" "+ (y(mean0_y)+3) +" L "+ x(mean0_x) +" "+ y(mean0_y) +" L "+ (x(mean0_x)+5) +" "+ (y(mean0_y)-3))
     .style("stroke-width", 0.5)
     .style("stroke", "rgb(40%,40%,40%)")
     .style("fill", "none");
			  
  svg.append("path")
     .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(mean0_x) +","+ y(mean0_y) +")")
	 .attr("d","M "+ (x(mean0_x+d_adv_width)-5) +" "+ (y(mean0_y)+3) +" L "+ x(mean0_x+d_adv_width) +" "+ y(mean0_y) +" L "+ (x(mean0_x+d_adv_width)-5) +" "+ (y(mean0_y)-3))
     .style("stroke-width", 0.5)
     .style("stroke", "rgb(40%,40%,40%)")
     .style("fill", "none");
					
  svg.append("text")
     .attr("fill", "rgb(60%,60%,60%)")
	 .attr("font-family","Roboto")
	 .attr("font-size", "13px")
	 .attr("text-anchor", "start")
	 .attr("font-style", "italic")
     .attr("x", x(mean0_x)+50)
	 .attr("y", y(mean0_y)-75)
	 .text("2 d")
	 .append("tspan")
     .attr("font-size", "10px")
     .attr("dx", "1px")
     .attr("dy", "4px")
	 .text("adv")
	 .append("tspan")
	 .attr("font-size", "13px")
     .attr("dx", "1px")
     .attr("dy", "-4px")
     .attr("font-weight", "normal")
	 .attr("font-style", "normal")
	 .text(" = ||")
	 .append("tspan")
     .attr("font-weight", "bold")
	 .attr("font-style", "italic")
	 .text(" j ")
	 .append("tspan")
     .attr("font-weight", "normal")
	 .attr("font-style", "normal")
	 .text(" - ")
	 .append("tspan")
     .attr("font-weight", "bold")
	 .attr("font-style", "italic")
	 .text(" i ")
	 .append("tspan")
     .attr("font-weight", "normal")
	 .attr("font-style", "normal")
	 .text("|| cos(\u03B8)");
	 
  svg.append("line")
	 .attr("stroke","rgb(40%,40%,40%)")
	 .attr("stroke-width",0.5)
	 .style("stroke-dasharray", ("2, 1"))
     .attr("x1", x(mean0_x))
     .attr("y1", y(mean0_y))
     .attr("x2", x(mean1_x))
     .attr("y2", y(mean1_y));
	 
  svg.append("path")
	 .attr("d","M "+ (x(mean0_x)+5) +" "+ (y(mean0_y)+3) +" L "+ x(mean0_x) +" "+ y(mean0_y) +" L "+ (x(mean0_x)+5) +" "+ (y(mean0_y)-3))
     .style("stroke-width", 0.5)
     .style("stroke", "rgb(40%,40%,40%)")
     .style("fill", "none");
			  
  svg.append("path")
	 .attr("d","M "+ (x(mean1_x)-5) +" "+ (y(mean1_y)+3) +" L "+ x(mean1_x) +" "+ y(mean1_y) +" L "+ (x(mean1_x)-5) +" "+ (y(mean1_y)-3))
     .style("stroke-width", 0.5)
     .style("stroke", "rgb(40%,40%,40%)")
     .style("fill", "none");
	 
  svg.append("text")
     .attr("fill", "rgb(60%,60%,60%)")
	 .attr("font-family","Roboto")
	 .attr("font-size", "13px")
	 .attr("text-anchor", "start")
     .attr("x", x(mean1_x)+15)
	 .attr("y", y(mean1_y)+2)
	 .text("||")
	 .append("tspan")
     .attr("font-weight", "bold")
	 .attr("font-style", "italic")
	 .text(" j ")
	 .append("tspan")
     .attr("font-weight", "normal")
	 .attr("font-style", "normal")
	 .text(" - ")
	 .append("tspan")
     .attr("font-weight", "bold")
	 .attr("font-style", "italic")
	 .text(" i ")
	 .append("tspan")
     .attr("font-weight", "normal")
	 .attr("font-style", "normal")
	 .text("||");
	 
  svg.append("line")
	 .attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(mean0_x+7) +","+ y(0) +")")
     .attr("x1", x(mean0_x+7))
	 .attr("y1", y(0))
	 .attr("x2", x(mean0_x+12))
	 .attr("y2", y(0))
	 .attr("stroke-width", 2)
	 .attr("stroke-dasharray", "5, 3")
	 .attr("stroke", orange);

  svg.append("polygon")
	 .attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(mean0_x+7) +","+ y(0) +")")
     .attr("points", (x(mean0_x+12)-4) +","+y(0)+" "+(x(mean0_x+12)-8)+","+(y(0) -4)+" "+x(mean0_x+12)+","+y(0)+" "+(x(mean0_x+12)-8)+","+(y(0) + 4))
  	 .attr("fill", orange)
  	 .attr("stroke-width", 1)
  	 .attr("stroke", orange);
	 
  svg.append("text")
	 .attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(mean0_x+7) +","+ y(0) +")")
     .attr("fill", orange)
	 .attr("font-family","Roboto")
	 .attr("font-size", "15px")
	 .attr("text-anchor", "start")
     .attr("font-weight", "bold")
	 .attr("font-style", "italic")
     .attr("x", x(mean0_x+12)+7)
	 .attr("y", y(0)+5)
	 .text("\u0175");
	 
  svg.append("line")
     .attr("x1", x(mean0_x+7))
	 .attr("y1", y(0))
	 .attr("x2", x(mean0_x+12))
	 .attr("y2", y(0))
	 .attr("stroke-width", 2)
	 .attr("stroke-dasharray", "5, 3")
	 .attr("stroke", "rgb(0%,0%,0%)");

  svg.append("polygon")
     .attr("points", (x(mean0_x+12)-4) +","+y(0)+" "+(x(mean0_x+12)-8)+","+(y(0) -4)+" "+x(mean0_x+12)+","+y(0)+" "+(x(mean0_x+12)-8)+","+(y(0) + 4))
  	 .attr("fill", "rgb(0%,0%,0%)")
  	 .attr("stroke-width", 1)
  	 .attr("stroke", "rgb(0%,0%,0%)");
	 
  svg.append("text")
     .attr("fill", "rgb(0%,0%,0%)")
	 .attr("font-family","Roboto")
	 .attr("font-size", "15px")
	 .attr("text-anchor", "start")
     .attr("font-weight", "bold")
	 .attr("font-style", "italic")
     .attr("x", x(mean0_x+12)+7)
	 .attr("y", y(0)+5)
	 .text("z");
	 
  svg.append("text")
     .attr("fill", "rgb(0%,0%,0%)")
	 .attr("font-family","Roboto")
	 .attr("font-size", "15px")
	 .attr("text-anchor", "start")
     .attr("font-weight", "bold")
	 .attr("font-style", "italic")
     .attr("x", x(mean0_x+12)+12)
	 .attr("y", y(0)+3)
	 .text("\u0302");
  
  svg.append("line")
     .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	 .attr("stroke-width", 2.5)
     .attr("x1", x(-1.5))
	 .attr("y1", -plot_h/2)
	 .attr("x2", x(-1.5))
	 .attr("y2", 2*plot_h)
	 .attr("stroke", orange);
	 
  var arc = d3.arc()
              .innerRadius(13)
              .outerRadius(14)
              .startAngle(Math.PI/2)
              .endAngle(Math.PI/2-theta);

  svg.append("path")
     .attr("d", arc)
  	 .attr("fill", "rgb(60%,60%,60%)")
     .attr("transform", "translate("+x(mean0_x)+","+y(0)+")");
	 
  svg.append("text")
     .attr("fill", "rgb(60%,60%,60%)")
	 .attr("font-family","Roboto")
	 .attr("font-size", "13px")
	 .attr("text-anchor", "start")
     .attr("font-weight", "bold")
     .attr("x", x(mean0_x)+15)
	 .attr("y", y(0)-5)
	 .text("\u03B8");
	 
  svg.append("text")
     .attr("fill", orange)
	 .attr("font-family","Roboto")
	 .attr("font-size", "15px")
	 .attr("text-anchor", "start")
     .attr("font-weight", "bold")
     .attr("x", plot_w-70)
	 .attr("y", plot_h-15)
	 .text("\uD835\uDC9E");
}

function svm_mnist1(){
  var width = 655;
  var height = 370;
  var plot_x = 5;
  var plot_y = 100;
  var plot_w = 360;
  var plot_h = 240;
  
  var radio_x = 10;
  var radio_y = 20;
  var reg_x = 420;
  var reg_y = 30;
  var d_adv_x = 420;
  var d_adv_y = 150;
  var err_train_x = 420;
  var err_train_y = 220;
  var err_test_x = 420;
  var err_test_y = 290;
  var bar_width = 160;
  var bar_color = "rgb(80%,80%,80%)";
  var bar_light_color = "rgb(97%,97%,97%)";
  
  var left_digit = 2;
  var right_digit = 3;
  
  var x = d3.scaleLinear().domain([-20, 20]).range([0, plot_w]);
  var y = d3.scaleLinear().domain([6, -1]).range([0, plot_h]);
  var blue = d3.interpolateBlues(0.7);
  var orange = "rgb(255,102,0)";
  var light_left_color = "rgb(80%,80%,80%)";
  var light_right_color = "rgb(90%,90%,90%)";
  var left_color = d3.interpolateBlues(0.3); //rgb(181, 212, 233)
  var right_color = d3.interpolateBlues(0.7); //rgb(47, 126, 188)

  var fig = d3.select("#svm-mnist1")
	          .style("position","relative");

  // plot  
  var plot = fig.append("svg")
	            .style("position","absolute")
	            .style("left", plot_x+"px")
	            .style("top", plot_y+"px")
	            .attr("width", plot_w)
	            .attr("height", plot_h);

  plot.append("rect")
      .attr("fill","rgb(98%,98%,98%)")
	  .attr("x", 0)
      .attr("y", 0)
      .attr("width", plot_w)
      .attr("height", plot_h);

  plot.append("line")
      .attr("x1", x(-20))
	  .attr("y1", y(0))
	  .attr("x2", x(20))
	  .attr("y2", y(0))
	  .attr('stroke',"rgb(0%,0%,0%)")
	  .attr("stroke-opacity",0.2)
	  .attr("stroke-width", 1);

  var group1 = plot.append("g");
  var group2 = plot.append("g");

  plot.append("line")
      .attr("x1", x(0))
	  .attr("y1", y(-2))
	  .attr("x2", x(0))
	  .attr("y2", y(8))
	  .attr('stroke', orange)
	  .attr("stroke-opacity", 1)
      .attr("stroke-width", 2.5);

  var path = plot.append("path");	

  // foreground
  var foreground = fig.append("svg")
	                  .style("position","absolute")
	                  .style("top", "0px")
	                  .style("left", "0px")
    	   	    	  .attr("width", width)
			          .attr("height", height);
					  
  foreground.append("rect")
            .attr("fill","none")
		    .attr('stroke',"rgb(60%,60%,60%)")
		    .attr("stroke-width", 1)
	        .attr("x", plot_x)
            .attr("y", plot_y)
            .attr("width", plot_w)
            .attr("height", plot_h);
				
  for (var i = 0; i < 9; i++) {
	foreground.append("text")
              .attr("x", radio_x + plot_w/10*i + 22)
	          .attr("y", radio_y + 14)
	          .attr("text-anchor", "start")
	          .attr("font-family","Roboto")
	          .attr("fill", left_color)
 	          .attr("font-weight", "bold")
	          .attr("font-size", "13px")
		      .attr("id","svm-mnist1-first-digit-label-"+i)
              .text(i.toString());
  }
	  
  for (var i = 1; i < 10; i++) {
	foreground.append("text")
              .attr("x", radio_x + plot_w/10*i + 22)
	          .attr("y", radio_y + 49)
	          .attr("text-anchor", "start")
	          .attr("font-family","Roboto")
	          .attr("fill", right_color)
 	          .attr("font-weight", "bold")
	          .attr("font-size", "13px")
			  .attr("id","svm-mnist1-second-digit-label-"+i)
              .text(i.toString());
  }
  
  foreground.append("text")
            .attr("x", reg_x +"px")
	        .attr("y", reg_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(0%,0%,0%)")
	        .attr("font-size", "15px")
            .text("L2 regularization :");
			
  foreground.append("text")
            .attr("x", reg_x + 130 +"px")
	        .attr("y", reg_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
			.attr("font-style","italic")
	        .attr("fill", "rgb(0%,0%,0%)")
	        .attr("font-size", "15px")
            .text("\u03BB")
			.append("tspan")
			.attr("font-style","normal")
			.attr("dx", "2px")
			.text(" = 10");
			
  foreground.append("text")
            .attr("x", d_adv_x +"px")
	        .attr("y", d_adv_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "15px")
            .text("Adversarial distance :");
			
  foreground.append("text")
            .attr("x", d_adv_x + 160 +"px")
	        .attr("y", d_adv_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
			.attr("font-style","italic")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "15px")
            .text("d")
			.append("tspan")
			.attr("font-size","10px")
			.attr("dx", "2px")
			.attr("dy", "3px")
            .text("adv")
			.append("tspan")
			.attr("dx", "3px")
			.attr("dy","-3px")
			.attr("font-style","normal")
	        .attr("font-size", "15px")
            .text(" = ");
			
  foreground.append("text")
            .attr("x", err_train_x +"px")
	        .attr("y", err_train_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "15px")
            .text("Training error :");
			
  foreground.append("text")
            .attr("x", err_train_x + 112 +"px")
	        .attr("y", err_train_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
			.attr("font-style","italic")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "15px")
            .text("err")
			.append("tspan")
			.attr("font-size","10px")
			.attr("dx", "2px")
			.attr("dy", "3px")
            .text("train")
			.append("tspan")
			.attr("dx", "3px")
			.attr("dy","-3px")
			.attr("font-style","normal")
	        .attr("font-size", "15px")
            .text(" = ");
			
  foreground.append("text")
            .attr("x", err_test_x +"px")
	        .attr("y", err_test_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "15px")
            .text("Test error :");
			
  foreground.append("text")
            .attr("x", err_test_x + 85 +"px")
	        .attr("y", err_test_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
			.attr("font-style","italic")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "15px")
            .text("err")
			.append("tspan")
			.attr("font-size","10px")
			.attr("dx", "2px")
			.attr("dy", "3px")
            .text("test")
			.append("tspan")
			.attr("dx", "3px")
			.attr("dy","-3px")
			.attr("font-style","normal")
	        .attr("font-size", "15px")
            .text(" = ");

  var reg_text = foreground.append("text"); 
  var d_adv_text = foreground.append("text");
  var err_test_text = foreground.append("text");
  var err_train_text = foreground.append("text");
  
  foreground.append("rect")
            .attr("x", d_adv_x)
		    .attr("y", d_adv_y + 15)
		    .attr("width", bar_width)
		    .attr("height", 15)
            .style("fill-opacity", 1)
            .style("fill", bar_light_color);
			
  foreground.append("rect")
            .attr("x", err_train_x)
		    .attr("y", err_train_y + 15)
		    .attr("width", bar_width)
		    .attr("height", 15)
            .style("fill-opacity", 1)
            .style("fill", bar_light_color);
			
  foreground.append("rect")
            .attr("x", err_test_x)
		    .attr("y", err_test_y + 15)
		    .attr("width", bar_width)
		    .attr("height", 15)
            .style("fill-opacity", 1)
            .style("fill", bar_light_color);
			
  var d_adv_rect = foreground.append("rect");
  var err_test_rect = foreground.append("rect");
  var err_train_rect = foreground.append("rect");
  
  // slider  
  var slider = fig.append("input")
	              .style("position","absolute")
	              .style("left", reg_x +"px")
	              .style("top", reg_y + 25 + "px")
	              .style("margin","0px")
	              .attr("type","range")
	              .attr("min",0)
	              .attr("max",80)
	              .attr("step",1)
	              .attr("value", 40);

  // radio inputs	 
  for (var i = 0; i < 9; i++) {
	fig.append("input")
	   .style("position","absolute")
	   .style("left", radio_x + plot_w/10*i +"px")
	   .style("top", radio_y + "px")
	   .attr("type","radio")
	   .attr("name","svm-mnist1-first-digit")
	   .attr("value",i)
	   .attr("id","svm-mnist1-first-digit-input-"+i);
  }
	  
  for (var i = 1; i < 10; i++) {
	fig.append("input")
	   .style("position","absolute")
	   .style("left", radio_x + plot_w/10*i +"px")
	   .style("top", radio_y + 35 + "px")
	   .attr("type","radio")
	   .attr("name","svm-mnist1-second-digit")
	   .attr("value",i)
	   .attr("id","svm-mnist1-second-digit-input-"+i);
  }
  
  function update_buttons(digit0, digit1) {
    for (var i=0; i<=digit0; i++) {
	  d3.select('#svm-mnist1-second-digit-input-'+i).style('visibility', 'hidden');
      d3.select('#svm-mnist1-second-digit-label-'+i).style('visibility', 'hidden');
    }
    for (var i=digit0+1; i<=9; i++) {
	  d3.select('#svm-mnist1-second-digit-input-'+i).style('visibility', 'visible');
      d3.select('#svm-mnist1-second-digit-label-'+i).style('visibility', 'visible');
    }
    for (var i=0; i<=digit1-1; i++) {
	  d3.select('#svm-mnist1-first-digit-input-'+i).style('visibility', 'visible');
      d3.select('#svm-mnist1-first-digit-label-'+i).style('visibility', 'visible');
    }
    for (var i=digit1; i<=9; i++) {
	  d3.select('#svm-mnist1-first-digit-input-'+i).style('visibility', 'hidden');
      d3.select('#svm-mnist1-first-digit-label-'+i).style('visibility', 'hidden');
    }
	
	slider.property("value", 40);
  }
  
  function draw_plot(digit0, digit1){
	  
    d3.queue().defer(d3.text,"assets/data/bins_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/extras_"+digit0+digit1+".csv")
              .await(draw_all);

    function draw_all(error, text_bins, text_extras) {
      var bins = d3.csvParseRows(text_bins).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csvParseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});	// theta; b; m; dadv; errTrain; errTest; x1; x2; xm1; xm2; y1; y2; ym1; ym2

	  var max_d_adv = Math.round( Math.max.apply(null, extras[3]) * 10) / 10;
      var max_err_train = Math.round( Math.max.apply(null, extras[4]) * 10) / 10;
	  var max_err_test = Math.round( Math.max.apply(null, extras[5]) * 10) / 10;	 

	  group1.selectAll("rect").remove();
	  group1.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {return x(i * 0.5 - 20);})
            .attr("y", function(d) {return y(0) - d[2*40] * 1.5 * plot_h;})
            .attr("width", plot_w/78)
            .attr("height", function(d) {return d[2*40] * 1.5 * plot_h;})
            .style("stroke-width", 0.3)
            .style("stroke", "rgb(30%, 30%, 30%)")
            .style("fill-opacity", 1)
            .style("fill", light_left_color);
	  
	  group2.selectAll("rect").remove();
      group2.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {return x(i * 0.5 - 20);})
            .attr("y", function(d) {return y(0) - (d[2*40]+d[2*40+1]) * 1.5 * plot_h;})
            .attr("width", plot_w/78)
            .attr("height", function(d) {return d[2*40+1] * 1.5 * plot_h;})
            .style("stroke-width", 0.3)
            .style("stroke", "rgb(10%, 10%, 10%)")
            .style("fill-opacity", 1)
            .style("fill", light_right_color);
				
	  
      path.attr("d", "M " + x(-20) + " " + y(1 + 20/extras[2][40]) + " L " + x(extras[2][40]) + " " + y(0) + " L " + x(20) + " " + y(0))
          .attr("stroke", blue)
          .attr("stroke-width", 2)
          .attr("fill", "none");
	  
	  d_adv_rect.attr("x", d_adv_x)
		        .attr("y", d_adv_y + 15)
		        .attr("width", bar_width*extras[3][40]/max_d_adv)
		        .attr("height", 15)
                .style("fill-opacity", 1)
                .style("fill", bar_color);
					 
	  err_train_rect.attr("x", err_train_x)
			        .attr("y", err_train_y + 15)
			        .attr("width", bar_width*extras[4][40]/max_err_train)
			        .attr("height", 15)
                    .style("fill-opacity", 1)
                    .style("fill", bar_color);
								
      err_test_rect.attr("x", err_test_x)
			       .attr("y", err_test_y + 15)
			       .attr("width", bar_width*extras[5][40]/max_err_test)
			       .attr("height", 15)
                   .style("fill-opacity", 1)
                   .style("fill", bar_color);

	  reg_text.attr("text-anchor", "start")
	          .attr("font-family","Roboto")
	          .attr("fill", "rgb(0%,0%,0%)")
			  .attr("font-size","10px")
			  .attr("x", reg_x + 178 +"px")
			  .attr("y", reg_y - 6 +"px")
			  .text(parseFloat(3).toFixed(1));
				
      d_adv_text.attr("text-anchor", "start")
	            .attr("font-family","Roboto")
	            .attr("fill", "rgb(60%,60%,60%)")
			    .attr("font-size","15px")
			    .attr("x", d_adv_x + 208 +"px")
			    .attr("y", d_adv_y +"px")
			    .text(parseFloat(extras[3][40]).toFixed(1))
				
      err_train_text.attr("text-anchor", "start")
	                .attr("font-family","Roboto")
	                .attr("fill", "rgb(60%,60%,60%)")
			        .attr("font-size","15px")
			        .attr("x", err_train_x + 173 +"px")
			        .attr("y", err_train_y +"px")
			        .text(parseFloat(extras[4][40]).toFixed(1)+"%")
				
      err_test_text.attr("text-anchor", "start")
	               .attr("font-family","Roboto")
	               .attr("fill", "rgb(60%,60%,60%)")
			       .attr("font-size","15px")
			       .attr("x", err_test_x + 143 +"px")
			       .attr("y", err_test_y +"px")
			       .text(parseFloat(extras[5][40]).toFixed(1)+"%")

		  
      function svm_mnist_update(reg_index) {
		group1.selectAll("rect")
		      .attr("y", function(d) {return y(0) - d[2*(80-reg_index)] * 1.5 * plot_h;})
			  .attr("height", function(d) {return d[2*(80-reg_index)] * 1.5 * plot_h;});

		group2.selectAll("rect")
		      .attr("y", function(d) {return y(0) - (d[2*(80-reg_index)]+d[2*(80-reg_index)+1]) * 1.5 * plot_h;})
			  .attr("height", function(d) {return d[2*(80-reg_index)+1] * 1.5 * plot_h;});
			  
		path.attr("d", "M " + x(-20) + " " + y(1 + 20/(extras[2][80-reg_index]+0.001)) + " L " + x(extras[2][80-reg_index]+0.001) + " " + y(0) + " L " + x(20) + " " + y(0));

	    d_adv_rect.attr("width", bar_width*extras[3][80-reg_index]/max_d_adv);		
	    err_train_rect.attr("width", bar_width*extras[4][80-reg_index]/max_err_train);
	    err_test_rect.attr("width", bar_width*extras[5][80-reg_index]/max_err_test);

		reg_text.text(parseFloat(-1+reg_index*0.1).toFixed(1));
		d_adv_text.text(parseFloat(extras[3][80-reg_index]).toFixed(1));
		err_train_text.text(parseFloat(extras[4][80-reg_index]).toFixed(1)+"%");
		err_test_text.text(parseFloat(extras[5][80-reg_index]).toFixed(1)+"%");
	  }
	  
      slider.on("input", function() {svm_mnist_update(this.value);});
    }
  }
  
  d3.select("#svm-mnist1-first-digit-input-"+left_digit).property("checked", true);
  d3.select("#svm-mnist1-second-digit-input-"+right_digit).property("checked", true);
  update_buttons(left_digit,right_digit);
  draw_plot(left_digit, right_digit);
  
  d3.selectAll('input[name="svm-mnist1-first-digit"]').on('click', function() {left_digit = +this.value;
                                                                               update_buttons(left_digit,right_digit);
																               draw_plot(left_digit, right_digit);
																			   });
  d3.selectAll('input[name="svm-mnist1-second-digit"]').on('click', function() {right_digit = +this.value;
                                                                                update_buttons(left_digit,right_digit);
																	            draw_plot(left_digit, right_digit);
																				});
}

function img_to_canvas(img) {
  var s = d3.scaleLinear().domain([-1, 1]).range([10, 245]);
  var canvas = document.createElement("canvas");
  canvas.setAttribute("width", 28);
  canvas.setAttribute("height", 28);
  
  var ctx = canvas.getContext("2d");
  var imgData = ctx.createImageData(28, 28);
  var data = imgData.data;

  for (var i = 0; i < 28; i++) {
	for (var j = 0; j < 28; j++) {
      var value = s(img[j*28+i]);
      data[4*(i*28+j)] = value;
      data[4*(i*28+j)+1] = value;
	  data[4*(i*28+j)+2] = value;
	  data[4*(i*28+j)+3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

function svm_mnist2(){
  var width = 648;
  var height = 370;
  var plot_x = 5;
  var plot_y = 100;
  var plot_w = 360;
  var plot_h = 240;
  
  var radio_x = 10;
  var radio_y = 20;
  var reg_x = 420;
  var reg_y = 30;
  
  var im0_x = 420;
  var im0_y = 100;
  var im1_x = 420;
  var im1_y = 230;
  var im_size = 90;
  var w_x = 420 + im_size + 40;
  var w_y = (im0_y + im1_y)/2;
  
  var left_digit = 2;
  var right_digit = 3;
  
  var x = d3.scaleLinear().domain([-21, 21]).range([0, plot_w]);
  var y = d3.scaleLinear().domain([14, -14]).range([0, plot_h]);
  var orange = "rgb(255,102,0)";
  var left_color = d3.interpolateBlues(0.3); //rgb(181, 212, 233)
  var right_color = d3.interpolateBlues(0.7); //rgb(47, 126, 188)
  var arrow_length = 40;
  
  var animationRunning = false;
  var requestId;

  var fig = d3.select("#svm-mnist2")
	          .style("position","relative");

  // plot
  var layer1 = fig.append("svg")
	              .style("position","absolute")
	              .style("left", plot_x+"px")
	              .style("top", plot_y+"px")
	              .attr("width", plot_w)
	              .attr("height", plot_h);

  layer1.append("rect")
        .attr("fill","rgb(98%,98%,98%)")
	    .attr("x", 0)
        .attr("y", 0)
        .attr("width", plot_w)
        .attr("height", plot_h);

  var layer2 = fig.append("canvas")
	              .style("position","absolute")
	              .style("left", plot_x+"px")
	              .style("top", plot_y+"px")
	              .attr("width", plot_w)
	              .attr("height", plot_h);
  var ctx_layer2 = layer2.node().getContext("2d");
  var container = fig.append("custom");
  
  var layer3 = fig.append("svg")
	              .style("position","absolute")
	              .style("left", plot_x+"px")
	              .style("top", plot_y+"px")
	              .attr("width", plot_w)
	              .attr("height", plot_h);
				  
  var d_adv_margin = layer3.append("rect");
  var mean0 = layer3.append("circle");
  var label0 = layer3.append("text");
  var mean1 = layer3.append("circle");
  var label1 = layer3.append("text");
  var boundary = layer3.append("line");
  var w_line = layer3.append("line");
  var w_polygon = layer3.append("polygon");
  var w_text = layer3.append("text");
  var d_adv_line = layer3.append("line");
  var d_adv_arrow1 = layer3.append("path");
  var d_adv_arrow2 = layer3.append("path");
  var d_adv_text =layer3.append("text");

  // foreground
  var foreground = fig.append("svg")
	                  .style("position","absolute")
	                  .style("top", "0px")
	                  .style("left", "0px")
    	   	    	  .attr("width", width)
			          .attr("height", height);
					  
  foreground.append("rect")
            .attr("fill","none")
		    .attr('stroke',"rgb(60%,60%,60%)")
		    .attr("stroke-width", 1)
	        .attr("x", plot_x)
            .attr("y", plot_y)
            .attr("width", plot_w)
            .attr("height", plot_h);
				
  for (var i = 0; i < 9; i++) {
	foreground.append("text")
              .attr("x", radio_x + plot_w/10*i + 22)
	          .attr("y", radio_y + 14)
	          .attr("text-anchor", "start")
	          .attr("font-family","Roboto")
	          .attr("fill", left_color)
 	          .attr("font-weight", "bold")
	          .attr("font-size", "13px")
		      .attr("id","svm-mnist2-first-digit-label-"+i)
              .text(i.toString());
  }
	  
  for (var i = 1; i < 10; i++) {
	foreground.append("text")
              .attr("x", radio_x + plot_w/10*i + 22)
	          .attr("y", radio_y + 49)
	          .attr("text-anchor", "start")
	          .attr("font-family","Roboto")
	          .attr("fill", right_color)
 	          .attr("font-weight", "bold")
	          .attr("font-size", "13px")
			  .attr("id","svm-mnist2-second-digit-label-"+i)
              .text(i.toString());
  }
  
  foreground.append("text")
            .attr("x", reg_x +"px")
	        .attr("y", reg_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(0%,0%,0%)")
	        .attr("font-size", "15px")
            .text("L2 regularization :");
			
  foreground.append("text")
            .attr("x", reg_x + 130 +"px")
	        .attr("y", reg_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
			.attr("font-style","italic")
	        .attr("fill", "rgb(0%,0%,0%)")
	        .attr("font-size", "15px")
            .text("\u03BB")
			.append("tspan")
			.attr("font-style","normal")
			.attr("dx", "2px")
			.text(" = 10");
			
  var reg_text = foreground.append("text");
  
  // arrows
  foreground.append("line")
            .attr("x1", plot_x)
		    .attr("y1", plot_y + plot_h)
		    .attr("x2", plot_x + arrow_length)
		    .attr("y2", plot_y + plot_h)
	        .attr("stroke-width", 2)
			.attr("stroke-dasharray", "5, 3")
	        .attr("stroke", "rgb(0%,0%,0%)");

  foreground.append("polygon")
            .attr("points", (plot_x + arrow_length-4) +","+(plot_y + plot_h)+" "+(plot_x + arrow_length-8)+","+(plot_y + plot_h -4)+" "+(plot_x + arrow_length)+","+(plot_y + plot_h)+" "+(plot_x + arrow_length-8)+","+(plot_y + plot_h + 4))
  	        .attr("fill", "rgb(0%,0%,0%)")
  	        .attr("stroke-width", 1)
  	        .attr("stroke", "rgb(0%,0%,0%)");

  foreground.append("text")
            .attr("x", plot_x + arrow_length + 10)
	        .attr("y", plot_y + plot_h + 5)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(0%,0%,0%)")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
            .text("z");
			
  foreground.append("text")
            .attr("x", plot_x + arrow_length + 12)
	        .attr("y", plot_y + plot_h + 3)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(0%,0%,0%)")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
            .text("\u0302");
			
  foreground.append("line")
            .attr("x1", plot_x)
		    .attr("y1", plot_y + plot_h)
		    .attr("x2", plot_x)
		    .attr("y2", plot_y + plot_h - arrow_length)
	        .attr("stroke-width", 2)
			.attr("stroke-dasharray", "5, 3")
	        .attr("stroke", "rgb(0%,0%,0%)");

  foreground.append("polygon")
            .attr("points", plot_x +","+(plot_y + plot_h - arrow_length)+" "+(plot_x - 4)+","+(plot_y + plot_h - arrow_length + 8)+" "+ plot_x +","+(plot_y + plot_h - arrow_length + 4)+" "+(plot_x + 4)+","+(plot_y + plot_h - arrow_length + 8))
  	        .attr("fill", "rgb(0%,0%,0%)")
  	        .attr("stroke-width", 1)
  	        .attr("stroke", "rgb(0%,0%,0%)");

  foreground.append("text")
            .attr("x", plot_x - 1)
	        .attr("y", plot_y + plot_h - arrow_length - 8)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(0%,0%,0%)")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
            .text("n");
			
  foreground.append("text")
            .attr("x", plot_x + 1)
	        .attr("y", plot_y + plot_h - arrow_length - 10)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(0%,0%,0%)")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
			.text("\u0302")
  
  // mean images
  foreground.append("text")
            .attr("x", im0_x + im_size/2)
	        .attr("y", im0_y + im_size + 20)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "13px")
            .text("Centroid ")
			.append("tspan")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
			.text("i");
			
  foreground.append("text")
            .attr("x", im1_x + im_size/2)
	        .attr("y", im1_y + im_size + 20)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "13px")
            .text("Centroid ")
			.append("tspan")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
			.text("j");
			
  // w
  var w_canvas = fig.append("canvas")
	                .style("position","absolute")
	                .style("left", w_x+"px")
	                .style("top", w_y+"px")
    	   	    	.attr("width", im_size)
			        .attr("height", im_size);
  var w_context = w_canvas.node().getContext("2d");
  w_context.imageSmoothingEnabled = false;
  
  foreground.append("text")
            .attr("x", w_x + im_size/2)
	        .attr("y", w_y + im_size + 20)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "13px")
            .text("Weight vector ")
			.append("tspan")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
			.text("w");
  
  // slider  
  var slider = fig.append("input")
	              .style("position","absolute")
	              .style("left", reg_x +"px")
	              .style("top", reg_y + 25 + "px")
	              .style("margin","0px")
	              .attr("type","range")
	              .attr("min",0)
	              .attr("max",80)
	              .attr("step",1)
	              .attr("value", 40);

  // radio inputs	 
  for (var i = 0; i < 9; i++) {
	fig.append("input")
	   .style("position","absolute")
	   .style("left", radio_x + plot_w/10*i +"px")
	   .style("top", radio_y + "px")
	   .attr("type","radio")
	   .attr("name","svm-mnist2-first-digit")
	   .attr("value",i)
	   .attr("id","svm-mnist2-first-digit-input-"+i);
  }
	  
  for (var i = 1; i < 10; i++) {
	fig.append("input")
	   .style("position","absolute")
	   .style("left", radio_x + plot_w/10*i +"px")
	   .style("top", radio_y + 35 + "px")
	   .attr("type","radio")
	   .attr("name","svm-mnist2-second-digit")
	   .attr("value",i)
	   .attr("id","svm-mnist2-second-digit-input-"+i);
  }
  
  function update_buttons(digit0, digit1) {
    for (var i=0; i<=digit0; i++) {
	  d3.select('#svm-mnist2-second-digit-input-'+i).style('visibility', 'hidden');
      d3.select('#svm-mnist2-second-digit-label-'+i).style('visibility', 'hidden');
    }
    for (var i=digit0+1; i<=9; i++) {
	  d3.select('#svm-mnist2-second-digit-input-'+i).style('visibility', 'visible');
      d3.select('#svm-mnist2-second-digit-label-'+i).style('visibility', 'visible');
    }
    for (var i=0; i<=digit1-1; i++) {
	  d3.select('#svm-mnist2-first-digit-input-'+i).style('visibility', 'visible');
      d3.select('#svm-mnist2-first-digit-label-'+i).style('visibility', 'visible');
    }
    for (var i=digit1; i<=9; i++) {
	  d3.select('#svm-mnist2-first-digit-input-'+i).style('visibility', 'hidden');
      d3.select('#svm-mnist2-first-digit-label-'+i).style('visibility', 'hidden');
    }
	
	slider.property("value", 40);
  }
  
  function draw_plot(digit0, digit1){
	  
    d3.queue().defer(d3.text,"assets/data/data0_"+digit0+digit1+".csv")
	          .defer(d3.text,"assets/data/data1_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/extras_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/w_"+digit0+digit1+".csv")
              .await(draw_all);

    function draw_all(error, text_data0, text_data1, text_extras, text_w) {
      var data0 = d3.csvParseRows(text_data0).map(function(row) {return row.map(function(value) {return +value;});});
      var data1 = d3.csvParseRows(text_data1).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csvParseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});	// theta; b; m; dadv; errTrain; errTest; x1; x2; xm1; xm2; y1; y2; ym1; ym2 
	  var w = d3.csvParseRows(text_w).map(function(row) {return row.map(function(value) {return +value;});});
	  
      var mean0_x = 0, mean1_x = 0;
      for(var i=0; i < 1500; i++){
        mean0_x += data0[i][0];
		mean1_x += data1[i][0];
      }
	  mean_x = (mean1_x-mean0_x)/3000;
      mean0_x = x(-mean_x);
	  mean1_x = x(mean_x);
	  var mean0_y = y(0), mean1_y = y(0);
	  
      foreground.append("image")
		        .attr("x",im0_x)
			    .attr("y",im0_y)
			    .attr("width", im_size)
			    .attr("height", im_size)
			    .attr("xlink:href","assets/mean"+digit0+".png")
				
      foreground.append("image")
		        .attr("x",im1_x)
			    .attr("y",im1_y)
			    .attr("width", im_size)
			    .attr("height", im_size)
			    .attr("xlink:href","assets/mean"+digit1+".png")
	  
	  var theta = extras[0][40];
	  
      reg_text.attr("text-anchor", "start")
	          .attr("font-family","Roboto")
	          .attr("fill", "rgb(0%,0%,0%)")
	          .attr("font-size","10px")
		      .attr("x", reg_x + 178 +"px")
		      .attr("y", reg_y - 6 +"px")
		      .text(parseFloat(3).toFixed(1));
			  
	  w_context.drawImage(img_to_canvas(w[40]),0,0,im_size,im_size);
			  
	  function init_canvas() {
	    container.selectAll("circle0").remove();
        container.selectAll("circle0")
                 .data(data0)
	             .enter()
	             .append("circle0")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[41]);})
		         .attr("r", 0.75)
	             .attr("lineWidth", 0.6)
                 .attr("strokeStyle", left_color)
			     .attr("fillStyle", left_color);
  				 
	    container.selectAll("circle1").remove();
	    container.selectAll("circle1")
                 .data(data1)
		         .enter()
		         .append("circle1")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[41]);})
		         .attr("r", 0.75)
			     .attr("lineWidth", 0.6)
                 .attr("strokeStyle", right_color)
			     .attr("fillStyle", right_color);
	  }

      function draw_layer2() {
        //Clear canvas
        ctx_layer2.clearRect(0, 0, width, height);
	
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
	    mean0.attr("cx", mean0_x)
		     .attr("cy", mean0_y)
		     .attr("r", 2.5)
		     .attr("fill", "rgb(0%,0%,0%)");
			 
        label0.attr("text-anchor", "middle")
	          .attr("font-family","Roboto")
	          .attr("fill", "rgb(0%,0%,0%)")
			  .attr("font-weight", "bold")
 	          .attr("font-style", "italic")
	          .attr("font-size", "15px")
		      .attr("x", mean0_x)
	          .attr("y", mean0_y + 20)
              .text("i");
			   
	    mean1.attr("cx", mean1_x)
		     .attr("cy", mean1_y)
		     .attr("r", 2.5)
		     .attr("fill", "rgb(0%,0%,0%)");
			 
        label1.attr("text-anchor", "middle")
	          .attr("font-family","Roboto")
	          .attr("fill", "rgb(0%,0%,0%)")
			  .attr("font-weight", "bold")
 	          .attr("font-style", "italic")
	          .attr("font-size", "15px")
		      .attr("x", mean1_x)
	          .attr("y", mean1_y - 15)
              .text("j");
			 
	    d_adv_margin.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	                .attr("fill", "rgba(0,0,0,0.07)")
                    .attr("x", x(-mean_x*Math.cos(theta)))
                    .attr("y", -200)
                    .attr("width", 2*(x(mean_x*Math.cos(theta))-x(0)))
                    .attr("height", plot_w+200);
		
		var d_adv_width = 2*mean_x*Math.cos(theta);
		var anchor_x = -mean_x + 12*Math.tan(theta);
		var anchor_y = -12;
        d_adv_line.attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
	              .attr("stroke","rgb(40%,40%,40%)")
		          .attr("stroke-width",0.5)
		          .style("stroke-dasharray", ("2, 1"))
                  .attr("x1", x(anchor_x))
                  .attr("y1", y(anchor_y))
                  .attr("x2", x(anchor_x + d_adv_width))
                  .attr("y2", y(anchor_y));
				  
        d_adv_arrow1.attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
			        .attr("d","M "+ (x(anchor_x)+5) +" "+ (y(anchor_y)+3) +" L "+ x(anchor_x) +" "+ y(anchor_y) +" L "+ (x(anchor_x)+5) +" "+ (y(anchor_y)-3))
                    .style("stroke-width", 0.5)
                    .style("stroke", "rgb(40%,40%,40%)")
                    .style("fill", "none");
			  
        d_adv_arrow2.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
			        .attr("d","M "+ (x(anchor_x+d_adv_width)-5) +" "+ (y(anchor_y)+3) +" L "+ x(anchor_x+d_adv_width) +" "+ y(anchor_y) +" L "+ (x(anchor_x+d_adv_width)-5) +" "+ (y(anchor_y)-3))
                    .style("stroke-width", 0.5)
                    .style("stroke", "rgb(40%,40%,40%)")
                    .style("fill", "none");
					
        d_adv_text.attr("fill", "rgb(60%,60%,60%)")
	              .attr("font-family","Roboto")
	              .attr("font-size", "13px")
	              .attr("text-anchor", "end")
			      .attr("font-style", "italic")
                  .attr("x", x(anchor_x)-10)
	              .attr("y", y(anchor_y)+10)
		          .text("2 d")
	              .append("tspan")
                  .attr("font-size", "10px")
                  .attr("dx", "1px")
                  .attr("dy", "4px")
	              .text("adv");
			  
	    boundary.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	            .attr("stroke-width", 2.5)
                .attr("x1", x(-extras[1][40]))
	            .attr("y1", -plot_h/2)
	            .attr("x2", x(-extras[1][40]))
	            .attr("y2", 2*plot_h)
	            .attr("stroke", orange);
				
	    // w_theta
        w_line.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("x1", x(-extras[1][40]))
		      .attr("y1", y(0))
		      .attr("x2", x(-extras[1][40])+arrow_length)
		      .attr("y2", y(0))
	          .attr("stroke-width", 2)
			  .attr("stroke-dasharray", "5, 3")
	          .attr("stroke", orange);

        w_polygon.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
                 .attr("points", (x(-extras[1][40])+arrow_length-4)+","+y(0)+" "+(x(-extras[1][40])+arrow_length-8)+","+(y(0)-4)+" "+(x(-extras[1][40])+arrow_length)+","+y(0)+" "+(x(-extras[1][40])+arrow_length-8)+","+(y(0)+4))
  	             .attr("fill", orange)
  	             .attr("stroke-width", 1)
  	             .attr("stroke", orange);

        w_text.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("x", x(-extras[1][40])+arrow_length+10)
	          .attr("y", y(-0.4))
	          .attr("text-anchor", "middle")
	          .attr("font-family","Roboto")
	          .attr("fill", orange)
 	          .attr("font-style", "italic")
 	          .attr("font-weight", "bold")
	          .attr("font-size", "15px")
              .text("\u0175");
	  }
	  
      function svm_mnist_update(reg_index) {
		theta = extras[0][80-reg_index];
		  
        container.selectAll("circle0")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});

	    container.selectAll("circle1")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});
				 
	    d_adv_margin.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
                    .attr("x", x(-mean_x*Math.cos(theta)))
                    .attr("width", 2*(x(mean_x*Math.cos(theta))-x(0)))
		
		var d_adv_width = 2*mean_x*Math.cos(theta);
       	var anchor_x = -mean_x + 12*Math.tan(theta);
		var anchor_y = -12;
		if (anchor_x > 18) {
		  anchor_x = 18;
		  anchor_y = - (mean_x+18)/Math.tan(theta);
		}
        d_adv_line.attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
                  .attr("x1", x(anchor_x))
                  .attr("y1", y(anchor_y))
                  .attr("x2", x(anchor_x + d_adv_width))
                  .attr("y2", y(anchor_y));
				  
        d_adv_arrow1.attr("transform", "rotate("+ (-90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
			        .attr("d","M "+ (x(anchor_x)+5) +" "+ (y(anchor_y)+3) +" L "+ x(anchor_x) +" "+ y(anchor_y) +" L "+ (x(anchor_x)+5) +" "+ (y(anchor_y)-3));
			  
        d_adv_arrow2.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(anchor_x) +","+ y(anchor_y) +")")
			        .attr("d","M "+ (x(anchor_x+d_adv_width)-5) +" "+ (y(anchor_y)+3) +" L "+ x(anchor_x+d_adv_width) +" "+ y(anchor_y) +" L "+ (x(anchor_x+d_adv_width)-5) +" "+ (y(anchor_y)-3));

        d_adv_text.attr("x", x(anchor_x)-10)
	              .attr("y", y(anchor_y)+10);
					
		boundary.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
                .attr("x1", x(-extras[1][80-reg_index]))
	            .attr("x2", x(-extras[1][80-reg_index]));
				
        w_line.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("x1", x(-extras[1][80-reg_index]))
		      .attr("x2", x(-extras[1][80-reg_index])+arrow_length);
			  
        w_polygon.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
                 .attr("points", (x(-extras[1][80-reg_index])+arrow_length-4)+","+y(0)+" "+(x(-extras[1][80-reg_index])+arrow_length-8)+","+(y(0)-4)+" "+(x(-extras[1][80-reg_index])+arrow_length)+","+y(0)+" "+(x(-extras[1][80-reg_index])+arrow_length-8)+","+(y(0)+4));

        w_text.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("x", x(-extras[1][80-reg_index])+arrow_length+10);
				 
		reg_text.text(parseFloat(-1+reg_index*0.1).toFixed(1));
	    w_context.drawImage(img_to_canvas(w[80-reg_index]),0,0,im_size,im_size);
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
	  draw_layer2();
	  draw_layer3();
      slider.on("input", function() {if (!animationRunning) {
			                          animationRunning = true;
			                          requestId = window.requestAnimationFrame(animate);
		                            }
									input_time = Date.now();
		                            svm_mnist_update(this.value);});
    }
  }
  
  d3.select("#svm-mnist2-first-digit-input-"+left_digit).property("checked", true);
  d3.select("#svm-mnist2-second-digit-input-"+right_digit).property("checked", true);
  update_buttons(left_digit,right_digit);
  draw_plot(left_digit, right_digit);
  
  d3.selectAll('input[name="svm-mnist2-first-digit"]').on('click', function() {left_digit = +this.value;
                                                                               update_buttons(left_digit,right_digit);
																               draw_plot(left_digit, right_digit);
																			   });
  d3.selectAll('input[name="svm-mnist2-second-digit"]').on('click', function() {right_digit = +this.value;
                                                                                update_buttons(left_digit,right_digit);
																	            draw_plot(left_digit, right_digit);
																				});
}

function svm_mnist3(){
  var width = 648;
  var height = 370;
  var plot_x = 5;
  var plot_y = 100;
  var plot_w = 360;
  var plot_h = 240;
  
  var radio_x = 10;
  var radio_y = 20;
  var reg_x = 420;
  var reg_y = 30;

  var im_size = 90;
  var imx_x = 420;
  var imx_y = 100;
  var imy_x = 420;
  var imy_y = 230;
  var imxm_x = 420 + im_size + 40;
  var imxm_y = 100;
  var imym_x = 420 + im_size + 40;
  var imym_y = 230;

  
  var left_digit = 2;
  var right_digit = 3;
  
  var x = d3.scaleLinear().domain([-21, 21]).range([0, plot_w]);
  var y = d3.scaleLinear().domain([14, -14]).range([0, plot_h]);
  var blue = d3.interpolateBlues(0.7);
  var orange = "rgb(255,102,0)";
  var left_color = d3.interpolateBlues(0.3); //rgb(181, 212, 233)
  var right_color = d3.interpolateBlues(0.7); //rgb(47, 126, 188)
  var light_left_color = "rgb(97.5%,97.5%,97.5%)";
  var light_right_color = "rgb(92.5%,92.5%,92.5%)";
  
  var animationRunning = false;
  var requestId;

  var fig = d3.select("#svm-mnist3")
	          .style("position","relative");

  // plot
  var layer1 = fig.append("svg")
	              .style("position","absolute")
	              .style("left", plot_x+"px")
	              .style("top", plot_y+"px")
	              .attr("width", plot_w)
	              .attr("height", plot_h);

  var background_left = layer1.append("rect");
  var background_right = layer1.append("rect");

  var layer2 = fig.append("canvas")
	              .style("position","absolute")
	              .style("left", plot_x+"px")
	              .style("top", plot_y+"px")
	              .attr("width", plot_w)
	              .attr("height", plot_h);
  var ctx_layer2 = layer2.node().getContext("2d");
  var container = fig.append("custom");
  
  var layer3 = fig.append("svg")
	              .style("position","absolute")
	              .style("left", plot_x+"px")
	              .style("top", plot_y+"px")
	              .attr("width", plot_w)
	              .attr("height", plot_h);
				  
  var boundary = layer3.append("line");
  var point_x = layer3.append("circle");
  var point_xm = layer3.append("circle");
  var point_y = layer3.append("circle");
  var point_ym = layer3.append("circle");
  var line_x_xm = layer3.append("line");
  var line_y_ym = layer3.append("line");
  var label_x = layer3.append("text");
  var label_xm = layer3.append("text");
  var label_y = layer3.append("text");
  var label_ym = layer3.append("text");

  // foreground
  var foreground = fig.append("svg")
	                  .style("position","absolute")
	                  .style("top", "0px")
	                  .style("left", "0px")
    	   	    	  .attr("width", width)
			          .attr("height", height);
					  
  foreground.append("rect")
            .attr("fill","none")
		    .attr('stroke',"rgb(60%,60%,60%)")
		    .attr("stroke-width", 1)
	        .attr("x", plot_x)
            .attr("y", plot_y)
            .attr("width", plot_w)
            .attr("height", plot_h);
				
  for (var i = 0; i < 9; i++) {
	foreground.append("text")
              .attr("x", radio_x + plot_w/10*i + 22)
	          .attr("y", radio_y + 14)
	          .attr("text-anchor", "start")
	          .attr("font-family","Roboto")
	          .attr("fill", left_color)
 	          .attr("font-weight", "bold")
	          .attr("font-size", "13px")
		      .attr("id","svm-mnist3-first-digit-label-"+i)
              .text(i.toString());
  }
	  
  for (var i = 1; i < 10; i++) {
	foreground.append("text")
              .attr("x", radio_x + plot_w/10*i + 22)
	          .attr("y", radio_y + 49)
	          .attr("text-anchor", "start")
	          .attr("font-family","Roboto")
	          .attr("fill", right_color)
 	          .attr("font-weight", "bold")
	          .attr("font-size", "13px")
			  .attr("id","svm-mnist3-second-digit-label-"+i)
              .text(i.toString());
  }
  
  foreground.append("text")
            .attr("x", reg_x +"px")
	        .attr("y", reg_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(0%,0%,0%)")
	        .attr("font-size", "15px")
            .text("L2 regularization :");
			
  foreground.append("text")
            .attr("x", reg_x + 130 +"px")
	        .attr("y", reg_y +"px")
	        .attr("text-anchor", "start")
	        .attr("font-family","Roboto")
			.attr("font-style","italic")
	        .attr("fill", "rgb(0%,0%,0%)")
	        .attr("font-size", "15px")
            .text("\u03BB")
			.append("tspan")
			.attr("font-style","normal")
			.attr("dx", "2px")
			.text(" = 10");

  var reg_text = foreground.append("text");
  reg_text.attr("text-anchor", "start")
	      .attr("font-family","Roboto")
	      .attr("fill", "rgb(0%,0%,0%)")
	      .attr("font-size","10px")
		  .attr("x", reg_x + 178 +"px")
		  .attr("y", reg_y - 6 +"px")
		  .text(parseFloat(3).toFixed(1));
		  
  // x xm y ym
  var imx_canvas = fig.append("canvas")
	                .style("position","absolute")
	                .style("left", imx_x+"px")
	                .style("top", imx_y+"px")
    	   	    	.attr("width", im_size)
			        .attr("height", im_size);
  var imx_context = imx_canvas.node().getContext("2d");
  imx_context.imageSmoothingEnabled = false;
  
  foreground.append("text")
            .attr("x", imx_x + im_size/2)
	        .attr("y", imx_y + im_size + 20)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "13px")
            .text("Image ")
			.append("tspan")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
			.text("x");
			
  var imxm_canvas = fig.append("canvas")
	                .style("position","absolute")
	                .style("left", imxm_x+"px")
	                .style("top", imxm_y+"px")
    	   	    	.attr("width", im_size)
			        .attr("height", im_size);
  var imxm_context = imxm_canvas.node().getContext("2d");
  imxm_context.imageSmoothingEnabled = false;
  
  foreground.append("text")
            .attr("x", imxm_x + im_size/2)
	        .attr("y", imxm_y + im_size + 20)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "13px")
            .text("Mirror image ")
			.append("tspan")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
			.text("x")
			.append("tspan")
	        .attr("font-size", "10px")
			.attr("dx",1)
			.attr("dy",2)
			.text("m");
			
  var imy_canvas = fig.append("canvas")
	                .style("position","absolute")
	                .style("left", imy_x+"px")
	                .style("top", imy_y+"px")
    	   	    	.attr("width", im_size)
			        .attr("height", im_size);
  var imy_context = imy_canvas.node().getContext("2d");
  imy_context.imageSmoothingEnabled = false;
  
  foreground.append("text")
            .attr("x", imy_x + im_size/2)
	        .attr("y", imy_y + im_size + 20)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "13px")
            .text("Image ")
			.append("tspan")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
			.text("y");
			
  var imym_canvas = fig.append("canvas")
	                .style("position","absolute")
	                .style("left", imym_x+"px")
	                .style("top", imym_y+"px")
    	   	    	.attr("width", im_size)
			        .attr("height", im_size);
  var imym_context = imym_canvas.node().getContext("2d");
  imym_context.imageSmoothingEnabled = false;
  
  foreground.append("text")
            .attr("x", imym_x + im_size/2)
	        .attr("y", imym_y + im_size + 20)
	        .attr("text-anchor", "middle")
	        .attr("font-family","Roboto")
	        .attr("fill", "rgb(60%,60%,60%)")
	        .attr("font-size", "13px")
            .text("Mirro image ")
			.append("tspan")
 	        .attr("font-style", "italic")
 	        .attr("font-weight", "bold")
	        .attr("font-size", "15px")
			.text("y")
			.append("tspan")
	        .attr("font-size", "10px")
			.attr("dx",1)
			.attr("dy",2)
			.text("m");
  
  // slider  
  var slider = fig.append("input")
	              .style("position","absolute")
	              .style("left", reg_x +"px")
	              .style("top", reg_y + 25 + "px")
	              .style("margin","0px")
	              .attr("type","range")
	              .attr("min",0)
	              .attr("max",80)
	              .attr("step",1)
	              .attr("value", 40);

  // radio inputs	 
  for (var i = 0; i < 9; i++) {
	fig.append("input")
	   .style("position","absolute")
	   .style("left", radio_x + plot_w/10*i +"px")
	   .style("top", radio_y + "px")
	   .attr("type","radio")
	   .attr("name","svm-mnist3-first-digit")
	   .attr("value",i)
	   .attr("id","svm-mnist3-first-digit-input-"+i);
  }
	  
  for (var i = 1; i < 10; i++) {
	fig.append("input")
	   .style("position","absolute")
	   .style("left", radio_x + plot_w/10*i +"px")
	   .style("top", radio_y + 35 + "px")
	   .attr("type","radio")
	   .attr("name","svm-mnist3-second-digit")
	   .attr("value",i)
	   .attr("id","svm-mnist3-second-digit-input-"+i);
  }
  
  function update_buttons(digit0, digit1) {
    for (var i=0; i<=digit0; i++) {
	  d3.select('#svm-mnist3-second-digit-input-'+i).style('visibility', 'hidden');
      d3.select('#svm-mnist3-second-digit-label-'+i).style('visibility', 'hidden');
    }
    for (var i=digit0+1; i<=9; i++) {
	  d3.select('#svm-mnist3-second-digit-input-'+i).style('visibility', 'visible');
      d3.select('#svm-mnist3-second-digit-label-'+i).style('visibility', 'visible');
    }
    for (var i=0; i<=digit1-1; i++) {
	  d3.select('#svm-mnist3-first-digit-input-'+i).style('visibility', 'visible');
      d3.select('#svm-mnist3-first-digit-label-'+i).style('visibility', 'visible');
    }
    for (var i=digit1; i<=9; i++) {
	  d3.select('#svm-mnist3-first-digit-input-'+i).style('visibility', 'hidden');
      d3.select('#svm-mnist3-first-digit-label-'+i).style('visibility', 'hidden');
    }
	
	slider.property("value", 40);
  }
  
  function draw_plot(digit0, digit1){
	  
    d3.queue().defer(d3.text,"assets/data/data0_"+digit0+digit1+".csv")
	          .defer(d3.text,"assets/data/data1_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/extras_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/x_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/xm_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/y_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/ym_"+digit0+digit1+".csv")
              .await(draw_all);

    function draw_all(error, text_data0, text_data1, text_extras, text_x, text_xm, text_y, text_ym) {
      var data0 = d3.csvParseRows(text_data0).map(function(row) {return row.map(function(value) {return +value;});});
      var data1 = d3.csvParseRows(text_data1).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csvParseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});	// theta; b; m; dadv; errTrain; errTest; x1; x2; xm1; xm2; y1; y2; ym1; ym2 
	  var imx = d3.csvParseRows(text_x).map(function(row) {return row.map(function(value) {return +value;});});
	  var imxm = d3.csvParseRows(text_xm).map(function(row) {return row.map(function(value) {return +value;});});
	  var imy = d3.csvParseRows(text_y).map(function(row) {return row.map(function(value) {return +value;});});
	  var imym = d3.csvParseRows(text_ym).map(function(row) {return row.map(function(value) {return +value;});});
	  
	  var theta = extras[0][40];
	  
	  imx_context.drawImage(img_to_canvas(imx[40]),0,0,im_size,im_size);
	  imxm_context.drawImage(img_to_canvas(imxm[40]),0,0,im_size,im_size);
	  imy_context.drawImage(img_to_canvas(imy[40]),0,0,im_size,im_size);
	  imym_context.drawImage(img_to_canvas(imym[40]),0,0,im_size,im_size);
			  
	  function init_canvas() {
	    container.selectAll("circle0").remove();
        container.selectAll("circle0")
                 .data(data0)
	             .enter()
	             .append("circle0")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[41]);})
		         .attr("r", 0.75)
	             .attr("lineWidth", 0.6)
                 .attr("strokeStyle", left_color)
			     .attr("fillStyle", left_color);
  				 
	    container.selectAll("circle1").remove();
	    container.selectAll("circle1")
                 .data(data1)
		         .enter()
		         .append("circle1")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[41]);})
		         .attr("r", 0.75)
			     .attr("lineWidth", 0.6)
                 .attr("strokeStyle", right_color)
			     .attr("fillStyle", right_color);
	  }
	  
	  function draw_layer1() {
	    background_left.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
                       .attr("fill",light_left_color)
			           .attr("x", x(-extras[1][40])-x(0)-plot_w/2)
                       .attr("y", -plot_h/2)
                       .attr("width", plot_w)
                       .attr("height", 2*plot_h);
			  
        background_right.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
                        .attr("fill",light_right_color)
			            .attr("x", x(-extras[1][40])-x(0)+plot_w/2)
                        .attr("y", -plot_h/2)
                        .attr("width", plot_w)
                        .attr("height", 2*plot_h);
	  }

      function draw_layer2() {
        //Clear canvas
        ctx_layer2.clearRect(0, 0, plot_w, plot_h);
	
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
	    boundary.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	            .attr("stroke-width", 2.5)
                .attr("x1", x(-extras[1][40]))
	            .attr("y1", -plot_h/2)
	            .attr("x2", x(-extras[1][40]))
	            .attr("y2", 2*plot_h)
	            .attr("stroke", orange);
				
	    // imx imxm imy imym	  
        point_x.attr("cx",x(extras[6][40]))
			    .attr("cy",y(extras[7][40]))
			    .attr("r",2.5)
			    .attr("fill","rgb(0%,0%,0%)");
			
	    point_xm.attr("cx",x(extras[8][40]))
			    .attr("cy",y(extras[9][40]))
			    .attr("r",2.5)
			    .attr("fill","rgb(0%,0%,0%)");
			
	    point_y.attr("cx",x(extras[10][40]))
			   .attr("cy",y(extras[11][40]))
			   .attr("r",2.5)
			   .attr("fill","rgb(0%,0%,0%)");

	    point_ym.attr("cx",x(extras[12][40]))
			    .attr("cy",y(extras[13][40]))
			    .attr("r",2.5)
			    .attr("fill","rgb(0%,0%,0%)");
				
        line_x_xm.attr("x1", x(extras[6][40]))
		         .attr("y1", y(extras[7][40]))
		         .attr("x2", x(extras[8][40]))
		         .attr("y2", y(extras[9][40]))
	             .attr("stroke-width", 1)
			     .attr("stroke-dasharray", "3, 1")
	             .attr("stroke", "rgb(0%,0%,0%)");

        line_y_ym.attr("x1", x(extras[10][40]))
		         .attr("y1", y(extras[11][40]))
		         .attr("x2", x(extras[12][40]))
		         .attr("y2", y(extras[13][40]))
	             .attr("stroke-width", 1)
			     .attr("stroke-dasharray", "3, 1")
	             .attr("stroke", "rgb(0%,0%,0%)");
				 
        label_x.attr("text-anchor", "middle")
	           .attr("font-family","Roboto")
	           .attr("fill", "rgb(0%,0%,0%)")
 	           .attr("font-style", "italic")
	 	       .attr("font-weight", "bold")
	           .attr("font-size", "15px")
		       .attr("x", x(extras[6][40])-3)
	           .attr("y", y(extras[7][40])+15)
               .text("x");
			  
        label_xm.attr("text-anchor", "middle")
	            .attr("font-family","Roboto")
	            .attr("fill", "rgb(0%,0%,0%)")
 	            .attr("font-style", "italic")
	 	        .attr("font-weight", "bold")
	            .attr("font-size", "15px")
			    .attr("x", x(extras[8][40])-3)
	            .attr("y", y(extras[9][40])-10)
                .text("x")
			    .append("tspan")
	            .attr("font-size", "10px")
			    .attr("dx",1)
			    .attr("dy",2)
			    .text("m");
			  
        label_y.attr("text-anchor", "middle")
	           .attr("font-family","Roboto")
	           .attr("fill", "rgb(0%,0%,0%)")
 	           .attr("font-style", "italic")
	 	       .attr("font-weight", "bold")
	           .attr("font-size", "15px")
			   .attr("x", x(extras[10][40])-3)
	           .attr("y", y(extras[11][40])-10)
               .text("y");
			  
        label_ym.attr("text-anchor", "middle")
	            .attr("font-family","Roboto")
	            .attr("fill", "rgb(0%,0%,0%)")
 	            .attr("font-style", "italic")
	 	        .attr("font-weight", "bold")
	            .attr("font-size", "15px")
			    .attr("x", x(extras[12][40])-3)
	            .attr("y", y(extras[13][40])+15)
                .text("y")
			    .append("tspan")
	            .attr("font-size", "10px")
			    .attr("dx",1)
			    .attr("dy",2)
			    .text("m");
	  }
	  
      function svm_mnist_update(reg_index) {
		theta = extras[0][80-reg_index];
		
	    background_left.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
			           .attr("x", x(-extras[1][80-reg_index])-x(0)-plot_w/2);
					   
        background_right.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
			            .attr("x", x(-extras[1][80-reg_index])-x(0)+plot_w/2);
		  
        container.selectAll("circle0")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});

	    container.selectAll("circle1")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});
				 
		boundary.attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
                .attr("x1", x(-extras[1][80-reg_index]))
	            .attr("x2", x(-extras[1][80-reg_index]));
				
        point_x.attr("cx",x(extras[6][80-reg_index]))
			    .attr("cy",y(extras[7][80-reg_index]));
				
	    point_xm.attr("cx",x(extras[8][80-reg_index]))
			    .attr("cy",y(extras[9][80-reg_index]));
				
	    point_y.attr("cx",x(extras[10][80-reg_index]))
			   .attr("cy",y(extras[11][80-reg_index]));
			   
	    point_ym.attr("cx",x(extras[12][80-reg_index]))
			    .attr("cy",y(extras[13][80-reg_index]));
				
        line_x_xm.attr("x1", x(extras[6][80-reg_index]))
		         .attr("y1", y(extras[7][80-reg_index]))
		         .attr("x2", x(extras[8][80-reg_index]))
		         .attr("y2", y(extras[9][80-reg_index]));
				 
        line_y_ym.attr("x1", x(extras[10][80-reg_index]))
		         .attr("y1", y(extras[11][80-reg_index]))
		         .attr("x2", x(extras[12][80-reg_index]))
		         .attr("y2", y(extras[13][80-reg_index]));
				 
        label_x.attr("x", x(extras[6][80-reg_index])-3)
	           .attr("y", y(extras[7][80-reg_index])+15);
			   
        label_xm.attr("x", x(extras[8][80-reg_index])-3)
	            .attr("y", y(extras[9][80-reg_index])-10);
				
        label_y.attr("x", x(extras[10][80-reg_index])-3)
	           .attr("y", y(extras[11][80-reg_index])-10);
			   
        label_ym.attr("x", x(extras[12][80-reg_index])-3)
	            .attr("y", y(extras[13][80-reg_index])+15);
	  
		reg_text.text(parseFloat(-1+reg_index*0.1).toFixed(1));
		
	    imx_context.drawImage(img_to_canvas(imx[80-reg_index]),0,0,im_size,im_size);
	    imxm_context.drawImage(img_to_canvas(imxm[80-reg_index]),0,0,im_size,im_size);
	    imy_context.drawImage(img_to_canvas(imy[80-reg_index]),0,0,im_size,im_size);
	    imym_context.drawImage(img_to_canvas(imym[80-reg_index]),0,0,im_size,im_size);
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
      slider.on("input", function() {if (!animationRunning) {
			                          animationRunning = true;
			                          requestId = window.requestAnimationFrame(animate);
		                            }
									input_time = Date.now();
		                            svm_mnist_update(this.value);});
    }
  }
  
  d3.select("#svm-mnist3-first-digit-input-"+left_digit).property("checked", true);
  d3.select("#svm-mnist3-second-digit-input-"+right_digit).property("checked", true);
  update_buttons(left_digit,right_digit);
  draw_plot(left_digit, right_digit);
  
  d3.selectAll('input[name="svm-mnist3-first-digit"]').on('click', function() {left_digit = +this.value;
                                                                               update_buttons(left_digit,right_digit);
																               draw_plot(left_digit, right_digit);
																			   });
  d3.selectAll('input[name="svm-mnist3-second-digit"]').on('click', function() {right_digit = +this.value;
                                                                                update_buttons(left_digit,right_digit);
																	            draw_plot(left_digit, right_digit);
																				});
}

function svm_mnist() {
  var width = 420;
  var height = 280;
  var x = d3.scaleLinear().domain([-21,21]).range([0, width]);
  var y = d3.scaleLinear().domain([14,-14]).range([0, height]);
  var left_digit = 2;
  var right_digit = 3;
  var left_color = d3.interpolateBlues(0.3); //rgb(181, 212, 233)
  var right_color = d3.interpolateBlues(0.7); //rgb(47, 126, 188)
  var orange = "rgb(255,102,0)";
  var animationRunning = false;
  var requestId;
  var theta;
  var reg_index;

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
  
  function draw_fig(digit0, digit1) {
	reg_index = 0;
	  
    d3.queue().defer(d3.text,"assets/data/data0_"+digit0+digit1+".csv")
              .defer(d3.text,"assets/data/data1_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/extras_"+digit0+digit1+".csv")
              .defer(d3.text,"assets/data/w_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/x_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/xm_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/y_"+digit0+digit1+".csv")
		      .defer(d3.text,"assets/data/ym_"+digit0+digit1+".csv")
              .await(draw_all);

    function draw_all(error, text_data0, text_data1, text_extras, text_w, text_x, text_xm, text_y, text_ym) {
      var data0 = d3.csvParseRows(text_data0).map(function(row) {return row.map(function(value) {return +value;});});
	  var data1 = d3.csvParseRows(text_data1).map(function(row) {return row.map(function(value) {return +value;});});
	  var extras = d3.csvParseRows(text_extras).map(function(row) {return row.map(function(value) {return +value;});});	// m; dadv; errTrain; errTest; b; theta; x1; x2; xm1; xm2; y1; y2; ym1; ym2
	  var w = d3.csvParseRows(text_w).map(function(row) {return row.map(function(value) {return +value;});});
	  var imx = d3.csvParseRows(text_x).map(function(row) {return row.map(function(value) {return +value;});});
	  var imxm = d3.csvParseRows(text_xm).map(function(row) {return row.map(function(value) {return +value;});});
	  var imy = d3.csvParseRows(text_y).map(function(row) {return row.map(function(value) {return +value;});});
	  var imym = d3.csvParseRows(text_ym).map(function(row) {return row.map(function(value) {return +value;});});

	  var max_dAdv = Math.round( Math.max.apply(null, extras[12]) * 10) / 10;
      var min_errTrain = Math.round( Math.min.apply(null, extras[13]) * 10) / 10;
	  var min_errTest = Math.round( Math.min.apply(null, extras[14]) * 10) / 10;
	  
      var fig = d3.select("#fig4-right-content");
	  fig.style("position","relative");
	  
      if (!fig.select("#svm-mnist-layer1").empty())
	    fig.select("#svm-mnist-layer1").remove();
	
      if (!fig.select("#svm-mnist-layer2").empty())
	    fig.select("#svm-mnist-layer2").remove();
	
      if (!fig.select("#svm-mnist-layer3").empty())
	    fig.select("#svm-mnist-layer3").remove();
	  
      var layer1 = fig.append("svg")
	                  .style("position","absolute")
					  .attr("id","svm-mnist-layer1")
                      .attr("width", width)
                      .attr("height", height)
					  .style("top", "0px")
					  .style("left", "0px");
	  
      var layer2 = fig.append("canvas")
					  .style("position","absolute")
					  .attr("id","svm-mnist-layer2")
                      .attr("width", width)
                      .attr("height", height)
					  .style("top", "0px")
					  .style("left", "0px");
	  var ctx_layer2 = layer2.node().getContext("2d");
	  
      var layer3 = fig.append("svg")
	                  .style("position","absolute")
					  .attr("id","svm-mnist-layer3")
                      .attr("width", width)
                      .attr("height", height)
					  .style("top", "0px")
					  .style("left", "0px");
	  
      var container = fig.append("custom");
	  var input_time;
	  
	  theta = extras[1][80-reg_index];

	  function init_canvas() {
        container.selectAll("circle0")
                 .data(data0)
	             .enter()
	             .append("circle0")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[80-reg_index+1]);})
		         .attr("r", 0.75)
	             .attr("lineWidth", 0.6)
                 .attr("strokeStyle", left_color)
			     .attr("fillStyle", left_color);
  				 
	    container.selectAll("circle1")
                 .data(data1)
		         .enter()
		         .append("circle1")
                 .attr("x", function (d) { return x(d[0]);})
		         .attr("y", function (d) { return y(d[80-reg_index+1]);})
		         .attr("r", 0.75)
			     .attr("lineWidth", 0.6)
                 .attr("strokeStyle", right_color)
			     .attr("fillStyle", right_color);
	  }

	  function draw_layer1() {
        layer1.append("rect")
		      .attr("id","svm-mnist-layer1-left")
			  .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("fill","rgb(97.5%,97.5%,97.5%)")
			  .attr("x", x(-extras[0][80-reg_index])-x(0)-width/2)
              .attr("y", -height/2)
              .attr("width", width)
              .attr("height", 2*height);
			  
        layer1.append("rect")
		      .attr("id","svm-mnist-layer1-right")
			  .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("fill","rgb(90%,90%,90%)")
			  .attr("x", x(-extras[0][80-reg_index])-x(0)+width/2)
              .attr("y", -height/2)
              .attr("width", width)
              .attr("height", 2*height);
	  }
	  
      function draw_layer2() {
        //Clear canvas
        ctx_layer2.clearRect(0, 0, width, height);
	
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
		// boundary
	    layer3.append("line")
		      .attr("id","svm-mnist-layer3-boundary")
			  .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
	          .attr("stroke-width", 2.5)
              .attr("x1", x(-extras[0][80-reg_index]))
	          .attr("y1", -height/2)
	          .attr("x2", x(-extras[0][80-reg_index]))
	          .attr("y2", 2*height)
	          .attr("stroke", orange);
			  
	    // w_theta
        layer3.append("line")
	          .attr("id","svm-mnist-layer3-w-line")
			  .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("x1", x(-extras[0][80-reg_index]))
		      .attr("y1", y(0))
		      .attr("x2", x(-extras[0][80-reg_index]+6))
		      .attr("y2", y(0))
	          .attr("stroke-width", 2)
			  .attr("stroke-dasharray", "5, 3")
	          .attr("stroke", orange);

        layer3.append("polygon")
	          .attr("id","svm-mnist-layer3-w-polygon")
		  	  .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("points", x(-extras[0][80-reg_index]+5.6)+","+y(0)+" "+x(-extras[0][80-reg_index]+5.2)+","+y(-0.5)+" "+x(-extras[0][80-reg_index]+6)+","+y(0)+" "+x(-extras[0][80-reg_index]+5.2)+","+y(0.5))
  	          .attr("fill", orange)
  	          .attr("stroke-width", 1)
  	          .attr("stroke", orange);
		 
        layer3.append("text")
	          .attr("id","svm-mnist-layer3-w-text")
			  .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
              .attr("x", x(-extras[0][80-reg_index]+7))
	          .attr("y", y(-0.4))
	          .attr("text-anchor", "middle")
	          .attr("font-family","Roboto")
	          .attr("fill", orange)
 	          .attr("font-style", "italic")
 	          .attr("font-weight", "bold")
	          .attr("font-size", "15px")
              .text("\u0175");
			  
	    // imx imxm imy imym	  
	    layer3.append("circle")
	          .attr("id","svm-mnist-layer3-x-circle")
	          .attr("cx",x(extras[2][80-reg_index]))
			  .attr("cy",y(extras[3][80-reg_index]))
			  .attr("r",3)
			  .attr("fill","rgb(0%,0%,0%)");
			
	    layer3.append("circle")
	          .attr("id","svm-mnist-layer3-xm-circle")
	          .attr("cx",x(extras[4][80-reg_index]))
			  .attr("cy",y(extras[5][80-reg_index]))
			  .attr("r",3)
			  .attr("fill","rgb(0%,0%,0%)");
			
	    layer3.append("circle")
	          .attr("id","svm-mnist-layer3-y-circle")
	          .attr("cx",x(extras[6][80-reg_index]))
			  .attr("cy",y(extras[7][80-reg_index]))
			  .attr("r",3)
			  .attr("fill","rgb(0%,0%,0%)");
			
	    layer3.append("circle")
	          .attr("id","svm-mnist-layer3-ym-circle")
	          .attr("cx",x(extras[8][80-reg_index]))
			  .attr("cy",y(extras[9][80-reg_index]))
			  .attr("r",3)
			  .attr("fill","rgb(0%,0%,0%)");
			
        layer3.append("line")
	          .attr("id","svm-mnist-layer3-x-xm-line")
              .attr("x1", x(extras[2][80-reg_index]))
		      .attr("y1", y(extras[3][80-reg_index]))
		      .attr("x2", x(extras[4][80-reg_index]))
		      .attr("y2", y(extras[5][80-reg_index]))
	          .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke", "rgb(0%,0%,0%)");

        layer3.append("line")
	          .attr("id","svm-mnist-layer3-y-ym-line")
              .attr("x1", x(extras[6][80-reg_index]))
		      .attr("y1", y(extras[7][80-reg_index]))
		      .attr("x2", x(extras[8][80-reg_index]))
		      .attr("y2", y(extras[9][80-reg_index]))
	          .attr("stroke-width", 1)
			  .attr("stroke-dasharray", "3, 1")
	          .attr("stroke", "rgb(0%,0%,0%)");
	    
		// labels
        var labels = layer3.append("g")
	                       .attr("text-anchor", "middle")
	                       .attr("font-family","Roboto")
	                       .attr("fill", "rgb(0%,0%,0%)")
 	                       .attr("font-style", "italic")
 	                       .attr("font-weight", "bold")
	                       .attr("font-size", "15px");
		
        labels.append("text")
	          .attr("id","svm-mnist-layer3-label-x")
              .attr("x", x(extras[2][80-reg_index])-3)
	          .attr("y", y(extras[3][80-reg_index])+15)
              .text("x");
			  
        labels.append("text")
	          .attr("id","svm-mnist-layer3-label-xm")
              .attr("x", x(extras[4][80-reg_index])-3)
	          .attr("y", y(extras[5][80-reg_index])-10)
              .text("x")
			  .append("tspan")
	          .attr("font-size", "10px")
			  .attr("dx",1)
			  .attr("dy",2)
			  .text("m");
			  
        labels.append("text")
	          .attr("id","svm-mnist-layer3-label-y")
              .attr("x", x(extras[6][80-reg_index])-3)
	          .attr("y", y(extras[7][80-reg_index])-10)
              .text("y");
			  
        labels.append("text")
	          .attr("id","svm-mnist-layer3-label-ym")
              .attr("x", x(extras[8][80-reg_index])-3)
	          .attr("y", y(extras[9][80-reg_index])+15)
              .text("y")
			  .append("tspan")
	          .attr("font-size", "10px")
			  .attr("dx",1)
			  .attr("dy",2)
			  .text("m");
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
		theta = extras[1][80-reg_index];
		  
		d3.select("#svm-mnist-layer1-left")
          .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
		  .attr("x", x(-extras[0][80-reg_index])-x(0)-width/2);
		  
		d3.select("#svm-mnist-layer1-right")
          .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
		  .attr("x", x(-extras[0][80-reg_index])-x(0)+width/2);
		  
        container.selectAll("circle0")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});

	    container.selectAll("circle1")
	             .attr("y", function (d) {return y(d[80-reg_index+1]);});
		  
		d3.select("#svm-mnist-layer3-boundary")
          .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
          .attr("x1", x(-extras[0][80-reg_index]))
	      .attr("x2", x(-extras[0][80-reg_index]));

		d3.select("#svm-mnist-layer3-w-line")
          .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
		  .attr("x1", x(-extras[0][80-reg_index]))
		  .attr("x2", x(-extras[0][80-reg_index]+6));
		  
		d3.select("#svm-mnist-layer3-w-polygon")
		  .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
            .attr("points", x(-extras[0][80-reg_index]+5.6)+","+y(0)+" "+x(-extras[0][80-reg_index]+5.2)+","+y(-0.5)+" "+x(-extras[0][80-reg_index]+6)+","+y(0)+" "+x(-extras[0][80-reg_index]+5.2)+","+y(0.5));
				 
		d3.select("#svm-mnist-layer3-w-text")
		  .attr("transform", "rotate("+ (- 90*2/Math.PI*theta) +","+ x(0) +","+ y(0) +")")
          .attr("x", x(-extras[0][80-reg_index]+7));

		d3.select("#svm-mnist-layer3-x-circle")
	      .attr("cx",x(extras[2][80-reg_index]))
		  .attr("cy",y(extras[3][80-reg_index]));
	    
		d3.select("#svm-mnist-layer3-xm-circle")
	      .attr("cx",x(extras[4][80-reg_index]))
		  .attr("cy",y(extras[5][80-reg_index]));
		  
		d3.select("#svm-mnist-layer3-y-circle")
	      .attr("cx",x(extras[6][80-reg_index]))
	      .attr("cy",y(extras[7][80-reg_index]));	
			
		d3.select("#svm-mnist-layer3-ym-circle")
	      .attr("cx",x(extras[8][80-reg_index]))
	      .attr("cy",y(extras[9][80-reg_index]));	

		d3.select("#svm-mnist-layer3-x-xm-line")
          .attr("x1", x(extras[2][80-reg_index]))
		  .attr("y1", y(extras[3][80-reg_index]))
		  .attr("x2", x(extras[4][80-reg_index]))
		  .attr("y2", y(extras[5][80-reg_index]))
		  
		d3.select("#svm-mnist-layer3-y-ym-line")
          .attr("x1", x(extras[6][80-reg_index]))
		  .attr("y1", y(extras[7][80-reg_index]))
		  .attr("x2", x(extras[8][80-reg_index]))
		  .attr("y2", y(extras[9][80-reg_index]))
		
		d3.select("#svm-mnist-layer3-label-x")
          .attr("x", x(extras[2][80-reg_index])-3)
	      .attr("y", y(extras[3][80-reg_index])+15)
		  
		d3.select("#svm-mnist-layer3-label-xm")
          .attr("x", x(extras[4][80-reg_index])-3)
	      .attr("y", y(extras[5][80-reg_index])-10)
		  
		d3.select("#svm-mnist-layer3-label-y")
          .attr("x", x(extras[6][80-reg_index])-3)
	      .attr("y", y(extras[7][80-reg_index])-10)
		  
		d3.select("#svm-mnist-layer3-label-ym")
          .attr("x", x(extras[8][80-reg_index])-3)
	      .attr("y", y(extras[9][80-reg_index])+15)
				 
	    if (Math.round( extras[12][80-reg_index] * 10) / 10 == max_dAdv)
		  d3.select("#fig4-left-dAdv").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	    else
		  d3.select("#fig4-left-dAdv").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
	    if (Math.round( extras[13][80-reg_index] * 10) / 10 == min_errTrain)
		  d3.select("#fig4-left-errTrain").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	    else
		  d3.select("#fig4-left-errTrain").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
	    if (Math.round( extras[14][80-reg_index] * 10) / 10 == min_errTest)
		  d3.select("#fig4-left-errTest").style({"font-weight": "bold", "color": "rgba(100%,0%,0%,0.6)"});
	    else
		  d3.select("#fig4-left-errTest").style({"font-weight": "normal", "color": "rgba(0,0,0,0.6)"});
	  
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
				 
		d3.select("#fig4-value-lambda").text(parseFloat(-1+reg_index*0.1).toFixed(1));
	    d3.select("#fig4-value-dx").text(parseFloat(extras[10][80-reg_index]).toFixed(1));
	    d3.select("#fig4-value-dy").text(parseFloat(extras[11][80-reg_index]).toFixed(1));
	    d3.select("#fig4-value-dAdv").text(parseFloat(extras[12][80-reg_index]).toFixed(1));
	    d3.select("#fig4-value-errTrain").text(parseFloat(extras[13][80-reg_index]).toFixed(1));
	    d3.select("#fig4-value-errTest").text(parseFloat(extras[14][80-reg_index]).toFixed(1));
	  }
	  
	  function animate() {
	    draw_layer2();
		draw_digits();
		
	    requestId = window.requestAnimationFrame(animate);
		
		if (Date.now() - input_time > 10000) {
          animationRunning = false;
          window.cancelAnimationFrame(requestId);
        }
	  }
	  
	  d3.select("#fig4-value-lambda").text(parseFloat(-1+reg_index*0.1).toFixed(1));
	  d3.select("#fig4-value-dx").text(parseFloat(extras[10][80-reg_index]).toFixed(1));
	  d3.select("#fig4-value-dy").text(parseFloat(extras[11][80-reg_index]).toFixed(1));
	  d3.select("#fig4-value-dAdv").text(parseFloat(extras[12][80-reg_index]).toFixed(1));
	  d3.select("#fig4-value-errTrain").text(parseFloat(extras[13][80-reg_index]).toFixed(1));
	  d3.select("#fig4-value-errTest").text(parseFloat(extras[14][80-reg_index]).toFixed(1));
	  draw_digits();
	  init_canvas();
	  draw_layer1();
	  draw_layer2();
	  draw_layer3();
	
	  var input = d3.select("#fig4-left-controler-input");
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
  
  d3.select('#left-input-'+left_digit).property('checked', true);
  d3.select('#right-input-'+right_digit).property('checked', true);
  update_buttons(left_digit,right_digit);
  draw_fig(left_digit, right_digit);
  
  d3.selectAll('input[name="left-digit"]').on('click', function() {if (animationRunning) {
                                                                     animationRunning = false;
                                                                     window.cancelAnimationFrame(requestId);
                                                                   }
	                                                               left_digit = +this.value;
                                                                   update_buttons(left_digit,right_digit);
																   draw_fig(left_digit, right_digit);});
  d3.selectAll('input[name="right-digit"]').on('click', function() {if (animationRunning) {
                                                                     animationRunning = false;
                                                                     window.cancelAnimationFrame(requestId);
                                                                   }
	                                                                right_digit = +this.value;
                                                                    update_buttons(left_digit,right_digit);
																	draw_fig(left_digit, right_digit);});
																	
  d3.select("#button-0vs1").on('click', function() {if (animationRunning) {
                                                      animationRunning = false;
                                                      window.cancelAnimationFrame(requestId);
                                                    }
													left_digit = 0;
	                                                right_digit = 1;
                                                    d3.select('#left-input-'+left_digit).property('checked', true);
                                                    d3.select('#right-input-'+right_digit).property('checked', true); 
                                                    update_buttons(left_digit,right_digit);
													draw_fig(left_digit, right_digit);});
											
  d3.select("#button-7vs9").on('click', function() {if (animationRunning) {
                                                      animationRunning = false;
                                                      window.cancelAnimationFrame(requestId);
                                                    }
													left_digit = 7;
	                                                right_digit = 9;
                                                    d3.select('#left-input-'+left_digit).property('checked', true);
                                                    d3.select('#right-input-'+right_digit).property('checked', true); 
                                                    update_buttons(left_digit,right_digit);
													draw_fig(left_digit, right_digit);});
}


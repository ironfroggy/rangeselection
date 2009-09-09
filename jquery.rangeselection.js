(function($){

    function safe_ceil(i) {
	var n = Math.ceil(i);
	if (n.toString() == 'NaN') {
	    return i;
	} else {
	    return n;
	}
    };

    function safe_floor(i) {
	var n = Math.floor(i);
	if (n.toString() == 'NaN') {
	    return i;
	} else {
	    return n;
	}
    };

    var defaults = {
	selectionrange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	num_labels: 5,
	callback: function (range) {}
    };

    $.fn.rangeselection = function(options) {
	var element = $(this);
	if (element.length == 0) {
	    return;
	}

	options = $.extend(defaults, options);
	element.data('options', options);

	if (options.width) {
	    element.css('width', options.width);
	}
	if (options.height) {
	    element.css('height', options.height);
	}

	addLabels(element, options.selectionrange);

	var min_highlight_height = element.find('.rangelabel').height() + element.find('.rangestart').height();
	element.find('.highlight').hide();

	var element_width = element.width();
	var element_height = element.height();
	var element_left = element.position().left;
	var element_top = element.position().top;

	var select = function(event) {
		if (element.data('clicked')) {
		    return;
		}
		var x = event.clientX - element_left;
		var y = event.clientY - element_top;
		var width = Math.ceil(options.selectionrange.length * (y / element_height));
		var center_i = Math.ceil(options.selectionrange.length * (x / element_width));

		var selectionrange = options.selectionrange;

		var range_start = Math.max(0, center_i - width / 2);
		var range_stop;
		var range;
		if (element.find('.rangelabel').height() > y) {
		    range_stop = range_start + 1;
		} else {
		    range_stop = Math.min(selectionrange.length, center_i + width / 2);
		}
		range = selectionrange.slice(range_start, range_stop);

		var highlight_width = Math.min(element_width, (range.length==selectionrange.length ? element_width : Math.max(30, (y / element_height) * element_width)));
		var highlight_left = event.clientX - highlight_width / 2;

		if (highlight_left + highlight_width > element_width) {
		    highlight_width = element_width - highlight_left + element_left;
		}
		if (highlight_left < element_left) {
		    highlight_width = highlight_width + (highlight_left - element_left);
		    highlight_left = element_left;
		}
		if (range.length == selectionrange.length) {
		    highlight_height = element_height;
		} else {
		    highlight_height = Math.max(min_highlight_height, y);
		}
		element.find('.highlight').css({ height: highlight_height, left: highlight_left, width: highlight_width }).show();
		var stop_label;
		var start_label;
		if (range.length == 0) {
		    stop_label = '???';
		    start_label = '???';
		} else {
		    stop_label = safe_floor(range[range.length-1].toString());
		    start_label = safe_ceil(range[0].toString());
		}

		element.find('.rangestart .value').html(start_label);
		element.find('.rangestop').css({ top: (y > 50 ? y-30 : 20) });

		element.find('.rangestart').css({ left: element_left, top: (y > 50 ? y-30 : 20)});
		element.find('.rangestop .value').html(stop_label);

		if (start_label == stop_label) {
		    element.find('.rangestop').hide();
		    element.find('.rangestart .extra').hide();
		} else {
		    element.find('.rangestop').show();

		    element.find('.extra').show();
		    if (element.find('.rangestart').position().top != element.find('.rangestop').position().top) {
			element.find('.extra').hide();
		    }
		}

		options.callback(range);
	    }

	element.mousemove(select);

	element.click(function(event){
		element.data('clicked', !element.data('clicked'));
		if (!element.data('clicked')) {
		    select(event);
		}
	    });
    };

    function addLabels(element, range) {
	var options = element.data('options');
	element.find('.rangelabel').remove();
	var steps = options.num_labels;
	var until = steps - 1;
	var values = [];
	for (var i=0; i<steps; i++) {
	    values.push(i/(steps-1));
	}
	$.each(values, function(i, x) {
		element.append('<span class="rangelabel' + (i==values.length-1 ? 'end' : '') + '">' + range[Math.floor((range.length-1) * x)] + '</span>');
	    });
	var last_width = element.find('.rangelabelend').width();
	var others_width = (element.width() - last_width) / until;
	element.find('.rangelabel').width(Math.floor(others_width));

	addLegend(element);
    };

    function addLegend(element) {
	addLegendBox(element, 10, 10, 10, '#ccc');
	addLegendBox(element, 20, 10, 10, '#eee');

	var mid_offset = element.width() * 0.25 - element.position().left + 30;
	addLegendBox(element, mid_offset-20, 10, 15, '#ccc');
	addLegendBox(element, mid_offset-5, 10, 5, '#eee');

	var mid_offset = element.width() / 2 - element.position().left + 30;
	addLegendBox(element, mid_offset-10, 10, 10, '#ccc');
	addLegendBox(element, mid_offset-20, 10, 10, '#ccc');

	var mid_offset = element.width() * 0.75 - element.position().left + 30;
	addLegendBox(element, mid_offset-15, 10, 15, '#ccc');
	addLegendBox(element, mid_offset-20, 10, 5, '#eee');


	var end_offset = element.width() + element.position().left;
	addLegendBox(element, end_offset-10, 10, 10, '#ccc');
	addLegendBox(element, end_offset-20, 10, 10, '#eee');
    };

    function addLegendBox(element, x, y, width, color) {
	addBox(element, x, element.position().top + element.height() - y, width, color);
    };

    function addBox(element, x, y, width, color) {
	element.append('<div class="legend_box"></div>');
	var boxes = element.find('.legend_box');
	var box = boxes.slice(boxes.length-1, boxes.length);
	box.css({position: "absolute", top: y, left: x, background: color, width: width});
    };

})($)
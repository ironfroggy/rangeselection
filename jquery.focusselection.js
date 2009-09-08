(function($){

    var defaults = {
	selectionrange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	num_labels: 5,
	callback: function (range) {}
    };

    $.fn.focusselection = function(options) {
	var element = $(this);
	if (element.length == 0) {
	    return;
	}

	options = $.extend(defaults, options);
	element.data('options', options);

	addLabels(element, options.selectionrange);

	element.find('.highlight')

	element.mousemove(function(event) {
		var x = event.clientX - element.position().left;
		var y = event.clientY - element.position().top;
		var width = Math.ceil(options.selectionrange.length * (y / element.height()));
		var center_i = Math.ceil(options.selectionrange.length * (x / element.width()));

		var range_start = Math.max(0, center_i - width / 2);
		var range_stop;
		if (element.find('.rangelabel').height() > y) {
		    range_stop = range_start + 1;
		} else {
		    range_stop = Math.min(options.selectionrange.length, center_i + width / 2);
		}
		var range = options.selectionrange.slice(range_start, range_stop);

		var highlight_width = Math.min(element.width(), Math.max(30, (y / element.height()) * element.width()));
		var highlight_left = event.clientX - highlight_width / 2;
		if (highlight_left + highlight_width > element.width()) {
		    highlight_width = element.width() - highlight_left + element.position().left;
		}
		if (highlight_left < element.position().left) {
		    highlight_width = highlight_width + (highlight_left - element.position().left);
		    highlight_left = element.position().left;
		}
		element.find('.highlight').css({ height: Math.max(20, y), left: highlight_left, width: highlight_width });

		element.find('.rangestart span').html(Math.ceil(range[0].toString()));
		element.find('.rangestart').css({ left: element.position().left, top: y-30 });
		element.find('.rangestop span').html(Math.floor(range[range.length-1].toString()));
		element.find('.rangestop').css({ top: y-30 });

		options.callback(range);
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
    };

})($)
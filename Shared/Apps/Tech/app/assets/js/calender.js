	$(document).ready(function() {
	
	
		/* initialize the external events
		-----------------------------------------------------------------*/
	
		$('#external-events div.external-event').each(function() {
		
			// create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
			// it doesn't need to have a start or end
			var eventObject = {
				title: $.trim($(this).text()) // use the element's text as the event title
			};
			
			// store the Event Object in the DOM element so we can get to it later
			$(this).data('eventObject', eventObject);
			
			// make the event draggable using jQuery UI
			$(this).draggable({
				zIndex: 999,
				revert: true,      // will cause the event to go back to its
				revertDuration: 0  //  original position after the drag
			});
			
		});
	
	
		/* initialize the calendar
		-----------------------------------------------------------------*/
		
		$('#calendar').fullCalendar({
			events: 'https://www.google.com/calendar/feeds/nyu.edu_3kn1jf88ba9smmceieaqk5qcts%40group.calendar.google.com/private-5e2dc3c435bde6d3d57d794143158823/basic',
			firstDay: 1,
			firstHour: 9,
			minTime: 8,
            maxTime: 20,
		});
		/* Hide Default header : coz our bottons look awesome */ 
		$('.fc-header').hide();
		
		//Get the current date and display on the tile
		var currentDate = $('#calendar').fullCalendar('getDate');
		
		$('#calendar').fullCalendar( 'changeView','agendaWeek');
		
		$('#calender-current-day').html($.fullCalendar.formatDate(currentDate, "dddd"));
		$('#calender-current-date').html($.fullCalendar.formatDate(currentDate, "MMM d yyyy"));
		
		
		
		
	});
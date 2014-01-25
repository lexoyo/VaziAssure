jQuery(document).ready(function() {

    //Generate trips from list
    var trips = jQuery(".co_trips_list > ul.cotrips li");
    
    var alltrips = [];
    
    trips.each(function(i){
    	
    	var link=jQuery(this).find('a')[0];
    	$(link).attr('id', 'trip_'+i);
    	
    	var trip = {
    		id: 'trip_' + i,
    		link: jQuery(this).find('a')[0],
    		fromlatitude: jQuery(this).find('.fromlat').text(),
    		fromlongitude: jQuery(this).find('.fromlon').text(),
      		tolatitude: jQuery(this).find('.tolat').text(),
    		tolongitude: jQuery(this).find('.tolon').text(),
    		html: jQuery(this).find('.description')[0].innerHTML
    	};
			
		alltrips.push(trip);

    
    });
    
    //Getting map customization
    var map_customization = $("#co_trips_map .map_customization");
    var init=false;
    if(map_customization){
    	//alert('init custom');
   		//Console.log('map custo');
    	init = {
    		zoom : parseInt(map_customization.find('.zoom').text()),
    		latitude : map_customization.find('.latitude').text(),
			longitude : map_customization.find('.longitude').text()
    	
    	}
    }
   
    var el = jQuery("#co_trips_map");
    var options = {
        scrollwheel: false,
        maptype: 'ROADMAP',
        trips: alltrips,
        drawRoutes: true,
        mapinit: init
        
    };
   
    jQuery(el).goMapComuto(options);
});

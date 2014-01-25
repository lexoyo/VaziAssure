var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
/*
$(document).ready(function() {
  initializeMap();
});
*/
function initializeMap(params) {

	//Used to render the route
	directionsDisplay = new google.maps.DirectionsRenderer({
		preserveViewport : true,
		suppressMarkers: true
	});
	
	//Highways ?
	var avoidHighways = false;
	if(document.getElementById("avoidHighways")){
		avoidHighways = true;
	}
	
	//Map init
	var init_lat = document.getElementById("map_init_lat").value;
	var init_lon = document.getElementById("map_init_lon").value;
	var init_latlng = new google.maps.LatLng(init_lat, init_lon);
	var init_zoom = parseInt(document.getElementById("map_init_zoom").value);
	
	var myOptions = {
      zoom: init_zoom,
      center: init_latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false
    };
    
    map = new google.maps.Map(document.getElementById("co_tripdetail_map"), myOptions);
    directionsDisplay.setMap(map);
    
    //viacities
  	var waypts = [];
  	var viacity_nb=parseInt(document.getElementById("viacity_nb").value);
  	
  	var start = new google.maps.LatLng(document.getElementById("viacity_lat_0").value, document.getElementById("viacity_lon_0").value);
	var end = new google.maps.LatLng(document.getElementById("viacity_lat_"+(viacity_nb-1)).value, document.getElementById("viacity_lon_"+(viacity_nb-1)).value);
	
	for(var i=0;i<viacity_nb;i++){
		
		var viacity = new google.maps.LatLng(document.getElementById("viacity_lat_"+i).value, document.getElementById("viacity_lon_"+i).value);
		var viacity_icon = document.getElementById("viacity_ico_"+i).value;
		var viacityMarker = new google.maps.Marker({
      		position: viacity,
     		map: map,
      		icon: viacity_icon
  		});
  		
  		if(i!=0 && i!=(viacity_nb-1)){
  			waypts.push({
          		location:viacity,
          		stopover:true
      		});
  		}
	}
	
	//The request for the route
	var request = {
		origin:start, 
		destination:end,
		travelMode: google.maps.DirectionsTravelMode.DRIVING,
		avoidHighways: avoidHighways,
		waypoints: waypts
	};
	
	//Asking google to determine and trace the route
	directionsService.route(request, function(result, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(result);
		}
	});
	
	//Handling bounds to center and zoom correctly
  	zoomAll();
  	
    if (typeof params !== 'undefined') {
        if (params.hasOwnProperty('onload')) {
            google.maps.event.addListenerOnce(map, 'idle', function(e){
                params['onload']();
            });
        }
    }
}

/**
 * zoomAll
 * modify center and zoom to show the whole route
 * @FIXME do not define function in global scope
 */
function zoomAll() {
    if (typeof map === 'undefined') {
        initializeMap({onload:zoomAll});
        return;
    }
    
    //Handling bounds to center and zoom correctly
    var mapBounds = new google.maps.LatLngBounds();
    var bound_s = new google.maps.LatLng(document.getElementById("map_lat_s").value, document.getElementById("map_lon_s").value);
    var bound_e = new google.maps.LatLng(document.getElementById("map_lat_e").value, document.getElementById("map_lon_e").value);
    mapBounds.extend(bound_s);
    mapBounds.extend(bound_e);
    map.fitBounds(mapBounds);
}

/**
 * zoomFrom
 * modify center and zoom to show FROM point
 * @FIXME do not define function in global scope
 */
function zoomFrom() {
    if (typeof map === 'undefined') {
        initializeMap({onload:zoomFrom});
        return;
    }
    
    map.setCenter(new google.maps.LatLng(document.getElementById("map_lat_s").value, document.getElementById("map_lon_s").value));
    map.setZoom(16);
}

/**
 * zoomTo
 * modify center and zoom to show TO point
 * @FIXME do not define function in global scope
 */
function zoomTo() {
    if (typeof map === 'undefined') {
        initializeMap({onload:zoomTo});
        return;
    }
    
    map.setCenter(new google.maps.LatLng(document.getElementById("map_lat_e").value, document.getElementById("map_lon_e").value));
    map.setZoom(16);
}

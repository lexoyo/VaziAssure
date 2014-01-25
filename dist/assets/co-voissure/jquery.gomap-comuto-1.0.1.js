/**
 * jQuery goMapComuto
 *
 * @url		http://www.covoiturage.fr/
 * @author	Maurice Svay <maurice.svay@comuto.com>
 * @version	1.0.1
 * @TODO Use decorator pattern: forwards methods to goMap
 */
 
(function($) {
    $.fn.goMapComuto = function(settings) {
        this.each(function() {
            var options = jQuery.extend({
                drawRoutes : true
            }, settings);
        
            $(this).goMap(options);
            
            $.goMapComuto = {};
            $.goMapComuto.map = $.goMap.getMap();
            $.goMapComuto.bounds = new google.maps.LatLngBounds();

            var directionService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({
                preserveViewport : true,
                suppressMarkers: true
            });
            
            if(settings.markers){
            for (var i=0,l=settings.markers.length; i<l; i++) {
            
            
            	if(settings.markers[i].title=='geomarker'){
					$.goMap.createListener({type:'marker', marker:'geomarker'}, 'mouseup', function() { 
						
						//alert($.goMap.getMarkers()[0]);
						$("input:text[name=latitude]").val($.goMap.getMarkers()[0].split(",")[0]);
						$("input:text[name=longitude]").val($.goMap.getMarkers()[0].split(",")[1]);
						
					}); 
            	}
            
                //Code pour prendre en compte des routes différentes pour chaque marker
               
                if(settings.markers[i].route){
                	var newroute = settings.markers[i].route;
              		 $.goMap.createListener(
                        {type:'marker', marker:'marker_'+i}, 
                        'click', 
                        function() {
                            var myid = this.id;
                            //lookup self
                            for (var j=0,l=settings.markers.length; j<l;j++) {
                                if (settings.markers[j].id == myid) {
                                    var from = {
                                        'latitude': settings.markers[j].route.fromlat,
                                        'longitude': settings.markers[j].route.fromlon
                                    }
                                    var to = {
                                        'latitude': settings.markers[j].route.tolat,
                                        'longitude': settings.markers[j].route.tolon
                                    }
                                }
                            }
                        	$(this).goMapComuto.drawRoute(
                        	    from,
                        	    to
                        	);
                        }
                    );
                }
                //Extend bounds
                var ll = new google.maps.LatLng(settings.markers[i].latitude, settings.markers[i].longitude);
                $.goMapComuto.bounds.extend(ll);
            }
            }
            
            
            //Gestion des trips
            if(settings.trips){
            for (var i=0,l=settings.trips.length; i<l; i++) {
           		
            	var trip=settings.trips[i];
            	            	
            	$(trip.link).click(function(){
            		
            		var myid = this.id;
            		
                    //lookup self
                    for (var j=0,l=settings.trips.length; j<l;j++) {
						if (settings.trips[j].id == myid) {
                        	var from = {
                                'latitude': settings.trips[j].fromlatitude,
                                'longitude': settings.trips[j].fromlongitude,
                                'html': settings.trips[j].html
                            }
                            var to = {
                                'latitude': settings.trips[j].tolatitude,
                                'longitude': settings.trips[j].tolongitude
                            }
                        }
                    }
                    
                    //On efface les markers
                    $.goMap.removeMarker('markerFrom');
                    $.goMap.removeMarker('markerTo');
                    
                    //départ
                    $.goMap.createMarker({
                    	latitude: from.latitude,
                    	longitude: from.longitude,
                    	id: 'markerFrom',
                    	html: {content: from.html, popup: true}
                    });
                    //arrivée
                    $.goMap.createMarker({
                    	latitude: to.latitude,
                    	longitude: to.longitude,
                    	id: 'markerTo'
                    });
                    
                	$(this).goMapComuto.drawRoute(
                	    from,
                	    to
                	);
            		
            		
            	});
            	
            	
            }
            }
            
           	
            
            //On centre la carte
			//On est en mode fixe avec une carte centrée en fonction 
			if(options.mapinit){
			
				$.goMap.setMap({
					zoom: options.mapinit.zoom,
					latitude:options.mapinit.latitude,
					longitude:options.mapinit.longitude
			
				});
			
			
			//On est en mode dynamique on adapte la carte en fonction des points
			}else{
				$.goMapComuto.map.fitBounds($.goMapComuto.bounds);
			}


            /**
             * Draw a route
             */
            $(this).goMapComuto.drawRoute = function(from, to) {
                if (typeof from.getPosition == 'function') {
                    var fromMarker = from.getPosition();
                } else {
                    var fromMarker = new google.maps.LatLng(from.latitude, from.longitude);
                }
                if (typeof to.getPosition == 'function') {
                    var toMarker = to.getPosition();
                } else {
                    var toMarker = new google.maps.LatLng(to.latitude, to.longitude);
                }
                
                directionsDisplay.setMap(null);
                directionsDisplay.setMap($.goMapComuto.map);
                var request = {
                    origin: fromMarker, 
                    destination: toMarker,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                directionService.route(request, function(result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(result);
                    }
                });
            };
        });
        return this;
    }
})(jQuery);

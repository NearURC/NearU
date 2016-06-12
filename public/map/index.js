//Types category wise
var types_cat=[
//	{
//		name:"Quotidiano",
//		type:['atm','bank','establishment','general_contractor','grocery_or_supermarket','gym','hair_care','laundry']
//	},
//	{
//		name:"Mangiare",
//		type:['bakery','bar','cafe','food','meal_delivery','meal_takeaway','restaurant']
//	},
	{
		name:"NEARU",
		type:['bakery','bar','cafe','food','meal_delivery','meal_takeaway','restaurant','hospital','police','doctor','atm','bank','movie_theater','pharmacy','museum','parking','embassy','church','subway_station','bus_station']
	}	
	// {
	// 	name:"Emergenza",
	// 	type:['fire_station','gas_station','hospital','police']
	// },
	// {
	// 	name:"Intrattenimento",
	// 	type:['amusement_park','aquarium','bowling_alley','casino','movie_theater','night_club','park','shopping_mall','stadium']
	// },
	// {
	// 	name:"Salute",
	// 	type:['dentist','doctor','health','pharmacy','physiotherapist']
	// },
	// {
	// 	name:"Misc",
	// 	type:['art_gallery','campground','cemetery','city_hall','courthouse','embassy','funeral_home','library','local_government_office','museum','parking','post_office','rv_park','school','storage']
	// },
	// {
	// 	name:"Servizi",
	// 	type:['accounting','beauty_salon','car_dealer','electrician','electronics_store','finance','florist','funeral_home','hair_care','insurance_agency','laundry','lawyer','locksmith','lodging','movie_rental','moving_company','painter','plumber','real_estate_agency','roofing_contractor','spa','travel_agency']
	// },
	// {
	// 	name:"Negozi",
	// 	type:['bicycle_store','book_store','clothing_store','convenience_store','department_store','electronics_store','establishment','furniture_store','hardware_store','home_goods_store','jewelry_store','liquor_store','pet_store','shoe_store','store']
	// },
	// {
	// 	name:"Trasporti",
	// 	type:['airport','bus_station','car_dealer','car_rental','subway_station','taxi_stand','train_station']
	// },
	// {
	// 	name:"Religione",
	// 	type:['church','hindu_temple','mosque','place_of_worship','synagogue']
	// }
];

//Under Category Radio Button
//To create Category Button and checkbox of these category

//To create check and uncheck button
var check_uncheck='<div class="row-fluid"><div class="span12">';
check_uncheck+='<div class="span1"><input class="btn btn-small btn-info checkall" type="submit" name="checkall" value="Seleziona Tutto"></div>';
check_uncheck+=	'<div class="span1"><input class="btn btn-small btn-info uncheckall" type="submit" name="uncheckall" value="Deseleziona Tutto"></div>';
check_uncheck+=	'</div></div>';

//To create types checkbox
var types_data="";
var types_button='<div id="types_button" style="display:none" class="row-fluid"><div class="span12">';
//Loop through each category
for(x in types_cat){
	
	//Grab category name
	name_div=types_cat[x].name;
	//To garb array of types of place under a category
	type_default=types_cat[x].type;
	
	var place_type="";
	var data_int="";
	var y=1;
	
	//Sort types of place array
	type_default=type_default.sort(); 
	for(x in type_default){

		/*
		  * To remove '_' from type of place and chnage a leter to capital
		  * For e.g if type is grocery_or_supermarket.Split is using _ as dilimter to get array containing [grocery,or,supermarket]
		  * then loop through each element of array and grab 1st letter and make it uppercase and concate it back to remaining string.
		  * Then use join() to get back whole string from array.
		*/
		value=type_default[x];
		name=type_default[x];
		name_arr=name.split("_");
		for(z in name_arr){
			name_arr[z]=name_arr[z].charAt(0).toUpperCase() + name_arr[z].slice(1);
		}
		name=name_arr.join(" ");
		
		/*
		 * As in Bootstarp we can have max of 12 span in row,hence following code add new row code after 12th span
		 * */
		if(x%10!=0){
			place_type=place_type+'<div class="span1"><label class="checkbox inline"><input type="checkbox" name="types" value="'+value+'" >'+name+'</label></div>';
			
		}else{
			if(x==0)
				place_type=place_type+'<div class="row-fluid"><div class="span12"><div class="span1"><label class="checkbox inline"><input type="checkbox" name="types" value="'+value+'" >'+name+'</label></div>';
			else
				place_type=place_type+'</div></div><div class="row-fluid"><div class="span12"><div class="span1"><label class="checkbox inline"><input type="checkbox" name="types" value="'+value+'">'+name+'</label></div>';
		}
		if(x==type_default.length-1)
				place_type=place_type+'</div></div>';
	}
	//Adding check_uncheck and type of places to a string
	types_data+='<div style="display:all" id="'+name_div+'">'+check_uncheck+place_type+'</div>';
	//To Create Category Button
	types_button+='<div class="span1"><input class="btn btn-small btn-danger" type="submit" value="'+name_div+'"></div>';
}
types_button+='</div></div>';

//Radio Button (Search and Choose)
var radio_button='<div class="row-fluid">';
radio_button+='<div class="span1"><label class="radio"><input type="radio" name="optionsRadios" value="s">Cerca</label></div>';
radio_button+='<div class="span1"><label class="radio"><input type="radio" name="optionsRadios" value="c">Categoria</label></div>';
radio_button+='</div>';

//Search Div
//To create Clear,Checkall,Uncheckall button,Type Search Text bar,Div to display type suggestion,Div to add category
var sh_div='<div style="display:none" id="search"><div class="row-fluid">';
sh_div+='<div class="span3"><input type="text" class="input-large" id="search_type" placeholder="Search Type"></div>';
sh_div+='<div class="span1"><input class="btn btn-small btn-info" type="submit" id="clear" name="clear" value="Clear"></div>';
sh_div+='<div class="span1"><input class="btn btn-small btn-info" type="submit" id="checkall-search" name="checkall" value="Checkall"></div>';
sh_div+='<div class="span1"><input class="btn btn-small btn-info" type="submit" id="uncheckall-search" name="uncheckall" value="Uncheckall"></div>';
sh_div+='</div>';
sh_div+='<div class="row-fluid"><div id="search_type_display" class="search_type span3"></div><div class="search_type span9" id="search_type_choose"></div>';
sh_div+='</div></div>';
sh_div+='</div>';

//Adding all data i.e Search and Choose to types_div
types_div_content='<div id="types">'+types_data+'</div>'+sh_div;
$('#types_div').html(types_div_content);

/*
 * When user choose search radio button
 * Following code suggest type as user type in Search Type text box
 * */
 
//Array containg all type supported by Google Places Api
//var types_all=['shopping_mall','art_gallery','campground','cemetery','city_hall','courthouse','embassy','funeral_home','library','local_government_office','museum','parking','post_office','rv_park','school','storage','atm','bank','establishment','general_contractor','grocery_or_supermarket','gym','hair_care','laundry','fire_station','gas_station','hospital','police','amusement_park','aquarium','bowling_alley','casino','movie_theater','night_club','park','stadium','dentist','doctor','health','pharmacy','physiotherapist','accounting','beauty_salon','car_dealer','electrician','electronics_store','finance','florist','funeral_home','hair_care','insurance_agency','laundry','lawyer','locksmith','lodging','movie_rental','moving_company','painter','plumber','real_estate_agency','roofing_contractor','spa','travel_agency','bicycle_store','book_store','clothing_store','convenience_store','department_store','electronics_store','establishment','furniture_store','hardware_store','home_goods_store','jewelry_store','liquor_store','pet_store','shoe_store','store','airport','bus_station','car_dealer','car_rental','subway_station','taxi_stand','train_station','church','hindu_temple','mosque','place_of_worship','synagogue','bakery','bar','cafe','food','meal_delivery','meal_takeaway','restaurant'];
var types_all=['bakery','bar','cafe','food','meal_delivery','meal_takeaway','restaurant','hospital','police','doctor','atm','bank','movie_theater','pharmacy','museum','parking','embassy','church','subway_station','bus_station'];
var types_all_temp=types_all.sort();

//As user type in search type input display him suggestion
$('#search_type').on("keyup",function(){
	//Text area where suggestions will be generated
	txt_area_data='<div class="row-fluid">';
	//Grab what user types in Search text box
	val=$(this).val();
	for(x in types_all_temp){
		sub_str=types_all_temp[x].substr(0,val.length);
		if(val.toUpperCase()==sub_str.toUpperCase()){
			//Converting 1st letter to Uppercase
			name_arr=types_all_temp[x].split("_");
			for(z in name_arr){
				name_arr[z]=name_arr[z].charAt(0).toUpperCase() + name_arr[z].slice(1);
			}
			name=name_arr.join(" ");
			
			//Add matching types so as to display them in text area
			txt_area_data+='<div class="span10"><button name="'+types_all_temp[x]+'" class="btn btn-mini" type="button">'+name+'</button></div>';
		}
	}
	txt_area_data+='</div>';
	$('#search_type_display').html(txt_area_data);
});

//When user click on any type in Suggestion Text Box,remove it from text area,types array and paste it in type selection div
$('#search_type_display').on('click','button',function(){
	button=$(this);
	value=button.attr('name');
	name=button.text();
	chk_bx='<div class="span2"><label class="checkbox inline"><input type="checkbox" name="types" value="'+value+'" checked>'+name+'</label></div>';
	//paste clicked type in selection div
	$('#search_type_choose').append(chk_bx);
	
	//remove this label from text area and types array
	button.parent('div').remove();
	index=types_all_temp.indexOf(value);
	types_all_temp.splice(index,1);
});

//Clear button action
//Remove all type from Choose div and add those types back in types_all array and clear search text box.
$('#clear').on('click',function(){
	var chk_box_arr=$('#search_type_choose').find('input:checkbox');
	//add types [those were present in choose div] back in types_all array
	chk_box_arr.each(function(){
		types_all_temp.push($(this).attr('value'));
	});
	types_all_temp.sort();
	
	//clear search text box and fire keyup action which will display all types in suggestion text box
	$('#search_type').val("");
	$('#search_type').keyup();
	//Remove all type from Choose div 
	$('#search_type_choose').html("");
})

//CheckAll and Uncheck All for search options
$('#checkall-search').on('click',function(){
	$('#search_type_choose').find("input:checkbox").attr('checked', true);
});
$('#uncheckall-search').on('click',function(){
	$('#search_type_choose').find("input:checkbox").attr('checked', false);
});

//To enlarge image when they are clicked from info window
function enlargeImage(obj){
	window.open(obj);
}

//Check which Radio button is checked and acc load either search form or category
$('input[type=radio]').change(function(){
	checked_radio=$(this);
	if(checked_radio.attr('value')=='s'){
		$('#search').show('slow');
		$('#types_button').hide("slow");
		$('#types').find('input:checkbox').attr('checked', false);
	}
	if(checked_radio.attr('value')=='c'){
		//checked_radio.parents('div[class="row-fluid"]').hide("slow");
		$('#types_button').show("slow");
		$('#search').hide('slow');
		$('#search_type_choose').find("input:checkbox").attr('checked', false);
	}
});

//Check all and Uncheck all types for choose radio button
$('.checkall').on('click',function(){
	//console.log($(this).parents('div[class="row-fluid"]').siblings('div'));
	$(this).parents('div[class="row-fluid"]').siblings('div').find("input:checkbox").attr('checked', true);
	//$('#types input:checkbox').attr('checked', true);
});

$('.uncheckall').on('click',function(){
	$(this).parents('div[class="row-fluid"]').siblings('div').find("input:checkbox").attr('checked', false);
});

//Hide and Unhide types when clciked on Types button
$('#type').on('click',function(){
	var types_div=$('#types_div');
	 if(types_div.css('display')=='block'){
	 	types_div.hide("slow");
	 }else{
		types_div.show("slow");
		//types_div.children('div').hide("slow");
		types_div.children('div').eq(0).show("slow");;
	}
});


//When user click on a category,make that category button color green and hide other category
$('#types_div').children('.row-fluid').on("click","input",function(){
	//hide other category
	$('#types_div').children('.row-fluid').find('input').attr('class','btn btn-small btn-danger');
	$('#types').children('div').hide("slow");
	
	var input=$(this);
	div_name=input.attr('value');
	div_obj=$('#'+div_name);
	if(div_obj.css('display')=='none'){
		div_obj.toggle("slow");
		//make clicked category button color green
		input.attr("class","btn btn-small btn-success");
	}
});



var map;
var infowindow;
// arrays to hold copies of the markers and html used by the side_bar
var gmarkers = [];

var geocoder;
var autocomplete;
var lat_default=41.8935088;
var lng_default=12.4930606;
var type_default=new Array();//if send blank array to types in request variable then all type on map will be drawn


//For checking,whatever map is laoded or not
var maploaded = false
var maploadTimer = 0



function getLocation(){
  	if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(initialize);
		    } else { 
		        x.innerHTML = "Geolocation is not supported by this browser.";
		    }
 }

function initialize(position) {
	
	//fire the 'loading' message
	checkGoogleMap();

	var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    lat_default= lat;
    lng_default = lng;
	//Default
	
	var pyrmont = new google.maps.LatLng(lat, lng);
	// prepare Geocoder
	geocoder = new google.maps.Geocoder();
	//Initialize map
	map = new google.maps.Map(document.getElementById('map'), {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: pyrmont,
		zoom: 17
	});

	
//-----------------------MARKER POSIZIONE ATTUALE---------------------------------------------------------------------

	var marker = new google.maps.Marker({
	    position: pyrmont,
	    map: map,
	    title: 'Sei qui!'
	  });
	
	//add the 'loaded' listener
	google.maps.event.addListener(map, 'tilesloaded', function(){
		maploaded = true
	});
	
	//Create info window which will be displayed when click on marker
	infowindow = new google.maps.InfoWindow();


//--------------SECONDA SEARCH CREAZIONE SEARCHBOX LINKATA ALLA MAPPA ATTUALE------------------------------------------------------------

  var input1 = document.getElementById('location2');
  var searchBox = new google.maps.places.SearchBox(input1);
 

  
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];

  searchBox.addListener('places_changed', function() {
  	document.getElementById("sidebar").innerHTML="";
	if(gmarkers.length>0){
		gmarkers=[];
		markers=[];
	}
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    gmarkers.forEach(function(marker) {
      marker.setMap(null);
    });
    //markers = [];
	
	
    // For each place, get the icon, name and location.
     var bounds = new google.maps.LatLngBounds();
     places.forEach(function(place) {
    	createMarker(place , markers);
      

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    map.setZoom(17);
  });
	
	 var service = new google.maps.places.PlacesService(map);
	 
	var request = {
		location: pyrmont,
		//radius: 250,
		rankBy : google.maps.places.RankBy.DISTANCE,
	types : ['food','bar','cafe', 'bakery'],
	};
	service.nearbySearch(request, callback);

}
//--------FIND-------------------------------------------------------------------------------------------------

function find(){ 
	//alert('find');
	$('#types_div').hide("slow");
	//Initailze by clearing marker array and sidebar    
	document.getElementById("sidebar").innerHTML="";
	if(gmarkers.length>0){
		gmarkers=[];
	}
	//Fetch location,radius,type from html page
	var rds = document.getElementById('radius').value;
	//var rds = '250';
	var lat;
	var lng;
	var type=new Array();
	//Putting all checked type in 'type' array which will be used by 'nearbyplaces' function.
	$('#types_div input[type="checkbox"]:checked').each(function(i){
		type[i]=$(this).attr('value');
	});
	console.log(type);
{
{			
			//$("#location").attr("placeholder","Location Please!!");
			navigator.geolocation.getCurrentPosition(function(position){
				lat=position.coords.latitude;
				lng=position.coords.longitude;
				nearbyPlaces(lat,lng,rds,type);
			});
				nearbyPlaces(lat,lng,rds,type);

		}
	}
}
	 
function nearbyPlaces(lat,lng,rds,type){
	//For checking,whatever map is laoded or not
	maploaded = false
	maploadTimer = 0
	checkGoogleMap();
	if(typeof lat=='undefined'){
		console.log("Undefined Cordinates");
	}else{
		pyrmont = new google.maps.LatLng(lat,lng);
		map = new google.maps.Map(document.getElementById('map'), {
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  center: pyrmont,
		  zoom: 17
		});
		if(document.getElementById('keyword').value === 'undefined'){
			
		request = {
		  location: pyrmont,
		//  rankBy : google.maps.places.RankBy.PROMINENCE,
		  radius : rds,
		types : type
		};
		}else{
			request = {
		  location: pyrmont,
		  keyword : document.getElementById('keyword').value,
		//  rankBy : google.maps.places.RankBy.PROMINENCE,
		  radius : rds,
		types : type
		};
		}

		//MARKER POSIZIONE ATTUALE
		navigator.geolocation.getCurrentPosition(function(position){
				lat=position.coords.latitude;
				lng=position.coords.longitude;
			});
		pyrmont = new google.maps.LatLng(lat, lng);
		var marker = new google.maps.Marker({
	    position: pyrmont,
	    map: map,
	    title: 'Sei qui!'
	  	});
		
 	   onLoad="javascript:document.initialize.submit()"		
		
		//add the 'loaded' listener
		google.maps.event.addDomListener(map, 'tilesloaded', function(){
			maploaded = true
		});
		
		service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, callback);
	}
}
function callback(results,status, pagination) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		//If status is ok,parse each place via for loop
		for (var i = 0; i < results.length; i++) {
			//Grab reference id of each place which will be used by request
			ref=results[i].reference;
			var requestD = {
				reference:ref
			};
			//Pass request array in getDetails function to get more details of a place like phone number,address etc.
			service = new google.maps.places.PlacesService(map);
			service.getDetails(requestD, function(placeD, status) {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					createMarker(placeD,gmarkers);
				}
			});
		}
	
		//The Google documentation states to wait 2 seconds between next page calls, hence used sleep.
		//The pagination.nextPage() calls the same callback, in this case callback().
		if (pagination.hasNextPage) {
			var moreButton = document.getElementById('more');
			moreButton.disabled = false;
			
			google.maps.event.addDomListenerOnce(moreButton, 'click',function() {
				sleep:0;
				moreButton.disabled = true;
				pagination.nextPage();
			});
		}
	}else{
		return;
	}
}
function createMarker(place,gmarkers) {
	var linkContent="";
	var photos = place.photos;
	var placeLoc = place.geometry.location;

	//Find type of place and add icon image
	//Please put lowercased text in icon_arr and try add element in chronical order
	var image="";
	var icon_arr=['airport','art','atm','bank','bar','bus','cafe','casino','club','car','doctor','food','grocery','hospital','lodging','mall','movie','pharmacy','police','post','real','restaurant','school','stadium','store','train','university','zoo'];
	types_str=place.types.join();
	types_str=types_str.toLowerCase();
	console.log(types_str);
	for(x in icon_arr){
		icon_name=icon_arr[x];
		if(types_str.search(icon_name)>-1){
			image="icons/"+icon_name+".png";
			break;
		}
	}
	if(image=="")
		image="icons/star.png";


	if(typeof image!='undefined'){	
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location,
			//ICONE CAMBIATE
			animation: google.maps.Animation.DROP,
			title:place.name,
			icon:image,
		});
	}
	
	function div_structure(metadata,value){
		return '<div class="row-fluid"><div class="span3">'+metadata+'</div><div class="span9">'+value+'</div></div>';
	}
	//---------------INFO TENDINA MAPPA----------------------------------
	google.maps.event.addListener(marker, 'click', function() {
		var snap;
		
		var placeContent="";
		if(typeof place.name!='undefined')
			placeContent=placeContent+place.name+'<br/>';
		if(typeof place.formatted_address!='undefined'){
			placeContent=placeContent+place.formatted_address+'<br/>';
		}
		if(typeof place.formatted_phone_number!='undefined'){
			placeContent=placeContent+place.formatted_phone_number+'<br/>';
		}
		if(typeof place.rating!='undefined'){
			placeContent=placeContent+"Voto "+place.rating+'<br/>';
		}
		if(typeof place.website!='undefined'){
			placeContent=placeContent+'<a target="_blank" href="'+place.website+'">'+place.website+'</a>'+'<br/>';
		}
		if(typeof place.photos!='undefined'){
			snap='';
			snaplarge='https://www.google.com/search?hl=it&site=imghp&tbm=isch&source=hp&biw=1278&bih=656&q='+place.name;
			for(x in place.photos){
//				snaplarge=photos[x].getUrl({'maxWidth': 640, 'maxHeight': 480});
				snap=snap+'<image onclick ="enlargeImage(snaplarge)" src='+photos[x].getUrl({'maxWidth': 35, 'maxHeight': 35})+'> ';
			}
		placeContent=placeContent+snap+'<br/>';
		}
//-------YELP--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		placeContent=placeContent+'<a target="_blank" href="http://nearu-nearu.c9users.io/yelp/search?placeName='+place.name+'&address='+ place.formatted_address+'&lat='+ place.geometry.location.lat()+'&long='+ place.geometry.location.lng()+'&phone='+place.international_phone_number+'"><button class="btn btn-primary">Guarda le recensioni e i commenti</button></a>'+'<br/>';
//-------TWITTA--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		placeContent=placeContent+'<a target="_blank" href="http://twitter.com/share?text=Dai%20uno%20sguardo%20a%20questo%20posto%20'+place.name+'&url=http://nearu-nearu.c9users.io"><button class="btn btn-primary">Condividi su Twitter</button></a>';
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-------SOCIALS--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		placeContent=placeContent+'<br><a target="_blank" href="http://nearu-nearu.c9users.io/socials@'+place.name+"@"+place.geometry.location.lat()+"@"+place.geometry.location.lng()+'"><button id="btn-placessocials" nomeplace="'+place.name+'" class="btn btn-primary">Vedilo nei social</button></a>';
		placeContent=placeContent+'<br><a target="_blank" href="/fb/'+place.name+'"><button>Cercalo nel tuo feed FB recente</button>'
		//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
		infowindow.setContent(placeContent);
		infowindow.open(map, this);
	
	});

	// save the info we need to use later for the side_bar
	gmarkers.push(marker);
	document.getElementById("sidebar").innerHTML +='<image src="icons/number_'+(gmarkers.length)+'.png">' + '<a href="javascript:myclick(' + (gmarkers.length-1) + ')">' + place.name +'<\/a><div style="display:none">'+linkContent+'</div><br>';
}

// This function picks up the click action from sidebar and opens the corresponding info window in map
function myclick(i) {
	google.maps.event.trigger(gmarkers[i], "click");
}

function checkGoogleMap() {
	//increment the timer every second
	maploadTimer = maploadTimer + 1
	
	//specify the target element for our messages
	var msg = document.getElementById('msg')
	
	if (maploaded == false) {
		//if we dont have a fully loaded map - show the message
		$("#msgContainer").slideDown("fast")
		//for the first 5 tries, show this message
		if (maploadTimer < 10) {
		msg.innerHTML = 'Carico...';
		}
		//loop it
		setTimeout('checkGoogleMap()',1000);
	} else {
		//otherwise, show 'loaded' message then hide the message after a second
		msg.innerHTML = 'Mappa Caricata.'
		maploadTimer = 0;
		setTimeout('hideMsg()',1000);
	} 
	//if the timer get up to 80, show a different message
	if (maploadTimer >= 8 && maploadTimer <10 ) {
		msg.innerHTML = 'La connessione è lenta!!Carico...';
	}
	//if it gets to 10 show another different message with a reload link (for what its worth!)
	if (maploadTimer >= 10) {
		msg.innerHTML = 'Hmmm, aspetti ancora! Puoi provare ad aprire la pagina con <b>Firefox</b> oppure clicca su <a href="#" onclick="location.reload(true); return false">ricarica la mappa</a>.';
	}
};

function hideMsg() {	
	$("#msgContainer").hide();
}
//Called when body loads
google.maps.event.addDomListener(window, 'load', getLocation);


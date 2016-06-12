var https = require('https');
var Twitter = require('twitter');
var lat;
var long;
var radius='8km';
var pages=1,pagecount=1;


var GeneralRequest = function(host,path,callbackreq){
  
  var callback = function(response) {
    var str = '';
    response.setEncoding('utf8');
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    //the whole response has been recieved, so we operate on it
    response.on('end', function () {
      callbackreq(JSON.parse(str));
    });
  };
  
  var options = {
    host: host,
    port: 443,
    path: path,
    method: 'GET'
  };
  
  var request = https.request(options, callback);
	request.on('error', function(e){
        console.log('error from request: ' + e.message);
    });
  request.end();
};

module.exports.GeneralRequest = GeneralRequest;





//var user = require('./app/models/user.js');

var getFBdata = function(placeschema,name,lat,long,token){
  if(!token) return 0;
  
  console.log(token);
  //var token = user.facebook.token;
  //var token = 'EAAC06VHccXcBAH5XZAvd3PjxdZByF4ZCVv0N0JVg7miJNujUjKisI4M9YidVFZA8Fo6YThVeq8JHVUQ7CMPZAPfGbNpMDFl1ASWLS2I8gFMKqDn7wuqieS9RBd2w196KGEzifZChyagQL2pMsHYkjMVrrClGzIE4EZD';//user.facebook.token;

  
  console.log(name);
  var nomeEnc=decodeURIComponent(name); 
  nomeEnc=encodeURIComponent(nomeEnc);

  
  function searchpage(){
    //search pages
    GeneralRequest('graph.facebook.com','/search?q='+nomeEnc+'&type=page&fields=name,id,location'+'&pages=1'+'&access_token='+token,function(resJSON){ 
          function setting(){
            //console.log(resJSON);
            if(resJSON.data[0]){
              for(var i=0;i<resJSON.data.length;i++){
                //console.log(resJSON.data[i].location);
                if(isSameLocation(resJSON.data[i].location,lat,long,4)){
                  placeschema.facebook.id = resJSON.data[i].id.toString();
                  break;
                }
              }
              
              if(placeschema.facebook.id == ''){
                console.log('notfound');
                placeschema.facebook.found = 'NOTFOUND';
                
                //wides search radius if none of the results are within radius or are without a location
                for(var i=0;i<resJSON.data.length;i++){
                  if(isSameLocation(resJSON.data[i].location,lat,long,radius,400)){
                    placeschema.facebook.id = resJSON.data[i].id.toString();
                    break;
                  }
                } 
                if(placeschema.facebook.id==''){
                  //takes first result as best match if none of the results are within radius or are without a location
                  placeschema.facebook.id = resJSON.data[0].id.toString();
                }
              }
              
            } else{
              placeschema.facebook.id = 'UNDEFINED'
              console.log('undefined!');
            }
          }
          setting.prototype.doSomething = function(callback){
            callback.call(this);
          };
          new setting().doSomething(searchBestMatch);
      });
  }
  
  //searches the best match for the given page
  function searchBestMatch(){
    if(placeschema.facebook.id == 'UNDEFINED') return;
    GeneralRequest('graph.facebook.com','/'+ placeschema.facebook.id +'?fields=best_page&access_token='+token,function(resJSON){ 
          function setting(){
            
            placeschema.facebook.id = resJSON.id.toString(); //takes first page result's id
          }
          setting.prototype.doSomething = function(callback){
            callback.call(this);
          };
          new setting().doSomething(searchinfo);
      });
    
  }

  function searchinfo(){
    
    //get page's picture
    GeneralRequest('graph.facebook.com','/'+ placeschema.facebook.id +'/picture?redirect=0&access_token='+token,function(resJSON){
        //console.log(resJSON);
        placeschema.facebook.img = resJSON.data.url;
      });
      
    //get page's likes
    GeneralRequest('graph.facebook.com','/'+ placeschema.facebook.id +'?fields=likes&access_token='+token,function(resJSON){
      //console.log(resJSON);
        placeschema.facebook.likes = resJSON.likes; 
      });
      
      
      //get page's about
      GeneralRequest('graph.facebook.com','/'+ placeschema.facebook.id +'?fields=about&access_token='+token,function(resJSON){
        //console.log(resJSON);
          placeschema.facebook.desc=resJSON.about;
        });
        
      //get page's phone
      GeneralRequest('graph.facebook.com','/'+ placeschema.facebook.id +'?fields=phone&access_token='+token,function(resJSON){
        //console.log(resJSON);
           placeschema.facebook.tel = resJSON.phone;
        });
      
      //get page's culinary team
      GeneralRequest('graph.facebook.com','/'+ placeschema.facebook.id +'?fields=culinary_team&access_token='+token,function(resJSON){
        //console.log(resJSON);
          placeschema.facebook.cooks = resJSON.toString(); //...
      });  
      
      //get page's name
      GeneralRequest('graph.facebook.com','/'+ placeschema.facebook.id +'?fields=name&access_token='+token,function(resJSON){
        //console.log(resJSON);
          placeschema.facebook.titolo = resJSON.name; //...
      });  
      //get page's first three photos
      GeneralRequest('graph.facebook.com','/'+ placeschema.facebook.id +'/photos?type=uploaded&access_token='+token,function(resJSON){
        //console.log(resJSON.data);
          if(resJSON.data == undefined) return;
          if(resJSON.data[0]!= undefined) placeschema.facebook.photos.one = resJSON.data[0].id;
          if(resJSON.data[1]!= undefined) placeschema.facebook.photos.two = resJSON.data[1].id;
          if(resJSON.data[2]!= undefined) placeschema.facebook.photos.three = resJSON.data[2].id;
      });  
  	
  	
  }
  
  searchpage();

};

var configAuth = require('./config/auth');

var getTWdata = function(places,nomeEnc,lat,long,token,tokenSecret){
  if(!token||!tokenSecret) return 0;
  function twRequest(path,callbackreq){

     var client = new Twitter({
      consumer_key: configAuth.twitterAuth.consumerKey, //'jcZcjNTyMchNXbY8lyfqKdhG1',
      consumer_secret: configAuth.twitterAuth.consumerSecret, //'tld4DGzW6wTAlvl5abq454lNY2niOPHk1XZVz8BCVpok5Ts2xY',
      access_token_key: token, //"168465851-Wem5oMS7xt5CCt8UITcArMZzrzd2xMH3KE6cMie2",
      access_token_secret: tokenSecret, //"nan9O0iB6k6CKQVjtPL4pPsSQkrxlB2KlhLRBZjemf3Sb",
    });
     
    var params = {};
    client.get(path, params, function(error, tweets, response){
        if(error)  console.log('error: '+ JSON.stringify(error));
        //console.log(tweets);  // The favorites. 
        //console.log(response);  // Raw response object.
        callbackreq(tweets);
    });
    
  }
  
  
  
  //get page
  twRequest('/users/search.json?q='+nomeEnc+'&page='+pages+'&count='+pagecount,function(resJSON){
        
        
        if(resJSON[0]){
          //console.log(JSON.stringify(resJSON[0].location));
          
          places.twitter.id=resJSON[0].id_str;
          places.twitter.img=resJSON[0].profile_image_url;
          places.twitter.banner=resJSON[0].profile_banner_url;
          places.twitter.name = resJSON[0].screen_name;
          places.twitter.followers = JSON.stringify(resJSON[0].followers_count);

          //get page's last 3 statuses
          twRequest('/statuses/user_timeline.json?user_id='+places.twitter.id+'&count=3&trim_user=1',function(resJSON){
            
            //statuses
            if(resJSON[0]){
              var len=resJSON.length;
              if(len>=1){
                places.twitter.pagesTweets.one.txt = resJSON[0].text;
                if(resJSON[0].entities.media) places.twitter.pagesTweets.one.media = JSON.stringify(resJSON[0].entities.media.media_url); 
                places.twitter.pagesTweets.one.id = resJSON[0].id_str;
                //console.log(JSON.stringify(resJSON[0])+'\n');
              }
              if(len>=2){
                
                 places.twitter.pagesTweets.two.txt = JSON.stringify(resJSON[1].text);
                if(resJSON[1].entities.media) places.twitter.pagesTweets.two.media = JSON.stringify(resJSON[1].entities.media.media_url); 
                places.twitter.pagesTweets.two.id = resJSON[1].id_str;
                    //console.log(JSON.stringify(resJSON[1])+'\n');
              }
              if(len>=3){
                
                places.twitter.pagesTweets.three.txt = JSON.stringify(resJSON[2].text);
                if(resJSON[2].entities.media) places.twitter.pagesTweets.three.media = JSON.stringify(resJSON[2].entities.media.media_url); 
                places.twitter.pagesTweets.three.id = resJSON[2].id_str;
                //console.log(JSON.stringify(resJSON[2])+'\n');
              }
          
            }
          });
          
        } else{
          places.twitter.id = 'notfound';
        }
    });

  
  //get tweets with exactly the name without media
  twRequest('/search/tweets.json?q='+nomeEnc+' -filter:media&lang=it&trim_user=1&count=3',function(resJSON){
        if(resJSON){
          var len=resJSON.statuses.length;
          if(len<1) return;
            if(len>=1){
              places.twitter.tweets.one.txt = JSON.stringify(resJSON.statuses[0].text);
              places.twitter.tweets.one.id = JSON.stringify(resJSON.statuses[0].id_str); 
            }
            if(len>=2){
              places.twitter.tweets.two.txt= JSON.stringify(resJSON.statuses[1].text);
              places.twitter.tweets.two.id = JSON.stringify(resJSON.statuses[1].id_str);
            }
            if(len>=3){
              places.twitter.tweets.three.txt = JSON.stringify(resJSON.statuses[2].text);
              places.twitter.tweets.three.id = JSON.stringify(resJSON.statuses[2].id_str);
            }
        }
    });
    
    
    //get tweets with exactly the name that contain photos
    twRequest('/search/tweets.json?q='+nomeEnc+' filter:media&count=7&trim_user=1',function(resJSON){
        if(resJSON!=undefined){
          var len=resJSON.statuses.length;
          var i = 0;
          var j = 0;
          for(i=0;i<len&&j<3;i++){
            if(resJSON.statuses[i].entities.media!=undefined){
              if(j==0){
                places.twitter.photos.one = resJSON.statuses[i].entities.media[0].media_url;
                j++;
                continue;
              } 
              if(j==1){
                places.twitter.photos.two = resJSON.statuses[i].entities.media[0].media_url;
                j++;
                continue;
              } 
              if(j==2){
                places.twitter.photos.three = resJSON.statuses[i].entities.media[0].media_url;
                break;
                } 
            } 
          }
        }
          
    });
      
    //get tweets with exactly the name that contain photos and have that specific geolocation
    twRequest('/search/tweets.json?q='+nomeEnc+' filter:media&count=7'+'&geocode='+lat+','+long+','+radius+'&trim_user=1',function(resJSON){ //CANNOT FIND ANYTHING
        if(resJSON){
          var len=resJSON.statuses.length;
          
          for(var i=0,j=0;i<len&&j<3;i++){
            if(resJSON.statuses[i].entities.media!=undefined){
              if(j==0){
                places.twitter.geoPhotos.one = resJSON.statuses[i].entities.media[0].media_url;
                j++;
                continue;
              } 
              if(j==1){
                places.twitter.geoPhotos.two = resJSON.statuses[i].entities.media[0].media_url;
                j++;
                continue;
              } 
              if(j==2){
                places.twitter.geoPhotos.three = resJSON.statuses[i].entities.media[0].media_url;
                break;
                } 
            } 
          }
          
        }
    });

}




function isSameLocation(loc,lat,long,radius){
  if(loc!='' && loc!= undefined && loc.latitude && loc.longitude){  //CONTROLLARE SE SONO UNDEFINED OBJECTS
  //calculate distance between two locations in km
  	var radlat1 = Math.PI * lat/180
  	var radlat2 = Math.PI * loc.latitude/180
  	var theta = long-loc.longitude
  	var radtheta = Math.PI * theta/180
  	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  	dist = Math.acos(dist)
  	dist = dist * 180/Math.PI
  	dist = dist * 60 * 1.1515
  	dist = dist * 1.609344
  	
  	//var radius=4; //radius of search in km
  	if(dist>radius) return false;
  	return true;
  }else return false;
}












//***NOT USED***  render the list of friends near u
/*var friendsList;

var getFriends = function(req){


  
 // console.log(req.user.facebook.name);

  var fbtoken = req.user.facebook.token;
    //var fbtoken = 'CAAWJTLpjWXkBADKZCMxomncGkOX4bnaZBlWKg94xb1EpB3icXSFQ8ZBTrXqjelEMK30vDiGWznHbgPpJ8vEK1uTGM9oVy7MjVSHDmbmoHK6uGVEODK6IrP5HOz4tPH3ZBUKTOjP0KAZBtsTZBpLbPUlY1ZBZAaPRwQfDw3baZB7rKePevDjgaUkjPP7PwKAnGonEZD';//user.facebook.token;

  
  //request every 5 minutes
 var nomiF = [20];
  GeneralRequest('graph.facebook.com','/me/friends' + '?access_token=' + fbtoken,function(resJSON){ 
    //console.log(resJSON.data.length);
    //console.log(JSON.stringify(resJSON.data));
        var temp = resJSON.data;
       // console.log(temp);
      alert(resJSON.data);
      
    });
    


}*/

//module.exports.getFriends = getFriends;
module.exports.getFBdata = getFBdata;
module.exports.getTWdata = getTWdata;
module.exports.GeneralRequest = GeneralRequest;
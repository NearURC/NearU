var Twitter = require('twitter');
var configAuth = require('../config/auth');
var datareq = require('../dataRequest.js');
var request = require('request');
var yelp = require('node-yelp');
var q = 'tasks2';
var sendTWEET = 0;
var open = require('amqplib').connect('amqp://localhost');
var User = require('../app/models/user');
var mongoose = require('mongoose');
var searchFriends=new Array;


module.exports = function(app , passport , open ){


//ricerca asincrono di menzioni di luoghi dagli amici su fb
app.get('/fb/*', function(req , res){
	if(!req.user.facebook){
		res.send('Connetti prima facebook al tuo account!');
	}
		searchFriends.push({
				v : 1,
				id: req.user.facebook.id
			});

 		req.user.list = new Array;
 		req.user.save();
 		console.log(req.user.facebook.token);
 		var placeToFind = decodeURI(req.url).split('/fb/')[1].toLowerCase();
 		console.log('\n'+ placeToFind);
 		/*datareq.*/producer(placeToFind,req.user,searchFriends);
 		//console.log('2');
 		/*datareq.*/consumer(req.user,searchFriends);
 		//console.log('3');
 		//console.log(list+'4');
 		setTimeout(res.render('friends.ejs' , { user: req.user, list: req.user.list}),6000);
 	});
 	
 	app.get('/fbstop', function(req , res){
		for(var i=0; i<searchFriends.length;i++){
			if(searchFriends[i].id==req.user.facebook.id) searchFriends[i].v=0;
		//	console.log(searchFriends[i].v);
		}
 		req.user.list = [];
 		req.user.save();
 		
		res.render('profile.ejs' , { user: req.user});
 		
 	});
 	
 	app.get('/fbrefresh',function(req , res){
		res.render('friends.ejs',{user : req.user , list : req.user.list});
 	});
 	
 	
 	
 	
function producer(nome,user){
	//console.log('p');
  var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
	if(err){
		console.log(err);
		return 1;
	} 
  conn.createChannel(function(err, ch) {
  	if(err){
		console.log(err);
		return 1;
	} 
    	/*user.searchFriends=1;
    	user.save();*/
  ch.assertQueue('tasks');
  
  var refreshIntervalId = setInterval(function() {
  	if(checkSearchF(user.facebook.id)==0){
  		console.log('NOTA BENE : '+ checkSearchF(user.facebook.id));
  		clearInterval(refreshIntervalId); //?
  		
  	} 
  	//console.log('p2');
    //check every 3 seconds
    //token='EAAC06VHccXcBAJkZCMKdRsa6dnrRnjd2vFAbPW2y2OTzZB82zcePX9P6exGyRUL75D4opvEeCZAwgnIRfjASOxw7c1LScHmvwEJ11qqflZCbygyKoggtMG1U8jeYSnHYH4hL3yZCqnnfmTiLZCMFnqzdDtoVTEOmznsfHN7EWV6gZDZD';
  			datareq.GeneralRequest('graph.facebook.com','/me/friends' + '?access_token=' + user.facebook.token,function(resJSON){ 
          //console.log(JSON.stringify(resJSON));
          //console.log(resJSON.data.length);
          for(var i=0; i < resJSON.data.length ; i++){
            if(resJSON.data[i]){
            	//console.log('p5');
            //	console.log(resJSON.data[0]);
              var friend= resJSON.data[i].name;
              datareq.GeneralRequest('graph.facebook.com','/' + resJSON.data[i].id + '/posts?fields=message&access_token=' + user.facebook.token,function(resJSON){
                //console.log(resJSON);
                //console.log(resJSON.data[0].message);
                for( var i=0 ; i< resJSON.data.length ; i++ ){
          
                  if( resJSON.data[i].message ){
                  	
                    if( resJSON.data[i].message.toLowerCase().indexOf(nome) > -1 ){
                    	//console.log('msg trovato');
                      var msg=new Array;
                        msg[0]=friend;
                        msg[1]=resJSON.data[i].id;
                      //console.log('p7');
                      ch.sendToQueue('task', new Buffer(msg[0]+'_,_'+msg[1]+'_,_'+resJSON.data[i].message.toString()));
                      console.log(" [x] Sent %s", msg);
                    }
                  }
                  
                }
                
              });
              
              
            }
          }
        });
  
  }, 6000);
  
   refreshIntervalId =setInterval(function() {
  	if(checkSearchF(user.facebook.id)==0){
  		console.log('0');
  		clearInterval(refreshIntervalId); //?
  		
  	} 
	 else{
		ch.sendToQueue('task', new Buffer('check'));
		console.log(" [x] Sent %s", 'check');
	 }
  }, 3000);
  
	});
});

}

function checkSearchF(userid){
	for(var i=0; i<searchFriends.length;i++){
		if(searchFriends[i].id==userid) return searchFriends[i].v;
	}
	return -1;
}


function consumer(user){
	//console.log('c');
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
	if(err){
		console.log(err);
		return 1;
	} 
  conn.createChannel(function(err, ch) {
  	if(err){
		console.log(err);
		return 1;
	} 
  ch.assertQueue('tasks');
  console.log(" [*] Waiting for messages in task.");
  ch.consume('task', function(msg) {
   // console.log('sono nel consume, msg = : '+ msg.content.toString());
    if(msg.content.toString()!='check'){
    //	console.log('sono nel primo if');
    
	    var us = mongoose.model('User');
			// find user
			us.find( { 'facebook.id': user.facebook.id }, function (err, u) {
			  if (err){
			  	console.log('error: '+err);
			  }
			  if(!u[0]){
			  	console.log('not found');
			  	
			  } else{
			  	if(u[0].list.indexOf(msg.content.toString()) == -1){
	     		u[0].list.push(msg.content.toString());
	     		//console.log(u[0]);
	     		 u[0].save();
	    		 }
			  }
			  	
			});

      console.log('consume');
      console.log(user.list.toString());
    }else if(msg.content.toString()=='check'){
    //	console.log('sono nell\'if ==check');
    
        if(checkSearchF(user.facebook.id)==0) return false;
    }
    
  }, {noAck: true});
	});
  
});
}
 	
 	
 	
 	

 	
	//home page
	app.get('/' , function(req , res){

		res.render('index.ejs');
	});

	//login
	app.get('/login', function(req , res){
		res.render('login.ejs', {message : req.flash('loginMessage')});
	});

	//process login form
	app.post('/login', passport.authenticate('local-login' , {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
	}));

	//signup
	app.get('/signup',function(req , res){
		res.render('signup.ejs', {message : req.flash('signupMessage')});
	});
	//process signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	//profile
	app.get('/profile', isLoggedIn , function(req , res){

		res.render('profile.ejs' , { user: req.user});

	});
	
	//profile2
	app.get('/profile2', isLoggedIn , function(req , res){
		res.render('profile2.ejs' , { user: req.user});
	});
	
	//cronologia
	app.get('/cronologia', isLoggedIn , function(req , res){
		res.render('cronologia.ejs' , { user: req.user});
	});
			
	//logout
	app.get('/logout', function(req , res){
		req.logout();
		res.redirect('/');
	});
	// |--------------------------------------------------------------------|
	// |-----------------------YELP ROUTES----------------------------------|
	// |--------------------------------------------------------------------|

	
	app.get('/yelp/search', function(req , res){
	//	console.log(req.query);
	//var qs = decodeURIComponent(req.query);
	var lat = req.query.lat;
	var long = req.query.long;
	var placeName =req.query.placeName;
	var address = req.query.address;
	var phoneNum = req.query.phone;
	//---elaborazione indirizzo da places
	var address_to_String= '';
	

	
	//console.log(ponte);
	//console.log(placeName);
	var client = yelp.createClient({
  oauth: {
    "consumer_key": configAuth.yelpAuth.consumer_key,
    "consumer_secret": configAuth.yelpAuth.consumer_secret,
    "token": configAuth.yelpAuth.token,
    "token_secret": configAuth.yelpAuth.token_secret
  },
  
  // Optional settings: 
  httpClient: {
    maxSockets: 25  // ~> Default is 10 
  }
});
 
 var latLng = lat+','+long;
 console.log(latLng);
 console.log(address);
client.search({
  term: placeName,
  //location : address,
  ll : latLng,
  limit : 20,
  offset : 0,
  sort : 1 ,
  radius_filter : 300
}).then(function (data) {
  var businesses = "";
  
  var tot = data.businesses;
  console.log(tot.length);
  for (var i = 0 ; i < tot.length ; i++){
  	console.log((tot[i].name).toString());
  	//console.log(tot[i].display_phone.toString());
  	console.log(tot[i].location.address.toString());
  	if((tot[i].name.toLowerCase() === placeName.toLowerCase())||
  		((tot[i].location.address).toString().toLowerCase() === address_to_String.toLowerCase()) ||
  		(tot[i].location.coordinate.latitude === lat && tot[i].location.coordinate.longitude === long)||
  		(tot[i].display_phone != undefined && (tot[i].display_phone.toString() === phoneNum.toString()))){
  		businesses= tot[i];
  		break;
  	}
  }
  var location = data.region;
  //console.log(tot);
  //console.log(placeName);
  console.log(businesses.url);
  res.redirect(businesses.url);
  
  // ...  
});
 

	

	});

	
	//FACEBOOK ROUTES
	app.get('/auth/facebook', passport.authenticate('facebook', { scopes : ['email','public_profile', 'user_friends','publish_actions','user_posts']}));

	app.get('/auth/facebook/callback',passport.authenticate('facebook',{
		successRedirect : '/profile',
		failureRedirect : '/',
		//scope : ['email','public_profile', 'user_friends','publish_actions','user_posts']
	}));
	//TWITTER ROUTES
	app.get('/auth/twitter',passport.authenticate('twitter'));
	app.get('/auth/twitter/callback', passport.authenticate('twitter',{
		successRedirect : '/profile',
		failureRedirect : '/'
	}));
	//GOOGLE ROUTES
	app.get('/auth/google',passport.authenticate('google', { scope : ['profile', 'email']}));
	app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/'
            }));

	//AUTHORIZE (ALREADY LOGGED IN)/ CONNECT SOCIAL ACCOUNT
		//locale
	app.get('/connect/local', function(req , res){
		res.render('connect-local.ejs', { message : req.flash('loginMessage')});
	});

	app.post('/connect/local', passport.authenticate('local-signup',{
		successRedirect : '/profile',
		failureRedirect : '/connect/local',
		failureFlash : true
	}));
		//facebook
	app.get('/connect/facebook', passport.authorize('facebook',{scope : ['email']}));

	app.get('connect/facebook/callback',passport.authorize('facebook', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));
		//twitter
	app.get('/connect/twitter', passport.authorize('twitter', {scope : ['email','email']}));

	app.get('/connect/twitter/callback', passport.authorize('twitter', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

		//google
	app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email']}));

	app.get('/connect/google/callback', passport.authorize('google', {
		successRedirect : '/profile',
		failureRedirect : '/'
	}));

	//UNLINK

	// local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
           res.redirect('/profile');
        });
    });
	app.get('/twitter/share', function(req , res){
		var place_name = req.query.name;
		request({
			url : 'https://nearu-nearu.c9users.io/twitter/send_tweet',
			method : 'POST',
			body : place_name
		} );
		res.redirect('/profile');
	});
	//TWEET 
    app.post('/twitter/send_tweet' , function(req , res){
    		
var client = new Twitter({
    		consumer_key : configAuth.twitterAuth.consumerKey ,
    		consumer_secret : configAuth.twitterAuth.consumerSecret,
    		access_token_key : req.user.twitter.token ,
    		access_token_secret : req.user.twitter.tokenSecret
    	});
    	client.post('statuses/update', {status : req.body.tweet.toString()}, function(error , tweet, response){
    		
    		console.log(tweet);
    		console.log(response);
    	});
 
    	//console.log(req.body.tweet);
    	res.redirect('/profile');

    });
    
    
    
    // |--------------------------------------------------------------------|
	// |-----------------------DATI SOCIALS---------------------------------|
	// |--------------------------------------------------------------------|
	
	app.get('/socials@*', function(req , res){
    	
    	//PLACESCHEMA:
		var places = {
		    local : {
		        name : '',
		    },
			facebook : {
				found: '',
				id : '',
				tel : '',
				desc : '',
				img : '',
				likes: '',
				cooks: '',
				titolo: '',
				photos: {
					one : '',
					two : '',
					three : '',
				},
			},
			twitter : {
				id : '',
				name : '',
				followers : '',
				img : '',
				banner : '',
				pagesTweets : {
					one :{
			    		id : '',
			    		txt : '',
			    		media : '',
			    	},
					two : {
			    		id : '',
			    		txt : '',
			    		media : '',
			    	},
					three : {
			    		id : '',
			    		txt : '',
			    		media : '',
			    	},
				},
				tweets : {
					one :{
						id :'',
			    		txt : '',
			    	},
					two : {
						id :'',
			    		txt : '',
			    	},
					three : {
						id :'',
			    		txt : '',
			    	},
				},
				photos : {
					one :'',
					two : '',
					three : '',
					},
				geoPhotos : {
					one :'',
					two : '',
					three : '',
					},
			},
		};
    	

		var data = function(){
		    datareq.getFBdata(places,req.url.split('@')[1],req.url.split('@')[2],req.url.split('@')[3],req.user.facebook.token);
			datareq.getTWdata(places,req.url.split('@')[1],req.url.split('@')[2],req.url.split('@')[3],req.user.twitter.token,req.user.twitter.tokenSecret);
		  }
		function renderPage(){
			var temp = function(){
				res.render('socials.ejs' , { user: req.user , place: places });
			}
			setTimeout(temp,700);
		}
		data.prototype.doSomething = function(callback){
			  	callback.call(this);
		};
		new data().doSomething(renderPage);
	});
    
    
    // |--------------------------------------------------------------------|
	// |--------------------------- REST API -------------------------------|
	// |--------------------------------------------------------------------|
	
	// |----------------RETURNS SOCIALS DATA OF A PLACE---------------------|
	app.get('/search/*', function(req , res){
    	// /search/nome/lat/long/&fbt=fbtoken&twt=twtoken&twts=twtokensecret
    	
    	//PLACESCHEMA:
		var places = {
		    local : {
		        name : '',
		    },
			facebook : {
				found: '',
				id : '',
				tel : '',
				desc : '',
				img : '',
				likes: '',
				cooks: '',
				titolo: '',
				photos: {
					one : '',
					two : '',
					three : '',
				},
			},
			twitter : {
				id : '',
				name : '',
				followers : '',
				img : '',
				banner : '',
				pagesTweets : {
					one :{
			    		id : '',
			    		txt : '',
			    		media : '',
			    	},
					two : {
			    		id : '',
			    		txt : '',
			    		media : '',
			    	},
					three : {
			    		id : '',
			    		txt : '',
			    		media : '',
			    	},
				},
				tweets : {
					one :{
						id :'',
			    		txt : '',
			    	},
					two : {
						id :'',
			    		txt : '',
			    	},
					three : {
						id :'',
			    		txt : '',
			    	},
				},
				photos : {
					one :'',
					two : '',
					three : '',
					},
				geoPhotos : {
					one :'',
					two : '',
					three : '',
					},
			},
		};
    	
		var data = function(){
		    if( req.url.indexOf('&fbt=') > -1 ) datareq.getFBdata(places, req.url.split('/')[2], req.url.split('/')[3], req.url.split('/')[4], req.url.split('&fbt=')[1].split('&twt=')[0]);
			if( req.url.indexOf('&twt=') > -1 && req.url.indexOf('&twts=') > -1 ) datareq.getTWdata(places, req.url.split('/')[2], req.url.split('/')[3], req.url.split('/')[4], req.url.split('&twt=')[1].split('&twts=')[0], req.url.split('&twts=')[1]);
		  }
		function sendData(){
			var temp = function(){
				
				res.send(JSON.stringify(places));
			}
			setTimeout(temp,700);
		}
		data.prototype.doSomething = function(callback){
			  	callback.call(this);
		};
		new data().doSomething(sendData);
	});
    
    
    
    
    // |--------------RETURN THE URL OF A YELP PLACE--------------------|
    app.get('/searchyelp/*', function(req , res){
    		// /searchyelp/nome/lat/long
    		
    		
    		//	console.log(req.query);
			//var qs = decodeURIComponent(req.query);
			var lat = req.url.split('/')[3];
			var long = req.url.split('/')[4];
			var placeName =decodeURIComponent(req.url.split('/')[2]);
			//---elaborazione indirizzo da places
			//var address_to_String= '';
			
		
			
			//console.log(ponte);
			//console.log(placeName);
			var client = yelp.createClient({
		  oauth: {
		    "consumer_key": configAuth.yelpAuth.consumer_key,
		    "consumer_secret": configAuth.yelpAuth.consumer_secret,
		    "token": configAuth.yelpAuth.token,
		    "token_secret": configAuth.yelpAuth.token_secret
		  },
		  
		  // Optional settings: 
		  httpClient: {
		    maxSockets: 25  // ~> Default is 10 
		  }
		});
		 
		 var latLng = lat+','+long;
		 console.log(latLng);
		 //console.log(address);
		client.search({
		  term: placeName,
		  //location : address,
		  ll : latLng,
		  limit : 20,
		  offset : 0,
		  sort : 1 ,
		  radius_filter : 300
		}).then(function (data) {
		  //var businesses = "";
		  
		  var tot = data.businesses;
		  console.log(tot.length);
		  /*for (var i = 0 ; i < tot.length ; i++){
		  	console.log((tot[i].name).toString());
		  	//console.log(tot[i].display_phone.toString());
		  	console.log(tot[i].location.address.toString());
		  	if((tot[i].name.toLowerCase() === placeName.toLowerCase())||
		  		(tot[i].location.coordinate.latitude === lat && tot[i].location.coordinate.longitude === long)){
		  		businesses= tot[i];
		  		break;
		  	}
		  }*/
		  //console.log(tot[0].url);
		  if(tot.length>=1){
		  	res.send(JSON.stringify(tot[0].url));
		  } else{
		  	res.send(JSON.stringify('not found'));
		  }

		});
	});


	// |----------------DELETE USER DATA---------------------|
	
	// facebook --------------------------------
	app.delete('/unlink/facebook&id=*', function(req, res) {
		//user: &id=id&password=password
		console.log(req.url.split('&id=')[1].split('&password=')[0] );
        var user = mongoose.model('User');
		// find user
		user.find( { "_id": req.url.split('&id=')[1].split('&password=')[0], 'local.password': req.url.split('&password=')[1] }, function (err, user) {
		  if (err){
		  	res.send(JSON.stringify('error: '+err));
		  }
		  if(!user[0]){
		  	res.send('not found');
		  	
		  } else if(user[0].facebook){
		  	user[0].facebook=undefined;
				user[0].save(function (err) {
			      if (err){
			      	res.send(JSON.stringify('error: '+err));
			      } else res.send('deleted');
			    });
			} else res.send("already not defined");
		});
    });

    // twitter --------------------------------
    app.delete('/unlink/twitter&id=*', function(req, res) {
    	///user: &id=id&password=password
		console.log(req.url.split('&id=')[1].split('&password=')[0] );
        var user = mongoose.model('User');
		// find user
		user.find( { "_id": req.url.split('&id=')[1].split('&password=')[0], 'local.password': req.url.split('&password=')[1] }, function (err, user) {
		  if (err){
		  	res.send(JSON.stringify('error: '+err));
		  }
		  if(!user[0]){
		  	res.send('not found');
		  	
		  } else if(user[0].twitter){
		  	user[0].twitter=undefined;
				user[0].save(function (err) {
			      if (err){
			      	res.send(JSON.stringify('error: '+err));
			      } else res.send('deleted');
			    });
			} else res.send("already not defined");
		});
    });

    // google ---------------------------------
    app.delete('/unlink/google&id=*', function(req, res) {
    	//user: &id=id&password=password
		console.log(req.url.split('&id=')[1].split('&password=')[0] );
        var user = mongoose.model('User');
		// find user
		user.find( { "_id": req.url.split('&id=')[1].split('&password=')[0], 'local.password': req.url.split('&password=')[1] }, function (err, user) {
		  if (err){
		  	res.send(JSON.stringify('error: '+err));
		  }
		  if(!user[0]){
		  	res.send('not found');
		  	
		  } else if(user[0].google){
		  	user[0].google=undefined;
				user[0].save(function (err) {
			      if (err){
			      	res.send(JSON.stringify('error: '+err));
			      } else res.send('deleted');
			    });
			} else res.send("already not defined");
		});
    });
    
    
    
	 app.get("*", function(req, res){
	 res.send("Sorry, page not found. Try another search request.");
	 });

};

	function isLoggedIn(req , res , next){
		if(req.isAuthenticated())
			return next();
		res.redirect('/');
	}


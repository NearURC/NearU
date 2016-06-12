var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//utente loggato in locale
var User = require('../app/models/user');
//carica variabili auth
var configAuth = require('./auth');

module.exports = function(passport){

	passport.serializeUser(function(user , done){
		done(null , user.id);
	});

	passport.deserializeUser(function(id , done){
		User.findById(id , function(err , user){
			done(err,user);
		});
	});

	//strategia di login
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req , email , password , done){
		process.nextTick(function(){
			User.findOne({'local.email' : email}, function( err , user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage','that email is already taken.'));
				}else{
					//creare il nuovo user
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					//salvo il nuovo user sul db
					newUser.save(function(err){
						if(err)
							throw err;
						return done(null , newUser);
					});
				}
			});
		});
	}));

	//login
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req , email , password , done){
		User.findOne({'local.email' : email}, function(err , user){
			if(err)
				return done(err);
			if(!user)
				return done(null , false , req.flash('loginMessage','no user found'));
			if(!user.validPassword(password))
				return done(null , false , req.flash('loginMessage', 'wrong password'));
			return done(null , user);
		});
	}));

	//FACEBOOK log in with passport
	passport.use(new FacebookStrategy({
		//passo all'app i valori necessari salvati in auth.js
		clientID : configAuth.facebookAuth.clientID ,
		clientSecret : configAuth.facebookAuth.clientSecret ,
		callbackURL : configAuth.facebookAuth.callbackURL,
		profileFields : ['email','displayName','name'],
		scope : ['email','displayName','name','user_friends','publish_actions','user_posts'],
		passReqToCallback : true
	},function(req , token , refreshToken , profile , done){
		process.nextTick(function(){
			if(!req.user){
				User.findOne({'facebook.id' : profile.id}, function(err , user){
					if(err)
						return done(err);
					if(user){
						if(!user.facebook.token){
							user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
							user.facebook.token = token ;
							if(profile.emails)
							user.facebook.email = profile.emails[0].value;
							else
							user.facebook.email = 'email non disponibile';
							user.save(function(err){
								if(err)
									console.log(profile);
									return done(null , user);
							});
						}
						return done(null , user);
					}
					else{
						var newUser = new User();
						newUser.facebook.id = profile.id;
						newUser.facebook.token = token ;
						newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
						if(profile.emails)
						newUser.facebook.email = profile.emails[0].value;
						else
						newUser.facebook.email = 'email non disponibile';
						//save
						newUser.save(function(err){
							if(err)
								throw err;
							return done(null , newUser);
						});
					}
				});
			}else{
				var user = req.user;

				user.facebook.id = profile.id;
				user.facebook.token = token ;
				user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
				if(profile.emails)
					user.facebook.email = profile.emails[0].value;
				else
					user.facebook.email = 'email non disponibile';
					//save
				user.save(function(err){
					if(err)	
						throw err;
					return done(null , user);
				});
			}
		});
	}));
	//TWITTER LOGIN STRATEGY
	passport.use(new TwitterStrategy({
		consumerKey : configAuth.twitterAuth.consumerKey ,
		consumerSecret : configAuth.twitterAuth.consumerSecret ,
		callbackURL : 'https://nearu-nearu.c9users.io:8080/auth/twitter/callback',
		passReqToCallback : true
	}, function(req , token , tokenSecret , profile , done){
		process.nextTick(function(){
		if(!req.user){
				User.findOne({'twitter.id': 'profile.id'},function(err , user){
					if(err)
						return done(err);
					if(user){
						if(!user.twitter.token){
							user.twitter.token = token ;
							user.twitter.tokenSecret = tokenSecret;
							user.save(function(err){
								if(err)
									throw err;
								return done(null, user);
							});
						}
						return done(null , user);
					}
					else{
						var newUser = new User();
						newUser.twitter.id = profile.id;
						newUser.twitter.token = token;
						user.twitter.tokenSecret = tokenSecret;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;
						newUser.save(function(err){
							if(err)
								throw err;
							return done(null,newUser);
						});
					}
				});
		}else{
			var user = req.user;
			user.twitter.id = profile.id;
			user.twitter.token = token;
			user.twitter.tokenSecret = tokenSecret;
			user.twitter.username = profile.username;
			user.twitter.displayName = profile.displayName;
			user.save(function(err){
				if (err)
					throw err;
				return done(null,user);
			});
		}
	});
	}));

	//	GOOGLE LOGIN STRATEGY
	passport.use(new GoogleStrategy({
		clientID : configAuth.googleAuth.clientID ,
		clientSecret : configAuth.googleAuth.clientSecret ,
		callbackURL : configAuth.googleAuth.callbackURL,
		profileFields : ['profile','email'],
		passReqToCallback : true
	}, function( req , token , refreshToken , profile , done){
		process.nextTick(function(){
			if(!req.user){
				User.findOne({'google.id' : profile.id}, function(err , user){
					if(err)
						return done(err);
					if(user){
						if(!user.google.token){
							user.google.token = token;
							user.save(function(err){
								if(err)
									throw err;
								return done(null , user);
							});
						}
						return done(null, user);
					}else{
						var newUser = new User();
						newUser.google.id = profile.id;
						newUser.google.token = token;
						newUser.google.name = profile.displayName;
						newUser.google.email = profile.emails[0].value;
						newUser.save(function(err){
							if(err)
								throw err;
							return done(null, newUser);
						});
					}
				});
			}else{
				var user = req.user;
				user.google.id = profile.id;
				user.google.token = token;
				user.google.name = profile.displayName;
				user.google.email = profile.emails[0].value;
				user.save(function(err){
					if(err)
						throw err;
					return done(null,user);
				});
			}
		});
	}));

};
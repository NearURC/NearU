var flash = require('connect-flash');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
var open = require('amqplib').connect('amqp://localhost');
var dataRequest = require('./dataRequest.js');

open.then(function(conn){
    var ch = conn.createChannel();
    ch = ch.then(function(channel){
        channel.assertQueue('tasks');
    });
});








//connessione al database
mongoose.connect(configDB.url);

require('./config/passport')(passport);

//set up per express
app.use(morgan('dev')); //tutte le richieste alla console
app.use(cookieParser()); //legge i cookies (per l'auth)
app.use(bodyParser.json()); //prende le info dai form html
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine' , 'ejs');

//per passport
app.use(session({secret : 'sonoilsegretosegretissimo'})); //segreto della sessione
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); //sessione persistente di login

//cartella pubblica per le immagini ed i css
 app.use( express.static( "public" ) );

//routes
require('./app/routes.js')(app , passport , open ); //carica le routes e configura passport in app



app.listen(process.env.PORT, process.env.IP, function(){
    console.log(process.env.IP);
   console.log('ascolto e funziono sulla porta' + " " +process.env.PORT); 
});




import './config.mjs';

import express from 'express';
import session from 'express-session';

import exphbs from 'express-handlebars';

import path from 'path';
import { fileURLToPath } from 'url';

import passport from 'passport';

import mongoose from 'mongoose';

import db from './db.mjs';
import './auth.mjs';

import {createServer } from 'http';
import { Server } from 'socket.io';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import hbs from 'hbs';



const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Users = db.Users;
const CurrSessions = db.Sessions;

const server = createServer(app);
const io = new Server(server, {
    path: '/socket.io'
});


app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(hbs),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));


//stuff?


app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

//path printer
app.use((req, res, next)=> {
    console.log(req.method + ' ' + req.path.toUpperCase());
    next();
});



//session support
const sessionOptions = {
    secret: 'secret cookie',
    resave: true,
    saveUniitialized: true
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

//routes
const router = express.Router();
const User = mongoose.model('Users');
const Sessions = mongoose.model('Sessions');




router.get('/', async (req, res) => {
    try{
        const sessions = await CurrSessions.find().lean();
        const user = req.user;

        if(!user)
        {
            res.render('login');
        }
        else 
        {
            res.render('home', { sessions, user: user, username: req.user.username});

        }
        
    }
    catch(err)
    {
        console.log(err);
        res.status(500);
        res.send("500 - Internal Error");
    }
});


router.post('/', async (req, res) => {
    const { name } = req.body;
    const date = new Date();
    const day = "" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + (date.getYear() + 1900);
    try
    {
        const sesh = new CurrSessions({
            name: name,
            date: day,
            users: 1,
            sessionId: name + '_' + date 
        });

        await sesh.save();
        res.redirect('/');
    }
    catch (err)
    {
        console.log(err);
        res.status(500);
        res.send("500 Internal Error");
    }
});



/*
router.get('/', function(req, res) {
    res.render('home');
});
*/

router.get('/home', function(req, res) {
    res.redirect('/');
});


router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/register', function(req, res) {
    res.render('register', );
});

//register post
router.post('/register', function(req, res) {
    User.register(new User({username: req.body.username}), 
        req.body.password, function(err, user){
      if (err) {
        res.render('register', {message:'Your registration information is not valid'});
      } else {
        passport.authenticate('local')(req, res, function() 
        {
          res.redirect('/');

        });
      }
    });   
  });

  //login post

  router.post('/login', function(req,res,next) {
    passport.authenticate('local', function(err,user) {
      if(user) {
        req.logIn(user, function(err) {
            if(err)
            {
                console.log("ERROR IN AUTH: ", err);
            }
          res.redirect('/');
        });
      } else {
        res.render('login', {message:'Your login or password is incorrect.'});
      }
    })(req, res, next);
  });



  app.get('/session/:_id', async (req, res) => {
    try {
        const sessionId = req.params._id;
        const sesh = await CurrSessions.findOne({ _id: sessionId }).lean();

        if (!sesh) {
            res.status(404);
            return res.send('404 Not Found');
        }

        const user = req.user;
        res.render('session', { sesh: sesh, user: user});

        io.on('connection', (socket) => {
            console.log("New User Joined");

            socket.emit('timerUpdate', sesh.timerValue);

            socket.on('timerUpdate', (remainingTime) => {
                io.emit('timerUpdate', remainingTime);
            });



        });
    } catch (err) {
        console.log(err);
        res.status(500);
        return res.send('500 Internal Error');
    }
});


  //websocket communication
  //handling joining sessions, notifying other clients
  //timer updates

  let timerInterval = 0;
   
  io.on('connection', (socket) => {
    console.log("New User Joined");

    socket.on('joinSession', (sessionId, userId) => {
        socket.join(sessionId);
        socket.broadcast.to(sessionId).emit('userJoined', userId);
        console.log("SOCKET joinSESSION called");
    });



    socket.on('timerUpdate', (remainingTime) => {    
        if (!timerInterval) {
            timerInterval = setInterval(() => {
              remainingTime--;
              io.emit('timerUpdate', remainingTime);
            }, 1000);
        }
    
        if (io.engine.clientsCount === 0) {
            clearInterval(timerInterval);
            timerInterval = null;
        }


        
    });
    

    socket.on('userJoined', (userId) => {
        console.log("EMITTING joinedUSER");
        io.emit('userJoined', userId);
    });

    socket.on('disconnect', () => {
        console.log("User Disconnected");
    });
});




app.use('/', router);

console.log(__dirname);

server.listen(process.env.PORT || 3000, () => {
    console.log("Server listening on PORT ", process.env.PORT || 3000);
});

export{
    router,
    app
};
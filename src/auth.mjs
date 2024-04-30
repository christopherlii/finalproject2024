import passport from 'passport';
import strat from 'passport-local';
import db from './db.mjs';

const Users = db.Users;

const LocalStrategy = strat.Strategy;


passport.use(new LocalStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());
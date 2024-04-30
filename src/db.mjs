import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

console.log(process.env.DSN);
mongoose.connect(process.env.DSN);


/*
How Users should work
- Every user has basic info(uername, userId, hash, name(not implemeneted yet))
- friends is an array of all your friends
- sessions is a past list of finished sessions that the user has partook in
    - i want a big part of this to be about tracking and managing your progress,
    and i want to be able to create a chart similar to the progress charts you see
    on github that show how much work you put on a daily basis

- groups is a later idea, but groups of students that study similar things

- im currently thinking about the right side of the home screen being 
    some sort of "activity feed", similar to instagram's recent 
    activity before they removed it. Users should be able to see their
    friends recent activities, how long they locked in for, and when they join
    or leave a session. 
- can also look into implementing chats later 

*/
const usersSchema = new mongoose.Schema({
    username: {type: String, required: true},
    userId: String,
    hash: {type: String, required: true},
    groups: Array,
    friends: Array,
    sessions: Array
});

/*
How sessions should work:
- Every session has basic info (name, sessionId, date)
- maybe disregard sectionsLeft? seems useless
- startTime and endTime are used for syncing purposes, updated
  incrementally as we go
- session only ends when every user has left, regardless of who created it
- Status indicates whether the session is in pre-start, study, break, or finished
- if status is finished, it will be appended to every user involved's finished
- also needs a counter for how long a user has been in a session



*/
const sessionsSchema = new mongoose.Schema({
    name: String,
    sessionId: String,
    date: String,
    sectionsLeft: Number,
    users: Number,
    status: String, //Ready, Running, Break, Finished
    startTime: Date,
    endTime: Date
});


//implement a "sessions history" section for people to see their progress

usersSchema.plugin(passportLocalMongoose);

const Users = mongoose.model('Users', usersSchema);
const Sessions = mongoose.model('Sessions', sessionsSchema);

export default
{
    Users, 
    Sessions
};
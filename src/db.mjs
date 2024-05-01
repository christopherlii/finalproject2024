import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

console.log(process.env.DSN);
mongoose.connect(process.env.DSN);


const usersSchema = new mongoose.Schema({
    username: {type: String, required: true},
    userId: String,
    hash: {type: String, required: true},
    groups: Array,
    friends: Array,
    sessions: Array
});


const sessionsSchema = new mongoose.Schema({
    name: String,
    sessionId: String,
    date: String,
    sectionsLeft: Number,
    users: Number,
    status: String, 
    startTime: Date,
    endTime: Date
});


usersSchema.plugin(passportLocalMongoose);

const Users = mongoose.model('Users', usersSchema);
const Sessions = mongoose.model('Sessions', sessionsSchema);

export default
{
    Users, 
    Sessions
};
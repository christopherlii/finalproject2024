//sessions.mjs

class Session {
    constructor(name, totalSessions) {
        this.name = name;
        this.totalSessions = totalSessions;
        this.sessionsCompleted = 0;
    }

    startSession() {
        if (this.sessionsCompleted < this.totalSessions) {
            this.sessionsCompleted++;
            console.log("Session started. Sessions completed: " + this.sessionsCompleted);
            return true;
        } else {
            console.log("Finished the pomodoro. Session is finished.");
            return false;
        }
    }

    endSession() {
        console.log("Session ended. Total sessions completed: " + this.sessionsCompleted);
    }

    getTotalSessions() {
        return this.totalSessions;
    }

    getSessionsLeft() {
        return this.totalSessions - this.sessionsCompleted;
    }

    getCompletionPercentage() {
        return (this.sessionsCompleted / this.totalSessions) * 100;
    }
}


export default Session;
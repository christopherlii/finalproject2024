// test/session.test.js

import { expect } from 'chai';
import { Session } from '../session.mjs';
import { Server } from 'socket.io';
import Client from 'socket.io-client';

describe('PomodoroSession', function() {
    let session;

    beforeEach(function() {
        session = new Session('Study Session', 4);
    });

describe('#startSession()', function() {
        it('should start a session if sessions are left', function() {
            const result = session.startSession();
            expect(result).to.be.true;
        });

        it('should not start a session if no sessions are left', function() {
            session.sessionsCompleted = 4; 
            const result = session.startSession();
            expect(result).to.be.false;
        });
    });

    describe('#endSession()', function() {
        it('should correctly log the end of a session', function() {
            session.startSession();
            session.endSession();
            expect(session.sessionsCompleted).to.equal(1);
        });
    });

    describe('#getTotalSessions()', function() {
        it('should return the total number of sessions', function() {
            expect(session.getTotalSessions()).to.equal(4);
        });
    });

    describe('#getSessionsLeft()', function() {
        it('should return the correct number of sessions left', function() {
            session.startSession();
            expect(session.getSessionsLeft()).to.equal(3);
        });
    });

    describe('#getCompletionPercentage()', function() {
        it('should return the correct completion percentage', function() {
            session.startSession();
            expect(session.getCompletionPercentage()).to.equal(25);
        });
    });
});

describe('Socket.io Tests', function() {
  let io, serverSocket, clientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = Client(`http://localhost:${port}`);
      io.on('connection', socket => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  after(() => {
    io.close();
    clientSocket.close();
  });

  describe('joinSession event', function() {
    it('should broadcast to all clients except the sender', function(done) {
      clientSocket.on('userJoined', (userId) => {
        expect(userId).to.equal('12345');
        done();
      });
      serverSocket.emit('joinSession', 'session123', '12345');
    });
  });

});

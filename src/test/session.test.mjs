// test/app.test.js

import { expect } from 'chai';
import request from 'supertest';
import io from 'socket.io-client';
import { app } from '../app.mjs';
import sinon from 'sinon';


describe('App', function() {
    // Test route handlers
    describe('GET /login', function() {
        it('should respond with status 200 and render login page', function(done) {
            request(app)
                .get('/login')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.include('Welcome Back!');
                    done();
                });
        });
    });

    // Test middleware function
    describe('Middleware', function() {
        it('should log request method and path', function(done) {
            const consoleSpy = sinon.spy(console, 'log'); // Use sinon to spy on console.log
    
            request(app)
                .post('/')
                .send({ username: 'testuser', password: 'testpassword' })
                .end(function(err, res) {
                    sinon.assert.calledWith(consoleSpy, 'POST /'); // Check if the right message was logged
                    consoleSpy.restore(); // Restore the original console.log function
                    done();
                });
        });
    });
    

    // Test WebSocket communication
    // Test WebSocket communication
    describe('WebSocket', function() {
        let socket;
    
        before(function(done) {
            socket = io('http://localhost:3000'); // Connect to your WebSocket server
            socket.on('connect', done);
        });
    
        it('should emit timerUpdate event with remaining time', function(done) {
            const remainingTime = 1500;
    
            // Emit timerUpdate from the client
            socket.emit('timerUpdate', remainingTime);
    
            // Listen for timerUpdate on the server
            socket.on('timerUpdate', function(time) {
                expect(time).to.equal(remainingTime-1);
                done();
            });
        });
    
        after(function() {
            socket.close(); // Close the socket connection after the test
        });
    });
    


    // Test register route
    describe('POST /register', function() {
        it('should register a new user', function(done) {
            request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'testpassword' })
                .expect(302) // Assuming redirect on successful registration
                .end(function(err, res) {
                    // You can add additional assertions here if needed
                    done();
                });
        });
    });
});

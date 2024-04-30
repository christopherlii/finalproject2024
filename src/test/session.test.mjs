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
            const consoleSpy = sinon.spy(console, 'log'); // Assuming you're using sinon for spies

            request(app)
                .post('/')
                .send({ /* Your request body */ })
                .end(function(err, res) {
                    expect(consoleSpy.calledWith('Method: POST')).to.be.true;
                    expect(consoleSpy.calledWith('POST', '/')).to.be.true;
                    done();
                });
        });
    });

    // Test WebSocket communication
    // Test WebSocket communication
describe('WebSocket', function() {
    let socket;

    before(function(done) {
        socket = io('http://localhost:3000'); // Replace 'http://localhost:3000' with your server URL
        socket.on('connect', function() {
            done();
        });
    });

    it('should emit timerUpdate event with remaining time', function(done) {
        const remainingTime = 1500;
        socket.emit('timerUpdate', remainingTime);
        socket.on('timerUpdate', function(time) {
            expect(time).to.equal(remainingTime);
            done();
        });
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

// test/app.test.js
import {describe, it} from 'mocha';
import { expect } from 'chai';
import request from 'supertest';
import io from 'socket.io-client';
import { app } from '../app.mjs';
import sinon from 'sinon';


describe('App', function() {
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

    describe('Middleware', function() {
        it('should log request method and path', function(done) {
            const consoleSpy = sinon.spy(console, 'log'); 
    
            request(app)
                .post('/')
                .send({ username: 'testuser', password: 'testpassword' })
                .end(function(err, res) {
                    sinon.assert.calledWith(consoleSpy, 'POST /'); 
                    consoleSpy.restore();
                    done();
                });
        });
    });
    

 
    describe('WebSocket', function() {
        let socket;
    
        before(function(done) {
            socket = io('http://localhost:3000'); 
            socket.on('connect', done);
        });
    
        it('should emit timerUpdate event with remaining time', function(done) {
            const remainingTime = 1500;
    
            socket.emit('timerUpdate', remainingTime);
    
            socket.on('timerUpdate', function(time) {
                expect(time).to.equal(remainingTime-1);
                done();
            });
        });
    
        after(function() {
            socket.close(); 
        });
    });
    

    describe('POST /register', function() {
        it('should register a new user', function(done) {
            request(app)
                .post('/register')
                .send({ username: 'testuser', password: 'testpassword' })
                .expect(302) 
                .end(function(err, res) {
                    done();
                });
        });
    });
});

const chai = require('chai');
const nock = require('nock');
const request = require('supertest');
const app = require('../src/server');

describe('GET /', function () {
    it('responds with home page', function (done) {
        //specify the url to be intercepted
        nock("http://localhost:8082")
            //define the method to be intercepted
            .get('/api/events')
            //respond with a OK and the specified JSON response
            .reply(200, {
                "events": [
                    { title: 'an event', id: 1234, description: 'something really cool', location: 'Joes pizza', likes: 0 },
                    { title: 'another event', id: 5678, description: 'something even cooler', location: 'Johns pizza', likes: 0 }
                ]
            });
        nock("http://localhost:8082")
            //define the method to be intercepted
            .get('/api/config')
            //respond with a OK and the specified JSON response
            .reply(200, {
                "config": {
                    "version": "1.0.1",
                    "team": "Your Team Name"
                }
            });

        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                chai.assert.isTrue(res.text.includes("<h1>Welcome to"));
                return done();
            });
    });

    it('should display page when the backend is down', function (done) {
        //specify the url to be intercepted
        nock("http://localhost:8082")
            //define the method to be intercepted
            .get('/api/events')
            //respond with an error
            .replyWithError("Error");

        request(app)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                chai.assert.isTrue(res.text.includes("Error"));
                return done();
            });
    });

    it('should display page not found', function (done) {
        request(app)
            .get('/fred')
            .expect('Content-Type', /html/)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    chai.assert.isTrue(res.text.includes("Error"));
                    chai.assert.isTrue(res.text.includes("NotFoundError"));
                    chai.assert.isTrue(res.text.includes("404"));
                    done();
                }
            });
    });

});



describe('POST /event', function () {
    it('adds an event', function (done) {
        const data = { title: 'test event', description: 'even cooler test', id: 4321, location: 'Some Test Place', likes: 0 };
        //specify the url to be intercepted
        nock("http://localhost:8082")
            //define the method to be intercepted
            .post('/api/event')
            //respond with a OK and the specified JSON response
            .reply(200, {
                "events": [
                    { title: 'an event', id: 1234, description: 'something really cool', location: 'Joes pizza', likes: 0 },
                    { title: 'another event', id: 5678, description: 'something even cooler', location: 'Johns pizza', likes: 0 },
                    data
                ]
            });

        request(app)
            .post('/event')
            .expect(302)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                console.log('Response Text: ', res.text );
                chai.assert.isTrue(res.text.includes("Redirecting"));
                return done();
            });
    });
});

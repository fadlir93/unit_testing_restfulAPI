process.env.NODE_ENV = 'test';

let mongoose = require('mongoose')
let Book = require('../controllers/models/book');

let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHTTP);

//Our parent block
describe('Books', () => {
    beforeEach((done) => {
        Book.remove({}, err => {
            done();
        })
    })
    describe('/GET book', () => {
        it('it should Get all the books', done => {
            chai.request(server)
                .get('/book')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                })
        })
    })
})
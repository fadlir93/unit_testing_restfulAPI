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

    describe('/POST book', () => {
        it('it should not POST a book without pages field', (done) => {
            let book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954
            }
            // req.header['x-access-token'] = 'someValue'
        chai.request(server)            
            .post('/book')
            // .set('x-access-token', '12879182798172')
            .send(book)
            .end((err, res) => {
                // console.log(res.request.header)
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.errors.should.have.property('pages');
                res.body.errors.pages.should.have.property('kind').eql('required');
                res.body.errors.pages.should.have.property('name').eql('ValidatorError');
                done();
            })
        })

        it('it should POST a book', done => {
            let book = {
                title : "Final Fantary Child Emperor",
                author : "Robert DW.J",
                year : 2010,
                pages : 1200
            }
        chai.request(server)
            .post('/book')
            .send(book)
            .end( (err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Book Successfully added!');
                res.body.book.should.have.property('title');
                res.body.book.should.have.property('author');
                res.body.book.should.have.property('pages');
                res.body.book.should.have.property('year');
                done();
            })
        })
    })
})
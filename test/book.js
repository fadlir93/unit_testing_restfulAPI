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

    describe('/GET/id book', () => {
        it('it should GET a book by the given id', done => {
            let book = new Book({title : "The lord of the rings", author: "J.R.R. Tolkien", year: 1954, pages : 128});
            book.save((err, book) => {
                chai.request(server)
                .get('/book/'+book.id)
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('author');
                    res.body.should.have.property('pages');
                    res.body.should.have.property('year');
                    res.body.should.have.property('_id').eql(book.id);
                    done();
                }) 
            })
        })
    })

    describe('/PUT/:id book', () => {
        it('it should UPDATE a book given the id', done => {
            let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
            book.save((err, book) => {
                chai.request(server)
                .put('/book/'+ book.id)
                .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1960, pages: 778})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book updated');
                    done();
                })
            })
        })
    })

    describe('/DELETE/:id book', () => {
        it('it should Delete a book given the id', done => {
            let book = new Book({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 989})
            book.save((err, book) => {
                chai.request(server)
                .delete('/book/'+book.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Book Successfully deleted!');
                    res.body.result.should.have.property('ok').eql(1);
                    done()
                })
            })
        })
    })
})
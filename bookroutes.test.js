process.env.NODE_ENV = 'test'
const db = require('./db')
const express = require('express')
const app = require('./app')
const Book = require('./models/book')
const request = require('supertest')

// beforeEach()
// afterEach()

describe('Book Routes', function () {
    beforeEach(async function () {
        await db.query("DELETE FROM books");
        let book = await Book.create({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Matthew Lane",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        })
    })

    test('GET /books', async function (){
        const results = await request(app).get('/books')
        expect(results.statusCode).toEqual(200)
        expect(results.body.books.length).toEqual(1)
        expect(results.body.books[0].author).toEqual('Matthew Lane')
    })

    test('GET single book /books/:id', async function (){
        const results = await request(app).get('/books/0691161518')
        expect(results.statusCode).toEqual(200)
        console.log (results)
        expect(results.body.book.isbn).toEqual('0691161518')
    })

    test('POST /books create a book with proper schema', async function (){
        const results = await request(app).post('/books/').send({
            "isbn": "07",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Test Author",
            "language": "english",
            "pages": 24,
            "publisher": "Test Pub 2007",
            "title": "Pop-up books are the best",
            "year": 2017
        })
        expect(results.statusCode).toEqual(201)
        expect(results.body.book.isbn).toEqual('07')
    })

    test('POST /books create a book with IMPROPER schema', async function (){
        const results = await request(app).post('/books/').send({
            "isbn": '07',
            "amazon_url": "http://a.co/eobPtX2",
            // "author": "Test Author",
            "language": "english",
            "pages": 24,
            "publisher": "Test Pub 2007",
            "title": "Pop-up books are the best",
            "year": 2017
        })
        expect(results.statusCode).toEqual(404)
    })

    test('PUT /books/:id update a book', async function (){
        const results = await request(app).put('/books/0691161518').send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Testing a put",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        })
        expect(results.statusCode).toEqual(200)
        expect(results.body.book.author).toEqual('Testing a put')
        
    })

    test('PUT /books/:id update a book with IMPORPER SCHEMA', async function (){
        const results = await request(app).put('/books/0691161518').send({
            "isbn": "0691161518",
            "amazon_url": "not a valid url",
            // "author": "Testing a put",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        })
        expect(results.statusCode).toEqual(404)
        // expect(results.body.book.author).toEqual('Testing a put')
        
    })

    test('DELETE /books/:id deleting a book', async function (){
        const results = await request(app).delete('/books/0691161518')
        // expect(results.statusCode).toEqual(404)
        // expect(results.body.book.author).toEqual('Testing a put')
        console.log(results)

        expect(results.body.message).toEqual('Book deleted')
        expect(results.statusCode).toEqual(200)
    })
})



afterAll(async function (){
    await db.end()
})
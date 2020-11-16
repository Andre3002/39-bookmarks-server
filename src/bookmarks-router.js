const express = require('express')
const bookRouter = express.Router()
const { v4: uuid } = require('uuid')

let bookmarks = [{
    id: "1",
    title: "The Odessey",
    content: "Greek tragedy",
    url: "www.test.com",
    rating: 4
}]

bookRouter
    .route('/')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post((req, res) => {
        app.use(express.json()) 
        const { title, content, url, rating } = req.body;

        if (!header) {
            logger.error(`Header is required`);
            return res
              .status(400)
              .send('Invalid data');
          }
    
    })

bookRouter
    .route('/:id')
    .get((req, res) => {    
        const bookmark = bookmarks.find(b => b.id == req.params.id)
        if (!bookmark){
            return res.status(404).send()
        } 
        res.json(bookmark)
    })
    .delete((req, res) => {
        bookmarks = bookmarks.filter(b => b.id !== req.params.id)
        res.status(204).send()
    })

module.exports = bookRouter
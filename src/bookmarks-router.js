const express = require('express')
const bookRouter = express.Router()
const { v4: uuid } = require('uuid')
const jsonParser = express.json()

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
    .post(jsonParser, (req, res) => {
        // app.use(express.json())
        const { title, content, url, rating } = req.body;
        const logger = req.app.get("logger")

        if (!title || !content || !url || !rating) {
            logger.error(`Title, content, url and a rating are required`);
            return res
                .status(400)
                .send('Invalid data');
        }

        // get an id
        const id = uuid();

        const bookmark = {
            id,
            title,
            content,
            url,
            rating
        };

        bookmarks.push(bookmark);

        logger.info(`Bookmark with id ${id} created`);

        res
            .status(201)
            .location(`http://localhost:8000/${id}`)
            .json(bookmark);

    })

bookRouter
    .route('/:id')
    .get((req, res) => {
        const bookmark = bookmarks.find(b => b.id == req.params.id)
        if (!bookmark) {
            return res.status(404).send()
        }
        res.json(bookmark)
    })
    .delete((req, res) => {
        bookmarks = bookmarks.filter(b => b.id !== req.params.id)
        res.status(204).send()
    })

module.exports = bookRouter
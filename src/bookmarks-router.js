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
        const logger = req.app.get("logger") // how to get logger in multiple places pt2/2

        if (!title) {
            logger.error(`A valid title is required`);
            return res
                .status(400)
                .send('A valid title is required');
        }

        if (!content) {
            logger.error(`Valid content is required`);
            return res
                .status(400)
                .send(`Valid content is required`);
        }

        if (!url) {
            logger.error(`A valid url is required`);
            return res
                .status(400)
                .send('A valid url is required');
        }

        //validation of url
        const regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if (!regexp.test(url)) {
            logger.error(`A valid url is required`);
            return res
                .status(400)
                .send('A valid url is required');
        }

        if (!rating) {
            logger.error(`A valid rating is required`);
            return res
                .status(400)
                .send('A valid rating is required');
        }

        if (!(parseInt(rating) >= 0 && parseInt(rating) <= 5)) {
            logger.error(`The rating must a number (0-5)`);
            return res
                .status(400)
                .send('Invalid data.  The rating must be a number (0-5)');
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
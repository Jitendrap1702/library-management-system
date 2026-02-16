const express = require('express');
const {books} = require('../data/books.json');
const {users} = require('../data/users.json');

const router = express.Router();

/**
 * ROUTE: /books
 * METHOD: GET
 * DESCRIPTION: Get all books
 * ACCESS: Public
 * PARAMS: None
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success : true,
        data : books
    })
});

/**
 * ROUTE: /books/:id
 * METHOD: GET
 * DESCRIPTION: Get a book by id
 * ACCESS: Public
 * PARAMS: ID
 */
router.get('/:id', (req, res) => {
    const {id} = req.params;
    const book = books.find(book => book.id === id);
    if(!book){
        res.status(404).json({
            success : false,
            message : 'Book not found for id: ' + id
        });
    }else{
        res.status(200).json({
            success : true,
            data : book
        });
    }
});


/**
 * ROUTE: /books
 * METHOD: POST
 * DESCRIPTION: Create/Register a new book
 * ACCESS: Public
 * PARAMS: None
 * BODY: {
 *      id : String,
 *      title : String,
 *     author : String,
 *    year : String
 * }
 */
router.post('/', (req, res) => {
    // Destructuring the required fields from the request body
    const {id, title, author, year} = req.body;

    // Validating that all required fields are present in the request body
    if(!id || !title || !author || !year){
        return res.status(400).json({
            success : false,
            message : 'All fields are required: id, title, author, year'
        });
    }
    // Checking if a book with the same id already exists in the books array
    const book = books.find(book => book.id === id);
    if(book){
        res.status(409).json({ 
            success : false,
            message : 'Book already exists with id: ' + id
        });
    }else{
        // Creating a new book object with the provided data
        const newBook = {
            id,
            title,
            author,
            year
        };
        // Adding the new book to the books array
        books.push(newBook);
        res.status(201).json({
            success : true,
            message : 'Book created successfully',
            data : newBook
        });
    }
});

/**
 * ROUTE: /books/:id
 * METHOD: PUT
 * DESCRIPTION: Update a book by id
 * ACCESS: Public
 * PARAMS: ID
 */
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {data} = req.body;
    if(!data){
        return res.status(400).json({
            success : false,
            message : 'Data field is required in the request body'
        });
    }
    const book = books.find(book => book.id === id);
    if(!book){
        res.status(404).json({
            success : false,
            message : 'Book not found for id: ' + id
        });
    }else{
        const updatedBook = books.map((book) => {
            if(book.id === id){
                return {...book, ...data};
            }
            return book;
        });
        books.splice(0, books.length, ...updatedBook);
        res.status(200).json({
            success : true,
            message : 'Book updated successfully',
            data : updatedBook
        });
    }
});

/**
 * ROUTE: /books/:id
 * METHOD: DELETE
 * DESCRIPTION: Delete a book by id
 * ACCESS: Public
 * PARAMS: ID
 */
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const book = books.find(book => book.id === id);
    if(!book){
        res.status(404).json({
            success : false,
            message : 'Book not found for id: ' + id
        });
    }else{
        /* Method 1: Using filter to create a new array without the book to be deleted and then replacing the original books array with the new array
        const updatedBooks = books.filter(book => book.id !== id);
        books.splice(0, books.length, ...updatedBooks);
        */
        const index = books.indexOf(book);
        books.splice(index, 1);
        res.status(200).json({
            success : true,
            message : 'Book deleted successfully',
            data : books
        });
    }
});

/**
 * ROUTE: /issued-books/for-users
 * METHOD: GET
 * DESCRIPTION: Get all issued books
 * ACCESS: Public
 * PARAMS: None
 */
router.get('/issued-books/for-users', (req, res) => {
    // const issuedBooks = books.filter(book => book.issued);
    const userWithIssuedBooks = users.filter((user) => {
        if(user.issuedBook) return user;
    });

    const issuedBooks = [];
    userWithIssuedBooks.forEach((user) => {
        const book = books.find((book) => book.id === user.issuedBook);

        book.issuedBy = user.name;
        book.issuedDate = user.issuedDate;
        book.returnDate = user.returnDate;

        issuedBooks.push(book);
    });

    // If no books have been issued yet, return a 404 response with an appropriate message
    if(issuedBooks.length === 0){
        return res.status(404).json({
            success : false,
            message : 'No books have been issued yet'
        });
    }

    // Returning the list of issued books along with the details of the user who issued each book
    res.status(200).json({
        success : true,
        data : issuedBooks
    });
});

module.exports = router;
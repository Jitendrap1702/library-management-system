const express = require('express');

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

const app = express();

app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.status(200).json({
        message : 'HOME PAGE: Welcome to the Library Management System'
    });
});

app.use('/users', usersRouter);
app.use('/books', booksRouter);

// app.all('*', (req, res) => {
//     res.status(500).json({
//         message : "Not Built Yet"
//     });
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

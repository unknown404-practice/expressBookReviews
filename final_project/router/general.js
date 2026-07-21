const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matches = [];
  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      matches.push(books[key]);
    }
  });
  res.send(matches);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matches = [];
  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      matches.push(books[key]);
    }
  });
  res.send(matches);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Task 11: Get book by ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Task 12: Get books by author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Task 13: Get books by title using async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports.general = public_users;
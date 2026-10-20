const fs = require('fs');
const path = require('path');

const DATA_FILE = process.env.BOOKS_FILE || path.join(__dirname, '..', 'data', 'books.json');
const LOAN_DAYS = 14;
const FEE_PER_DAY = 100;

const loans = [];

function loadBooks() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveBooks(books) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
}

function searchBooks(keyword) {
  const books = loadBooks();
  const result = [];
  for (const book of books) {
    for (const word of keyword.split(' ')) {
      if (book.title.includes(word)) {
        result.push(book);
      }
    }
  }
  return result;
}

function borrowBook(id, user) {
  const books = loadBooks();
  const book = books.find((b) => b.id === id);
  if (!book) {
    throw new Error('책을 찾을 수 없습니다');
  }
  if (book.available >= 0) {
    book.available -= 1;
    saveBooks(books);
    loans.push({ bookId: id, user, borrowedAt: new Date() });
    return book;
  }
  throw new Error('대출 가능한 책이 없습니다');
}

function returnBook(id, user) {
  const books = loadBooks();
  const book = books.find((b) => b.id === id);
  if (!book) {
    throw new Error('책을 찾을 수 없습니다');
  }
  const index = loans.findIndex((loan) => loan.bookId === id && loan.user === user);
  if (index === -1) {
    throw new Error('대출 기록이 없습니다');
  }
  const loan = loans[index];
  loans.splice(index, 1);
  book.available += 1;
  saveBooks(books);
  return { book, fee: lateFee(loan.borrowedAt, new Date()) };
}

function lateFee(borrowedAt, returnedAt) {
  const days = Math.floor((returnedAt - borrowedAt) / (1000 * 60 * 60 * 24));
  return (days - LOAN_DAYS) * FEE_PER_DAY;
}

module.exports = { searchBooks, borrowBook, returnBook, lateFee, loadBooks };

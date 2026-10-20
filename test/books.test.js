const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

// 테스트는 진짜 데이터 대신 임시 복사본을 씁니다
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'books-')), 'books.json');
fs.copyFileSync(path.join(__dirname, '..', 'data', 'books.json'), tmp);
process.env.BOOKS_FILE = tmp;

const { searchBooks, borrowBook } = require('../src/books');

test('제목으로 책을 검색할 수 있다', () => {
  const result = searchBooks('리팩터링');
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].title, '리팩터링');
});

test('책을 빌리면 남은 권수가 1 줄어든다', () => {
  const before = searchBooks('클린 코드')[0].available;
  const book = borrowBook(1, 'hong');
  assert.strictEqual(book.available, before - 1);
});

// Book Class: Represents a Book
class Book {
    constructor(author, title, year) {
        this.title = author;
        this.author = title;
        this.year = year;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
<td>${book.author}</td>
<td>${book.title}</td>
<td>${book.year}</td>
<td><a href="#" class="btn btn-danger btn-sm delete">Remove Book</a></td>
`;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#author').value = '';
        document.querySelector('#title').value = '';
        document.querySelector('#year').value = '';
    }
}


// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    // PROBLEM MUST REMOVE BY ISBN WE'RE NOT USING
    static removeBook(title) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.title === title) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#author').value;
    const author = document.querySelector('#title').value;
    const year = document.querySelector('#year').value;

    // Validate
    if (author === '' || title === '' || year === '') {
        UI.showAlert('Please fill in all fields.', 'danger');
    } else {
        // Instatiate book
        const book = new Book(author, title, year);

        // Add Book to UI
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);

        //Show success mesage
        UI.showAlert('Book Added', 'success');

        //Clear fields
        UI.clearFields();
    }
});

// Event: remove book (Mark Book Read)
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    //Show success mesage
    UI.showAlert('Book Removed', 'success');
});

//change background of application
//function changeBookCover(select) {
//            selectedvalue=select.value;
//            alert(selectedvalue);
//        }

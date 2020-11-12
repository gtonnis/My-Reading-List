// Book Class: Represents a Book
class Book {
    constructor(title, author, year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }
}

// UserInterface Class: Handle UserInterface Tasks
class UserInterface {
    static displayBooks() {
       const books = Storage.getBooks();

        books.forEach((book) => UserInterface.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#reading-list');

        const row = document.createElement('tr');

        row.innerHTML = `
<td>${book.title}</td>
<td>${book.author}</td>
<td>${book.year}</td>
<td><a href="#" class="btn btn-danger delete">Remove Book</a></td>
`;
       
        list.appendChild(row);
    }
    
    static deleteBook(el){
        if(el.classList.contains('delete')){
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
        // Vanish in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }
    
    static clearFields(){
    document.querySelector('#author').value = ''; 
    document.querySelector('#title').value = '';
    document.querySelector('#year').value = '';
    }
}


// Storage Class: Handles Storage
class Storage {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
            }
        
        return books;
    }
    
    static addBook(book) {
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    // Remove Book 
    static removeBook(title) {
        const books = Storage.getBooks();
        books.forEach((book, index) => {
          if(book.title === title)  {
              books.splice(index, 1);
          }
        });
        
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UserInterface.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    //Get form values
    const title = document.querySelector('#author').value;
    const author = document.querySelector('#title').value;
    const year = document.querySelector('#year').value;

    // Validate
    if (author ==='' || title === '' || year ===''){
        UserInterface.showAlert('Please fill in all fields.', 'danger');
    }else{
         // Instatiate book
    const book = new Book(author, title, year);

    // Add Book to UserInterface
    UserInterface.addBookToList(book);
        
        // Add book to storage
        Storage.addBook(book);
        
        //Show success mesage
        UserInterface.showAlert('Information Added', 'success');
    
    //Clear fields
UserInterface.clearFields();
    }
    });

// Event: remove book 
document.querySelector('#reading-list').addEventListener('click', (e) => {
   // Remove book from UserInterface
    UserInterface.deleteBook(e.target);
    
    // Remove book from storage
 Storage.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
    //Show success message
        UserInterface.showAlert('Information Removed', 'success');
});

//Sorting Books
/**
*
*@param {HTMLTableElement} table The table to sort
*@param {number} column The index of the column to sort
*@param {boolean} asc Determines if the sorting will be in ascending
*/
function sortTableByColumn(table, column, asc = true){
    const dirModifier = asc ? 1 : -1;
    const tBody = table.tBodies[0];
    const rows = Array.from(tBody.querySelectorAll("tr"));

    //Sort each row
    const sortedRows = rows.sort((a, b) => {
       const aColumnText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
       const bColumnText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();

       return aColumnText > bColumnText ? (1 * dirModifier) : (-1 * dirModifier);
    });

    //Remove all existing TRs from the table
    while (tBody.firstChild){
        tBody.removeChild(tBody.firstChild);
    }

    //Re-add the newly sorted rows
    tBody.append(...sortedRows);

    //Remember how the column is currently sorted
    table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
       const tableElement = headerCell.parentElement.parentElement.parentElement; 
       const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
       const currentIsAscending = headerCell.classList.contains("th-sort-asc");

       sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
});


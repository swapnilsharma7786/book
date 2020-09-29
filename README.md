# book
Book

The library is going to be accessed by a set of RESTful services.

JavaScript and asynchronous programming, Web services and Unit Testing with mocha

POST
This method is used to add a book to the library. Books should be kept in memory as an array of strings containing the
book titles. No duplicate titles are allowed. New books are added to the end of the array. The title of the book to be
added is passed to this method in the body of the POST request with a parameter called “book”.

DELETE
This method is used to remove a book from the library. Errors should be thrown for attempted removal of non-existent
books. If a book is removed, all subsequent books are shifted up by 1 index. The body of this DELETE request should
contain a “book” parameter with the name of the book to be removed from existence.

PATCH
This method updates the name of an existing book. Errors should be thrown for attempts to update non-existent books,
or if the updated name would match the name of another book already in the library, to avoid confusion (or an
existential book crisis.) The index of the book should stay the same after its name has been updated. The request body
should contain two parameters, “original_book”, the initial name of the book to be updated, and “new_book”,
the new name of said book.

GET
This method returns the full contents of the library.

PUT
This method should simulate asynchronous persistence of the current book list to a database (no actual saving of the
book list to a database is required.) A function called “saveItemOnDatabase (name, callback)” has
defined such that the first parameter is the name of the book to be saved and the second is a callback function. This
function called for every book in the list separately.

To simulate a database delay for every write operation, you can use the native JavaScript “setInterval” function in
combination with “Math.random()” and the book name string’s “length” property. If you like, you can write
individual files for each book using the NodeJS File System module, but only asynchronous methods are accepted as part
of the solution.

The request main thread should wait for the callback responses of every call to “saveItemOnDatabase”, and it
should be responsible for the synchronization of these asynchronous events. After all the books are “saved to the
database”, a response should be sent to the PUT request. The response should contain a JSON object where each key is
a book name, and each value is an associated integer value that is the number of milliseconds elapsed from the
beginning of the main request until the moment the callback related to that particular key/book was called. As an
example, please see the following sample response:

{
“1984”: 233,
“A Christmas Carol”: 506,
“Moby Dick”: 708,
“The Hitchhiker’s Guide to the Galaxy”: 1476,
“The Lord of the Rings”: 1091
}

Test Cases:
describe('Books API', function () {
    
    var books = ["1984", "A Christmas Carol", "Moby Dick", "The Hitchhiker’s Guide to the Galaxy", "The Lord of the Rings"];
    
    describe('/POST - Add New Book', () => {
        it('it should Add all the books', (done) => {
            for (book in books) {
                chai.request(server).post('/api/book').send({book:books[book]}).end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.status("success");
                    //console.log("Response Body:", res.body);
                });
            }
            done();
        });
        
        it('it should throw an error with invalid payload on add book', (done) => {
            chai.request(server).post('/api/book').send({books:"A Christmas Carol"}).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.status("error");
                //console.log("Response Body:", res.body);
                done(); 
            });
        });
    });
    
    describe('/DELETE - Delete book', () => {
        it('it should delete the book', (done) => {
            chai.request(server).delete('/api/book/Moby Dick').end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.status("success");
                //console.log("Response Body:", res.body);
                done();
            });
        });
        
        it('it should avoid deleting the Non-existing book', (done) => {
            chai.request(server).delete('/api/book/MobyDick').end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.status("error");
                //console.log("Response Body:", res.body);
                done();
            });
        });
    });
    
    describe('/PATCH - Update book', () => {
        it('it should update the book', (done) => {
            chai.request(server).patch('/api/book').send({original_book : "1984",new_book : "Year 1984"}).end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.status("success");
                //console.log("Response Body:", res.body);
                done();
            });
        });
        
        it('it should throw an error on updating non-existing book', (done) => {
            chai.request(server).patch('/api/book').send({original_book : "1984",new_book : "Year 1984"}).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.status("error");
                //console.log("Response Body:", res.body);
                done();
            });
        });
        
        it('it should throw an error on updating book with Invalid payload', (done) => {
            chai.request(server).patch('/api/book').send({book : "1984",new_book : "Year 1984"}).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.status("error");
                //console.log("Response Body:", res.body);
                done();
            });
        });
    });
    
    describe('/GET - Get All books', () => {
        it('it should GET all the books', (done) => {
            chai.request(server).get('/api/book').end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.status("success");
                //console.log("Response Body:", res.body);
                done();
            });
        });
    });
    
    describe('/PUT - Add All books in DB', () => {
        it('it should Create Book in DB', (done) => {
            chai.request(server).put('/api/book').end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.status("success");
                //console.log("Response Body:", res.body);
                done();
            });
        });
    });

});

Command to Run Test Case : npm test >
Command to Run the server: npm start >

import { Observable } from 'rxjs';
import { BooksService } from './../../services/books.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IBook } from 'src/app/models/Book';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-books',
  template: `
    <form #newBook="ngForm" class="newBook">
      <h6>Add new book</h6>
      <p *ngIf="!formValid" class="alert alert-danger">
        The form is not valid. Please check all fields!
      </p>
      <div>Title: <input type="text" ngModel name="title" required /></div>
      <div>Author: <input type="text" ngModel name="author" required /></div>
      <div>
        Category: <input type="text" ngModel name="category" required />
      </div>
      <div>
        Pages: <input type="number" min="1" max="999999" name="pages" />
      </div>
      <button type="submit" (click)="addBook()">Add</button>
    </form>
    <div class="books-list">
      <app-book
        *ngFor="let book of books"
        [bookFromParent]="book"
        (onDelete1)="onDelete($event)"
      ></app-book>
    </div>
  `,
  styles: [
    '.books-list { display: flex; flex-wrap: wrap; gap: 15px; }',
    '.newBook { padding: 50px; padding-top: 0; display: flex; flex-wrap: wrap; gap: 20px; }',
    'h6, form > p { display: inline-block; width: 100%; }',
    '.ng-invalid:not(form).ng-touched { border: 1px solid salmon; }',
  ],
})
export class BooksComponent implements OnInit {
  constructor(private _booksService: BooksService) {}
  books: IBook[] = [];
  filteredBooks: IBook[] = [];
  field: string = '';
  sortAsc: boolean = true;
  dataLoaded: boolean = false;
  book!: IBook;
  formValid: boolean = true;

  @ViewChild('newBook') newBook!: NgForm;
  ngOnInit(): void {
    this._booksService.getAllBooks().subscribe(
      (res) => {
        this.books = res;
        this.filteredBooks = this.books;
        this.dataLoaded = true;
      },
      (err) => {
        console.log(err);
        this.dataLoaded = true;
      }
    );
  }

  addBook() {
    if (this.newBook.valid) {
      this._booksService.createBook(this.newBook.value).subscribe(
        (res) => {
          this.books.push(res);
          this.filteredBooks = this.books;
          this.book = res;
        },
        (err) => console.log(err)
      );
      this.formValid = true;
    } else {
      this.formValid = false;
    }
  }

  onDelete(id: number): void {
    this._booksService.deleteBook(id).subscribe(
      (res) => {
        alert(
          `Book ${
            this.books.find((b) => b.id == id)?.title
          } successfuly deleted from DB!`
        );
        this.books = this.books.filter((b) => b.id !== id);
        this.filteredBooks = this.books;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

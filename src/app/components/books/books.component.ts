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
      <div class="summary">
        <p>Total books: {{ totalBooks }}</p>
        <label for="category">Select category: </label>
        <select
          [(ngModel)]="model"
          id="category"
          name="category"
          (input)="onChange($event)"
        >
          <option value="all">all</option>
          <option *ngFor="let item of categories" [value]="item">
            {{ item }}
          </option>
        </select>
        <h5 *ngIf="!!model">
          Total books by category "{{ model }}": {{ categoryCount }}
        </h5>
      </div>
    </form>

    <div class="books-list">
      <app-book
        *ngFor="let book of filteredBooks"
        [bookFromParent]="book"
        (onDelete1)="onDelete($event)"
        (onUpdateInParent)="updateCategories()"
      ></app-book>
    </div>
  `,
  styles: [
    '.books-list { display: flex; flex-wrap: wrap; gap: 15px; }',
    '.newBook { padding: 50px; padding-top: 0; display: flex; flex-wrap: wrap; gap: 20px; }',
    'h6, form > p { display: inline-block; width: 100%; }',
    '.ng-invalid:not(form).ng-touched { border: 1px solid salmon; }',
    'h5 {margin-top: 20px; margin-bottom: 20px;}',
    'select { margin-left: 10px; }',
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
  totalBooks: number = 0;
  categories: string[] = [];
  model: string | undefined;
  categoryCount!: number;

  @ViewChild('newBook') newBook!: NgForm;
  ngOnInit(): void {
    this._booksService.getAllBooks().subscribe(
      (res) => {
        this.books = res;
        this.filteredBooks = this.books;
        this.dataLoaded = true;
        this.updateCategories();
      },
      (err) => {
        console.log(err);
        this.dataLoaded = true;
      }
    );
    this.getTotalBooks();
  }

  addBook() {
    if (this.newBook.valid) {
      this._booksService.createBook(this.newBook.value).subscribe(
        (res) => {
          this.books.push(res);
          this.filteredBooks = this.books;
          this.book = res;
          alert(`Book ${res.title} successfuly added to DB!`);
          this.getTotalBooks();
          this.updateCategories();
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
        this.getTotalBooks();
        this.updateCategories();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getTotalBooks(): void {
    this._booksService.getTotalBooks().subscribe(
      (res) => (this.totalBooks = res.total_records),
      (err) => console.log(err)
    );
  }

  onChange($event: any): void {
    if ($event.target.value === 'all') {
      this.filteredBooks = this.books;
    } else {
      this._booksService.getCountByCategory($event.target.value).subscribe(
        (res) => {
          this.categoryCount = res.category_count;
          this.filteredBooks = this.books.filter(
            (b) => b.category === $event.target.value
          );
        },
        (err) => console.log(err)
      );
    }
  }

  updateCategories(): void {
    this.categories = [];
    for (const key in this.filteredBooks) {
      if (!this.categories.includes(this.filteredBooks[key].category)) {
        this.categories.push(this.filteredBooks[key].category);
      }
    }
  }
}

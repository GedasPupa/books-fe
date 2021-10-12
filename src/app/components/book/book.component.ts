import { BooksService } from './../../services/books.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { IBook } from 'src/app/models/Book';

@Component({
  selector: 'app-book',
  template: `
    <form class="card" #oneBookInfo="ngForm" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">{{ bookFromParent.title }}</h5>
        <p class="card-text">
          Some quick example text to make up the bulk of the card's content.
        </p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          Author: {{ bookFromParent.author }}
          <!-- <input name="id" value="{{ cowFromParent.id }}" ngModel /> -->
          <input name="author" ngModel />
        </li>
        <li class="list-group-item">
          Category: {{ bookFromParent.category }}
          <input name="category" ngModel />
        </li>
        <li class="list-group-item">
          Pages:<br />{{ bookFromParent.pages }}
          <input type="number" name="pages" ngModel />
        </li>
      </ul>
      <div class="card-body">
        <button
          (click)="onUpdate($event)"
          class="card-link"
          id="{{ bookFromParent.id }}"
        >
          Update
        </button>
        <button (click)="onDelete(bookFromParent.id!)" class="card-link">
          Delete
        </button>
      </div>
    </form>
  `,
  styles: [''],
})
export class BookComponent implements OnInit {
  @Input() bookFromParent!: IBook;
  @Output() onDelete1: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('oneBookInfo') oneBookInfo!: NgForm;
  book!: IBook;

  constructor(private _booksService: BooksService) {}

  ngOnInit(): void {
    this.book = this.bookFromParent;
  }

  onUpdate($event: any) {
    // console.log(this.oneCowInfo.value);
    // console.log(+$event.path[0].id);
    this.oneBookInfo.value.author != ''
      ? (this.book.author = this.oneBookInfo.value.author)
      : undefined;
    this.oneBookInfo.value.category != ''
      ? (this.book.category = this.oneBookInfo.value.category)
      : undefined;
    this.oneBookInfo.value.pages != ''
      ? (this.book.pages = this.oneBookInfo.value.pages)
      : undefined;

    console.log(this.book);
    this._booksService.updateBook(this.book).subscribe(
      (res) => {
        console.log(res);
        alert(`Book ${res.title} successfully updated in DB!`);
      },
      (err) => console.log(err)
    );
  }

  onDelete(id: number): void {
    this.onDelete1.emit(id);
  }
}

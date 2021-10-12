import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBook } from '../models/Book';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<IBook[]> {
    return this.http.get<IBook[]>('http://localhost:3000/books');
  }

  getOneBook(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/books/${id}`);
  }

  deleteBook(id: number) {
    return this.http.delete(`http://localhost:3000/books/${id}`);
  }

  createBook(book: IBook): Observable<IBook> {
    return this.http.post<IBook>(`http://localhost:3000/books`, book);
  }

  updateBook(book: IBook): Observable<any> {
    return this.http.put<IBook>(`http://localhost:3000/books/${book.id}`, book);
  }

  // getRecordsSum(): Observable<any> {
  //   return this.http.get<any>(`http://localhost:3000/sum`);
  // }

  // getTotalMilk(): Observable<any> {
  //   return this.http.get<any>(`http://localhost:3000/milk-sum`);
  // }
}

import { Observable } from "rxjs";

export interface BaseService<T> {
  baseUrl: string;

  getItems?(): Observable<T[]>;
  getItem?(): Observable<T>;
  saveItem?(): Observable<T>;
  deleteItem?(): Observable<T>;
}

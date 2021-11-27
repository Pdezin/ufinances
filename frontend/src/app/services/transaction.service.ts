import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/Transaction';
import { TransactionsData } from '../models/TransactionsData';

@Injectable()
export class TransactionService {
  apiUrl = 'https://localhost:5001/v1/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(skip?: number, take?: number): Observable<TransactionsData> {
    if (skip !== undefined && take !== undefined) {
      return this.http.get<TransactionsData>(
        `${this.apiUrl}/skip=${skip * take}/take=${take}`
      );
    }
    return this.http.get<TransactionsData>(`${this.apiUrl}/skip=0/take=10`);
  }

  getTransactionsFilterByDate(
    start: string,
    end: string,
    skip?: number,
    take?: number
  ): Observable<TransactionsData> {
    if (
      skip !== undefined &&
      take !== undefined &&
      start !== undefined &&
      end !== undefined
    ) {
      return this.http.get<TransactionsData>(
        `${this.apiUrl}/skip=${
          skip * take
        }/take=${take}/start=${start}/end=${end}`
      );
    }
    return this.http.get<TransactionsData>(
      `${this.apiUrl}/skip=0/take=10/start=${start}/end=${end}`
    );
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  editTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(
      `${this.apiUrl}/${transaction.id}`,
      transaction
    );
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

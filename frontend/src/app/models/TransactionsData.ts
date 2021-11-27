import { Transaction } from './Transaction';

export interface TransactionsData {
  values: {
    income: number;
    outcome: number;
    total: number;
  };
  totalTransactions: number;
  transactions: Transaction[];
}

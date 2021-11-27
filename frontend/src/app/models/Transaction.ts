import { Category } from './Category';

export interface Transaction {
  id: string;
  title: string;
  categoryId: string;
  category: Category;
  type: 0 | 1;
  value: number;
  createdAt: Date;
}

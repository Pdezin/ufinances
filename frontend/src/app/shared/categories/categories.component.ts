import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/models/Category';
import { AlertService } from 'src/app/services/alert.service';
import { CategoryService } from 'src/app/services/category.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  providers: [CategoryService, TransactionService],
})
export class CategoriesComponent implements OnInit {
  category!: Category;
  dataSource!: Category[];

  constructor(
    public categoryService: CategoryService,
    public transactionService: TransactionService,
    public alertService: AlertService,
    @Inject(MAT_DIALOG_DATA)
    public data: Category,
    public dialogRef: MatDialogRef<CategoriesComponent>
  ) {
    this.categoryService.getCategories().subscribe(
      (response: Category[]) => {
        this.dataSource = response;
      },
      () => {
        this.alertService.error(
          'Erro ao carregar categorias',
          'Por favor tente novamente mais tarde'
        );
      }
    );
  }

  ngOnInit(): void {}

  async deleteCategory(id: string): Promise<void> {
    const result = await this.alertService.confirm(
      'Tem certeza? Ao deletar esta categoria, todas as transações relacionadas a ela serão removidas também'
    );
    if (result.isConfirmed) {
      this.categoryService.deleteTransaction(id).subscribe(
        () => {
          this.alertService.success('Categoria removida com sucesso!');
          window.setTimeout(() => {
            location.reload();
          }, 2400);
        },
        () => {
          this.alertService.error('Erro ao deletar a categoria');
        }
      );
    }
  }

  addCategory(): void {
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result.title) {
        this.categoryService.createCategory(result).subscribe(
          () => {
            this.alertService.success('Categoria adicionada com sucesso!');
          },
          () => {
            this.alertService.error(
              'Erro ao adicionar categoria',
              'Verifique seus dados e tente novamente'
            );
          }
        );
      } else {
        this.alertService.error('Opss...', 'Dados inválidos!');
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

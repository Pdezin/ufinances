import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { Transaction } from 'src/app/models/Transaction';
import { TransactionService } from 'src/app/services/transaction.service';
import { CategoriesComponent } from 'src/app/shared/categories/categories.component';
import { LoaderService } from 'src/app/loader/loader.service';
import { AlertService } from 'src/app/services/alert.service';
import { TransactionsData } from 'src/app/models/TransactionsData';
import { PageEvent } from '@angular/material/paginator';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [TransactionService],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>;
  displayedColumns: string[] = [
    'title',
    'category',
    'type',
    'value',
    'createdAt',
    'action',
  ];
  dataSource!: TransactionsData;
  pageEvent!: PageEvent;
  formDatePicker!: FormGroup;
  usingDateFilter!: boolean;

  constructor(
    public loaderService: LoaderService,
    public dialog: MatDialog,
    public categoryModal: MatDialog,
    public transactionService: TransactionService,
    public alertService: AlertService,
    private fb: FormBuilder
  ) {
    this.updateTransactions();

    this.formDatePicker = this.fb.group({
      dateRange: new FormGroup({
        start: new FormControl(
          { value: null, disabled: true },
          Validators.required
        ),
        end: new FormControl(
          { value: null, disabled: true },
          Validators.required
        ),
      }),
    });
  }

  datePickerFilterTransactions() {
    const startDate: Date = this.formDatePicker.value.dateRange.start;
    const endDate: Date = this.formDatePicker.value.dateRange.end;

    if (startDate && endDate) {
      this.usingDateFilter = true;
      const start = startDate.toISOString().slice(0, 10);
      const end = endDate.toISOString().slice(0, 10);

      if (this.pageEvent) {
        const skip = this.pageEvent.pageIndex;
        const take = this.pageEvent.pageSize;
        this.transactionService
          .getTransactionsFilterByDate(start, end, skip, take)
          .subscribe(
            (data: any) => {
              this.dataSource = data;
            },
            () => {
              this.alertService.error(
                'Falha ao buscar transações',
                'Por favor tente novamente mais tarde'
              );
            }
          );
      } else {
        this.transactionService
          .getTransactionsFilterByDate(start, end)
          .subscribe(
            (data: any) => {
              this.dataSource = data;
            },
            () => {
              this.alertService.error(
                'Falha ao buscar transações',
                'Por favor tente novamente mais tarde'
              );
            }
          );
      }
    }
  }

  filterDaysDatePicker(d: Date | null): boolean {
    return d ? d <= new Date() : false;
  }

  removeDateFilter() {
    this.updateTransactions();
  }

  ngOnInit(): void {}

  openModal(transaction: Transaction | null): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      data: transaction
        ? {
            id: transaction.id,
            title: transaction.title,
            categoryId: transaction.categoryId,
            type: String(transaction.type),
            value: transaction.value,
          }
        : {
            title: '',
            categoryId: '',
            type: '0',
            value: null,
          },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      if (result.title && result.value && result.categoryId) {
        const index = this.dataSource.transactions.findIndex(
          (t) => t.id == result.id
        );
        const data: Transaction = {
          ...result,
          type: Number(result.type),
        };

        if (index !== -1) {
          this.transactionService.editTransaction(data).subscribe(
            (res: Transaction) => {
              this.updateTransactions();
              this.alertService.success('Edição efetuada com sucesso!');
            },
            (err) => {
              this.alertService.error(
                'Erro ao editar transação',
                'Verifique seus dados e tente novamente'
              );
            }
          );
        } else {
          this.transactionService.createTransaction(data).subscribe(
            (res: Transaction) => {
              this.updateTransactions();
              this.alertService.success('Transação adicionada com sucesso!');
            },
            (err) => {
              this.alertService.error(
                'Erro ao adicionar transação',
                'Verifique seus dados e tente novamente'
              );
            }
          );
        }
      } else {
        this.alertService.error('Opss...', 'Dados inválidos!');
      }
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    const result = await this.alertService.confirm(
      'Tem certeza que deseja deletar esta transação?'
    );
    if (result.isConfirmed) {
      this.transactionService.deleteTransaction(id).subscribe(
        (data: Transaction) => {
          this.updateTransactions();
          this.alertService.success('Removido com sucesso!');
        },
        (err) => {
          this.alertService.error(
            'Erro ao remover transação',
            'Por favor tente novamente mais tarde'
          );
        }
      );
    }
  }

  editTransaction(transaction: Transaction): void {
    this.openModal(transaction);
  }

  openCategories(): void {
    this.categoryModal.open(CategoriesComponent, {
      width: '400px',
      data: {
        title: '',
      },
    });
  }

  updateTransactions(): void {
    this.usingDateFilter = false;
    if (this.formDatePicker) {
      this.formDatePicker.setValue({
        dateRange: {
          start: '',
          end: '',
        },
      });
    }
    if (this.pageEvent) {
      const skip = this.pageEvent.pageIndex;
      const take = this.pageEvent.pageSize;
      this.transactionService.getTransactions(skip, take).subscribe(
        (data: any) => {
          this.dataSource = data;
        },
        () => {
          this.alertService.error(
            'Falha ao buscar transações',
            'Por favor tente novamente mais tarde'
          );
        }
      );
    } else {
      this.transactionService.getTransactions().subscribe(
        (data: any) => {
          this.dataSource = data;
        },
        () => {
          this.alertService.error(
            'Falha ao buscar transações',
            'Por favor tente novamente mais tarde'
          );
        }
      );
    }
  }

  //Paginação

  ListarItens(): void {
    if (this.usingDateFilter) {
      this.datePickerFilterTransactions();
    } else {
      this.updateTransactions();
    }
  }
}

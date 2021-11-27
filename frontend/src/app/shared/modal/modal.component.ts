import { Component, OnInit, Inject } from '@angular/core';
import { Transaction } from 'src/app/models/Transaction';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [CategoryService],
})
export class ModalComponent implements OnInit {
  transaction!: Transaction;
  isChange!: boolean;
  categories!: Category[];

  constructor(
    public alertService: AlertService,
    public categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA)
    public data: Transaction,
    public dialogRef: MatDialogRef<ModalComponent>
  ) {
    this.categoryService.getCategories().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      () => {
        this.alertService.error(
          'Ocorreu um erro',
          'Tente novamente mais tarde'
        );
      }
    );
  }

  ngOnInit(): void {
    if (this.data.id) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

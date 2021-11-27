import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  public success(title: string, message?: string): void {
    this.showAlert(title, 'success', message);
  }

  public error(title: string, message?: string): void {
    this.showAlert(title, 'error', message);
  }

  public async confirm(title: string): Promise<SweetAlertResult> {
    return await this.showConfirm(title);
  }

  private showAlert(
    title: string,
    icon: SweetAlertIcon,
    message?: string
  ): void {
    Swal.fire({
      title,
      text: message,
      icon,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  private async showConfirm(title: string): Promise<SweetAlertResult> {
    const res = await Swal.fire({
      title,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: `Cancelar`,
    });

    return res;
  }
}

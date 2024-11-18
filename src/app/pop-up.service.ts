import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor(private pop: MatSnackBar) { }


  Successful(body: string) {
    this.pop.open(body, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['successful'],
    });
  }

  Error(body: string) {
    this.pop.open(body, 'close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error'],
    });
  }
}

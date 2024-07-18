import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-credits-dialog',
  templateUrl: './credits-dialog.component.html',
  styleUrl: './credits-dialog.component.css'
})
export class CreditsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreditsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      language: string, 
    },
  ) { }

}

import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-skyboard-dialog',
  templateUrl: './skyboard-dialog.component.html',
  styles: []
})
export class SkyboardDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SkyboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

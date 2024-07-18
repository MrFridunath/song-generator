import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISong } from '../../models/song.object';

@Component({
  selector: 'app-lyrics-dialog',
  templateUrl: './lyrics-dialog.component.html',
  styleUrls: ['./lyrics-dialog.component.css']
})
export class LyricsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LyricsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      song: ISong,
      language: string, 
    },
  ) { }

  lyrics: string = '';

  ngOnInit(): void {
    this.lyrics = this.data.song.lyrics.replaceAll('\n', '\n<br>');
  }

}

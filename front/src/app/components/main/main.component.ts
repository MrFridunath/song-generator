import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MainService } from '../../services/main.service';
import { ISong } from '../../models/song.object';
import { MatDialog } from '@angular/material/dialog';
import { LyricsDialogComponent } from '../../dialogs/lyrics-dialog/lyrics-dialog.component';
import { CreditsDialogComponent } from '../../dialogs/credits-dialog/credits-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements AfterViewInit, OnInit {

  custom: boolean = false;
  instrumental: boolean = false;

  simpleForm!: FormGroup;
  customForm!: FormGroup;

  tokensLeft: number = 0;

  loading: boolean = false;

  loadingTitle: boolean = false;
  loadingLyrics: boolean = false;
  loadingDescription: boolean = false;

  audio: any;

  savedSongs: ISong[] = [];

  genres: any[] = [
    {
      es: 'Pop',
      en: 'Pop'
    },
    {
      es: 'Rock',
      en: 'Rock'
    },
    {
      es: 'Indie',
      en: 'Indie'
    },
    {
      es: 'Dance',
      en: 'Dance'
    },
    {
      es: 'Electrónica',
      en: 'Electronic'
    },
    {
      es: 'Urbana',
      en: 'Urban'
    },
    {
      es: 'Clásica',
      en: 'Classic'
    },
    {
      es: 'Blues',
      en: 'Blues'
    },
    {
      es: 'Jazz',
      en: 'Jazz'
    },
    {
      es: 'Soul',
      en: 'Soul'
    },
    {
      es: 'Funk',
      en: 'Funk'
    },
    {
      es: 'Rap',
      en: 'Rap'
    },
    {
      es: 'Disco',
      en: 'Disco'
    },
    {
      es: 'Reggae',
      en: 'Reggae'
    },
  ];

  settings: any;

  alerts: any[] = [
    {
      code: 0,
      msg: {
        es: 'Canción generada correctamente',
        en: 'Successfully generated song'
      }
    }
  ];

  errors: any[] = [
    {
      code: 0,
      msg: {
        es: 'Descripción de canción muy larga',
        en: 'Very long song description'
      }
    },
    {
      code: 1,
      msg: {
        es: 'El servicio no está disponible, prueba en otro momento',
        en: 'The service is not available, try another time'
      }
    },
    {
      code: 2,
      msg: {
        es: 'Te has quedado sin tokens, prueba mañana',
        en: 'You\'re out of tokens, try tomorrow'
      }
    },
    {
      code: 3,
      msg: {
        es: 'La API de Suno no está disponible, contacta con el administrador',
        en: 'Suno API is not available, contact administrator'
      }
    },
  ];

  @ViewChild('darkModeSwitch', { read: ElementRef }) element: ElementRef | undefined;

  sun = 'M12 15.5q1.45 0 2.475-1.025Q15.5 13.45 15.5 12q0-1.45-1.025-2.475Q13.45 8.5 12 8.5q-1.45 0-2.475 1.025Q8.5 10.55 8.5 12q0 1.45 1.025 2.475Q10.55 15.5 12 15.5Zm0 1.5q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.537 1.463T17 12q0 2.075-1.463 3.537T12 17ZM1.75 12.75q-.325 0-.538-.213Q1 12.325 1 12q0-.325.212-.537Q1.425 11.25 1.75 11.25h2.5q.325 0 .537.213Q5 11.675 5 12q0 .325-.213.537-.213.213-.537.213Zm18 0q-.325 0-.538-.213Q19 12.325 19 12q0-.325.212-.537.212-.213.538-.213h2.5q.325 0 .538.213Q23 11.675 23 12q0 .325-.212.537-.212.213-.538.213ZM12 5q-.325 0-.537-.213Q11.25 4.575 11.25 4.25v-2.5q0-.325.213-.538Q11.675 1 12 1q.325 0 .537.212 .213.212 .213.538v2.5q0 .325-.213.537Q12.325 5 12 5Zm0 18q-.325 0-.537-.212-.213-.212-.213-.538v-2.5q0-.325.213-.538Q11.675 19 12 19q.325 0 .537.212 .213.212 .213.538v2.5q0 .325-.213.538Q12.325 23 12 23ZM6 7.05l-1.425-1.4q-.225-.225-.213-.537.013-.312.213-.537.225-.225.537-.225t.537.225L7.05 6q.2.225 .2.525 0 .3-.2.5-.2.225-.513.225-.312 0-.537-.2Zm12.35 12.375L16.95 18q-.2-.225-.2-.538t.225-.512q.2-.225.5-.225t.525.225l1.425 1.4q.225.225 .212.538-.012.313-.212.538-.225.225-.538.225t-.538-.225ZM16.95 7.05q-.225-.225-.225-.525 0-.3.225-.525l1.4-1.425q.225-.225.538-.213.313 .013.538 .213.225 .225.225 .537t-.225.537L18 7.05q-.2.2-.512.2-.312 0-.538-.2ZM4.575 19.425q-.225-.225-.225-.538t.225-.538L6 16.95q.225-.225.525-.225.3 0 .525.225 .225.225 .225.525 0 .3-.225.525l-1.4 1.425q-.225.225-.537.212-.312-.012-.537-.212ZM12 12Z';
  moon ='M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.2 0 .425.013 .225.013 .575.038-.9.8-1.4 1.975-.5 1.175-.5 2.475 0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.3 0 2.475-.463T20.95 11.15q.025.3 .038.488Q21 11.825 21 12q0 3.75-2.625 6.375T12 21Zm0-1.5q2.725 0 4.75-1.687t2.525-3.963q-.625.275-1.337.412Q17.225 14.4 16.5 14.4q-2.875 0-4.887-2.013T9.6 7.5q0-.6.125-1.287.125-.687.45-1.562-2.45.675-4.062 2.738Q4.5 9.45 4.5 12q0 3.125 2.188 5.313T12 19.5Zm-.1-7.425Z';

  constructor(
    private fb: FormBuilder,
    public service: MainService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.simpleForm = this.fb.group({
      'description': ['', Validators.required]
    });
    this.customForm = this.fb.group({
      'title': ['', Validators.required],
      'genres': ['', Validators.required],
      'lyrics': ['']
    });
  }
  
  ngOnInit(): void {
    this.audio = new Audio();
    this.getTokens();
    this.savedSongs = this.service.restoreSongs();
    let settings = this.service.restoreSettings();
    if (!settings) {
      this.settings = {
        darkMode: true,
        apiKeys: {
          suno: false,
          sunoKey: '',
          chatGPT: false,
          chatGPTKey: '',
          gemini: false,
          geminiKey: '',
          llama: false,
          llamaKey: '',
          claude: false,
          claudeKey: ''
        },
        language: 'es',
        model: 'openai'
      };
    } else {
      this.settings = settings;
    }
  }

  ngAfterViewInit(): void {
    if (this.element) {
      this.element.nativeElement.querySelector('.mdc-switch__icon--on').firstChild.setAttribute('d', this.moon);
      this.element.nativeElement.querySelector('.mdc-switch__icon--off').firstChild.setAttribute('d', this.sun);
    }
  }

  getTokens(): void {
    this.service.getRemainingTokens().subscribe({
      next: ((data: number) => {
        if (data) {
          this.tokensLeft = data;
        }
      }),
      error: ((e: any) => {
        console.error(e);
      })
    });
  }

  getYear(): number {
    let now: Date = new Date();
    return now.getFullYear();
  }

  setModel(m: string): void {
    this.settings.model = m;
    this.saveSettingsLocal();
  }

  resetForms(): void {
    this.simpleForm.get('description')?.reset('');
    this.customForm.get('lyrics')?.reset('');
    this.customForm.get('genres')?.reset('');
    this.customForm.get('title')?.reset('');
  }

  onCustomToggle(event: MatSlideToggleChange): void {
    this.custom = event.checked;
    this.resetForms();
  }
  
  onInstrumentalToggle(event: MatSlideToggleChange): void {
    this.instrumental = event.checked;
    if (this.instrumental) {
      this.customForm.get('lyrics')?.reset('');
      this.customForm.get('lyrics')?.disable();
    } else {
      this.customForm.get('lyrics')?.enable();
    }
  }

  isFormValid(): boolean {
    let result = false;
    if (this.custom) {
      if (this.customForm.valid) {
        result = true;
      }
    } else {
      if (this.simpleForm.valid) {
        result = true;
      }
    }
    return result;
  }

  addGenre(i: number): void {
    let value_es = this.genres[i].es.toLowerCase();
    let value_en = this.genres[i].en.toLowerCase();
    let formValue = this.customForm.get('genres')?.value.trim();
    if (!formValue.includes(value_es) && !formValue.includes(value_en)) {
      if (formValue.length === 0) {
        if (this.settings.language === 'es') {
          this.customForm.get('genres')?.patchValue(value_es);
        } else {
          this.customForm.get('genres')?.patchValue(value_en);
        }
      } else {
        if (this.settings.language === 'es') {
          this.customForm.get('genres')?.patchValue(formValue + ', ' + value_es);
        } else {
          this.customForm.get('genres')?.patchValue(formValue + ', ' + value_en);
        }
      }
    }
  }

  sendDataForm(): void {
    this.loading = true;
    let options: any = {};
    options.instrumental = this.instrumental;
    if (this.custom) {
      options.custom = true;
      options.lyrics = this.customForm.get('lyrics')?.value;
      options.genre = this.customForm.get('genres')?.value;
      options.title = this.customForm.get('title')?.value;
    } else {
      options.custom = false;
      options.description = this.simpleForm.get('description')?.value;
    }
    this.service.generateSong(options).subscribe({
      next: ((s: ISong) => {
        this.savedSongs.push(s);
        this.playSong(this.savedSongs.length - 1);
        this.resetForms();
        this.getTokens();
        this.loading = false;
        this.saveSongsLocal();
        this.showAlert(0);
      }),
      error: ((err: any) => {
        console.error(err);
        if (err.error && err.error.error && err.error.error === 'topic too long') {
          this.showError(0);
        } 
        else if (err.error && err.error.error && err.error.error === 'service not available') {
          this.showError(1);
        }
        else if (err.error && err.error.error && err.error.error === 'insufficient credits') {
          this.showError(2);
        }
        else if (err.error && err.error.error && err.error.error === 'suno api not working') {
          this.showError(3);
        }
        //console.error(err.error.error );
        this.loading = false;
      })
    });
  }

  playSong(index: number): void {
    for (let i = 0; i < this.savedSongs.length; i++) {
      this.savedSongs[i].running = false;
      clearInterval(this.savedSongs[i].interval);
      this.savedSongs[i].time = 0;
    }
    this.audio.pause();
    this.savedSongs[index].running = true;
    this.audio.src = this.savedSongs[index].audioUrl;
    this.audio.load();
    this.audio.play();
    this.savedSongs[index].time = 0;
    this.savedSongs[index].interval = setInterval(() => {
      this.savedSongs[index].time += 1;
    }, 1000);
    this.audio.addEventListener('ended', () => {
      //this.savedSongs[index].running = false;
      //this.audio.pause();
      this.pauseSong(index);
      if((index + 1) < this.savedSongs.length) {
        console.log("TRAZA", index + 1, this.savedSongs);
        this.playSong(index + 1);
      }
    });
  }
  
  pauseSong(index: number): void {
    this.audio.pause();
    this.savedSongs[index].running = false;
    clearInterval(this.savedSongs[index].interval);
    this.savedSongs[index].time = 0;
  }

  getSongDuration(d: number): string {
    let minutes = Math.floor(d / 60);
    let seconds = Math.floor(d - minutes * 60);
    let minutesS = minutes.toString();
    let secondsS = seconds.toString();
    if (secondsS.length === 1) {
      secondsS = '0' + secondsS;
    }
    if (minutesS.length === 1) {
      minutesS = '0' + minutesS;
    }
    return minutesS + ':' + secondsS;
  }

  deleteSong(index: number): void {
    if (this.savedSongs[index].running) {
      this.pauseSong(index);
    }
    this.savedSongs.splice(index, 1);
    this.saveSongsLocal();
  }

  saveSongsLocal(): void {
    this.service.setSongs(this.savedSongs);
    this.service.saveSongs();
  }

  saveSettingsLocal(): void {
    this.service.setSettings(this.settings);
    this.service.saveSettings();
  }

  generateText(option: string): void {
    let options: any = {
      model: this.settings.model,
      option: option,
      language : this.settings.language,
    };
    if (option === 'title') {
      this.loadingTitle = true;
      this.customForm.get('title')?.disable();
      if(this.customForm.get('lyrics')?.value.length > 0) {
        options.lyrics = this.customForm.get('lyrics')?.value;
      }
      if(this.customForm.get('genres')?.value.length > 0) {
        options.genres = this.customForm.get('genres')?.value;
      }
    }
    else if (option === 'lyrics') {
      this.loadingLyrics = true;
      this.customForm.get('lyrics')?.disable();
      if(this.customForm.get('title')?.value.length > 0) {
        options.title = this.customForm.get('title')?.value;
      }
      if(this.customForm.get('genres')?.value.length > 0) {
        options.genres = this.customForm.get('genres')?.value;
      }
    } else if (option === 'description') {
      this.loadingDescription = true;
      this.simpleForm.get('description')?.disable();
      //options.description = this.simpleForm.get('description')?.value;
    }
    this.service.generateText(options).subscribe({
      next: ((text: string) => {
        if(options.option === 'title') {
          this.customForm.get('title')?.patchValue(text);
          this.loadingTitle = false;
          this.customForm.get('title')?.enable();
        }
        else if(options.option === 'lyrics') {
          this.customForm.get('lyrics')?.patchValue(text);
          this.loadingLyrics = false;
          this.customForm.get('lyrics')?.enable();
        }
        else if(options.option === 'description') {
          this.simpleForm.get('description')?.patchValue(text);
          this.loadingDescription = false;
          this.simpleForm.get('description')?.enable();
        }
      }),
      error: ((err: any) => {
        console.error(err);
        if (option === 'description') {
          this.loadingDescription = false;
          this.simpleForm.get('description')?.enable();
        }
        else if (option === 'title') {
          this.loadingTitle = false;
          this.customForm.get('title')?.enable();
        }
        if (option === 'lyrics') {
          this.loadingLyrics = false;
          this.customForm.get('lyrics')?.enable();
        }
      })
    });
  }

  showLyrics(song: ISong): void {
    if (song.lyrics !== '[Instrumental]') {
      const dialogRef = this.dialog.open(LyricsDialogComponent, {
        width: '500px',
        data: {
          song: song,
          language: this.settings.language,
        }
      });
      dialogRef.afterClosed().subscribe((data: any) => {
        if (data) {
        }
      });
    }
  }

  showCredits(): void {
    const dialogRef = this.dialog.open(CreditsDialogComponent, {
      width: '500px',
      data: {
        language: this.settings.language,
      }
    });
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
      }
    });
  }

  toggleDarkMode(e: any): void {
    if (e.checked) {
      this.settings.darkMode = true;
    } else {
      this.settings.darkMode = false;
    }
    this.saveSettingsLocal();
  }
  
  toggleLanguage(key: string): void {
    this.settings.language = key;
    this.saveSettingsLocal();
  }

  deleteHistory(): void {
    this.savedSongs = [];
    this.saveSongsLocal();
  }

  setCustomAPIKeys(): void {
    //TODO
    //Open API Key Dialog
  }

  showError(c: number): void {
    let action = '';
    if (this.settings.language === 'es') {
      action = 'Cerrar';
    } else {
      action = 'Close';
    }
    let msg = '';
    for (let i = 0; i < this.errors.length; i++) {
      if(this.errors[i].code === c) {
        if (this.settings.language === 'es') {
          msg = this.errors[i].msg.es;
        } else if (this.settings.language === 'en') {
          msg = this.errors[i].msg.en;
        } 
      }
    }
    this.snackBar.open(msg, action);
  }

  showAlert(c: number): void {
    let action = '';
    if (this.settings.language === 'es') {
      action = 'Cerrar';
    } else {
      action = 'Close';
    }
    let msg = '';
    for (let i = 0; i < this.alerts.length; i++) {
      if(this.alerts[i].code === c) {
        if (this.settings.language === 'es') {
          msg = this.alerts[i].msg.es;
        } else if (this.settings.language === 'en') {
          msg = this.alerts[i].msg.en;
        } 
      }
    }
    this.snackBar.open(msg, action);
  }

}

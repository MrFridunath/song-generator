import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISong } from '../models/song.object';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  songs: ISong[] = [];
  settings: any;

  constructor(
    private http: HttpClient,
  ) {
  }

  generateSong(options: any): Observable<ISong> {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    let body: any = {};
    if (options.custom) {
        body.custom = options.custom;
        body.instrumental = options.instrumental;
        body.lyrics = options.lyrics;
        body.genre = options.genre;
        body.title = options.title;
    } else {
        body.custom = false;
        body.instrumental = options.instrumental;
        body.description = options.description;
    }
    return this.http.post('/api/v1/song', JSON.stringify(body), {headers: headers}).pipe(
        map( (data: any) => {
          console.log("TRAZA GEN SONG: " + data);
          return data;
        }), catchError ((error: any) => {
          throw error;
    }));
  }

  generateText(options: any): Observable<string> {
    let headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    let body: any = {
      model: options.model,
      option: options.option,
      language: options.language,
    };
    if (options.genres) {
        body.genres = options.genres;
    }
    if (options.lyrics) {
        body.lyrics = options.lyrics;
    }
    if (options.title) {
        body.title = options.title;
    }
    /*
    if (options.description) {
        body.description = options.description;
    }
    */
    return this.http.post('/api/v1/text', JSON.stringify(body), {headers: headers}).pipe(
        map( (data: any) => {
        return data;
        }), catchError ((error: any) => {
        throw error;
    }));
  }

  getRemainingTokens(): Observable<number> {
    let api = 'api/v1/tokens';
    return this.http.get(api).pipe(
      map((data: any) => {
        console.log("HTTP SUNO TOKENS: " + data);
        let tokens = data;
        if (data > 0) {
            tokens /= 10;
            tokens = Math.floor(tokens);
        }
        return tokens;
      }),
      catchError((error: any) => {
        throw error;
      })
    );
  }
  
  setSongs(songs: ISong[]): void {
    this.songs = songs;
  }

  restoreSongs(): ISong[] {
    if (localStorage.getItem('songs-lstorage')) {
        let encoded = localStorage.getItem('songs-lstorage');
        if(encoded) {
            let token = JSON.parse(atob(encoded));
            if(token.songs) {
                this.songs = token.songs;
                for(let i = 0; i < this.songs.length; i++) {
                    this.songs[i].running = false;
                    clearInterval(this.songs[i].interval);
                    this.songs[i].time = 0;
                }
            }
        }
    }
    return this.songs;
  }

  saveSongs(): void {
    localStorage.removeItem('songs-lstorage');
    let settings = {
        songs: this.songs,
    };
    let token = btoa(JSON.stringify(settings));
    localStorage.setItem('songs-lstorage', token);
  }

  setSettings(settings: any): void {
    this.settings = settings;
  }

  restoreSettings(): ISong[] {
    if (localStorage.getItem('settings-lstorage')) {
        let encoded = localStorage.getItem('settings-lstorage');
        if(encoded) {
            let token = JSON.parse(atob(encoded));
            if(token) {
                this.settings = token;
            }
        }
    }
    return this.settings;
  }

  saveSettings(): void {
    localStorage.removeItem('settings-lstorage');
    let settings = this.settings;
    let token = btoa(JSON.stringify(settings));
    localStorage.setItem('settings-lstorage', token);
  }

}

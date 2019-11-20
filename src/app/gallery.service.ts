import { Image } from './interfaces/image.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const IMAGE_ENDPOINT = 'https://jsonplaceholder.typicode.com/albums/1/photos?_limit=10';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  constructor(private httpClient: HttpClient) { }

  public getImages(): Observable<Image[]> {
    return this.httpClient.get<Image[]>(IMAGE_ENDPOINT);
  }
}

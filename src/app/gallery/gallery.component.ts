import { Image } from './../interfaces/image.interface';
import { GalleryService } from './../gallery.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  public images: Image[];
  constructor(
    private galleryService: GalleryService
  ) { }

  ngOnInit() {
    this.galleryService.getImages().subscribe(images => {
      this.images = images;
    });
  }
}

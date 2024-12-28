import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  images: string[] = ['assets/img2.png', 'assets/img3.jpg', 'assets/img4.jpeg', 'assets/img5.jpg'];
  currentIndex: number = 0;
  intervalId: any;

  constructor() { }

  ngOnInit(): void {
    this.startSlideshow();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startSlideshow(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startSlideshow();
    }
  }
}

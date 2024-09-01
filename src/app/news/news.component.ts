import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';  

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule  
  ],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']  
})
export class NewsComponent implements OnInit {
  public newsList: any[] = [];
  public isLoading: boolean = true;
  public errorMessage: string = '';
  public currentPage: number = 0;  

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.fetchNews();
  }

  refresh(): void {
    this.fetchNews(true);
  }

  openNewsInNewTab(url: string) {
    window.open(url, '_blank');
  }

  private fetchNews(refresh: boolean = false): void {
    this.isLoading = true;
    this.newsService.getNews(!refresh ? this.currentPage : 0)  
      .then((news) => {
        this.newsList = news;
        this.isLoading = false;
      })
      .catch((error) => {
        this.errorMessage = 'Error al cargar las noticias' + error;
        this.isLoading = false;
      });
  }

  goToNextPage(): void {
    this.currentPage++;
    this.fetchNews();
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetchNews();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  public newsList: any[] = [];
  public isLoading: boolean = true;
  public errorMessage: string = '';

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.fetchNews();
  }

  refresh(): void {
    this.fetchNews();
  }

  private fetchNews(): void {
    this.isLoading = true;
    this.newsService.getNews()
      .then((news) => {
        console.log('Noticias cargadas exitosamente');
        this.newsList = news;
        this.isLoading = false;
      })
      .catch((error) => {
        this.errorMessage = 'Error al cargar las noticias';
        this.isLoading = false;
      });
  }

}  

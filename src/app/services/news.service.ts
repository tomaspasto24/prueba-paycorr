import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl: string = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  private apiKey: string = 'OTzT1kPx2CTY2tk0lzL1AKRuXQBt0hj0';
  private localStorageKey: string = 'newsData';

  constructor() { }

  getNews(): Promise<any> {
    const params = new URLSearchParams({
      'api-key': this.apiKey,
      'fl': 'headline,word_count,multimedia, web_url',
      'begin_date': this.getCurrentDate()
    });

    return fetch(`${this.apiUrl}?${params.toString()}`)
      .then(response => response.json())
      .then(data => {
        this.saveToLocalStorage(data);
        return this.transformNewsData(data);
      })
      .catch(error => {
        console.error('Error al obtener las noticias:', error);
        return this.getFromLocalStorage(); 
      });
  }

  private transformNewsData(response: any, internet: boolean = true): any[] {
    return response.response.docs.map((article: any) => {
      return {
        title: article.headline.main,
        imageUrl: internet ? this.getImageUrl(article.multimedia) : 'https://media.istockphoto.com/id/1336657186/vector/no-wi-fi-flat-vector.jpg?s=612x612&w=0&k=20&c=HbcdNJXVwQl3UhnENheZy0VXLXVrPDebCWD9aBHVDJM=',
        wordCount: article.word_count,
        webUrl: article.web_url
      };
    });
  }

  private getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}${month}${day}`;
  }

  private getImageUrl(multimedia: any[]): string {
    const imageBaseUrl = 'http://www.nytimes.com/';
    const image = multimedia.find(media => media.subtype === 'thumbnail');
    return image ? imageBaseUrl + image.url : '';
  }

  private saveToLocalStorage(data: any): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  private getFromLocalStorage(): any[] {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      return this.transformNewsData(JSON.parse(data), false);
    }
    return [];
  }
}

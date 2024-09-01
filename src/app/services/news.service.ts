import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private apiUrl: string = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  private apiKey: string = 'OTzT1kPx2CTY2tk0lzL1AKRuXQBt0hj0';
  private localStorageKey: string = 'nyt-articles';

  constructor() { }

  getNews(page: number = 0): Promise<any> {
    const params = new URLSearchParams({
      'api-key': this.apiKey,
      'fl': 'headline,word_count,multimedia,web_url',
      'begin_date': this.getCurrentDate(),
      'page': page.toString()
    });

    return fetch(`${this.apiUrl}?${params.toString()}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.fault) throw new Error(data.fault.faultstring);
        this.saveToLocalStorage(data, page);
        return this.transformNewsData(data);
      })
      .catch(error => {
        console.error('Error al obtener las noticias:', error);
        return this.getFromLocalStorage(page);
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
    if (multimedia.length === 0) {
      return 'https://static.vecteezy.com/system/resources/thumbnails/022/059/000/small/no-image-available-icon-vector.jpg';
    }
    const imageBaseUrl = 'http://www.nytimes.com/';
    const image = multimedia.find(media => media.subtype === 'thumbnail');
    return image ? imageBaseUrl + image.url : '';
  }

  private saveToLocalStorage(data: any, page: number): void {
    const savedData = JSON.parse(localStorage.getItem(this.localStorageKey) as string) || {};
    savedData[page] = data;
    localStorage.setItem(this.localStorageKey, JSON.stringify(savedData));
  }

  private getFromLocalStorage(page: number): any[] {
    const savedData = JSON.parse(localStorage.getItem(this.localStorageKey) as string);
    if (savedData && savedData[page]) {
      return this.transformNewsData(savedData[page], false);
    }
    return [];
  }
}

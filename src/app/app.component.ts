import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewsComponent } from './news/news.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NewsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'prueba-paycorr';
}

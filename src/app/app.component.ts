import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { CategoriesComponent } from './components/home/categories.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Real-estate-app';
  categories: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<CategoriesComponent[]>('http://localhost:8090/api/v1/category/').subscribe((data) => {
      console.log(data);
      this.categories = data;
    });
  }
}
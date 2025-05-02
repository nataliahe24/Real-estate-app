import { Component, OnInit } from '@angular/core';
import { JwtService } from './core/services/auth/jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'real-estate-app';

  constructor(private jwtService: JwtService) {}
  
  ngOnInit(): void {
    // Solo para pruebas - establecer token manualmente
    this.jwtService.setManualTestToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJNaUFwcEpXVCIsInN1YiI6Im5hdGFsaWFoZW5hb3IyNEBnbWFpbC5jb20iLCJhdXRob3JpdGllcyI6IkFETUlOIiwiaWF0IjoxNzQ2MTUwNDY0LCJleHAiOjE3NDcyMzY4NjQsIm5iZiI6MTc0NjE1MDQ2NH0.szjAMdWkBo_LfQBY6XSLxFSep_AZpj9JlPCN9wmV530');
  }
}

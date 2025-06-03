import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-buyer-visit-list',
  templateUrl: './buyer-visit-list.component.html',
  styleUrls: ['./buyer-visit-list.component.scss']
})
export class BuyerVisitListComponent implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Mis Visitas Programadas | Real Estate App');
  }
} 
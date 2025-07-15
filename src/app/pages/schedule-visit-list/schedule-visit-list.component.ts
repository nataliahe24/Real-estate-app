import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-schedule-visit-list',
  templateUrl: './schedule-visit-list.component.html',
  styleUrls: ['./schedule-visit-list.component.scss']
})
export class ScheduleVisitListComponent implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Mis Visitas Programadas | Real Estate App');
  }
} 
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PropertyService } from '@app/core/services/properties/property.service';
import { PropertyFilter, PropertyFilters, PropertyResponse } from '@app/core/models/property.model';
import { CategoryService } from '../../core/services/categories/category.service';
import { Category } from '../../core/models/category.model';

interface PaginatedPropertiesResponse {
  content: PropertyResponse[];
  totalElements: number;
}

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent  {

  constructor(private propertyService: PropertyService) {};
  }
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-simple-data-grid',
  templateUrl: './simple-data-grid.component.html',
  styleUrls: ['./simple-data-grid.component.css']
})
export class SimpleDataGridComponent implements OnInit {
  @Input() gridColumns: any[] = [];
  @Input() gridData: any[] = [];

  constructor() {
  }

  ngOnInit() {
  }
}

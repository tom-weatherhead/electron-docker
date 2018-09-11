import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms'; // <-- here
import { RoundProgressModule } from 'angular-svg-round-progressbar'; // <-- here

import { SimpleDataGridComponent } from './components/simple-data-grid/simple-data-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    SimpleDataGridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // <-- here
    HttpClientModule,
    RoundProgressModule // <-- and here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

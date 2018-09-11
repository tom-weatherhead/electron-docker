import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms'; // <-- here
import { RoundProgressModule } from 'angular-svg-round-progressbar'; // <-- here

import { ConfigService } from './services/config/config.service';

import { AppComponent } from './components/app/app.component';
import { SimpleDataGridComponent } from './components/simple-data-grid/simple-data-grid.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // <-- here
    HttpClientModule,
    RoundProgressModule // <-- and here
  ],
  declarations: [
    AppComponent,
    SimpleDataGridComponent
  ],
  providers: [
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

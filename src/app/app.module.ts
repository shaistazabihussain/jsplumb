import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, GroupComponent, NodeComponent } from './app.component';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { DatasetComponent } from './dataset';

@NgModule({
  declarations: [
    AppComponent, NodeComponent, GroupComponent, DatasetComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    jsPlumbToolkitModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ NodeComponent, GroupComponent ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

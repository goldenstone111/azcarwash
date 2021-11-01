import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyCarsPageRoutingModule } from './my-cars-routing.module';

import { MyCarsPage } from './my-cars.page';
import { PopoverForCarPageModule } from '../popover-for-car/popover-for-car.module';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    IonicModule,
    PopoverForCarPageModule,
    MyCarsPageRoutingModule 
  ],
  declarations: [MyCarsPage]
})
export class MyCarsPageModule {}

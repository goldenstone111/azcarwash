import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopoverForCarPage } from './popover-for-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [PopoverForCarPage],
  entryComponents: [PopoverForCarPage]
})
export class PopoverForCarPageModule {}

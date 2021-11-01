import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddREviewPageRoutingModule } from './add-review-routing.module';

import { AddREviewPage } from './add-review.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddREviewPageRoutingModule
  ],
  declarations: [AddREviewPage]
})
export class AddREviewPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BundleModelPageRoutingModule } from './bundle-model-routing.module';

import { BundleModelPage } from './bundle-model.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BundleModelPageRoutingModule
  ],
  declarations: [BundleModelPage]
})
export class BundleModelPageModule {}

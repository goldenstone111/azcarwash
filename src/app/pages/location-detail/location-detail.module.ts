import { OrderModule } from 'ngx-order-pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationDetailPageRoutingModule } from './location-detail-routing.module';

import { LocationDetailPage } from './location-detail.page';
import { BundleModelPageModule } from '../bundle-model/bundle-model.module';
import { CustomPipeModule } from 'src/app/custom-pipe/custom-pipe.module';
import { CetegoryInfoPageModule } from 'src/app/cetegory-info/cetegory-info.module';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    IonicModule, 
    LocationDetailPageRoutingModule,
    BundleModelPageModule,
    CustomPipeModule,
    CetegoryInfoPageModule,
    OrderModule
  ],
  declarations: [LocationDetailPage]
})
export class LocationDetailPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CetegoryInfoPageRoutingModule } from './cetegory-info-routing.module';

import { CetegoryInfoPage } from './cetegory-info.page';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    IonicModule, 
    CetegoryInfoPageRoutingModule
  ],
  declarations: [CetegoryInfoPage]
})
export class CetegoryInfoPageModule {}

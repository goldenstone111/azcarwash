import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewBookingPageRoutingModule } from './view-booking-routing.module';

import { ViewBookingPage } from './view-booking.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewBookingPageRoutingModule
  ],
  declarations: [ViewBookingPage]
})
export class ViewBookingPageModule {}

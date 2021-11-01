import { OrderModule } from 'ngx-order-pipe';
import { CustomPipeModule } from 'src/app/custom-pipe/custom-pipe.module';
import { LocationModalPageModule } from '../location-modal/location-modal.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import { IonBottomDrawerModule } from 'ion-bottom-drawer';
import { ServiceListComponent } from 'src/app/components/service-list/service-list.component';
import { CarListComponent } from 'src/app/components/car-list/car-list.component';
import { DateTimePickerComponent } from 'src/app/components/date-time-picker/date-time-picker.component';
import { CetegoryInfoPageModule } from 'src/app/cetegory-info/cetegory-info.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonBottomDrawerModule,
    HomePageRoutingModule,  
    LocationModalPageModule,
    CustomPipeModule,
    CetegoryInfoPageModule,
    OrderModule,
  ],
  entryComponents: [ServiceListComponent,CarListComponent,DateTimePickerComponent],
  declarations: [HomePage,ServiceListComponent,CarListComponent,DateTimePickerComponent]
})
export class HomePageModule {}

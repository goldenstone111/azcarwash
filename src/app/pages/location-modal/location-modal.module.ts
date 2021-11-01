import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { LocationModalPage } from "./location-modal.page";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "", 
    component: LocationModalPage
  }
];  
 
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [LocationModalPage]
})
export class LocationModalPageModule {}

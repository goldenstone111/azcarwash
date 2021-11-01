import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopoverForCarPage } from './popover-for-car.page';

const routes: Routes = [
  {
    path: '',
    component: PopoverForCarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoverForCarPageRoutingModule {}

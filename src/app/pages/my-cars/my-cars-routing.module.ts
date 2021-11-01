import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyCarsPage } from './my-cars.page';

const routes: Routes = [
  {
    path: '',
    component: MyCarsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyCarsPageRoutingModule {}

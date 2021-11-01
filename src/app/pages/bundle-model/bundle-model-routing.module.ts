import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BundleModelPage } from './bundle-model.page';

const routes: Routes = [
  {
    path: '',
    component: BundleModelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BundleModelPageRoutingModule {}

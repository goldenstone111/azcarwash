import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddREviewPage } from './add-review.page';

const routes: Routes = [
  {
    path: '',
    component: AddREviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddREviewPageRoutingModule {}

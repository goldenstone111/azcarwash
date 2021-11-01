import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CetegoryInfoPage } from './cetegory-info.page';

const routes: Routes = [
  {
    path: '',
    component: CetegoryInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CetegoryInfoPageRoutingModule {}

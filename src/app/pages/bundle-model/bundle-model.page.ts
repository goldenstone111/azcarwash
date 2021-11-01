import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
import * as _ from 'underscore';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bundle-model',
  templateUrl: './bundle-model.page.html',
  styleUrls: ['./bundle-model.page.scss'],
})
export class BundleModelPage implements OnInit {
  package:any = {};
  selectedData:any = {}; 
  constructor(
    private utill: UtillService,
    private modal: ModalController
  ) {
    
    this.package = this.utill.packageBook; 
    this.selectedData = this.utill.bookingData;
    
  }
 
  ngOnInit() {
  } 

  continue() {
    this.utill.bookingData.for = 'PACKAGE';
    this.modal.dismiss();
    this.utill.navCtrl().navigateForward('confirmBooking')
  }

}

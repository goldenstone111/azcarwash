import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-for-car',
  templateUrl: './popover-for-car.page.html',
  styleUrls: ['./popover-for-car.page.scss'],
})
export class PopoverForCarPage implements OnInit {

  constructor(
    private utill: UtillService,
    private navParm: NavParams,
    private popOver: PopoverController
  ) { 
    
  }

  ngOnInit() {
  }

  deleteCar() {
    this.utill.startLoad();
    this.utill.afs.collection('carMaster').doc(this.navParm.get('data').id)
    .delete()
    .then(() => {
      setTimeout(() => {
        this.utill.stopload();
        this.popOver.dismiss();
        this.utill.success('Delete Successfully');
      }, 2000);
    }).catch((er) => {
      this.utill.stopload();
      this.utill.error('Something Went Wrong'+er,'');
    });
  }

  updateCar() {

  }

}

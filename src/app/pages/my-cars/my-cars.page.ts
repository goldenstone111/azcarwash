import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';
import { PopoverController } from '@ionic/angular';
import { PopoverForCarPage } from '../popover-for-car/popover-for-car.page';

@Component({
  selector: 'app-my-cars',
  templateUrl: './my-cars.page.html',
  styleUrls: ['./my-cars.page.scss']
})
export class MyCarsPage implements OnInit {
  carCollection:Observable<any>; 
  constructor(
    private utill: UtillService,
    public popoverController: PopoverController
  ) {
    this.utill.startLoad();
    this.carCollection =  this.utill.afs.collection("carMaster", ref => ref
      .where('UserId', '==', this.utill.userId))
      .snapshotChanges().pipe(
        map((actions: any) =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })))
          
          this.carCollection.subscribe((res) => {
            this.utill.stopload();
          }, err => {
            this.utill.stopload();
          });
  }

  ngOnInit() { }

  
  goToAddCar() {
    this.utill.navCtrl().navigateForward('addCar');
  }
 
    
  async presentPopover(ev: any,car: any) {
    
    
    const popover = await this.popoverController.create({
      component: PopoverForCarPage,
      event: ev,
      translucent: true,
      componentProps: {data:car},
      mode : 'ios' 
    });
    return await popover.present();
  }
  
} 

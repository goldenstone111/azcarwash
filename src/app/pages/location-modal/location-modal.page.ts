import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.page.html',
  styleUrls: ['./location-modal.page.scss'],
})
export class LocationModalPage implements OnInit {
  data: any = {}; 
  userAddress:any = {}; 
  constructor(
    private utill: UtillService,
    private modal: ModalController
  ) {  
    this.utill.defaultLocation.subscribe((res:any) => {
    this.userAddress = res; 
    this.data = this.utill.dataTrasfer;
    this.utill.afs.collection("ratingMaster", ref => ref
    .where('condoId', '==', this.userAddress.condo))
    .snapshotChanges().pipe(
      map((actions: any) => 
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))).subscribe((res) => { 
          if(res) {
            this.data.reviewData = res;
            let sumOfStar = res.reduce((s, f) => {
              return s + f.star;
            }, 0);   
            this.data.avgRating = sumOfStar / res.length;
            this.data.avgRating = isNaN(this.data.avgRating) == true ? 0 : this.data.avgRating;
          }
        })
      });
  } 

  ngOnInit() {
  }

  goTOLocation() {
    this.modal.dismiss();
    this.utill.navCtrl().navigateForward('locationDetail');
  }

}

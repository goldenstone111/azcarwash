import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
})
export class CarListComponent implements OnInit {
  carCollection: Observable<any>;
  selectedCar: any = '';
  data: any = {};
  constructor(
    private utill: UtillService
  ) {
    if (this.utill.afAuth.auth.currentUser) {
      this.utill.startLoad();
      this.carCollection = this.utill.afs.collection("carMaster", ref => ref.where('UserId', '==', this.utill.afAuth.auth.currentUser.uid)).snapshotChanges().pipe(
        map((actions: any) =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })));

      this.carCollection.subscribe(() => {
        this.utill.stopload();
      }, err => {
        this.utill.stopload();
      });
    }
  }

  ngOnInit() {
    this.getSelectedCar();
  }

  ngAfterViewInit() {
    this.getSelectedCar();
  }

  goToAddCar() {
    this.utill.navCtrl().navigateForward('addCar');
  }

  onCarSelect(car: any) {
    this.data.selectedCar = car;
    this.utill.bookingDetail.next(this.data);
  }

  getSelectedCar() {
    this.utill.bookingDetail.subscribe((res: any) => {
      this.data = res;
      if (Object.entries(res).length != 0) {
        if (Object.entries(res.selectedCar).length != 0) {
          this.selectedCar = res.selectedCar.id;
        }
      }
    });
  }
}

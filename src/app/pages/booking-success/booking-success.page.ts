import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.page.html',
  styleUrls: ['./booking-success.page.scss']
})
export class BookingSuccessPage implements OnInit {
  user:any = {};
  constructor(
    private utill: UtillService
  ) {
    this.utill.startLoad();
    this.utill.afs.collection('users').doc(this.utill.userId).valueChanges()
    .subscribe((res) => {
      
      this.user = res;
      this.utill.stopload();
    }, err => {
      this.utill.stopload();
    })
  }
 
  ngOnInit() {}
 
  goToBookings() {
    this.utill.navCtrl().navigateRoot('myBookings');
  }
} 

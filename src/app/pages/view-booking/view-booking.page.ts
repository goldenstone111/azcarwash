import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.page.html',
  styleUrls: ['./view-booking.page.scss'],
})
export class ViewBookingPage implements OnInit {
  bookingData:any = {};
  constructor(
    private utill: UtillService
  ) { 
    this.bookingData = utill.dataTrasfer;
    
    this.bookingData.empData = this.utill.afs.collection('users').doc(this.bookingData.AvailableEmpId).valueChanges();
    this.bookingData.userCar = this.utill.afs.collection('carMaster').doc(this.bookingData.carId).valueChanges();
    this.bookingData.address = this.utill.afs.collection('addressMaster').doc(this.bookingData.addressId).valueChanges();
  }

  ngOnInit() {
  } 

}

import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddREviewPage implements OnInit {
  text: any = '';
  selectStar: any = '';
  constructor(
    private utill: UtillService
  ) {
    
  }

  ngOnInit() {
  }

  addReview() {
    this.utill.startLoad();
    let temp: any = {
      created_at: moment().format('YYYY-MM-DD HH:mm'),
      message: this.text,
      star: this.selectStar,
      bookingId: this.utill.dataTrasfer.id,
      condoId: this.utill.dataTrasfer.condoId,
      empId: this.utill.dataTrasfer.AvailableEmpId,
      userId: this.utill.userId
    }
    this.utill.afs.collection<any>('ratingMaster').add(temp).then(() => {
      this.utill.afs.doc(`bookingMaster/${this.utill.dataTrasfer.id}`).valueChanges().subscribe(() => {
        let userDoc = this.utill.afs.doc<any>('bookingMaster/' + this.utill.dataTrasfer.id);
        userDoc.update({
          reviewGiven: true
        }).then(() => {
          this.utill.success('Review Addeded Successfully...');
          this.utill.navCtrl().navigateBack('myBookings');
          this.utill.stopload();
        }).catch(() => {
          this.utill.stopload();
        })
      });
    }).catch(() => { })
  }

}

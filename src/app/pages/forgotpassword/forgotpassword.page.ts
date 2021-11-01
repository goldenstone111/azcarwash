import { UtillService } from 'src/services/utill.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
  email: any = undefined;
  constructor(
    private utill: UtillService
  ) { }

  ngOnInit() {
  }

  forgotPassword() {
    this.utill.startLoad();
    this.utill
      .resetPassword(this.email)
      .then(res => {
        this.utill.stopload();
        if (res == true) {
          this.utill.success("Check your email");
          this.email = "";
          this.utill.navCtrl().back();
        }
      })
      .catch(err => {
        this.utill.stopload();
        this.utill.success(err.message);
      });
  }

}

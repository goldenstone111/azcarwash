import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { UtillService } from 'src/services/utill.service';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  credentials: any = {
    email: undefined,
    password: undefined
  };
  constructor(
    private nav: NavController,
    private afAuth: AngularFireAuth,
    private utill: UtillService,
    private menu: MenuController,
    private fcm: FCM 
  ) {
    this.menu.enable(false);
    if (localStorage.getItem("userKey")) {
      this.nav.navigateForward('home');
    }
  }

  ngOnInit() {
  }

  goSignUp() {
    this.nav.navigateForward('signUp');
  }

  goForgot() {
    this.nav.navigateForward('forgotpassword');
  }

  onLogin() {
    this.utill.startLoad();
    this.afAuth.auth
    .signInWithEmailAndPassword(this.credentials.email, this.credentials.password)
    .then((data: any) => {
      this.fcm.getToken().then(token => {
        
        this.utill.afs.collection(`users`).doc(data.user.uid).update({
            token: token
        });
      });  
      localStorage.setItem('userKey', data.user.uid);
      this.menu.enable(true);
      this.utill.navCtrl().navigateRoot('pickupAddress');
      this.utill.stopload();
    }).catch((err) => {
      this.utill.stopload();
      if (err.message) {
        this.utill.error(err.message, '')
      }
    })
  }

}

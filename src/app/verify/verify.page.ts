import { UtillService } from "src/services/utill.service";
import { Component, OnInit } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/functions";

@Component({
  selector: "app-verify",
  templateUrl: "./verify.page.html",
  styleUrls: ["./verify.page.scss"],
})
export class VerifyPage implements OnInit {
  otp: string;
  verifyCode: any = "";
  constructor(private utill: UtillService) {
    
    this.utill
      .getOtp(this.utill.dataTrasfer.number)
      .then((r: any) => {
        this.verifyCode = r.data;
        
      })
      .catch(() => {});
  }

  ngOnInit() {}

  // clearData = (clear) => {
  //   if (clear == "1") this.opt.a = "";
  //   else if (clear == "2") this.opt.b = "";
  //   else if (clear == "3") this.opt.c = "";
  //   else if (clear == "4") this.opt.d = "";
  //   else if (clear == "5") this.opt.e = "";
  //   else this.opt.f = "";
  // };

  // moveFocus(event, nextElement, previousElement, clear) {
  //   console.warn(event, nextElement, previousElement, clear)
  //   if (event.keyCode == 8 && previousElement) {
  //     console.warn("prev");
  //     previousElement.setFocus();
  //     this.clearData(clear - 1);
  //   } else if (event.keyCode >= 48 && event.keyCode <= 57) {
  //     console.warn("next");
  //     if (nextElement) {
  //     console.warn("in next");

  //       nextElement.setFocus();
  //     }
  //   } else {
  //     console.log("final");

  //     event.path[0].value = "";
  //   }
  // }

  resendCode() {}

  continue() {
    //let otp = this.opt.a + "" + this.opt.b + "" + this.opt.c + "" + this.opt.d;
    let otp = this.otp;
    if (this.verifyCode === otp) {
      this.onVerifySuccess();
    } else {
       this.utill.error("Invalid OTP", "");
    }
  }

  onVerifySuccess() {
    this.utill.startLoad();
    this.utill.afAuth.auth
      .createUserWithEmailAndPassword(
        this.utill.dataTrasfer.email,
        this.utill.dataTrasfer.password
      )
      .then((data: any) => {
        this.utill.afs
          .collection("users")
          .doc(data.user.uid)
          .set(this.utill.dataTrasfer)
          .then(() => {
            localStorage.setItem("userKey", data.user.uid);
            this.utill.success("verified and registered Successfully...");
            this.utill.navCtrl().navigateForward("home");
            this.utill.stopload();
          })
          .catch(() => {
            this.utill.stopload();
          });
      })
      .catch((err) => {
        this.utill.error(err.message, "");
        this.utill.stopload();
      });
  }
}

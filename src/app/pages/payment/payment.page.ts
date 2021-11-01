import {
  InAppBrowser,
  InAppBrowserEvent,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
import { Component, OnInit } from "@angular/core";
import { UtillService } from "src/services/utill.service";
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration,
} from "@ionic-native/paypal/ngx";
import * as _ from "underscore";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.page.html",
  styleUrls: ["./payment.page.scss"],
})
export class PaymentPage implements OnInit {
  bookings: any = {};
  paymentType: any = "senangpay";
  settingData: any = {};
  userData: any = {};
  constructor(
    private utill: UtillService,
    private payPal: PayPal,
    private iab: InAppBrowser
  ) {
    this.bookings = this.utill.dataTrasfer;

    this.bookings.total =
      this.utill.dataTrasfer.addOnServiceTotal +
      this.utill.dataTrasfer.tax +
      this.utill.dataTrasfer.serviceTotal;

    this.utill.afs
      .collection("mainAdminConfiguration")
      .doc("IJ2gZiWf46mGgBS80nF9")
      .valueChanges()
      .subscribe((res) => {
        this.settingData = res;
      });

    this.utill.afs
      .doc(`users/${this.bookings.userId}`)
      .valueChanges()
      .subscribe(
        (res) => {
          this.userData = res;
        },
        (err) => {}
      );
  }

  ngOnInit() {
   
   
  }

  payNow() {
    debugger
    if (this.paymentType == "OFFLINE") {
      this.addInDatabase();
    } else if (this.paymentType == "PAYPAL") {
      this.payPal
        .init({
          PayPalEnvironmentProduction: this.settingData.paypalProductionBox,
          PayPalEnvironmentSandbox: this.settingData.paypal_sendbox_id,
        })
        .then(
          () => {
            this.payPal
              .prepareToRender(
                "PayPalEnvironmentSandbox",
                new PayPalConfiguration({})
              )
              .then(
                () => {
                  let payment = new PayPalPayment(
                    this.utill.dataTrasfer.total,
                    "MYR",
                    "Description",
                    "sale"
                  );
                  this.payPal.renderSinglePaymentUI(payment).then(
                    (res) => {
                      if (res.response.id) {
                        this.bookings.paymentStatus = 1;
                        this.bookings.paymentMethod = "PAYPAL";
                        this.bookings.paymentToken = res.response.id;
                        this.addInDatabase();
                      }
                    },
                    () => {
                      // Error or render dialog closed without being successful
                    }
                  );
                },
                () => {
                  // Error in configuration
                }
              );
          },
          () => {
            // Error in initialization, maybe PayPal isn't supported or something else
          }
        );
    } else if (this.paymentType == "SENSANG") {
      this.payWithSanegpay();
    } else if (this.paymentType == "E_WALLET") {
      this.utill.error("Coming Soon...", "");
    } else if (this.paymentType == "senangpay") {
      this.payWithSanegpay();
    } else if (this.paymentType == "senangpay2") {
      this.payWithSanegpay();
    }
  }

  chnagePaymentMethod(e) {
    this.paymentType = e.detail.value;
  }

  payWithSanegpay() {
    const id = this.utill.afs.createId();
    let serviceName = this.bookings.services[0].name.includes("&")
      ? this.bookings.services[0].name.replace("&", "and")
      : this.bookings.services[0].name;

    let i =
      "https://azdetail.app/sanangpay.php?detail=" +
      serviceName +
      "&amount=" +
      this.utill.dataTrasfer.total +
      "&order_id=" +
      id +
      "&name=" +
      this.userData.username +
      "&email=" +
      this.userData.email +
      "&phone=" +
      this.userData.number;
    console.log(i);
    const options: InAppBrowserOptions = {
      location: "no",
    };
    
    const browser = this.iab.create(i, "_blank", options);
    browser.on("loadstart").subscribe((e: InAppBrowserEvent) => {
      console.log("browser status for payment gateway",e);
      
      if (e.url.indexOf("status_id") > -1) {
        browser.close();
        
        this.checkPaymentStatus(e.url);
      }
    });
  }

  checkPaymentStatus(url) {
    
    debugger;
    let paramObj: any = {};
    
    paramObj = decodeURI(url)
      .replace("?", "&")
      .split("&")
      .map((param) => param.split("="))
      .reduce((values, [key, value]) => {
        values[key] = value;
        return values;
      }, {});
   
    if (paramObj.status_id == 1) {
      this.bookings.paymentStatus = 1;
      this.bookings.paymentMethod = "senangPay";
      this.bookings.paymentToken = paramObj.transaction_id;
      this.addInDatabase(paramObj.order_id);
    } else {
      this.utill.presentToast(paramObj.msg);
    }
  }

  addInDatabase(sid = null) {
    
    
    const id = sid || this.utill.afs.createId();

    this.utill.startLoad();
    this.utill.afs
      .doc<any>("bookingMaster/" + id)
      .set(this.bookings)
      .then(() => {
        this.utill.stopload();
        this.clenUtillity();
        if (this.bookings) {
          _.map(this.bookings.empId, (empId) => {
            this.utill.afs.collection<any>("notification").add({
              id: empId,
              bookingKey: id,
              type: 0,
            });
          });
        }
        
        this.utill.navCtrl().navigateRoot("bookingSuccess");
      })
      .catch(() => {
        this.utill.stopload();
        this.utill.error("Something went wrong...", "");
      });
  }

  clenUtillity() {
    this.utill.bookingDataState.next({
      isCarSelected: false,
      isServiceSelected: false,
      isDateSelected: false,
    });
    this.utill.dataTrasfer = {};
    this.utill.bookingData = {};
    this.utill.bookingDetail.next({});
  }
}

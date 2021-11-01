import { Component, OnInit } from "@angular/core";
import { UtillService } from "src/services/utill.service";
import { map } from "rxjs/internal/operators/map";
import { AlertController } from "@ionic/angular";
import * as moment from "moment";

@Component({
  selector: "app-my-bookings",
  templateUrl: "./my-bookings.page.html",
  styleUrls: ["./my-bookings.page.scss"],
})
export class MyBookingsPage implements OnInit {
  selectStar: any = 0;
  bookingCollection: any = [];
  isDataAva: any = {
    past: 0,
    upComing: 0,
  };
  constructor(
    private utill: UtillService,
    private alertController: AlertController
  ) {
    this.utill.startLoad();
    this.bookingCollection = this.utill.afs
      .collection("bookingMaster", (ref) =>
        ref
          .where("userId", "==", this.utill.userId)
          .orderBy("startTime", "desc")
      )
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        ),
        map((res) =>
          res.filter((r: any) => {
            r.AvailableEmpId = r.AvailableEmpId || "0";

            r.empData = this.utill.afs
              .collection("users")
              .doc(r.AvailableEmpId)
              .valueChanges();

            r.condoData = this.utill.afs
              .collection("condo")
              .doc(r.condoId)
              .valueChanges();

            r.addressData = this.utill.afs
              .collection("addressMaster")
              .doc(r.addressId)
              .valueChanges();

            if (r.services[0].categoryId) {
              r.categoryData = this.utill.afs
                .collection("category")
                .doc(r.services[0].categoryId)
                .valueChanges();
            }

            // Date Diff *****************************************************

            let date1: any = new Date(r.startTime);
            let date2: any = new Date();
            var diff = (date2 - date1) / 3600000;
            r.hours = diff;

            // *****************************************************************

            if (r.status == 1) {
              this.isDataAva.upComing++ || 0;
            } else {
              this.isDataAva.past++ || 0;
            }
            let time = moment(
              r.startTime,
              "YYYY/MM/DD HH:mm"
            ).format('MMM DD, YYYY, hh:mm A');
            console.warn(time)
            r.startTime = time;
            return r;
          })
        )
      );

    this.bookingCollection.subscribe(
      (res) => {
        this.utill.stopload();
      },
      (err) => () => this.utill.stopload()
    );
  }

  ngOnInit() { }

  onViewMore(bookingData: any) {

    this.utill.dataTrasfer = bookingData;
    this.utill.navCtrl().navigateForward("viewBooking");
  }

  onRate(bookingData: any) {
    this.utill.dataTrasfer = bookingData;
    this.utill.navCtrl().navigateForward("addReview");
  }

  async cancelOrder(bookingData) {
    const alert = await this.alertController.create({
      header: "Sure!",
      message:
        "<strong> Are you sure you want to cancel the booking? </strong>",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => { },
        },
        {
          text: "Okay",
          handler: () => {
            this.utill.afs
              .collection("bookingMaster")
              .doc(bookingData.id)
              .update({
                status: 3,
              });
          },
        },
      ],
    });

    await alert.present();
  }
}

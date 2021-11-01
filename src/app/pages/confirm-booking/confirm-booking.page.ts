import { Component, OnInit } from "@angular/core";
import { UtillService } from "src/services/utill.service";
import { map } from "rxjs/internal/operators/map";
import * as moment from "moment";
import * as _ from "underscore";

@Component({
  selector: "app-confirm-booking",
  templateUrl: "./confirm-booking.page.html",
  styleUrls: ["./confirm-booking.page.scss"],
})
export class ConfirmBookingPage implements OnInit {
  aboutData: any = {};
  bookingData: any = {};
  bookings: any = {};
  employee: any = [];
  packageInfo: any = {};
  getTax: any = 0;
  addOnService: any = [];
  addOnTime: any = 0;
  condoInfo: any = {};
  constructor(private utill: UtillService) {
    this.condoInfo = this.utill.dataTrasfer;
    this.utill.afs
      .collection("mainAdminConfiguration")
      .doc("IJ2gZiWf46mGgBS80nF9")
      .valueChanges()
      .subscribe((res: any) => {
        this.getTax = res.tax;
        this.bookingData = this.utill.bookingData;
        this.bookingData.about = this.utill.dataTrasfer;
        this.utill.defaultLocation.subscribe((res: any) => {
          this.bookingData.address = res;
          this.bookings.condoId = res.condo;
        });
        this.bookings.discount = 0;
        this.bookings.addOnServiceTotal = 0;
        if (utill.bookingData.for == "PACKAGE") {
          this.packageInfo = this.utill.packageBook;
          if (this.bookingData.selectedCar.Type == "small") {
            this.bookings.serviceTotal = this.utill.packageBook.priceSmall;
          } else if (this.bookingData.selectedCar.Type == "medium") {
            this.bookings.serviceTotal = this.utill.packageBook.priceMedium;
          } else if (this.bookingData.selectedCar.Type == "large") {
            this.bookings.serviceTotal = this.utill.packageBook.priceLarge;
          }
          let duration: number = 0;
          this.utill.packageBook.servicesData.forEach((singleService) => {
            duration += parseFloat(singleService.duration);
          });
          this.bookings.totalDuration = duration;

          this.bookings.packageId = this.utill.packageBook.id;
          this.bookings.Type = "PACKAGE";
          this.bookings.services = this.utill.packageBook.servicesData;
          this.bookings.tax = (this.bookings.serviceTotal * this.getTax) / 100;
        } else {
          this.bookings.Type = "SERVICES";
          this.getSelectedService();
        }
        this.bookings.userId = this.utill.afAuth.auth.currentUser.uid;
        this.bookings.status = 0;
        this.bookings.onTheWay = false;
        this.bookings.carId = this.bookingData.selectedCar.id;
        this.bookings.addressId = this.bookingData.address.id;
        this.bookings.adminStatus = 0;
        this.bookings.paymentStatus = 0;
        this.bookings.reviewGiven = false;
        this.bookings.AvailableEmpId = "";
        this.bookings.addOnService = [];
      });
  }

  async getSelectedService() {
    let selectedService: any = [];
    //  Get total
    this.bookings.serviceTotal = 0;
    this.bookings.totalDuration = 0;
    //
    await this.bookingData.servicesWithcet.forEach((services) => {
      let status = true;
      services.services.forEach((ser) => {
        if (ser.select) {
          let price = 0;
          status = false;

          this.bookings.totalDuration += parseFloat(ser.duration);

          if (this.bookingData.selectedCar.Type == "small") {
            this.bookings.serviceTotal += ser.priceSmall;
            price = ser.priceSmall;
          } else if (this.bookingData.selectedCar.Type == "medium") {
            this.bookings.serviceTotal += ser.priceMedium;
            price = ser.priceMedium;
          } else if (this.bookingData.selectedCar.Type == "large") {
            this.bookings.serviceTotal += ser.priceLarge;
            price = ser.priceLarge;
          }

          let total =
            this.bookings.serviceTotal + this.bookings.addOnServiceTotal;

          this.bookings.tax = (total * this.getTax) / 100;
          this.bookings.taxPercentage = this.getTax;
          selectedService.push({
            image: ser.image,
            name: ser.name,
            categoryId: ser.categoryId,
            duration: ser.duration,
            seqNumber: ser.seqNumber,
            price: price,
            description: ser.description,
            id: ser.id,
          });
        } else {
          ser.addon = true;
        }
      });
      if (status) {
        services.addon = true;
      }
    });
    this.bookings.services = await selectedService;

    this.addOnService = [];
    let sub = this.utill.afs
      .collection("addOn")
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      )
      .subscribe((res) => {
        if (res && res.length != 0) {
          _.map(res, (addOn) => {
            _.map(addOn.serviceId, (service) => {
              _.map(this.bookings.services, (selectedService) => {
                if (selectedService.id == service) {
                  this.addOnService.push(addOn);
                }
              });
            });
          });
        }
        sub.unsubscribe();
      });

    await this.setStartEndTime();
  }

  setStartEndTime() {
    this.bookings.startTime = moment(
      this.bookingData.dateTime.date.date +
        " " +
        this.bookingData.dateTime.time.in24,
      "YYYY/MM/DD HH:mm"
    ).format("YYYY-MM-DD HH:mm");
    let date = moment(this.bookings.startTime).format("YYYY-MM-DD");
    this.bookings.endTime = moment(this.bookings.startTime, "YYYY-MM-DD HH:mm")
      .add(this.bookings.totalDuration, "m")
      .format("YYYY-MM-DD HH:mm");
  }

  payNow() {
    // this.bookings.totalDuration += 30;

    const totalduration =
      this.bookings.totalDuration + parseFloat(this.addOnTime);
    // this.bookings.totalDuration += parseFloat(this.addOnTime);

    this.bookings.startTime = moment(
      this.bookingData.dateTime.date.date +
        " " +
        this.bookingData.dateTime.time.in24,
      "YYYY/MM/DD HH:mm a"
    ).format("YYYY-MM-DD HH:mm");
    let date = moment(this.bookings.startTime).format("YYYY-MM-DD");
    this.bookings.endTime = moment(this.bookings.startTime, "YYYY-MM-DD HH:mm")
      .add(totalduration, "m")
      .format("YYYY-MM-DD HH:mm");
    // this.bookings.endTime = moment(date + " " + end_time).format(
    //   "YYYY-MM-DD HH:mm"
    // );

    // return

    let empG = JSON.parse(JSON.stringify(this.utill.employee));

    if (this.utill.employee || this.utill.employee.length != 0) {
      empG.forEach((element: any, ind) => {
        element.available = true;
        const paymentDone = this.utill.afs
          .collection("bookingMaster", (ref) =>
            ref
              .where("AvailableEmpId", "==", element.id)
              .where("status", "==", 1)
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
                if (
                  this.utill.convertDate(r.startTime) ==
                  moment(this.bookings.startTime, "YYYY/MM/DD").format(
                    "YYYY-MM-DD"
                  )
                ) {
                  let bookingStart = moment(
                    r.startTime,
                    "YYYY-MM-DD HH:mm"
                  ).format("HH:mm");
                  let bookingEnd = moment(r.endTime, "YYYY-MM-DD HH:mm").format(
                    "HH:mm"
                  );
                  let seletStartTime = moment(
                    this.bookings.startTime,
                    "YYYY-MM-DD HH:mm"
                  ).format("HH:mm");
                  let selectEndTime = moment(
                    this.bookings.endTime,
                    "YYYY-MM-DD HH:mm"
                  ).format("HH:mm");

                  if (
                    moment(bookingStart, "HH:mm").isBetween(
                      moment(seletStartTime, "HH:mm"),
                      moment(selectEndTime, "HH:mm")
                    ) ||
                    moment(bookingEnd, "HH:mm").isBetween(
                      moment(seletStartTime, "HH:mm"),
                      moment(selectEndTime, "HH:mm")
                    )
                  ) {
                    element.available = false;
                  }
                }
                return r;
              })
            )
          )
          .subscribe(() => {
            if (this.utill.employee.length == ind + 1) {
              let emp: any = [];

              empG.forEach((el) => {
                if (el.available) {
                  emp.push(el);
                }
              });

              if (emp.length > 0) {
                this.bookings.empId = _.chain(emp).pluck("id").value();
                this.utill.dataTrasfer = this.bookings;

                this.utill.navCtrl().navigateForward("payment");
                paymentDone.unsubscribe();
              } else {
                this.utill.error(
                  "None of the Detailer is available at that time"
                );
              }
            }
          });
      });
    }
  }

  async onAddOnSelect(addon: any) {
    let IsSame: any = false;
    this.bookings.addOnServiceTotal =
      this.bookings.addOnServiceTotal > 0 ? this.bookings.addOnServiceTotal : 0;
    await _.map(this.addOnService, (addOn: any) => {
      if (addon.id == addOn.id && addOn.select == true) {
        IsSame = true;
      }
      // else {
      //   IsSame = false;
      // }
      // addOn.select = false;
    });

    addon.select = await !IsSame;
    let addOnPrice: any = 0;
    if (addon.select) {
      if (this.bookingData.selectedCar.Type == "small") {
        this.bookings.addOnServiceTotal += addon.priceSmall;
        addOnPrice = addon.priceSmall;
      } else if (this.bookingData.selectedCar.Type == "medium") {
        this.bookings.addOnServiceTotal += addon.priceMedium;
        addOnPrice = addon.priceMedium;
      } else if (this.bookingData.selectedCar.Type == "large") {
        this.bookings.addOnServiceTotal += addon.priceLarge;
        addOnPrice = addon.priceLarge;
      }
      this.addOnTime += parseFloat(addon.duration);
      let addonData = {
        id: addon.id,
        image: addon.image,
        price: addOnPrice,
        name: addon.name,
        duration: addon.duration,
        description: addon.description,
      };

      this.bookings.addOnService.push(addonData);

      let total = this.bookings.serviceTotal + this.bookings.addOnServiceTotal;
      this.bookings.tax = (total * this.getTax) / 100;
    } else if (!addon.select) {
      if (this.bookingData.selectedCar.Type == "small") {
        this.bookings.addOnServiceTotal -= addon.priceSmall;
        addOnPrice = addon.priceSmall;
      } else if (this.bookingData.selectedCar.Type == "medium") {
        this.bookings.addOnServiceTotal -= addon.priceMedium;
        addOnPrice = addon.priceMedium;
      } else if (this.bookingData.selectedCar.Type == "large") {
        this.bookings.addOnServiceTotal -= addon.priceLarge;
        addOnPrice = addon.priceLarge;
      }
      this.addOnTime -= parseFloat(addon.duration);
      this.bookings.addOnService.forEach((element, index) => {
        if (element.id == addon.id) {
          this.bookings.addOnService.splice(index, 1);
        }
      });
      let total = this.bookings.serviceTotal - this.bookings.addOnServiceTotal;
      this.bookings.tax = (total * this.getTax) / 100;
    }
  }

  ngOnInit() {}
}

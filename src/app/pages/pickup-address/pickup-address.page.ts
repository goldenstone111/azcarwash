import { Component, OnInit } from "@angular/core";
import { UtillService } from "src/services/utill.service";
import { map } from "rxjs/internal/operators/map";
import * as _ from "underscore";

@Component({
  selector: "app-pickup-address",
  templateUrl: "./pickup-address.page.html",
  styleUrls: ["./pickup-address.page.scss"],
})
export class PickupAddressPage implements OnInit {
  addressList: any;
  constructor(public utill: UtillService) {
    this.utill.startLoad();
    this.utill.afs
      .collection(`addressMaster`, (ref) =>
        ref.where("UserId", "==", this.utill.userId)
      )
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
      .subscribe((address) => {
        this.addressList = address;
        this.utill.stopload();
      });
  }

  ngOnInit() {}

  goBack() {
    this.utill.navCtrl().back();
  }

  setAddress(name) {
    _.map(this.addressList, (element) => {
      
      element.default = false;
    });
    name.default = true;
  }

  goToAddAddress() {
    this.utill.navCtrl().navigateForward("addAddress");
  }

  goNext() {
    this.addressList.forEach((element) => {
      this.utill.afs.collection("addressMaster").doc(element.id).set(element);
    });
    this.utill.navCtrl().navigateForward("home");
  }

  onDelete(address: any) {
    this.utill.startLoad();
    this.utill.afs
      .collection("addressMaster")
      .doc(address.id)
      .delete()
      .then(
        (res) => {
          this.utill.success("Deleted Successfully...");
          this.utill.stopload();
        },
        (err) => {
          this.utill.stopload();
          this.utill.error(JSON.stringify(err));
        }
      );
  }

  onEdit(address: any) {
    this.utill.locator = "edit";
    this.utill.navCtrl().navigateForward("addAddress");
    this.utill.dataTrasfer = address;
  }
}

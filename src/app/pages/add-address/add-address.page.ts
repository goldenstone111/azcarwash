import { OrderPipe } from 'ngx-order-pipe';
import { map } from "rxjs/internal/operators/map";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UtillService } from "src/services/utill.service";

@Component({
  selector: "app-add-address",
  templateUrl: "./add-address.page.html",
  styleUrls: ["./add-address.page.scss"]
})
export class AddAddressPage implements OnInit {
  addressType: any = "Home";
  public addressForm: FormGroup;
  condo: any = [];
  isAddress: any = {};
  code: any = "";
  order: string = 'name';
  constructor(
    private orderPipe: OrderPipe,
    private formBuilder: FormBuilder, 
    private utill: UtillService) {
    this.addressForm = this.formBuilder.group({
      condo: [null, Validators.compose([Validators.required])],
      parkingLvl: [null, Validators.compose([Validators.required])],
      lot: [null, Validators.compose([Validators.required])]
    });

    this.utill.afs
      .collection("condo")
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      ).subscribe(res => {
        this.condo = res; 
        this.condo = this.orderPipe.transform(this.condo, this.order, false, true);
      });

    this.utill.defaultLocation.subscribe(res => {
      this.isAddress = res;
    });

    if (this.utill.locator == "edit") {
      this.addressForm.patchValue({
        condo: this.utill.dataTrasfer.condo,
        parkingLvl: this.utill.dataTrasfer.parkingLvl,
        lot: this.utill.dataTrasfer.lot
      });
      this.addressType = this.utill.dataTrasfer.title;
    }
  }

  ngOnInit() {}

  onAddressTypeSelect(type) {
    this.addressType = type;
  }

  async onAddressAdd() {
    this.utill.startLoad();
    let temp: any = {};
    temp = this.addressForm.value;

    await this.condo.forEach(element => {
      if (element.id == this.addressForm.value.condo) {
        temp.condoName = element.name;
      }
    });

    temp.UserId = this.utill.afAuth.auth.currentUser.uid;
    temp.title = this.addressType;

    if (!this.isAddress) {
      temp.default = true;
    }

    if (this.utill.locator == "edit") {
      this.utill.afs
        .collection("addressMaster")
        .doc(this.utill.dataTrasfer.id)
        .update(temp)
        .then(res => {
          this.utill.stopload();
          this.utill.success("Update Successfully");
          this.utill.navCtrl().back();
        })
        .catch(err => {
          this.utill.error(JSON.stringify(err));
          this.utill.stopload();
        });
    } else {
      this.utill.afs
        .collection<any>("addressMaster")
        .add(temp)
        .then(() => {
          this.utill.stopload();
          this.utill.defaultLocation.next(temp);
          this.utill.success("Address has been addeded successfully...");
          this.utill.navCtrl().back();
        })
        .catch(() => {
          this.utill.stopload();
          this.utill.error("Something went wrong...", "");
        });
    }
  }

  ionViewWillLeave() {
    this.utill.locator = "";
  }
}

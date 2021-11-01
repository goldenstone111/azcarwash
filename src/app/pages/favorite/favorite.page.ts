import { UtillService } from "src/services/utill.service";
import { Component, OnInit } from "@angular/core";
import * as _ from "underscore";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { map } from "rxjs/internal/operators/map";
import { AlertController } from '@ionic/angular';

@Component({
  selector: "app-favorite",
  templateUrl: "./favorite.page.html",
  styleUrls: ["./favorite.page.scss"]
})
export class FavoritePage implements OnInit {
  favoriteList: any = [];
  user:any = {};
  constructor( 
    private utill: UtillService, 
    private geolocation: Geolocation,
    private alert:AlertController) {
    this.utill.startLoad();
    this.geolocation.getCurrentPosition().then(resp => {
      let sub = this.utill.afs
        .collection("users")
        .doc(this.utill.userId)
        .valueChanges()
        .subscribe((res: any) => {
          this.user = res;
          _.map(res.fevCondo, condoId => {
            let data = this.utill.afs
              .collection("condo")
              .doc(condoId)
              .valueChanges()
              .subscribe((condoInfo: any) => {
                
                // get ids
                condoInfo.id = condoId;
                // get Distance
                condoInfo.lat = condoInfo.lat || 22.3039;
                condoInfo.lng = condoInfo.lng || 70.8022;
                condoInfo.distance = this.utill.distance(
                  resp.coords.latitude,
                  resp.coords.longitude,
                  condoInfo.lat,
                  condoInfo.lng,
                  "K"
                );
                // get ratting
                this.utill.afs
                  .collection("ratingMaster", ref =>
                    ref.where("condoId", "==", condoId)
                  )
                  .snapshotChanges()
                  .pipe(
                    map((actions: any) => 
                      actions.map(a => {
                        const data = a.payload.doc.data();
                        const id = a.payload.doc.id;
                        return { id, ...data };
                      })
                    )
                  )
                  .subscribe(res => {
                    
                    if (res) {
                      condoInfo.reviewData = res;
                      let sumOfStar = res.reduce((s, f) => {
                        return s + f.star;
                      }, 0);
                      condoInfo.avgRating = sumOfStar / res.length;
                      condoInfo.avgRating =
                        isNaN(condoInfo.avgRating) == true ? 0 : condoInfo.avgRating;
                    }
                  });
                this.favoriteList.push(condoInfo);
                
                
                data.unsubscribe();
              });
          });
          sub.unsubscribe();
          this.utill.stopload();
        });
    });
  }

  async removeIt(index,data) {
    const alert = await this.alert.create({
      header: 'Sure!',
      message: 'Remove from <strong>Favorite List</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.utill.startLoad();
            this.user.fevCondo = _.without(this.user.fevCondo, data.id);
            this.utill.afs.collection('users').doc(this.utill.userId).update({
              fevCondo: this.user.fevCondo
            }).then(() => {
              this.utill.stopload();
              this.utill.success('Feblist Has Been Updated..');  
              this.favoriteList.splice(index, 1);
            }).catch(() => this.utill.stopload());
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {}
}

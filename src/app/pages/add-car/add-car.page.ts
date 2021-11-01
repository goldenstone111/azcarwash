import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
import { map } from 'rxjs/internal/operators/map';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
})
export class AddCarPage implements OnInit {
  code: any;
  number: any ;
  brands: any = [];
  models: any = [];
  temp: any = []; 
  size: any = [
    { value: 'small' },
    { value: 'medium' },
    { value: 'large' }
  ];
  selected: any = '';
  imagecheck: boolean;
  imgUrl: string;
  uploadImg: any = '';
  uniqueId: any = '';
  public carForm: FormGroup;
  onCarAdd: boolean = false;
  order: string = 'name';

  constructor(
    private orderPipe: OrderPipe,
    private utill: UtillService,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private actionSheetController: ActionSheetController
  ) {
 
    this.carForm = this.formBuilder.group({
      Brand: ['', Validators.compose([Validators.required])],
      Model: ['', Validators.compose([Validators.required])],
      Type: ['', Validators.compose([Validators.required])],
      Number: ['', Validators.compose([Validators.required])],
      image_1: ['', Validators.compose([Validators.required])]
    });

    this.carForm.patchValue({ 
      image_1: 'noimg'
    });

    this.utill.afs.collection("vehicleType").snapshotChanges().pipe(
      map((actions: any) =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))).subscribe((res: any) => {
          this.brands = res;
          if(this.brands && this.brands.length != 0) {
            this.brands = this.orderPipe.transform(this.brands, this.order, false, true);
          }
     }); 

    this.utill.afs.collection("vehicles").snapshotChanges().pipe(
      map((actions: any) =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))).subscribe((res: any) => {
          this.models = res;
          this.temp = res;
      });
  }

  ngOnInit() {
  }

  initializeItems() {
    this.models = this.temp;
  }

  getItems() {
    this.carForm.patchValue({
      Type: '',
      Model: ''
    });
    this.initializeItems();
    const val = this.carForm.value.Brand;
    if (val && val.trim() != '') {
      if (this.models.length != 0) {
        this.models = this.models.filter((item) => {
          return (item.brand.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
      }
    }
  }

  getCarSize() {
    this.temp.map((object) => {
      if (object.name == this.carForm.value.Model) {
        this.carForm.patchValue({
          Type: object.size
        })
      }
    }, err => { })
  }

  onAddCar() {
    this.onCarAdd = true;

    if(this.imagecheck) {
      this.utill.startLoad();
      this.uniqueId = this.utill.afs.createId();
      let temp: any = {};
      temp = this.carForm.value;
      temp.UserId = this.utill.afAuth.auth.currentUser.uid;
      temp.default = true;
      temp.uniqueId =  this.uniqueId;
      this.utill.afs.doc<any>('carMaster/' + this.uniqueId).set(temp).then(() => {
        if (this.imagecheck) {
          this.imageUpload(this.uploadImg);
        }
        this.utill.stopload();
        this.utill.success('Your car addeded successfully...');
        this.utill.navCtrl().back();
      }).catch((err) => {
        this.onCarAdd = false;
        this.utill.stopload(); 
        this.utill.error('Something went wrong...', '');
      });
    } else {
      this.onCarAdd = false;
      this.utill.error('Car image must be required!')
    }
  }

  imageUpload(image) {
    const { task, ref } = this.utill.uploadImageToFirebase(image);
    task.subscribe(
      snapshot => {
        // this.imageUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      error => alert("Some error occurred while uploading the picture"),
      () =>
        ref.getDownloadURL().subscribe(downloadUrl => {
          this.utill.afs.collection('carMaster').doc(this.uniqueId).update({ image_1: downloadUrl }).then(() => {
         
          });
        })
    );
  }

  openGallery() {
    this.utill.startLoad();
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((file_uri) => {
      
      this.imagecheck = true;
      this.imgUrl = "data:image/jpg;base64," + file_uri;
      this.uploadImg = file_uri;
      this.utill.stopload(); 
    }, (err) => {
      this.utill.stopload();
    });
  }

  openCamera() {
    this.utill.startLoad();
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 1000, 
      targetHeight: 1000,
      destinationType: this.camera.DestinationType.DATA_URL,      
      correctOrientation: true
    }

    this.camera.getPicture(options).then((file_uri) => {
      this.imagecheck = true;
      this.imgUrl = "data:image/jpg;base64," + file_uri;
      this.uploadImg = file_uri;
      this.utill.stopload(); 
    }, (err) => {
      this.utill.stopload();
    });
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose an option',
      buttons: [{
        text: 'Camera',
        role: 'destructive',
        icon: 'md-camera',
        handler: () => {
          this.openCamera();
        }
      }, {
        text: 'Gallery',
        icon: 'md-image',
        handler: () => {
          this.openGallery();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          
        }
      }]
    });
    await actionSheet.present();
  }

}
 
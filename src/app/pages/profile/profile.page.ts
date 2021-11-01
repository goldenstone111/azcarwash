import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtillService } from 'src/services/utill.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MenuController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public myForm: FormGroup;
  imagecheck: boolean;
  imgUrl: string;
  uploadImg: any = '';
  constructor(
    private formBuilder: FormBuilder,
    private utill: UtillService,
    public afAuth: AngularFireAuth, 
    public afs: AngularFirestore,
    private camera: Camera,
    private actionSheetController: ActionSheetController
  ) {
    this.myForm = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      number: ['', Validators.compose([Validators.required])]
    });

   this.afs.collection('users').doc(this.utill.userId).valueChanges().subscribe((res:any) => {
     this.myForm.patchValue({
      username: res.username,
      email: res.email,
      number: res.number
    })
    this.imgUrl = res.image;
   })
  } 

  ngOnInit() {
  }

  onUpdate() {
    this.utill.startLoad();
    if (this.imagecheck) {
      this.imageUpload(this.uploadImg);
    }
    this.afs.collection('users').doc(this.utill.userId).update(this.myForm.value).then(() => {
      this.utill.stopload();
      this.utill.success('Profile has been updated !');
    }, err => {
      this.utill.stopload();
      this.utill.success('Something Went Wrong !');
    });
  }

  imageUpload(image) {
    const { task, ref } = this.utill.uploadImageToFirebase(image);
    task.subscribe(
      snapshot => {
        
        // this.imageUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      error => alert("Some error occured while uploading the picture"),
      () =>
        ref.getDownloadURL().subscribe(downloadUrl => {
          this.utill.afs
            .collection(`users`)
            .doc(this.utill.userId)
            .update({ image: downloadUrl });
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

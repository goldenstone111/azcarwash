import { FCM } from "@ionic-native/fcm/ngx";
import { AngularFireAuth } from "angularfire2/auth";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UtillService } from "src/services/utill.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.page.html",
  styleUrls: ["./sign-up.page.scss"],
})
export class SignUpPage implements OnInit {
  public myForm: FormGroup;
  imagecheck: boolean;
  imgUrl: string;
  uploadImg: any = "";
  token: any = "";
  constructor(
    private formBuilder: FormBuilder,
    private utill: UtillService,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private camera: Camera,
    private fcm: FCM
  ) {
    this.myForm = this.formBuilder.group({
      username: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.compose([Validators.required])],
      number: ["", Validators.compose([Validators.required])],
      role: ["", Validators.compose([Validators.required])],
      image: ["", Validators.compose([Validators.required])],
      coverImage: ["", Validators.compose([Validators.required])],
      status: ["", Validators.compose([Validators.required])],
      fevCondo: [[]],
    });

    this.myForm.patchValue({
      role: 3,
      coverImage:
        "https://cache.ocean-sandbox.com/img/front/cag/default-cover.jpg",
      status: true,
      image:
        "https://dumielauxepices.net/sites/default/files/person-icons-avatar-711972-5314933.png",
    });

    this.fcm.getToken().then((token) => {
      this.token = token;
    });
  }

  ngOnInit() {}

  OnSignUp() {
    if (this.imagecheck) {
      this.imageUpload(this.uploadImg);
    }
    this.utill.dataTrasfer = this.myForm.value;
    this.utill.dataTrasfer.token = this.token;
    this.utill.success("Please verify your number...");
    this.utill.navCtrl().navigateForward("verify");
  }

  imageUpload(image) {
    const { task, ref } = this.utill.uploadImageToFirebase(image);
    task.subscribe(
      (snapshot) => {},
      (error) => alert("Some error occured while uploading the picture"),
      () =>
        ref.getDownloadURL().subscribe((downloadUrl) => {
          this.utill.afs
            .collection(`users`)
            .doc(this.utill.userId)
            .update({ image: downloadUrl });
        })
    );
  }

  openGallary() {
    this.utill.startLoad();
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(
      (file_uri) => {
        this.imagecheck = true;
        this.imgUrl = "data:image/jpg;base64," + file_uri;
        this.uploadImg = file_uri;
        this.utill.stopload();
      },
      (err) => {
        this.utill.stopload();
      }
    );
  }
}

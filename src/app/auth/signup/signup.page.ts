import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  form: FormGroup;
  isFocused = false;

  constructor(private loadingCtrl: LoadingController, private router: Router) {}

  ngOnInit() {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.form = new FormGroup({
      phone: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.pattern(/^[0-9]{8}$/)],
      }),
    });
  }

  onKeyPress(e: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(e.charCode);

    if (e.code === 'Enter') {
      return;
    }

    // Invalid character, prevent input
    // Therefore no change event is emitted
    if (!pattern.test(inputChar)) {
      return e.preventDefault();
    }

    const phone: string = this.form.value.phone;
    // Length limit reached
    if (phone && phone.toString().length >= 8) {
      return e.preventDefault();
    }

    if (phone) {
      const updatedPhone = phone + inputChar;
      // Mannually updating the form because the keypress event being called
      // morethan once before the form updates its self
      this.form.patchValue({ phone: updatedPhone });
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Processing request...',
      })
      .then((loadingEL) => {
        loadingEL.present();
        console.log(this.form.value);
        setTimeout(() => {
          this.router.navigateByUrl('/auth/signup/check');
          loadingEL.dismiss();
        }, 1000);
      });
  }
}

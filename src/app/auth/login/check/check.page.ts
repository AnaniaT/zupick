import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-check',
  templateUrl: './check.page.html',
  styleUrls: ['./check.page.scss'],
})
export class CheckPage implements OnInit, OnDestroy {
  form: FormGroup;
  isFocused = false;
  private codeLen = 5;

  private timer: any;
  timeLimit = 60;
  resendBtnTxt = '';

  constructor(private loadingCtrl: LoadingController, private navCtrl: NavController) {}

  ngOnInit() {
    this.ionViewWillEnter();
    this.resendBtnTxt = `Try resend in ${this.timeLimit.toString()}`;
    this.timer = setInterval(() => {
      this.resendHandler();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  ionViewWillEnter() {
    this.form = new FormGroup({
      code: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required,
          // Validators.min(00000000),
          // Validators.max(99999999),
          Validators.pattern(`^[0-9]{${this.codeLen}}$`),
        ],
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

    const code: string = this.form.value.code;
    // Length limit reached
    if (code && code.toString().length >= this.codeLen) {
      return e.preventDefault();
    }

    if (code) {
      const updatedCode = code + inputChar;
      // Mannually updating the form because the keypress event being called
      // morethan once before the form updates its self
      this.form.patchValue({ code: updatedCode });
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Logging in...',
      })
      .then((loadingEL) => {
        loadingEL.present();
        console.log(this.form.value);
        setTimeout(() => {
          this.navCtrl.navigateRoot('/home');
          loadingEL.dismiss();
        }, 1000);
      });
  }

  private resendHandler() {
    this.timeLimit--;
    if (this.timeLimit <= 0) {
      clearInterval(this.timer);
      return (this.resendBtnTxt = `Resend`);
    }
    return (this.resendBtnTxt = `Try resend in ${this.timeLimit.toString()}`);
  }

  private resetResenderBtn() {
    clearInterval(this.timer);
    this.timeLimit = 60;
    this.timer = setInterval(() => {
      this.resendHandler();
    }, 1000);
  }

  onResendConfirmation() {
    if (this.timeLimit > 0) {
      return;
    }
    this.resendBtnTxt = 'Resending...';
    this.resetResenderBtn();
  }
}

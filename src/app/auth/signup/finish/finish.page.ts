import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.page.html',
  styleUrls: ['./finish.page.scss'],
})
export class FinishPage implements OnInit, OnDestroy {
  form: FormGroup;
  isFocused = false;
  private maxNameLen = 20;
  private namePattern = /[a-z]/;

  constructor(private loadingCtrl: LoadingController, private router: Router) {}

  ngOnInit() {
    this.ionViewWillEnter();
  }

  ngOnDestroy() {}

  ionViewWillEnter() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(this.namePattern),
          Validators.maxLength(this.maxNameLen),
        ],
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)],
      }),
      passwordConf: new FormControl(null, {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.minLength(6),
          this.confPassCheck.bind(this),
        ],
      }),
    });
  }

  confPassCheck(control: AbstractControl): { [k: string]: boolean } | null {
    if (this.form) {
      const pass = this.form.get('password').value;
      if (control.value !== pass) {
        return { misMatch: true };
      }
    }
    return null;
  }

  onKeyPress(e: any) {
    const inputChar = String.fromCharCode(e.charCode);

    // if (e.code === 'Enter') {
    //   return;
    // }

    // Invalid character, prevent input
    // Therefore no change event is emitted
    if (!this.namePattern.test(inputChar)) {
      return e.preventDefault();
    }

    const name: string = this.form.value.name;
    // Length limit reached
    if (name && name.toString().length >= this.maxNameLen) {
      return e.preventDefault();
    }

    if (name) {
      const updatedName = name + inputChar;
      // Mannually updating the form because the keypress event being called
      // morethan once before the form updates its self
      this.form.patchValue({ name: updatedName });
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Finishing up...',
      })
      .then((loadingEL) => {
        loadingEL.present();
        console.log(this.form.value);
        setTimeout(() => {
          this.router.navigateByUrl('/home');
          loadingEL.dismiss();
        }, 1000);
      });
  }
}

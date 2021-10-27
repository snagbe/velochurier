import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {DialogData, OverlayComponent} from "../../overlay/overlay.component";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private overlay: OverlayComponent) { }

  ngOnInit(): void {
  }

  onSubmit(passwordForm: NgForm) {
    this.authService.changePassword(passwordForm.value.passwordNew)
      .subscribe((res) => {
        console.log("Update successful.");
        passwordForm.reset();
      }).catch((error) => {
      console.log("An error ocurred");
      console.log(error);
      const data: DialogData = {
        type: 'Fehler',
        message: 'Ein unerwarteter Fehler ist aufgetreten'
      }
      this.overlay.openDialog(data);
    });
  }

  onBack() {
    this.router.navigate(['/settings']);
  }
}

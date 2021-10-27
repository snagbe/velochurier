import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {DialogData, OverlayComponent} from "../../overlay/overlay.component";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private overlay: OverlayComponent) {
  }

  ngOnInit(): void {
  }

  onSubmit(passwordForm: NgForm) {
    this.authService.createUser(passwordForm.value.email, passwordForm.value.password)
      .then(() => {
        const data: DialogData = {
          title: 'Neuer Benutzer erstellt',
          message: 'Der Benutzer ' + passwordForm.value.email + ' wurde erfolgreich erstellt.'
        }
        this.overlay.openDialog(data);
        passwordForm.reset();
      }).catch((error) => {
      const data: DialogData = {
        title: 'Fehler',
        message: 'Der Benutzer konnte nicht erstellt werden.'
      }
      this.overlay.openDialog(data);
    });
  }

  onBack() {
    this.router.navigate(['/settings']);
  }
}

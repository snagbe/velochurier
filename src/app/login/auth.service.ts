import {Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {updatePassword} from "@angular/fire/auth";
import firebase from "firebase/compat";
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  doLogin(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  doLogout() {
    this.afAuth.signOut();
    this.router.navigate(['/auth']);
  }

  doAuthCheck() {
    this.afAuth.authState.subscribe(user => {
      if (!user || !user.uid) {
        this.router.navigate(['/auth']);
      }
    });
  }

  changePassword(newPwd:string) {
    /*this.afAuth.authState.subscribe(user => {
      if (user) {
        updatePassword(user, newPwd).then(() => {
          console.log("Update successful.");
        }).catch((error) => {
          console.log("An error ocurred");
          console.log(error);
          // ...
        });
      }
    });*/


    /*const user = this.afAuth.currentUser;
    // @ts-ignore
    updatePassword(user, newPwd).then(() => {
      console.log("Update successful.");
    }).catch((error) => {
      console.log("An error ocurred");
      console.log(error);
      // ...
    });*/
  }
}

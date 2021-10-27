import {Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {updatePassword} from "@angular/fire/auth";

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

  changePassword(newPwd: string) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        return updatePassword(user, newPwd);
      }
    });
    return null;
  }
}

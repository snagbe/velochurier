import {Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";

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
    this.afAuth.authState.subscribe(res => {
      if (!res || !res.uid) {
        this.router.navigate(['/auth']);
      }
    });
  }
}

import {Injectable} from "@angular/core";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  createUserWithEmailAndPassword
} from "@angular/fire/auth";
import {FirebaseService} from "../firebase/firebase.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private firebaseService: FirebaseService,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  /**
   * Logs in the user
   * @param email The entered email address
   * @param password The entered password
   */
  doLogin(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Logs out the current user user
   */
  doLogout() {
    this.afAuth.signOut();
    this.router.navigate(['/auth']);
  }

  /**
   * Checks if an user is logged in
   */
  doAuthCheck() {
    this.afAuth.authState.subscribe(user => {
      if (!user || !user.uid) {
        this.router.navigate(['/auth']);
      }
    });
  }

  /**
   * Checks if an user has the admin authorization
   */
  doAdminCheck() {
    this.afAuth.authState.subscribe(user => {
      if (!this.firebaseService.checkAdmin()) {
        this.router.navigate(['/settings']);
      }
    });
  }

  /**
   * Changes the password of the logged in user
   * @param newPwd The new password
   */
  changePassword(newPwd: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    return updatePassword(user, newPwd);
  }

  /**
   * Reauthorization of the currently logged in user
   * @param pwd The entered password
   */
  reauthenticate(pwd: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, pwd);
    return reauthenticateWithCredential(user, credential);
  }

  /**
   * Sends an email with a link to reset the current password
   * @param email The users email address
   */
  sendPasswordResetMail(email) {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  }

  /**
   * Creates a new user
   * @param email The email address from the new user
   * @param pwd The password from the new user
   */
  createUser(email: string, pwd: string) {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, pwd);
  }
}

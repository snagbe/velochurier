import {Component, OnInit} from '@angular/core';
import {Address} from "../address/addresses";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";
import {FirebaseService} from "../firebase/firebase.service";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  addresses: Address[];
  addOrder: boolean = false;

  constructor(private firebaseService: FirebaseService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.addresses = this.firebaseService.getAddresses();
  }

  /**
   * Navigates to the customer component with the order id passed to it
   * @param id the uid of the order
   */
  onEditCustomer(id) {
    this.router.navigate(['customer', {orderId: id}]).then(() => {
      window.location.reload();
    });
  }
}

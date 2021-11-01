import {Component, OnInit} from '@angular/core';
import {Address} from "../address/addresses";
import {DeliveriesService} from "../deliveries/deliveries.service";
import {AuthService} from "../auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  addresses: Address[];
  addOrder: boolean = false;

  constructor(private deliveriesService: DeliveriesService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.deliveriesService.getAddresses().subscribe(value => this.addresses = value);
  }

  onEditCustomer(id) {
    this.router.navigate(['customer', {orderId: id}]).then(() => {
      window.location.reload();
    });
  }
}

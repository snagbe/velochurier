import { Component, OnInit } from '@angular/core';
import {Address} from "../address/addresses";
import {DeliveriesService} from "../deliveries/deliveries.service";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  addresses: Address[];
  addOrder: boolean = false;

  constructor(private deliveriesService: DeliveriesService) { }

  ngOnInit(): void {
    this.deliveriesService.getAdresses().subscribe(value => this.addresses = value);
  }

  openAddOrder(){
    this.addOrder = !this.addOrder;
  }
}

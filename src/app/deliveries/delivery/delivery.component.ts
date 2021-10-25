import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Address} from "../../address/addresses";
import {DeliveriesService} from "../deliveries.service";
import {AuthService} from "../../login/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  @ViewChild('deliverBottomSheet') DeliverBottomSheet: TemplateRef<any>;
  @Input() currentIndex: number;
  addresses: Address[];

  constructor(private bottomSheet: MatBottomSheet,
              private db: AngularFireDatabase,
              private deliveriesService: DeliveriesService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.deliveriesService.getAdresses().subscribe(value => this.addresses = value);
  }

  onBack() {
    this.router.navigate(['/deliveries']);
  }

  openDeliverSheetMenu() {
    this.bottomSheet.open(this.DeliverBottomSheet);
  }

  closeDeliverSheetMenu() {
    this.bottomSheet.dismiss();
  }

  deleteDeliver(deliveryMethod, address) {
    this.db.object('/address/' + address.id).remove();
  }
}

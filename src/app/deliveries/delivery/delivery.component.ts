import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Address} from "../../address/addresses";
import {DeliveriesService} from "../deliveries.service";
import {AuthService} from "../../login/auth.service";
import {ActivatedRoute, Router, Data} from "@angular/router";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  @ViewChild('deliverBottomSheet') DeliverBottomSheet: TemplateRef<any>;
  currentID: any;
  currentReceiverLat: number;
  currentReceiverLng: number;
  currentDate: any;

  zoom: number;
  clientCount: number
  receiverAddresses: Address[];
  clientAddresses: Address[];
  currentRecord: any[] = [];

  constructor(private bottomSheet: MatBottomSheet,
              private db: AngularFireDatabase,
              private deliveriesService: DeliveriesService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.zoom = 20;
    this.route.data.subscribe(
      (data: Data) => {
        this.currentID = data['delivery'].id;
        this.currentReceiverLat = +data['delivery'].lat;
        this.currentReceiverLng = +data['delivery'].lng;
        this.currentDate = new Date(data['delivery'].date);
      }
  );
    this.deliveriesService.getOrderAddresses(this.currentDate, 'open', 'receiver').subscribe(value => this.receiverAddresses = value);
    this.deliveriesService.getOrderAddresses(this.currentDate, 'open', 'client').subscribe(value => this.clientAddresses = value);
  }

  onBack() {
    this.router.navigate(['/deliveries']);
  }

  checkIsEmpty() {
    console.log('test');
  }

  openDeliverSheetMenu() {
    this.bottomSheet.open(this.DeliverBottomSheet);
  }

  closeDeliverSheetMenu() {
    this.bottomSheet.dismiss();
  }

  onEditOrder() {
      this.router.navigate(['order', 'edit', {id: this.currentID, date: this.currentDate}]);
  }

  /**
   * move the selected order in the firebase from open to delivered
   * @param deliveryMethod method to send the email
   */
  onMoveToDelivered(deliveryMethod) {
    this.currentRecord = [];
    // get the selected Object from 'open' and push the object to the list 'currentRecord'
    const selectedDate = this.currentDate.value.getFullYear() + '-' + (this.currentDate.value.getMonth() + 1) + '-' + this.currentDate.value.getDate();
    this.db.list('order/open/' + selectedDate).query
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (this.currentID === key) {
            this.currentRecord.push(data);
          }
        });

    // remove the selected Object
    if (this.currentRecord) {
      this.db.object('order/open/' + selectedDate + '/' + this.currentID).remove();

    }

    let article = this.currentRecord[0].article;
    let client = this.currentRecord[0].client;
    let receiver = this.currentRecord[0].receiver;

    // move the list 'currentRecord' to the 'delivered' record
    this.db.list('order/delivered/' + selectedDate + '/')
      .set(this.currentID, {
        "article": article,
        "client": client,
        "receiver": receiver
      })
    this.closeDeliverSheetMenu();
    this.onBack();
  }
}

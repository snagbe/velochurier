import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {MatDialog} from '@angular/material/dialog';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Address} from "../../address/addresses";
import {DeliveriesService} from "../deliveries.service";
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute, Router, Data} from "@angular/router";

import {EmailService} from "../../email.service";
import {DialogData, OverlayService} from "../../overlay/overlay.service";


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  @ViewChild('deliverBottomSheet') DeliverBottomSheet: TemplateRef<any>;
  @ViewChild('editBottomSheet') EditBottomSheet: TemplateRef<any>;

  currentID: any;
  currentReceiverLat: number;
  currentReceiverLng: number;
  currentDate: Date;

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
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private overlay: OverlayService,
              private emailService: EmailService) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.zoom = 18.5;
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

  /**
   * allows you to return to the previous component deliveries
   */
  onBack() {
    this.router.navigate(['/deliveries']);
  }

  /**
   * opens the form that displays the delivery options
   */
  openDeliverSheetMenu() {
    this.bottomSheet.open(this.DeliverBottomSheet);
  }

  /**
   * closes the form that displays the delivery options
   */
  closeDeliverSheetMenu() {
    this.bottomSheet.dismiss();
  }

  /**
   * Navigates to the order component with the order id passed to it
   */
  onEditOrder() {
    this.router.navigate(['order', 'edit', {orderId: this.currentID}]).then(() => {
      window.location.reload();
    });
  }

  /**
   * opens a dialog that displays the delivery confirmation
   * @param deliveryMethod the selected delivery method
   */
  getDeliveryInfo(deliveryMethod) {
    const data: DialogData = {
      title: "Zustellung '" + deliveryMethod + "'",
      message: 'Bitte gib an, wo du die Lieferung abgegeben hast.',
      type: 'confirmation',
      inputVisible: true,
      primaryButton: {
        name: 'Zustellen', function: function () {
          this.onMoveToDelivered(deliveryMethod, this.overlay.input);
        }.bind(this)
      },
      secondaryButton: {
        name: 'Abbrechen'
      }
    }
    this.overlay.openDialog(data);
  }

  /**
   * Moves the selected order in the firebase from open to delivered
   * @param deliveryMethod The selected delivery method.
   * @param deliveryInfo The additional delivery info.
   */
  onMoveToDelivered(deliveryMethod, deliveryInfo?) {
    // get the selected Object from 'open' and push the object to the list 'currentRecord'
    const selectedDate = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
    this.db.list('order/open/' + selectedDate).query
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (this.currentID === key) {
            this.currentRecord.push(data);
          }
        });

    //send email
    /*    const html = '<p>Diese Lieferung wurde nach folgendermassen zugestellt' + deliveryMethod + '</p>';
        this.emailService.transport('smtp.host.com', 587);
        this.emailService.sendEmail('support@yourdomain.com', 'nagbe.samuel@gmail.com', 'Test Email Subject', html);*/

    // move the list 'currentRecord' to the 'delivered' record
    let data: DialogData;
    this.db.list('order/delivered/' + selectedDate + '/')
      .set(this.currentID, {
        "article": this.currentRecord[0].article,
        "client": this.currentRecord[0].client,
        "receiver": this.currentRecord[0].receiver,
        "deliveryMethod": deliveryMethod,
        "deliveryInfo": deliveryInfo ? deliveryInfo : "",
      }).then(() => {
      if (this.currentRecord) {
        this.db.object('order/open/' + selectedDate + '/' + this.currentID).remove();
      }
      data = {
        title: 'Zustellung',
        message: 'Der Auftrag wurde auf folgende Art: "' + deliveryMethod + '" abgeschlossen.',
        type: 'success',
        timeout: 3000,
        primaryButton: {name: 'Ok'}
      }
      this.overlay.openDialog(data);
    }).catch((error) => {
      data = {
        title: 'Fehler',
        message: 'Der Auftrag konnte nicht zugestellt werden.',
        type: 'error',
        primaryButton: {name: 'Ok'}
      }
      this.overlay.openDialog(data);
    });
    this.closeDeliverSheetMenu();
    this.onBack();
  }

  /**
   * opens the form that displays the edit order options
   */
  openEditSheetMenu() {
    this.bottomSheet.open(this.EditBottomSheet);
  }

  /**
   * closes the form that displays the edit order options
   */
  closeEditSheetMenu() {
    this.bottomSheet.dismiss();
  }

  /**
   * asks if you want to delete the selected order
   */
  onDeleteOrder() {
    const data: DialogData = {
      title: 'Auftrag l??schen',
      message: 'M??chtest du den Auftrag wirklich l??schen?',
      type: 'confirmation',
      primaryButton: {
        name: 'L??schen', function: function () {
          this.deleteOrder();
        }.bind(this)
      },
      secondaryButton: {
        name: 'Abbrechen'
      }
    }
    this.overlay.openDialog(data);
  }

  /**
   * Removes the selected order in the firebase
   */
  deleteOrder() {
    const selectedDate = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
    this.db.object('order/open/' + selectedDate + '/' + this.currentID).remove();

    this.onBack();
    this.closeEditSheetMenu();
    const data: DialogData = {
      title: 'Auftrag gel??scht',
      message: 'Der Auftrag wurde erfolgreich gel??scht.',
      type: 'success',
      timeout: 3000,
      primaryButton: {name: 'Ok'}
    }
    this.overlay.openDialog(data);
  }
}

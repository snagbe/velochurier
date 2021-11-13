import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AddressComponent} from "../../address/address.component";
import {AutocompleteComponent} from "../../autocomplete/autocomplete.component";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {Address} from "../../address/addresses";
import {GlobalComponents} from "../../global-components";
import {Subscription} from "rxjs";
import {FirebaseService} from "../../firebase/firebase.service";
import {DialogData, OverlayService} from "../../overlay/overlay.service";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChild('orderForm', {static: false}) orderForm: NgForm;
  @ViewChild('autoClient') autoClient: AutocompleteComponent;
  @ViewChild('address') address: AddressComponent;

  subscription: Subscription;
  selectedAddress: Address[];
  currentId: any;
  pageTitle: string;

  constructor(private globalComp: GlobalComponents,
              private router: Router,
              private route: ActivatedRoute,
              private firebaseService: FirebaseService,
              private overlay: OverlayService) {
  }

  ngOnInit(): void {

    this.pageTitle = "Kunde bearbeiten";
    this.route.data.subscribe(
      (data: Data) => {
        this.currentId = data['customer'].orderId;
      }
    );
    this.firebaseService.getAddressById(this.currentId);

    this.subscription = this.globalComp.addressChange
      .subscribe(() => {
        this.selectedAddress = this.globalComp.getAddress();
        if ('Empfänger' === this.selectedAddress[0].type) {
          this.address.formGroup.controls.company.setValue(this.selectedAddress[0].company);
          this.address.formGroup.controls.surname.setValue(this.selectedAddress[0].surname);
          this.address.formGroup.controls.name.setValue(this.selectedAddress[0].name);
          this.address.formGroup.controls.zip.setValue(this.selectedAddress[0].zip);
          this.address.formGroup.controls.city.setValue(this.selectedAddress[0].city);
          this.address.formGroup.controls.street.setValue(this.selectedAddress[0].street);
          this.address.formGroup.controls.mail.setValue(this.selectedAddress[0].email);
          this.address.formGroup.controls.phone.setValue(this.selectedAddress[0].phone);
          this.address.formGroup.controls.description.setValue(this.selectedAddress[0].description);
        }
      })
  }

  public onSaveAddress() {

    this.firebaseService.removeAddress(this.currentId);
    this.firebaseService.saveAddress(this.address.formGroup.value);

    this.onBack();
  }

  public onBack() {
    this.router.navigate(['/customers']);
  }

  /**
   * Remove the selected order in the firebase.
   */
  onDeleteCustomer() {
    const data: DialogData = {
      title: 'Kunde löschen',
      message: 'Möchtest du den Kunden wirklich löschen?',
      type: 'confirmation',
      primaryButton: {
        name: 'Löschen', function: function () {
          this.deleteCustomer();
        }.bind(this)
      },
      secondaryButton: {
        name: 'Abbrechen'
      }
    }
    this.overlay.openDialog(data);
  }

  deleteCustomer() {
    this.overlay.closeDialog();
    this.firebaseService.removeAddress(this.currentId);
    this.onBack();
    const data: DialogData = {
      title: 'Kunde gelöscht',
      message: 'Der Kunde wurde erfolgreich gelöscht.',
      type: 'success',
      timeout: 3000,
      primaryButton: {name: 'Ok'}
    }
    this.overlay.openDialog(data);
  }
}

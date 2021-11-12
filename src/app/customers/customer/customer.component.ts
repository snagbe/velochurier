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

  pageTitle: string;
  company: string;
  surname: string;
  name: string;
  street: string;
  zip: number;
  city: string;
  mail: string;
  phone: string;
  clientDescription: string;

  //cache Fields
  cacheClientCompany: string;
  cacheClientSurname: string;
  cacheClientName: string;

  subscription: Subscription;
  selectedAddress: Address[];
  currentId: any;


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
          this.company = this.selectedAddress[0].company;
          this.cacheClientCompany = this.selectedAddress[0].company;
          this.surname = this.selectedAddress[0].surname;
          this.cacheClientSurname = this.selectedAddress[0].surname;
          this.name = this.selectedAddress[0].name;
          this.cacheClientName = this.selectedAddress[0].name;
          this.zip = this.selectedAddress[0].zip;
          this.city = this.selectedAddress[0].city;
          this.street = this.selectedAddress[0].street;
          this.mail = this.selectedAddress[0].email;
          this.phone = this.selectedAddress[0].phone;
          this.clientDescription = this.selectedAddress[0].description;
        }
      })
  }

  public onSaveAddress() {

    this.firebaseService.removeAddress(this.currentId);
    this.firebaseService.saveAddress(this.address);

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

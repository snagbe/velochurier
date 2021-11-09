import {Address} from "../address/addresses";
import {Injectable, ViewChild} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../global-components";
import {AddressComponent} from "../address/address.component";
import {DialogData, OverlayComponent} from "../overlay/overlay.component";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  @ViewChild('client') client: AddressComponent;
  @ViewChild('receiver') receiver: AddressComponent;

  orderType: string;

  clientCompany: string;
  clientName: string;

  constructor(private db: AngularFireDatabase,
              private globalComp: GlobalComponents,
              private overlay: OverlayComponent) {
  }

  ngOnInit(): void {
  }

  public getAddresses() {
    let sortedAddresses = [];
    this.db.database.ref('address').orderByChild('displayName')
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (data) {
            sortedAddresses.push({id: key, city: data.city, street: data.street, zip: data.zip, surname: data.surname, name: data.name, company: data.company, email: data.email, phone: data.phone, description: data.description});
          }
        });
    return  sortedAddresses;
  }

  public getAddressById(id) {
    this.db.database.ref('address')
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          this.orderType = 'Empfänger';
          if (key === id) {
            // @ts-ignore
            const address: Address = {
              type: this.orderType,
              city: data.city,
              company: data.company,
              name: data.name,
              surname: data.surname,
              street: data.street,
              zip: data.zip,
              email: data.email,
              phone: data.phone,
              description: data.description
            };
            this.globalComp.setAddress(address);
            this.globalComp.addressChange.next();
          }
        });
  }

  removeAddress(id) {
    let addressId;
    this.db.database.ref('address/').on('child_added',
      snap => {
        const key = snap.key;
        if (key === id) {
          addressId = snap.key;
        }
      });
    this.db.object('address/' + id).remove();
  }

  public saveAddress(node) {
    let addressData;
    let displayName;

    if(node.company){
      displayName = node.company;
    }else {
      displayName = node.name + ' ' + node.surname;
    }

    addressData = {
      "displayName": displayName,
      "company": node.company,
      "surname": node.surname,
      "name": node.name,
      "street": node.street,
      "zip": node.zip,
      "city": node.city,
      "email": node.email,
      "phone": node.phone,
      "description": node.description
    }

    let data: DialogData;
    this.db.list('address/').push(addressData)
      .then(() => {
        data = {
          title: 'Daten gespeichert',
          message: 'Die eingegebene Adresse wurde erfolgreich gespeichert.',
          type: 'success',
          timeout: 3000,
          primaryButton: {name: 'Ok'}
        }
        this.overlay.openDialog(data);
      }).catch((error) => {
      data = {
        title: 'Fehler',
        message: 'Die eingegebene Adresse konnte nicht gespeichert werden.',
        type: 'error',
        timeout: null,
        primaryButton: {name: 'Ok'}
      }
      this.overlay.openDialog(data);
    });
  }
}

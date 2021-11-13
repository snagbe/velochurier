import {Address} from "../address/addresses";
import {Injectable, ViewChild} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../global-components";
import {AddressComponent} from "../address/address.component";
import {DialogData, OverlayService} from "../overlay/overlay.service";
import {getAuth} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  @ViewChild('client') client: AddressComponent;
  @ViewChild('receiver') receiver: AddressComponent;

  orderType: string;

  clientCompany: string;
  clientName: string;
  savedKey: string;

  constructor(private db: AngularFireDatabase,
              private globalComp: GlobalComponents,
              private overlay: OverlayService) {
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
            sortedAddresses.push({
              id: key,
              city: data.city,
              street: data.street,
              zip: data.zip,
              surname: data.surname,
              name: data.name,
              company: data.company,
              email: data.email,
              phone: data.phone,
              description: data.description
            });
          }
        });
    return sortedAddresses;
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
          addressId = key;
          this.db.object('address/' + addressId).remove();
        }
      });
  }

  public async saveAddress(node) {
    let addressData;
    let displayName;

    if (node.company) {
      displayName = node.company;
    } else {
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
    return await this.db.list('address').push(addressData)
      .then((ref => {
        data = {
          title: 'Daten gespeichert',
          message: 'Die eingegebene Adresse wurde erfolgreich gespeichert.',
          type: 'success',
          timeout: 3000,
          primaryButton: {name: 'Ok'}
        }
        this.overlay.openDialog(data);
        this.savedKey = ref.key;
        return this.savedKey;
      })).catch((error) => {
        data = {
          title: 'Fehler',
          message: 'Die eingegebene Adresse konnte nicht gespeichert werden.',
          type: 'error',
          primaryButton: {name: 'Ok'}
        }
        this.overlay.openDialog(data);
        return '';
      });
  }

  getAllUsers() {
    let sortedUsers = [];
    this.db.database.ref('admin').orderByChild('username')
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (data) {
            sortedUsers.push({
              id: key,
              uid: data.uid,
              username: data.username,
              admin: data.admin
            });
          }
        });
    return sortedUsers;
  }

  checkAdmin() {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    let isAdmin: boolean = false
    this.db.database.ref('admin')
      .on('child_added',
        snap => {
          const data = snap.val();
          if (data.uid === uid && data.admin) {
            isAdmin = data.admin;
          }
        });
    return isAdmin;
  }

  checkAdminWithUid(uid) {
    let isAdmin: boolean = false
    this.db.database.ref('admin/' + uid)
      .on('value',
        snap => {
          const data = snap.val();
          if (data.admin) {
            isAdmin = data.admin;
          }
        });
    return isAdmin;
  }
}

import {Address} from "./address/addresses";
import {Subject} from "rxjs";

export class GlobalComponents {
  public clientAddressChange = new Subject<number>();
  private clientAddress: Address[];
  private isCompEmpty: number;

  setAddress(address: Address) {
    this.clientAddress = [];
    this.clientAddress.push(address);
  }

  getAddress() {
    return this.clientAddress;
  }
}

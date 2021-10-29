import {Address} from "./address/addresses";
import {Subject} from "rxjs";
import {Article} from "./add-order/article";

export class GlobalComponents {

  public addressChange = new Subject<number>();
  private clientAddress: Address[];
  public orderArticleChange = new Subject<number>();
  private orderArticle: Article[];
  public coordsChange = new Subject<number>();

  setAddress(address: Address) {
    this.clientAddress = [];
    this.clientAddress.push(address);
  }

  getAddress() {
    return this.clientAddress;
  }

  setArticle(order: Article) {
    this.orderArticle = [];
    this.orderArticle.push(order);
  }

  getArticle() {
    return this.orderArticle;
  }
}

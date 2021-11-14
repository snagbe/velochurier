import {Address} from "./address/addresses";
import {Subject} from "rxjs";
import {Article} from "./add-order/article";

export class GlobalComponents {

  public addressChange = new Subject<number>();
  private clientAddress: Address[];
  public orderArticleChange = new Subject<number>();
  private orderArticle: Article[];

  /**
   * puts customer information into the "clientAddress" array
   * @param address the customer information
   */
  setAddress(address: Address) {
    this.clientAddress = [];
    this.clientAddress.push(address);
  }

  /**
   * returns the "customer" array
   */
  getAddress() {
    return this.clientAddress;
  }

  /**
   * puts article information into the "orderArticle" array
   * @param order the article information
   */
  setArticle(order: Article) {
    this.orderArticle = [];
    this.orderArticle.push(order);
  }

  /**
   * returns the "article" array
   */
  getArticle() {
    return this.orderArticle;
  }
}

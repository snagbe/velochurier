import {Inject, Injectable, LOCALE_ID, PLATFORM_ID} from "@angular/core";
import {NativeDateAdapter} from "@angular/material/core";
import {getLocaleFirstDayOfWeek} from "@angular/common";

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  constructor(
    @Inject(LOCALE_ID) public locale,
    @Inject(PLATFORM_ID) platformId
  ) {
    super(locale, platformId);
  }

  /**
   * Sets the first day of the week to Monday
   */
  getFirstDayOfWeek() {
    return getLocaleFirstDayOfWeek(this.locale);
  }
}

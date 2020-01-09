import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CustomNotification} from '../../interfaces/customNotification';

@Injectable({
  providedIn: 'root'
})
export class CustomAlertService {

  public notificationToDisplay: BehaviorSubject<CustomNotification> = new BehaviorSubject<CustomNotification>(null);

  constructor() { }

  public setNotification(notification: CustomNotification): void {
    this.notificationToDisplay.next(notification);
  }

  public getNotification(): Observable<CustomNotification> {
    return this.notificationToDisplay.asObservable();
  }
}

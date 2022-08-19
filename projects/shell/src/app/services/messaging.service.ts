import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/messaging';

import { environment } from '../environments/environment';

import { BehaviorSubject } from 'rxjs';
import { MainConfigService } from './main-config.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class MessagingService {
  displayToken: string;
  constructor(
    private http: HttpClient,
    private mainconfig: MainConfigService,
    private swPush: SwPush
  ) {}

  // requestPermission() {
  //   this.angularFireMessaging.requestToken.subscribe(
  //     (token) => {
  //       console.log(token);
  //       const data = {
  //         username: this.mainconfig.username,
  //         company_id: this.mainconfig.company_id,
  //         token: token
  //       };
  //       this.http.post(this.mainconfig.API_URL + '/fcm/save-fcm-token', data, httpOptions).subscribe();
  //     },
  //     (err) => {
  //       console.error('Unable to get permission to notify.', err);
  //     }
  //   );
  // }

  // receiveMessage() {
  //   this.angularFireMessaging.messages.subscribe( (payload) => {
  //     console.log('new message received. ', payload);
  //     this.currentMessage.next(payload);
  //   });
  // }

  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.mainconfig.VAPID_PUBLIC_KEY,
      })
      .then(sub => {
        // console.log('sub: ', sub);
        const data = {
          username: this.mainconfig.username,
          company_id: this.mainconfig.company_id,
          push_subscription: sub,
        };
        // console.log('data: ', data);
        return this.http
          .post(
            this.mainconfig.API_URL +
              '/push-subscription/save-user',
            data,
            httpOptions
          )
          .subscribe();
      })
      .catch(err =>
        console.error('Could not subscribe to notifications', err)
      );

    // const messaging = firebase.messaging();
    // messaging.requestPermission()
    //   .then(() => messaging.getToken().then(token => {
    //     console.log(token);
    //     const data = {
    //       username: this.mainconfig.username,
    //       company_id: this.mainconfig.company_id,
    //       token: token
    //     };
    //     this.http.post(this.mainconfig.API_URL + '/fcm/save-fcm-token', data, httpOptions).subscribe();
    //   }))
    //   .catch(err => {
    //     console.log('Unable to get permission to notify.', err);
    //   });

    this.swPush.messages.subscribe(response => {
      console.log('notificationMessage: ', response);
    });

    this.swPush.notificationClicks.subscribe(response => {
      console.log('notificationClick! ', response);
    });
  }

  triggerPushNotification() {
    return this.http.post(
      this.mainconfig.API_URL + '/push-subscription/push-notification',
      { username: this.mainconfig.username },
      httpOptions
    );
  }

  customPushNotification(data) {
    return this.http.post(
      this.mainconfig.API_URL + '/push-subscription/push-notification-message',
      { username: this.mainconfig.username, ...data},
      httpOptions
    );
  }

  specificPushNotification(data) {
    return this.http.post(
      this.mainconfig.API_URL + '/push-subscription/push-notification-message-specific',
      { username: this.mainconfig.username, ...data},
      httpOptions
    );
  }
}

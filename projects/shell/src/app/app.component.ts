import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

import 'firebase/messaging';

import { SwUpdate, SwPush } from '@angular/service-worker';
import { from } from 'rxjs/internal/observable/from';
import { interval } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { OfflineOnlineHttpHandler } from './services/offline-online-http-handler.service';
import { InternetConnectionStatusService } from './services/internet-connection-status/internet-connection-status.module';
import { MainConfigService } from './services/main-config.service';

export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  subscriptionList = [];

  ConnectionStatus: string;
  isConnected = true;

  constructor(private mainconfig: MainConfigService,
    private router: Router,
    private swUpdate: SwUpdate,
    private zone: NgZone,
    private ConnectionService: InternetConnectionStatusService,
    private offlineonlinehttphandler: OfflineOnlineHttpHandler,

    ) {

    if (swUpdate.isEnabled) {
      console.log('Checking for updates!');

      interval(10 * 60 * 1000).subscribe(data => {
        from(swUpdate.checkForUpdate()).subscribe(() => {
          console.log('Updates Checked!');
        });
      });

      from(swUpdate.checkForUpdate()).subscribe(() => {
        console.log('Updates Checked!');
      });

      swUpdate.available.subscribe(() => {
        alert('New updates downloaded! Refreshing!');
        this.router.navigate(['/']);
        this.mainconfig.loggedInStatus = 0;
        this.mainconfig.authorized_page = {};
        window.location.reload();
      });
    }

    this.mainconfig.checkVersion();

    this.router.events.subscribe((event) => {
      // console.log('environment[production]==>',environment['production']);

      ///////////////////// IF INI BIKIN ERROR REROUTING DARI LEMPARAN EMAIL////////////////////////
      // if ( environment['production'] === true && event instanceof NavigationStart) {
      //   browserRefresh = !router.navigated;
      // } else {
      //   browserRefresh = router.navigated;
      // }
      ///////////////////// IF INI BIKIN ERROR REROUTING DARI LEMPARAN EMAIL////////////////////////

      if (event instanceof NavigationStart){
        browserRefresh = !router.navigated;
      }

      if (event instanceof NavigationEnd) {
        console.log('url: ', event['url']);
        this.mainconfig.currentURL = event['url'];
      }

    });

    this.offlineonlinehttphandler.checkAndProcessQueueRequest().then();

    this.ConnectionService.monitor(false).subscribe(isConnected =>  {
      this.isConnected = isConnected['hasNetworkConnection'];
      if(this.isConnected){
        this.ConnectionStatus = 'ONLINE';
        this.mainconfig.connection_status = true;
        this.offlineonlinehttphandler.checkAndProcessQueueRequest().then();
      } else {
        this.ConnectionStatus = 'OFFLINE';
        this.mainconfig.connection_status = false;
      }
      alert(`Your connection status is ${this.ConnectionStatus}`);
    });

    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        if (this.isConnected) {
          this.offlineonlinehttphandler.checkAndProcessQueueRequest().then();
        }
      }, (1000 * 60 * 10));
    });
  }

  // constructor(swUpdate: SwUpdate, swPush: SwPush) {
  //   swUpdate.available.subscribe(_ => swUpdate.activateUpdate().then(() => {
  //     console.log('reload for update');
  //     document.location.reload();
  //   }));
  //   swPush.messages.subscribe(msg => console.log('swPush message', msg));
  //   swPush.notificationClicks.subscribe(click => console.log('notification click', click));
  //   if (!firebase.apps.length) {
  //     firebase.initializeApp(environment.firebase);
  //     navigator.serviceWorker.getRegistration().then(swr => firebase.messaging().useServiceWorker(swr));
  //   }
  // }

  ngOnInit() {
  }

  ngOnDestroy() {
    for (const eachSubscription of this.subscriptionList) {
      eachSubscription.unsubscribe();
    }
  }

}

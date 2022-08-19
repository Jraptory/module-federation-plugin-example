import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MainConfigService } from './main-config.service';
import { Socket } from 'ngx-socket-io';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable()
export class SocketOne extends Socket {
  constructor(private mainconfig: MainConfigService) {
    // super({
    //   url: 'http://' + mainconfig.config['restaurantPrintServerIP'] + ':3001',
    //   options: {},
    // });
    super({ url: 'http://localhost:3001', options: { reconnection: false } });
  }
}

@Injectable({
  providedIn: 'root',
})
export class SocketIOService {
  constructor(
    private socket: SocketOne,
    private mainconfig: MainConfigService,
    private http: HttpClient
  ) {}
  updateStatus = this.socket.fromEvent<any>('updateStatus');
  updateBulkStatus = this.socket.fromEvent<any>('updateBulkStatus');
  updateWeight = this.socket.fromEvent<any>('updateWeight');

  getStatus(): any {
    console.log('getStatus');
    this.http
      .post(this.mainconfig.API_URL + '/check-token', '', httpOptions)
      .subscribe((response) => {
        console.log(response);
        if (response['statusCode'] !== 'Token invalid!') {
          this.socket.emit('getStatus', { id: 'get Status from client!' });
        }
        return response;
      });
  }

  newStatus(element): any {
    console.log('newStatus');
    this.http
      .post(this.mainconfig.API_URL + '/check-token', '', httpOptions)
      .subscribe((response) => {
        console.log(response);
        if (response['statusCode'] !== 'Token invalid!') {
          this.socket.emit('newStatus', element);
        }
        return response;
      });
  }

  getBulkStatus(payload): any {
    this.http
      .post(this.mainconfig.API_URL + '/check-token', '', httpOptions)
      .subscribe((response) => {
        console.log(response);
        if (response['statusCode'] !== 'Token invalid!') {
          this.socket.emit('getBulkStatus', payload);
        }
        return response;
      });
  }

  newBulkStatus(payload): any {
    this.http
      .post(this.mainconfig.API_URL + '/check-token', '', httpOptions)
      .subscribe((response) => {
        console.log(response);
        if (response['statusCode'] !== 'Token invalid!') {
          this.socket.emit('newBulkStatus', payload);
        }
        return response;
      });
  }

  // weight(payload): any {
  //   this.http
  //     .post(this.mainconfig.API_URL + '/check-token', '', httpOptions)
  //     .subscribe((response) => {
  //       console.log({ 'check token': response });
  //       if (response['statusCode'] !== 'Token invalid!') {
  //         this.socket.emit('weight', payload);
  //       }
  //       return response;
  //     });
  // }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MainConfigService } from '../main-config.service';
import { Dexie } from 'dexie';
import * as moment from 'moment';
import { from } from 'rxjs';

interface RequestQueue {
  id?: number;
  company_id: string,
  site: string,
  document_type: Number,
  request: string;
  created_time: Date;
  status: Number; // 0: canceled, 1: waiting for online, 2: processed done!
  response?: string;
  last_updated: Date;
  try_count: Number;
  http_options: string;
}

interface CachedRequest {
  id?: number;
  request: string;
  response: string;
  created_time: Date;
  last_updated: Date;
}

export class OfflineOnlineHttpHandlerDatabase extends Dexie {
  public requestQueue: Dexie.Table<RequestQueue, number>; // id is number in this case
  public cachedRequest: Dexie.Table<CachedRequest, number>; // id is number in this case

  public constructor() {
    super("offline-online-http-handler");
    this.version(1).stores({
      request_queue: "++id, company_id, site, document_type, request, created_time, response, status, last_updated, try_count, http_options",
      cached_request: "++id, request, response, created_time, last_updated"
    });
    this.requestQueue = this.table("request_queue");
    this.cachedRequest = this.table("cached_request");
  }
}

@Injectable({
  providedIn: 'root',
})

export class OfflineOnlineHttpHandler {
  constructor(
    private http: HttpClient,
    private mainconfig: MainConfigService
  ) { }

  offlineOnlineHTTPhandlerDBRef = new OfflineOnlineHttpHandlerDatabase();

  HTTPPostRequest(
    url,
    body,
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    },
    queueData = {
      document_type: 0,
    },
    config = {
      enableQueue: 0,
      enableCache: 0
    }
  ) {

    const queueDataContainer = {
      document_type: 0
    };

    const queueDataKeys = Object.keys(queueData);

    for (const eachKey of queueDataKeys) {
      queueDataContainer[eachKey] = queueData[eachKey];
    }


    const configContainer = {
      enableQueue: 0,
      enableCache: 0
    }

    const configKeys = Object.keys(config);

    for (const eachKey of configKeys) {
      configContainer[eachKey] = config[eachKey];
    }

    const request = JSON.stringify({
      url: url,
      body: body
    });

    if (this.mainconfig.connection_status) { // jika ONLINE
      return this.http.post(url, body, httpOptions).pipe(
        map((data) => {
          from(this.cacheHTTPRequest(request, JSON.stringify(data))).subscribe();
          return data;
        })
      );
    } else { // jika OFFLINE
      if (configContainer['enableQueue']) {// jika QUEUE dihidupkan
        return from(this.queueRequest(request, httpOptions, queueDataContainer['document_type'])).pipe(map((response) => {
          return {
            statusCode: 1,
            queuedFlag: 1,
            message: 'OFFLINE! Data diqueue!'
          }
        }));

      }

      if (configContainer['enableCache']) { // jika CACHE dihidupkan
        return from(this.queryCachedHTTPRequest(request)).pipe(map((response) => { // query response yg sudah dicache
          return response
        }));
      }
    }
  }

  async cacheHTTPRequest(request, response) {

    const anyPreviouslyCachedRequest = await this.offlineOnlineHTTPhandlerDBRef.cachedRequest.get({ request: request });
    // console.log('anyPreviouslyCachedRequest: ', anyPreviouslyCachedRequest);
    if (anyPreviouslyCachedRequest) {
      const updated = await this.offlineOnlineHTTPhandlerDBRef.cachedRequest.update(
        anyPreviouslyCachedRequest['id'],
        {
          request: request,
          response: response,
          last_updated: moment().toDate()
        }
      );
    } else {
      const added = await this.offlineOnlineHTTPhandlerDBRef.cachedRequest.add({
        request: request,
        response: response,
        last_updated: moment().toDate(),
        created_time: moment().toDate()
      });
    }

    return { statusCode: 1, message: 'stored!' };
  }

  async queryCachedHTTPRequest(request) {
    const anyPreviouslyCachedRequest = await this.offlineOnlineHTTPhandlerDBRef.cachedRequest.get({ request: request });
    // console.log('anyPreviouslyCachedRequest: ', anyPreviouslyCachedRequest);
    if (anyPreviouslyCachedRequest) {
      return { statusCode: 1, data: JSON.parse(anyPreviouslyCachedRequest['response']) };
    } else {
      return { statusCode: 0, message: 'No cached!' }
    }
  }

  async queueRequest(request, httpOptions: { headers: HttpHeaders }, document_type = 0,) {
    const processedHTTPOptions = [];

    for (const eachKey of httpOptions['headers'].keys()) {
      const eachHTTPOption = {
        k: eachKey,
        v: httpOptions['headers'].get(eachKey)
      };

      processedHTTPOptions.push(eachHTTPOption);
    }

    const updated = await this.offlineOnlineHTTPhandlerDBRef.requestQueue.add({
      company_id: this.mainconfig.company_id,
      site: this.mainconfig.site,
      document_type: document_type,
      request: request,
      created_time: moment().toDate(),
      status: 1,
      last_updated: moment().toDate(),
      try_count: 0,
      http_options: JSON.stringify(processedHTTPOptions)
    });
    return updated;
  }

  getQueueRequest(condition) {
    return from(this.offlineOnlineHTTPhandlerDBRef.requestQueue.get(condition));
  }

  async checkAndProcessQueueRequest() {
    // console.log('checkCount!');
    let queueCount = -1;
    while (queueCount !== 0 && this.mainconfig.connection_status) {
      const response = await this.offlineOnlineHTTPhandlerDBRef.requestQueue.where('status').equals(1).toArray()
      // console.log('checkAndProcessQueueRequest firstQuery: ', response.length);
      queueCount = response.length;
      for (const eachRequest of response) {
        const { url, body } = JSON.parse(eachRequest['request']);
        const httpOptionsRaw = JSON.parse(eachRequest['http_options']);

        const httpHeaders = {};

        for (const eachHTTPOptions of httpOptionsRaw) {
          httpHeaders[eachHTTPOptions['k']] = eachHTTPOptions['v'];
        }

        const eachHTTPOptions = {
          headers: new HttpHeaders(httpHeaders)
        };
        // console.log('eachHTTPOptions: ', eachHTTPOptions);

        const eachResponse = await this.http.post(url, body, eachHTTPOptions).toPromise();
        const updated = await this.offlineOnlineHTTPhandlerDBRef.requestQueue.update(eachRequest['id'], { status: 2, response: JSON.stringify(eachResponse) });
      }
    }
  }
}

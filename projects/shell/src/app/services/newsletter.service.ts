import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MainConfigService } from './main-config.service';

@Injectable()
export class NewsletterService {
	constructor(
		private http: HttpClient,
		private mainconfig: MainConfigService
	) {}

	addPushSubscriber(sub: any) {
		console.log(sub);
		return this.http.post(
			this.mainconfig.API_URL + '/push-subscription/save-user',
			sub
		);
	}

	send() {
		return this.http.post('/api/newsletter', null);
	}
}

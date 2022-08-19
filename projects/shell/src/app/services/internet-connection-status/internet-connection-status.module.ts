import {NgModule} from '@angular/core';
import {ConnectionServiceOptions, ConnectionServiceOptionsToken, InternetConnectionStatusService} from './internet-connection-status.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [InternetConnectionStatusService]
})
export class ConnectionServiceModule {
}

export {
  InternetConnectionStatusService,
  ConnectionServiceOptionsToken,
  ConnectionServiceOptions
};

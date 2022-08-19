import { Location } from '@angular/common';
import { Injectable, OnInit } from '@angular/core';
import {
  Observable,
  of,
  BehaviorSubject,
  Subject,
  Subscriber,
  concat,
  forkJoin,
} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router, ActivationStart } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { UntypedFormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { environment } from './../environments/environment';
import { version } from './../version';
import { SnackbarComponent } from './components/snackbar/snackbar.module';
import { VoidConfirmModalComponent } from './components/void-confirm-modal/void-confirm-modal.module';
import { Country, State, City }  from 'country-state-city';
import * as moment from 'moment';
import { BdcWalkService } from 'bdc-walkthrough';
import { escapeRegExp } from 'lodash';
import { PriedsModalDialogModalComponent } from './components/prieds-modal-dialog/prieds-modal-dialog-modal/prieds-modal-dialog-modal.component';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(form.invalid || control.invalid);
  }
}
@Injectable({
  providedIn: 'root',
})
export class MainConfigService {
  hostname = '';
  // API_URL = 'https://hayamikreasi.prieds.com:3005';
  API_URL = 'http://localhost:3000';
  // API_URL = 'https://api.prototype.prieds.com/dev';
  // API_URL = 'https://prototype-a.prieds.com:3010';
  // API_URL = 'http://10.1.80.144:3000';
  // API_URL = 'https://warunglinda.prieds.com:3011';
// API_URL = 'https://fxcxgim456.execute-api.ap-southeast-1.amazonaws.com/dev';
  // API_URL = 'https://api.test.gifusouvenir.com/dev';

  // API_URL = 'https://api.sunterbp.com/prod';
  // API_URL = 'https://api.erp.prieds.com/prod';
  ACCURATE_API_URL = 'http://52.76.233.12:3400'; //Env Testing
  API_RFID_STATIC = 'http://localhost:8080';

  REPORT_API_URL = 'https://api.prototype.prieds.com/report';
  EXPORT_IMPORT_API_URL = 'https://api.prototype.prieds.com/export-import'

  UPLOAD_URL = 'https://api.prototype.prieds.com/upload';
  RESOURCE_URL =
    'https://prototype-prieds-assets.s3-ap-southeast-1.amazonaws.com/';
  RESPONSE_RESOURCE_URL = 'https://prototype-prieds-assets.s3.ap-southeast-1.amazonaws.com'
  // SYSTEM
  loggedInStatus = 0;
  rememberUser = 1;
  username = '';
  name = '';
  contact_no = '';
  email = '';
  site = '';
  current_site = '';
  system = '';
  company = '';
  company_id = '';
  authorized_page: any = {};
  password_regex = '^(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[0-9].*)[A-Za-z0-9]{8,}$';
  token = '';
  role = '';
  session_id = '';
  login_time = moment();

  authorization: any = {};
  config: any = {};
  configArray: any = {};

  companyAuthorization: any = {};
  companyConfig: any = {};
  companyConfigArray: any = {};

  siteAuthorization: any = {};
  siteConfig: any = {};
  siteConfigArray: any = {};

  roleAuthorization: any = {};
  roleConfig: any = {};
  roleConfigArray: any = {};

  site_list = [];
  authorized_system = [];
  company_authorized_system = [];
  site_authorized_system_list = [];
  site_authorized_system = [];
  role_authorized_system = [];

  site_address_1 = '';
  site_address_2 = '';
  site_address_3 = '';
  site_address_4 = '';

  //! MULTI TAB
  tabs = [];
  addTabMultiTabInterfaceBehaviorSubject = new BehaviorSubject<any>({});
  clearTabMultiTabInterfaceBehaviorSubject = new BehaviorSubject<any>({});
  maximumTabs = 10;
  //! END OF MULTI TAB

  focusKeyboard = false;

  readonly VAPID_PUBLIC_KEY =
    'BDlFmX-DHpyMLX454Cuqp05ZXMYkwP8VvnxIa7cwrPYuKtznfKdv0JdAhJJHsisgneJrMBBuQ3eaZiSEuGfek1A';
  resourceURL = '';
  routes = [];
  routeData = {};
  menu = [];

  currentPath = '';
  currentCategory = '';
  currentSubCategory = '';

  currentURL = '';

  outdated = 0;

  API_version = {
    version_1: 0,
    version_2: 0,
    version_3: 0,
  };

  company_site_list = [];
  menu_list = [];

  ppn = 0.11; // 11%
  ppn_divider = 1 + this.ppn; // 111%
  pph = 0.02; // 2%
  pph42 = 0.1; // 10%
  pph21 = 0.025 // 2.5%
  materai = 10000 // materai Rp. 100000
  current_language = 'en'; // 'id' = Bahasa Indonesia , 'en' = Bahasa English

  maxByte = 3000000;

  // tslint:disable-next-line: no-use-before-declare
  matcher = new MyErrorStateMatcher();

  systemList = ['ALL', 'ADMIN', 'OMS', 'SMRBS', 'JMS-BP', 'DMS'];
  putaway_status = ['Waiting', 'In Progress', 'Has Been Put', 'Cancelled'];

  // OMS
  salesman_code = '';
  salesman_code_list = [];

  buyer_code = '';
  buyer_code_list = [];

  attribute_list = {}; // consists of attributes and its list.
  customerList = [];
  supplierList = [];
  customer_salesman_codeList = [];
  product_list: any = {
    sku: [],
    description: [],
  };

  item_days_considerd_as_new = 14;

  status_item_request = [
    'Disabled',
    'Waiting Of Approval',
    'Approved',
    'Rejected',
    'Partially Fulfilled',
    'Fully Fulfilled',
  ];

  status_Ticket = ['Waiting Check', 'Done', 'In Progress'];
  transaction_type=['LOAN','RENTAL','BUY','BACKUP'];
  payment=['TUNAI','TRANSFER','FREE'];
  rental_mode = ['Monthly Check', 'Pergantian Mesin', 'Sewa 1/2 Bulan'];
  cost_type = ['', 'Update', 'Additional'];
  service_status_lmk=['Kopi LMK','Tidak Kopi LMK'];

  status_apd = ['Sangat Aman', 'Aman', 'Kekurangan', 'Tak Ada Stock'];

  status_donatur = [
    'DONASI BARU!',
    'RS Sudah Mengontak Donatur',
    'Donasi Sudah Diterima',
  ];

  status_STO = [
    'Canceled',
    'Waiting for Approval',
    'Partial Approve',
    'Waiting for Dispatch',
    'Dispatched',
    'Received',
  ];

  connection_status = true;

  // SMRBS
  book_count = 0;
  room = '';
  booking_id = '';

  // DISPLAY DASHBOARD
  showMenuButton = true;
  showSideNav = true;
  showNavBar = true;

  selectedTabWarehouseDashboard = new UntypedFormControl(0);

  currencyList = [
      {
          value: 'AUD',
          description: 'Australian Dollar',
          symbol: '$',
      },
      {
        value: 'EUR',
        description: 'Euro',
        symbol: '€',
      },
      {
          value: 'GBP',
          description: 'Great Britain Poundsterling',
          symbol: '£',
      },
      {
          value: 'IDR',
          description: 'Indonesia Rupiah',
          symbol: 'Rp.',
      },
      {
          value: 'JPY',
          description: 'Japanese Yen',
          symbol: '¥',
      },
      {
          value: 'CNY',
          description: 'Chinese Yuan',
          symbol: '¥',
      },
      {
          value: 'USD',
          description: 'US Dollar',
          symbol: '$',
      },
      {
          value: 'SGD',
          description: 'Singapore Dollar',
          symbol: '$'
      },
  ];

  company_tier_list = [];

  mainChartSite = new BehaviorSubject<any>('');

  // ALL SYSTEM

  content_landing_page = [];
  slider_landing_page = [];

  // ALL SYSTEM

  // OMS

  supplier_type = ['BAHAN', 'CMT', 'SABLON', 'JAHIT'];
  term_of_payment = [
    'NET0',
    'NET15',
    'NET30',
    'NET45',
    'NET60',
    'NET75',
    'NET90',
  ];
  retur_type = ['Barang Rusak', 'Barang Sisa Serian', 'Barang Utuh'];
  expenses_type = ['RENT', 'SALARY', 'FUEL', 'ACCOMODATION', 'OTHER'];
  take_payment_method = [
    'TRANSFER BCA',
    'TRANSFER MANDIRI',
    'GIRO BCA PT',
    'GIRO BCA PD',
    'TRANSFER BRI',
    'CHECK',
    'CASH',
  ];
  paid_by = ['PD', 'PT'];

  documents_Format = {
    PO: ['document_type', 'site', 'time', 'salesmancodeandcount', 'status'],
    SO: ['document_type', 'site', 'time', 'salesmancodeandcount', 'status'],
    DO: ['document_type', 'site', 'time', 'salesmancodeandcount', 'status'],
    time_format: 'YYMM',
  };

  POS_payment_method = ['CASH', 'DEBIT', 'KREDIT', 'GO-PAY', 'OVO'];
  payment_method = ['Cash', 'Kredit', 'Transfer', 'Debit', 'Bon', 'Giro'];
  term_of_payment_list = [
    'NET0',
    'NET15',
    'NET30',
    'NET45',
    'NET60',
    'NET75',
    'NET90',
    'Custom',
  ];

  attribute_key_list = ['type', 'size', 'model'];

  existing_attribute_key_list = [];

  explodedAttribute = 'size';
  status_rental = ['NOT ACTIVE', 'ACTIVE'];
  invoice_status = ['Void', 'Hutang', 'Lunas', 'Lebih Bayar'];
  voucher_status = ['Void', 'Created'];

  activity_type = ['Create', 'Process', 'Delete', 'Close'];

  account_event_type = [
    'Sales',
    'Purchase',
    'Transfer',
    'Kasih Pinjaman',
    'Terima Pinjaman',
    'VOID',
    'Revision',
    'Bayar Hutang',
    'Bayar Piutang',
    'Expense',
    'Take Payment',
    'Pay Bills',
    'Production',
    'Stock Adjustment',
    'Pemodalan',
    'Stock Transfer',
    'Replace Stock',
    'Project Progress',
    'Adjusting Entries',
    'Petty Cash Voucher',
    'Reimbursement',
    'Rental Order',
    'Expedition',
    'Depreciation',
  ];

  stock_activity_type = [
    'Create',
    'Delete',
    'Close',
    'VOID',
    'Dispatch',
    'STOCKOPNAME',
    'INBOUND',
    'Revision',
    'STO',
    '',
    'Production',
    '',
    '',
    '',
    'Cart SO',
    'Direct Purchase Service',
    '',
    '',
    '',
    '',
    '',
    'Sales Return',
    '',
    '',
    '',
    'Material Usage',
    '',
  ];

  OMS_status = {
    PO: [
      'Deleted',
      'new PO',
      'SO partially created',
      'SO fully created',
      'SO Cancelled',
      'VOID'
    ],
    SO: [
      'Deleted',
      'Waiting Approval',
      'SO Approved',
      'DO partially created',
      'DO fully created',
      'DO Cancelled',
      'SO closed',
      'VOID'
    ],
    DO: ['Deleted', 'Created', 'Dispatched', 'Received', 'Undispatched', 'VOID'],
    INV: ['VOID', 'HUTANG', 'LUNAS'],
    ItemDelivery: ['Not sent', 'Partially sent', 'Sent'],
    itemOrderType: ['Normal', 'Indent'],
    inboundStatus: ['Deleted', 'Done', 'Need Approval'],
    PurchaseStatus: ['Deleted', 'PO Awaiting Approval', 'PO Approved', 'PO Rejected', 'PO Done'],
    StatusInbound: ['Not Inbound Yet', 'Partially Inbound', 'Fully Inbound', 'Void'],
    StatusInvoice: ['Not Invoice Yet', 'Partially Invoice', 'Fully Invoice', 'Void'],
    PPNMode: [
      'Non PPN',
      'PPN',
      'PPN Included',
    ],
    stockOpname : [
      'Disabled',
      'Created',
      'Waiting Approval',
      'Approved',
    ]
  };

  // ===============================================
  /* !PRIMARY COLORS */
  /* PRIMARY BLUE */
  blue_10 = '#EBFAFF';
  blue_40 = '#9de0f5';
  blue_50 = '#28b8e2';
  blue_60 = '#186e87';
  blue_80 = '#104c5e';

  /* NEUTRAL */
  black_5  = '#f8f8f8';
  black_10 = '#eaecec';
  black_40 = '#c4c8c9';
  black_50 = '#868b8c';
  black_60 = '#53595b';
  black_80 = '#283133';

  /* !SECONDARY COLORS */
  /* GREEN */
  green_10 = '#e6fbef';
  green_50 = '#15d667';
  green_80 = '#069744';

  /* YELLOW */
  yellow_10 = '#fff7db';
  yellow_50 = '#f6c204';
  yellow_80 = '#a68309';

  /* RED */
  red_10 = '#ffece0'
  red_50 = '#e16216'
  red_80 = '#9d440f'

  /* PURPLE */
  purple_10 = '#f1e9fd';
  purple_50 = '#7725ef';
  purple_80 = '#4c1799';

  // ===============================================

  sku_status = ['Disabled', 'Active'];

  order_type = ['Normal', 'Indent'];

  expeditionList = [];

  enableChangesAmount = false;
  enablePaidAmount = false;

  page_setting_list = {};

  sku_type = [
    'Raw Material',
    'Finished Goods',
    'Spareparts',
    'WIP',
    'Machine/Tools',
    'Service Expenses',
    'Design',
    'Waste',
    'Service Production',
    'Assets'
  ];

  project_type = ['Building', 'Construction', 'Support'];

  /* data from front-end-expedition */
  bookingSearch = {
    route_name: '',
    bookingTo: '',
    bookingDate: '',
    bookingUnit: '',
    schedule_customer_umum: '',
    shipName: '',
    voyage: '',
    email: '',
  };
  // END OMS --------------------------------------------------------------------------------------------------------------------------------------------

  // JMS-BP ---------------------------------------------------------------------------------------------------------------------------------------------
  sparepart_status = ['Belum Tersuplai', 'Sebagian Tersuplai', 'Tersuplai'];

  itemPekerjaan = [
    {
      name: 'All Body',
      type: 0, // 0: single, 1: left and right
      score: 13,
      bypass_calculation: 0,
      parent: 1,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Bumper Depan',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Pintu Depan',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Pintu Belakang',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Fender',
      type: 1, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Quarter',
      type: 1, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Bumper Belakang',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Roof',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Kap Mesin',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Bagasi / Backdoor',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Kaca Depan',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Kaca Belakang',
      type: 0, // 0: single, 1: left and right
      score: 1,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Spoiler FR',
      type: 0, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Spoiler RR',
      type: 0, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Spoiler Backdoor',
      type: 0, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Cover Ban Serep',
      type: 0, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: [],
        center: ['Replace', 'Repair'],
        right: [],
      },
    },
    {
      name: 'Spion',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Cover Fender',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Cover Pintu Belakang',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Cover Quarter',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Cover Rocker',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Cover Spion',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Ext. Bumper Depan',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Ext. Bumper Belakang',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Tanduk RR',
      type: 1, // 0: single, 1: left and right
      score: 0.5,
      bypass_calculation: 0,
      parent: 0,
      buttons: {
        left: ['Replace', 'Repair'],
        center: [],
        right: ['Replace', 'Repair'],
      },
    },
    {
      name: 'Heavy / Towing',
      type: 0,
      score: 0,
      bypass_calculation: 1,
      parent: 2,
      buttons: {
        left: [],
        center: ['H/T'],
        right: [],
      },
    },
    {
      name: 'Estimasi',
      type: 0,
      score: 0,
      bypass_calculation: 1,
      parent: 2,
      buttons: {
        left: [],
        center: ['ESTIMASI'],
        right: [],
      },
    },
  ];

  job_list = [
    {
      name: 'Body Repair',
      short_name: 'B',
    },
    {
      name: 'Preparation',
      short_name: 'Pr',
    },
    {
      name: 'Painting',
      short_name: 'Pa',
    },
    {
      name: 'Polishing',
      short_name: 'Ps',
    },
    {
      name: 'Finishing',
      short_name: 'FI',
    },
    {
      name: 'Tes Jalan',
      short_name: 'TJ',
    },
  ];

  qc = {
    'Body Repair': [
      {
        name: 'Pekerjaan Sesuai Order',
        mandatory: 0,
      },
      {
        name: 'Cek Potensi ADD JOB',
        mandatory: 0,
      },
      {
        name: 'Dent',
        mandatory: 0,
      },
      {
        name: 'Ding',
        mandatory: 0,
      },
      {
        name: 'Stelan',
        mandatory: 0,
      },
      {
        name: 'Bolong',
        mandatory: 0,
      },
      {
        name: 'Tektok',
        mandatory: 0,
      },
      {
        name: 'Poor Grind',
        mandatory: 0,
      },
      {
        name: 'Poor Rust Protection',
        mandatory: 0,
      },
    ],
    Preparation: [
      {
        name: 'Pekerjaan Sesuai',
        mandatory: 0,
      },
      {
        name: 'SPK TAMBAHAN',
        mandatory: 0,
      },
      {
        name: 'Sparepart',
        mandatory: 0,
      },
      {
        name: 'Defect Body',
        mandatory: 0,
      },
      {
        name: 'Wave',
        mandatory: 0,
      },
      {
        name: 'Scratch',
        mandatory: 0,
      },
      {
        name: 'Pinhole',
        mandatory: 0,
      },
      {
        name: 'Chipping',
        mandatory: 0,
      },
      {
        name: 'Over Spray Surfacer',
        mandatory: 0,
      },
      {
        name: 'Ex Rubber',
        mandatory: 0,
      },
      {
        name: 'Cleaning',
        mandatory: 0,
      },
    ],
    Painting: [
      {
        name: 'Pekerjaan Sesuai',
        mandatory: 0,
      },
      {
        name: 'SPK TAMBAHAN',
        mandatory: 0,
      },
      {
        name: 'Sparepart',
        mandatory: 0,
      },
      {
        name: 'Defect Body',
        mandatory: 0,
      },
      {
        name: 'Defect Preparation',
        mandatory: 0,
      },
      {
        name: 'Bleeding',
        mandatory: 0,
      },
      {
        name: 'Lifting',
        mandatory: 0,
      },
      {
        name: 'Blister',
        mandatory: 0,
      },
      {
        name: 'Popping',
        mandatory: 0,
      },
      {
        name: 'O/S PaintCoat',
        mandatory: 0,
      },
      {
        name: 'O/S Charcoal',
        mandatory: 0,
      },
      {
        name: 'Mothling',
        mandatory: 0,
      },
      {
        name: 'Low Gloss',
        mandatory: 0,
      },
      {
        name: 'Wrong Color App',
        mandatory: 0,
      },
      {
        name: 'Wrong Color Mix',
        mandatory: 0,
      },
      {
        name: 'Poor Hiding',
        mandatory: 0,
      },
      {
        name: 'Runs',
        mandatory: 0,
      },
      {
        name: 'FishEye',
        mandatory: 0,
      },
      {
        name: 'Orange Peel',
        mandatory: 0,
      },
      {
        name: 'Dry Coat',
        mandatory: 0,
      },
      {
        name: 'Cleaning',
        mandatory: 0,
      },
    ],
    Polishing: [
      {
        name: 'Pekerjaan Sesuai',
        mandatory: 0,
      },
      {
        name: 'SPK TAMBAHAN',
        mandatory: 0,
      },
      {
        name: 'Sparepart',
        mandatory: 0,
      },
      {
        name: 'Defect Body',
        mandatory: 0,
      },
      {
        name: 'Defect Preparation',
        mandatory: 0,
      },
      {
        name: 'Defect Painting',
        mandatory: 0,
      },
      {
        name: 'Buram',
        mandatory: 0,
      },
      {
        name: 'Botak Poles',
        mandatory: 0,
      },
      {
        name: 'Buffer Scratch',
        mandatory: 0,
      },
      {
        name: 'Sandpapper Scratch',
        mandatory: 0,
      },
      {
        name: 'Chip Polesh & Assembly',
        mandatory: 0,
      },
      {
        name: 'Cleaning',
        mandatory: 0,
      },
    ],
    Finishing: [
      {
        name: 'Pekerjaan Sesuai',
        mandatory: 0,
      },
      {
        name: 'SPK TAMBAHAN',
        mandatory: 0,
      },
      {
        name: 'Sparepart',
        mandatory: 0,
      },
      {
        name: 'Esek No Rangka',
        mandatory: 0,
      },
      {
        name: 'Defect Body',
        mandatory: 0,
      },
      {
        name: 'Defect Preparation',
        mandatory: 0,
      },
      {
        name: 'Defect Painting',
        mandatory: 0,
      },
      {
        name: 'Defect Poles',
        mandatory: 0,
      },
      {
        name: 'Stelan',
        mandatory: 0,
      },
      {
        name: 'Lampu-Lampu',
        mandatory: 0,
      },
      {
        name: 'Mirror/Spion',
        mandatory: 0,
      },
      {
        name: 'Wiper & Washer',
        mandatory: 0,
      },
      {
        name: 'Audio/Radio',
        mandatory: 0,
      },
      {
        name: 'Camera Mundur',
        mandatory: 0,
      },
      {
        name: 'Air Conditioner',
        mandatory: 0,
      },
      {
        name: 'Battery Indicator',
        mandatory: 0,
      },
      {
        name: 'Klakson',
        mandatory: 0,
      },
      {
        name: 'Power Window',
        mandatory: 0,
      },
      {
        name: 'Door Lock',
        mandatory: 0,
      },
      {
        name: 'Alarm',
        mandatory: 0,
      },
      {
        name: 'Momen Baut Ban',
        mandatory: 0,
      },
      {
        name: 'Kebersihan Panel',
        mandatory: 0,
      },
      {
        name: 'Kebersihan Interior',
        mandatory: 0,
      },
    ],
  };

  POS_Status_color = [
    'gray',
    'white',
    'red',
    'yellow',
    'blue',
    'green',
    'darkgreen',
  ];

  status_order_sparepart = ['Belum Order', 'Order Partial', 'Full Order'];

  status_supply_sparepart = ['Belum Supply', 'Partial Supply', 'Full Supply'];

  leadtime_pekerjaan = [
    {
      name: 'Body Repair',
      base: 60,
      increment: 30,
    },
    {
      name: 'Preparation',
      base: 60,
      increment: 60,
    },
    {
      name: 'Painting',
      base: 60,
      increment: 30,
    },
    {
      name: 'Polishing',
      base: 60,
      increment: 60,
    },
    {
      name: 'Finishing',
      base: 60,
      increment: 30,
    },
    {
      name: 'Tes Jalan',
      base: 60,
      increment: 30,
    },
  ];

  // END JMS-BP ----------------------------------------------------------------------------------------------------------------------------------------------

  // Booking
  open_hours = ['Office Hours', 'Full Days'];
  open_days = ['Weekend', 'Weekdays', 'Alldays'];
  category = ['Security', 'Entertainment', 'Energy', 'Support'];
  meeting_type = ['Internal', 'External'];
  bookingStatus = [
    'Cancelled',
    'Approval Pending',
    'Approved',
    'Start',
    'Finish',
  ];
  attendantStatus = ['Absent', 'Lobby', 'Present'];
  work_type = [
    'Additonal Cleaning',
    'Additional Food/Drinks',
    'Room Preparation',
  ];

  // style
  style = {
    layout: ['layout1', 'layout2'],
    'font-size': [
      '9',
      '10',
      '11',
      '12',
      '14',
      '18',
      '20',
      '22',
      '24',
      '28',
      '32',
    ],
    // tslint:disable-next-line: max-line-length
    'font-family': [
      'Courier New, Courier, monospace',
      'Helvetica, Arial, sans-serif',
      'serif',
      'monospace',
      'sans-serif',
      'cursive',
      'fantasy',
    ],
    'font-color': ['white', 'black', 'red', 'green', 'blue'],
    color: [
      'white',
      'black',
      'red',
      'green',
      'blue',
      'yellow',
      'rgb(64,186,210)',
      'rgb(1,195,168)',
      'rgb(250,184,0)',
      'rgb(238,112,9)',
    ],
    // tslint:disable-next-line: max-line-length
    background: [
      'rgb(64,186,210)',
      'rgb(1,195,168)',
      'rgb(250,184,0)',
      'rgb(238,112,9)',
      'rgb(9,9,37)',
      'rgb(30, 137, 209)',
      'rgb(230, 99, 212)',
      'rgb(243, 75, 75)',
    ],
    'background-style': ['cover'],
    'background-image': [
      'url(https://ak4.picdn.net/shutterstock/videos/17912074/thumb/1.jpg)',
      'url(https://image.freepik.com/free-photo/space-reading-education-workspace-empty-white_1421-684.jpg)',
      'url(https://img.freepik.com/free-vector/abstract-network-science-connection-technology_36402-247.jpg?size=626&ext=jpg)',
      'url(https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRADKNEXinSHeBiLVCRc2AJeSKTuyZK8OvWbWZ5fDAj3s7L4GhF)',
      'url(https://image.shutterstock.com/image-illustration/abstract-futuristic-technology-background-fractal-260nw-631104026.jpg)',
      'url(https://images.vexels.com/media/users/3/4546/raw/7261754de66a72c34aa64c7e5cb41d26-red-technology-background.jpg)',
      'url(https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSJXSnofs5X9B3h-Y8FbGDPizx9x5MlpEwlD9kyCif5Pa069-D-)',
      'url(http://www.seekgif.com/uploads/2017/07/dark-blue-backgrounds-image-wallpaper-cave-5.jpeg)',
    ],
  };

  theme: any = {
    header: {
      layout: '',
      'font-family': 'Roboto',
      // 'font-color':'',
      'font-size': '16',
      'background-image':
        'url(http://www.seekgif.com/uploads/2017/07/dark-blue-backgrounds-image-wallpaper-cave-5.jpeg)',
      color: 'white',
      background: 'rgb(9, 9, 37)',
      'background-size': 'cover',
    },
    automation: {
      layout: 'layout1',
      'font-family': 'Roboto',
      // 'font-color':'',
      'font-size': '14',
      fontsizetitle: '20',
      fontsizesubtitle: '18',
      'background-image':
        'url(https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSJXSnofs5X9B3h-Y8FbGDPizx9x5MlpEwlD9kyCif5Pa069-D-)',
      color: 'white',
      background: 'rgb(64,186,210)',
      'background-size': 'cover',
    },
    digitalsignage: {
      layout: 'layout2',
      'font-family': 'Roboto',
      // 'font-color':'',
      'font-size': '14',
      fontsizetitle: '20',
      fontsizesubtitle: '18',
      // tslint:disable-next-line: max-line-length
      'background-image':
        'url(https://img.freepik.com/free-vector/abstract-network-science-connection-technology_36402-247.jpg?size=626&ext=jpg)',
      color: 'white',
      background: 'rgb(9, 9, 37)',
      'background-size': 'cover',
    },
  };

  group = [
    'group1',
    'group2',
    'group3',
    'group4',
    'group5',
    'group6',
    'group7',
    'group8',
    'group9',
    'group10',
    'group11',
  ];

  // style
  countryList = [];
  stateList = [];
  cityList = [];

  nps_survey = 0;

  toggleSideNav() {
    this.showSideNav = !this.showSideNav;
  }

  async updateUserDetails(data) {
    this.loggedInStatus = 1;
    this.username = data.username;
    this.name = data.name;
    this.contact_no = data['contact_no'];
    this.email = data['email'];
    this.company = data['company'];
    this.company_id = data['company_id'];
    this.token = data['token'];

    this.authorized_system = data['authorized_system'];
    this.session_id = data['session_id'];
    this.login_time = data['login_time'];

    // console.log('username: ', this.username);
    // console.log('company_id: ', this.company_id);
    //console.log('dataUpdateUserDetail', data);
    // if (data['rememberUser']) {
    //   this.rememberUser = false;
    // }

    await this.getCompanyData();

    await this.getSiteData();

    await this.getRoleData();

    await this.changeSystem(data['default_system'], 0, 1);

    this.storeCurrentConfig();

    this.mainChartSite.next(this.site);

    if (this.rememberUser === 1) {
      sessionStorage.setItem('token', this.token);

      httpOptions.headers = httpOptions.headers.set(
        'x-access-token',
        this.token
      );
    }

  }

  async changeSystem(system, navigate, use_default) {
    //console.log('systemChange', system);
    this.system = system;
    for (const eachSystem of this.authorized_system) {
      if (eachSystem['system'] === this.system) {
        if (use_default === 1) {
          this.site = eachSystem['default_site'];
        }
        this.site_list = eachSystem['site_list'];
        // console.log(this.site);
        // console.log(this.site_list);
        break;
      }
    }

    this.processAuthorizations();

  if (this.company_authorized_system){
  for (const eachSystem of this.company_authorized_system) {
      if (eachSystem['system'] === this.system) {
        this.processCompanyAuthorizations(eachSystem);
        break;
      }
    }
  } else {
    this.company_authorized_system = [];
  }


    this.processSiteAuthorizationsList();

    for (const eachSystem of this.role_authorized_system) {
      if (eachSystem['system'] === this.system) {
        this.processRoleAuthorizations(eachSystem);
      }
    }

    // console.log('this.companyAuthorization: ', this.companyAuthorization);

    this.storeCurrentConfig();

    if (navigate === 1) {
      this.router.navigate(['/' + this.system]);
    }
  }

  processSiteAuthorizationsList() {
    for (const eachSite of this.site_authorized_system_list) {
      if (eachSite['site'] === this.site) {
        if ('authorized_system' in eachSite) {
          this.site_authorized_system = eachSite['authorized_system'];

          for (const eachSystem of this.site_authorized_system) {
            if (eachSystem['system'] === this.system) {
              this.processSiteAuthorizations(eachSystem);
              break;
            }
          }
        }

        if (!('authorized_system' in eachSite)) {
          this.site_authorized_system = [];
        }
      }
    }
  }

  processAuthorizations() {
    this.authorized_page = {};
    this.authorization = {};
    this.config = {};
    this.salesman_code = null;
    this.salesman_code_list = [];
    this.attribute_key_list = [];
    for (const eachSite of this.site_list) {
      if (eachSite.site === this.site) {
        // console.log(eachSite);
        for (const eachPage of eachSite['authorized_page']) {
          if(!('setting' in eachPage)) {
            eachPage['setting'] = [];
          }
          this.authorized_page[eachPage['name']] = {
            ...eachPage,
          };

        }

        // console.log('this.authorized_page: ', this.authorized_page);

        for (const eachAuthorization of eachSite['authorization']) {
          this.authorization[eachAuthorization['k']] = eachAuthorization['v'];
        }

        for (const eachConfig of eachSite['config']) {
          this.config[eachConfig['k']] = eachConfig['v'];
        }

        for (const eachConfigArray of eachSite['configArray']) {
          this.configArray[eachConfigArray['k']] = eachConfigArray['v'];
        }

        if (this.config['qty_increment']) {
          this.config['qty_increment'] = parseFloat(
            this.config['qty_increment']
          );
        }

        if (this.config['room'] !== '') {
          this.room = this.config['room'];
        }

        if (this.config['default_salesman_code']) {
          this.salesman_code = this.config['default_salesman_code'];
        }

        if (this.configArray['salesman_code']) {
          this.salesman_code_list = this.configArray['salesman_code'];
        }

        if (this.config['default_buyer_code']) {
          this.buyer_code = this.config['default_buyer_code'];
        }

        if (this.configArray['buyer_code_list']) {
          this.buyer_code_list = this.configArray['buyer_code_list'];
        }

        if (this.configArray['attribute_list']) {
          this.attribute_key_list = this.configArray['attribute_list'];
        }

        // console.log('config: ', this.config);
        // console.log('configArray: ', this.configArray);
        // console.log('authorization: ', this.authorization);

        break;
      }
    }
    if (this.authorization['custom_term_of_payment_almegatex'] == 1) {
      this.term_of_payment_list = [
        'NET0',
        'NET7',
        'NET14',
        'NET30',
        'NET45',
        'NET60',
        'NET75',
        'Custom',
      ];
    }
  }

  processCompanyAuthorizations(companyAuthorizationSystemData) {
    this.companyAuthorization = {};
    this.companyConfig = {};
    this.companyConfigArray = {};

    // console.log(companyAuthorizationSystemData);closeAccount

    for (const eachAuthorization of companyAuthorizationSystemData['authorization']) {
      this.companyAuthorization[eachAuthorization['k']] = eachAuthorization['v'];
    }

    for (const eachConfig of companyAuthorizationSystemData['config']) {
      this.companyConfig[eachConfig['k']] = eachConfig['v'];
    }

    for (const eachConfigArray of companyAuthorizationSystemData['config_array']) {
      this.companyConfigArray[eachConfigArray['k']] = eachConfigArray['v'];
    }
  }

  processSiteAuthorizations(siteAuthorizationSystemData) {
    this.siteAuthorization = {};
    this.siteConfig = {};
    this.siteConfigArray = {};

    // console.log(companyAuthorizationSystemData);closeAccount

    for (const eachAuthorization of siteAuthorizationSystemData['authorization']) {
      this.siteAuthorization[eachAuthorization['k']] = eachAuthorization['v'];
    }

    for (const eachConfig of siteAuthorizationSystemData['config']) {
      this.siteConfig[eachConfig['k']] = eachConfig['v'];
    }

    for (const eachConfigArray of siteAuthorizationSystemData['config_array']) {
      this.siteConfigArray[eachConfigArray['k']] = eachConfigArray['v'];
    }

    // console.log('siteAuthorization: ', this.siteAuthorization);
    // console.log('siteConfig: ', this.siteConfig);
    // console.log('siteConfigArray: ', this.siteConfigArray);
  }

  processRoleAuthorizations(roleAuthorizationSystemData) {
    this.roleAuthorization = {};
    this.roleConfig = {};
    this.roleConfigArray = {};

    // console.log(roleAuthorizationSystemData);closeAccount

    for (const eachAuthorization of roleAuthorizationSystemData['authorization']) {
      this.roleAuthorization[eachAuthorization['k']] = eachAuthorization['v'];
    }

    for (const eachConfig of roleAuthorizationSystemData['config']) {
      this.roleConfig[eachConfig['k']] = eachConfig['v'];
    }

    for (const eachConfigArray of roleAuthorizationSystemData['config_array']) {
      this.roleConfigArray[eachConfigArray['k']] = eachConfigArray['v'];
    }
  }

  updateMenu() {
    // this.menu = [];
    // for (const eachPath of this.routes) {
    //   if (this.authorized_page[eachPath.path] === 1) {
    //     const index = this.menu.map(function(e) { return e.category; }).indexOf(eachPath.data.category);
    //     if (index === -1) {
    //       this.menu.push(
    //         {
    //           category: eachPath.data.category,
    //           icon_category: eachPath.data.icon_category,
    //           path:
    //           [
    //             {
    //               path: eachPath.path,
    //               title: eachPath.data.title,
    //               showMenuButton: eachPath.data.showMenuButton,
    //               showSideNav: eachPath.data.showSideNav,
    //               showNavBar: eachPath.data.showNavBar,
    //               icon: eachPath.data.icon
    //             }
    //           ]
    //         }
    //       );
    //     } else {
    //       this.menu[index]['path'].push(
    //         {
    //           path: eachPath.path,
    //           title: eachPath.data.title,
    //           showMenuButton: eachPath.data.showMenuButton,
    //           showSideNav: eachPath.data.showSideNav,
    //           showNavBar: eachPath.data.showNavBar,
    //           icon: eachPath.data.icon
    //         }
    //       );
    //     }
    //   }
    // }

    this.menu = [];
    for (const eachPath of this.routes) {
      if (this.authorized_page[eachPath.path] === 1) {
        const index = this.menu
          .map((e) => e.category)
          .indexOf(eachPath.data.category);
        if (index === -1) {
          const newMenu = {
            category: eachPath.data.category,
            icon_category: eachPath.data.icon_category,
            path: [],
          };
          if (eachPath.data.subCategory) {
            newMenu['path'].push({
              subCategory: eachPath.data.subCategory,
              icon_subCategory: eachPath.data.icon_subCategory,
              path: [
                {
                  path: eachPath.path,
                  title: eachPath.data.title,
                  ...eachPath['data'],
                  // showMenuButton: eachPath.data.showMenuButton,
                  // showSideNav: eachPath.data.showSideNav,
                  // showNavBar: eachPath.data.showNavBar,
                  // icon: eachPath.data.icon,
                },
              ],
            });
          } else {
            newMenu['path'].push({
              path: eachPath.path,
              title: eachPath.data.title,
              ...eachPath['data'],
              // showMenuButton: eachPath.data.showMenuButton,
              // showSideNav: eachPath.data.showSideNav,
              // showNavBar: eachPath.data.showNavBar,
              // icon: eachPath.data.icon,
            });
          }

          this.menu.push(newMenu);
        } else {
          if (eachPath.data.subCategory) {
            const indexSubCategory = this.menu[index]['path']
              .map((e) => (e.subCategory ? e.subCategory : ''))
              .indexOf(eachPath.data.subCategory);
            if (indexSubCategory === -1) {
              this.menu[index]['path'].push({
                subCategory: eachPath.data.subCategory,
                icon_subCategory: eachPath.data.icon_subCategory,
                path: [
                  {
                    path: eachPath.path,
                    title: eachPath.data.title,
                    ...eachPath['data'],
                    // showMenuButton: eachPath.data.showMenuButton,
                    // showSideNav: eachPath.data.showSideNav,
                    // showNavBar: eachPath.data.showNavBar,
                    // icon: eachPath.data.icon,
                  },
                ],
              });
            } else {
              this.menu[index]['path'][indexSubCategory]['path'].push({
                path: eachPath.path,
                title: eachPath.data.title,
                ...eachPath['data'],
                // showMenuButton: eachPath.data.showMenuButton,
                // showSideNav: eachPath.data.showSideNav,
                // showNavBar: eachPath.data.showNavBar,
                // icon: eachPath.data.icon,
              });
            }
          } else {
            this.menu[index]['path'].push({
              path: eachPath.path,
              title: eachPath.data.title,
              ...eachPath['data'],
              // showMenuButton: eachPath.data.showMenuButton,
              // showSideNav: eachPath.data.showSideNav,
              // showNavBar: eachPath.data.showNavBar,
              // icon: eachPath.data.icon,
            });
          }
        }
      }
    }
  }

  storeCurrentConfig() {
    sessionStorage.setItem('loggedInStatus', '1');
    sessionStorage.setItem('username', this.username);
    sessionStorage.setItem('name', this.name);
    sessionStorage.setItem('company_id', this.company_id);
    sessionStorage.setItem('company', this.company);
    sessionStorage.setItem('contact_no', this.contact_no);
    sessionStorage.setItem('email', this.email);

    sessionStorage.setItem('system', this.system);
    sessionStorage.setItem(
      'authorized_system',
      JSON.stringify(this.authorized_system)
    );

    sessionStorage.setItem(
      'company_authorized_system',
      JSON.stringify(this.company_authorized_system)
    );
    sessionStorage.setItem(
      'site_authorized_system_list',
      JSON.stringify(this.site_authorized_system_list)
    );

    sessionStorage.setItem('site', this.site);
    sessionStorage.setItem('session_id', this.session_id);

  }

  getAttributeList(data: string) {
    const Post_Data = {
      condition: {
        k: data,
        status: 1,
        company_id: this.company_id,
        site: this.site,
      },
    };

    return this.http
      .post(
        this.API_URL + '/core/fetch-data/get-attribute-list',
        Post_Data,
        httpOptions
      )
      .pipe(
        map((response: Array<any>) => {
          //  console.log('get Attribute List: ', response);
          this.attribute_list[data] = [];
          for (const eachAttribute of response) {
            this.attribute_list[data].push(eachAttribute['v']);
          }
        })
      );
  }

  getAttributeKeyList() {
    const Post_Data = {
      condition: {
        company_id: this.company_id,
      },
    };
    return this.http
      .post(
        this.API_URL + '/core/fetch-data/get-attribute-key',
        Post_Data,
        httpOptions
      )
      .pipe(
        map((response: Array<any>) => {
          // console.log('getAttributeKeyList: ', response);
          this.existing_attribute_key_list = response;
        })
      );
  }

  fetchCustomerList() {
    this.customerList = [];
    const Post_Data = {
      company_id: this.company_id,
    };

    if (this.salesman_code !== '') {
      Post_Data['customer_salesman_code'] = this.salesman_code;
    }

    return this.http
      .post(
        this.API_URL + '/core/refresh/salesman-customer-suggestion',
        Post_Data,
        httpOptions
      )
      .pipe(
        map((response: Array<any>) => {
          for (let i = 0; i < response.length; i++) {
            this.customerList.push(response[i]['customer_id']);
          }
        })
      );
  }

  fetchSKUDescriptionList() {
    const Post_Data = {
      condition: {
        company_id: this.company_id,
        site: this.site,
      },
    };

    return this.http
      .post(
        this.API_URL + '/core/fetch-data/get-sku-description-list',
        Post_Data,
        httpOptions
      )
      .pipe(
        map((response: Array<any>) => {
          // console.log(response);

          this.product_list['sku'] = [];
          this.product_list['description'] = [];

          for (const eachProduct of response) {
            this.product_list['sku'].push(eachProduct['sku']);
            this.product_list['description'].push(eachProduct['description']);
          }
          // console.log('this.product_list: ', this.product_list );
        })
      );
  }

  fetchSupplierList() {
    this.supplierList = [];
    const Post_Data = {
      company_id: this.company_id,
    };

    // if( this.salesman_code !== '') {
    //   Post_Data['customer_salesman_code'] = this.salesman_code;
    // }

    return this.http
      .post(
        this.API_URL + '/core/refresh/supplier-suggestion',
        Post_Data,
        httpOptions
      )
      .pipe(
        map((response: Array<any>) => {
          // console.log(response);
          for (let i = 0; i < response.length; i++) {
            this.supplierList.push(response[i]['supplier_id']);
          }
        })
      );
  }

  fetchcustomer_salesman_codeList() {
    this.customer_salesman_codeList = [];
    const Post_Data = {
      company_id: this.company_id,
    };

    return this.http
      .post(
        this.API_URL + '/core/refresh/salesman-suggestion',
        Post_Data,
        httpOptions
      )
      .pipe(
        map((response: Array<any>) => {
          for (let i = 0; i < response.length; i++) {
            this.customer_salesman_codeList.push(response[i]['salesman_code']);
          }
        })
      );
  }

  fetchCompanySiteList() {
    const Post_Data = {
      condition: {
        company_id: this.company_id,
      },
    };

    this.http
    .post(
      this.API_URL + '/group-company-site-management/get-site-list',
      Post_Data,
      httpOptions
    )
    .subscribe((response: Array<any>) => {
      // console.log(response);
      this.company_site_list = [];
      for (const eachSite of response) {
        this.company_site_list.push(eachSite['site']);
      }
    });
  }

  fetchCompanyTierList() {
    const Post_Data = {
      condition: {
        company_id: this.company_id,
      },
    };

    this.http.post(
      this.API_URL + '/core/product-price-tier/get-tier-list-suggestion-list',
      Post_Data,
      httpOptions
		)
    .subscribe((response: Array<any>) => {
      console.log(response);
      this.company_tier_list = [];
      for (const eachResponse of response) {
        this.company_tier_list.push(eachResponse['tier']);
      }

      console.log('tierList: ', this.company_tier_list);
    });
  }

  async getCompanyData() {
    const Post_Data = {
      condition: {
        company_id: this.company_id,
      },
    };

    const response = await this.http.post(
      this.API_URL + '/group-company-site-management/get-company',
        Post_Data,
        httpOptions
      ).toPromise();


      //console.log('response: ', response);

    this.company_authorized_system = response['authorized_system'];
  }


  async getSiteData() {

    const Post_Data = {
      condition: {
        company_id: this.company_id,
        site: {$in: []},
      },
    };

    for (const eachSystem of this.authorized_system) {
      for (const eachSite of eachSystem['site_list']) {
        Post_Data['condition']['site']['$in'].push(eachSite['site']);
      }
    }

    const response: any = await this.http.post(
      this.API_URL + '/group-company-site-management/get-site-list',
        Post_Data,
        httpOptions
      ).toPromise();


    console.log('getSiteData response: ', response);
    this.site_authorized_system_list = response;
  }

  async getRoleData() {
    if (this.role !== '') {
      const Post_Data = {
        condition: {
          company_id: this.company_id,
          role: this.role
        },
      };

      const response = await this.http.post(
        this.API_URL + '/role/get-role',
          Post_Data,
          httpOptions
        ).toPromise();


        //console.log('response: ', response);

      this.role_authorized_system = response['authorized_system'];
      return {statusCode: 1};
    }

    return {statusCode: 0};
  }



  submitStyle() {
    const data = [];
    Object.entries(this.theme).map(([page, styles]) => {
      const style = Object.entries(styles).map(([key, value]) => ({
        k: key,
        v: value,
      }));
      data.push({
        company_id: this.company_id,
        site: this.site,
        page: page,
        style: style,
      });
    });
    // console.log(data);
    this.http
      .post(this.API_URL + '/SMRBS/theme/submit-theme', data, httpOptions)
      .subscribe();
  }

  getStyle() {
    const data = {
      site: this.site,
      company_id: this.company_id,
    };
    this.http
      .post(this.API_URL + '/SMRBS/theme/get-theme', data, httpOptions)
      .subscribe((response: Array<any>) => {
        // console.log(response);
        for (const eachPage of response) {
          const object = {};

          for (const eachStyle of eachPage['style']) {
            object[eachStyle['k']] = eachStyle['v'];
          }
          this.theme[eachPage['page']] = object;
        }
      });
  }

  fetchExpeditionList() {
    this.expeditionList = [];

    return this.http
      .post(
        this.API_URL + '/core/expedition/get-expedition',
        {condition: {company_id : this.company_id, status: 1}},
        httpOptions
      )
      .pipe(
        map((response: Array<any>) => {
          // console.log('expeditionList: ', response);
          // for (let i = 0; i < response.length; i++) {
          //   this.expeditionList.push(response[i]['expeditionname']);
          // }

          for (const eachExpedition of response['data']) {
            if (eachExpedition['prefered_expedition'] !== null && eachExpedition['prefered_expedition'] !== '' && 'prefered_expedition' in eachExpedition) {
              this.expeditionList.push(eachExpedition['prefered_expedition']);
            }
          }
        })
      );
  }

  fetchCountryList() {
    this.countryList = [];
    this.stateList = [];
    this.countryList = Country.getAllCountries();
    this.stateList = State.getAllStates();
  }

  getErrorMessage(element) {
    if (!element.errors) {
      return null;
    }

    if (element.errors['required']) {
      return 'Required!';
    }

    if (element.errors['notExist']) {
      return 'Not exist!';
    }

    if (element.errors['email']) {
      return 'Email address invalid!';
    }

    if (element.errors['exist']) {
      return 'Already exist!';
    }

    if (element.errors['pattern']) {
      if (element.errors['pattern']['requiredPattern'] === this.password_regex) {
        return 'Must be more than 8 characters and contains at least one lowercase, one uppercase and one number!';
      } else {
        return 'Must contain alphabets and numbers!';
      }
    }

    if (element.errors['minlength']) {
      return 'Min Length: ' + element.errors['minlength']['requiredLength'] + '!';
    }

    if (element.errors['maxlength']) {
      return 'Max Length: ' + element.errors['maxlength']['requiredLength'] + '!';
    }

    if (element.errors['min']) {
      return 'Min ' + element.errors['min']['min'] + '!';
    }

    if (element.errors['max']) {
      return 'Max ' + element.errors['max']['max'] + '!';
    }
  }

  getSiteList() {
    const Post_Data = {
      condition: {
        company_id: this.company_id
      }
    };

    return this.http
      .post(
        this.API_URL + '/group-company-site-management/get-site-list',
        Post_Data,
        httpOptions
      )
      .pipe(
        map((response: Array<any>) => {
          const siteList = [];

          for (const eachSite of response) {
            siteList.push(eachSite['site']);
          }
          return siteList;
        })
      );

  }

  refreshUserBookCount() {
    const Post_Data = {
      username: this.username,
      company_id: this.company_id,
    };

    return this.http
      .post(
        this.API_URL + '/SMRBS/user-account/refresh-user-book-count',
        Post_Data,
        httpOptions
      )
      .pipe(
        map((response) => {
          // console.log(response);
          this.book_count = response['book_count'];
        })
      );
  }

  refreshAttributeList() {
    if (this.attribute_key_list.length === 0) {
      return of({});
    }

    const observables = [];

    for (const eachAttribute of this.attribute_key_list) {
      observables.push(this.getAttributeList(eachAttribute));
    }
    return concat(...observables).pipe(
      map((response: any) => {
        return response;
      })
    );

    // });
  }

  uploadSingleResourceS3(file, name) {
    const Post_Data = {
      key: this.company_id + '/' + name,
    };

    return this.http.post(this.UPLOAD_URL, Post_Data, httpOptions).pipe(
      map((response) => {
        // console.log(response);
        const formData = new FormData();
        formData.append('file', file, name);
        this.http.put(response['url'], file, {}).subscribe((uploaded) => {
          // console.log(uploaded);
        });
      })
    );
  }

  uploadMultiResourceS3(fileList: Array<Blob>, nameList) {
    for (let i = 0; i < fileList.length; i++) {
      const Post_Data = {
        key: this.company_id + '/' + nameList[i],
      };
      // console.log('Post_Data uploadMultiResourceS3: ', Post_Data);

      this.http
        .post(this.UPLOAD_URL, Post_Data, httpOptions)
        .pipe(
          map((response) => {
            // console.log('responseupload', response);
            // const formData = new FormData();
            // formData.append('file', fileList[i], nameList[i]);
            this.showSnackBar('Uploading ' + nameList[i], null, 2000);
            this.http
              .put(response['url'], fileList[i], {})
              .subscribe((uploaded) => {
                // console.log('uploaded', uploaded);
                this.showSnackBar('Done upload ' + nameList[i], null, 2000);
              });
          })
        )
        .subscribe();
    }
  }

  // NEW
  uploadFilesS3(fileUploadList: Array<any>) {
    const observables = [];
    fileUploadList.forEach((eachFile) => {
      const Post_Data = {
        key: this.company_id + '/' + eachFile['filename'],
      };

      const eachObservable = this.http
        .post(this.UPLOAD_URL, Post_Data, httpOptions)
        .pipe(
          map((response) => {
            // console.log('url: ', response);
            // const formData = new FormData();
            // formData.append('file', fileList[i], nameList[i]);
            this.showSnackBar('Uploading ' + eachFile['filename'], null, 2000);
            this.http
              .put(response['url'], eachFile['file'], {})
              .pipe(
                map((uploaded) => {
                  // console.log(uploaded);
                  this.showSnackBar(
                    'Done upload ' + eachFile['filename'],
                    null,
                    2000
                  );
                })
              )
              .subscribe();
          })
        );

      observables.push(eachObservable);
    });

    return forkJoin(...observables).pipe(
      map((responseList) => {
        return responseList;
      })
    );
  }

  getImage(imagename) {
    if (this.config['use_S3'] === '1') {
      // tslint:disable-next-line: max-line-length
      return of(
        this.RESOURCE_URL + this.company_id + '/' + imagename.replace(' ', '+')
      );
    } else {
      const data = { filename: imagename };
      // console.log(response);
      const mediaType = 'image/jpeg';
      const reader = new FileReader();
      return new Observable((observer: Subscriber<any>): void => {
        // if success
        reader.onload = (ev: ProgressEvent): void => {
          observer.next(reader.result);
          observer.complete();
        };

        this.http
          .post(this.API_URL + '/get-image', data, {
            responseType: 'blob',
          })
          .pipe(
            map((fileImage) => {
              // console.log(fileImage);
              const blob = new Blob([fileImage], {
                type: mediaType,
              });
              reader.readAsDataURL(blob);
            })
          )
          .subscribe();
      });
    }
  }

  getImageURL(imagename) {
    return (
      this.RESOURCE_URL + this.company_id + '/' + imagename.replace(' ', '+')
    );
  }

  downloadImage(imagename) {
    // let link = document.createElement('a');
    // link.setAttribute('type', 'hidden');
    // link.href = 'assets/file';
    // link.download = path;
    // document.body.appendChild(link);
    // link.click();
    // link.remove();

    const a = document.createElement('a');

    if (this.config['use_S3'] === '1') {
      // console.log(imagename);
      this.http
        .get(
          this.RESOURCE_URL +
            this.company_id +
            '/' +
            imagename.replace(/ /g, '+'),
          {
            responseType: 'blob',
          }
        )
        .subscribe((fileImage) => {
          // console.log(fileImage);
          a.href = window.URL.createObjectURL(fileImage);
          a.download = imagename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
    } else {
      const data = { filename: imagename };
      // console.log(data, '====== data image from s3 =======');
      this.http
        .post(this.API_URL + '/get-image', data, {
          responseType: 'blob',
        })
        .subscribe((fileImage) => {
          // console.log(response);
          // console.log(fileImage, '=========== file image from s3 =========');
          a.href = window.URL.createObjectURL(fileImage);
          a.download = imagename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
    }
  }

  downloadFile(url, filename) {
    const a = document.createElement('a');
    // console.log(imagename);
    this.http
      .get(
        url,
        { responseType: 'blob' }
      )
      .subscribe((file) => {
        // console.log(fileImage);
        a.href = window.URL.createObjectURL(file);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  }

  getFile(url) {
    return this.http.get(url, {responseType: 'blob'});
  }

  _filter(list: string[], value: string): string[] {
    if (!value) {
      return list;
    }
    const filterValue = value.toLowerCase();
    if (list.length > 0) {
      return list.filter((option) => {
        if (option) {
          return option.toLowerCase().includes(filterValue);
        } else {
          return [];
        }
      });
    } else {
      return [];
    }
  }

  _filterObject(list: Array<any>, value: string, key: string): string[] {
    // console.log('valueFilterObject: ', value);
    if (!value) {
      return list;
    }
    try {
      const filterValue = value.toLowerCase();
      if (list.length > 0) {
        return list.filter((option) => {
          if (option) {
            return option[key].toLowerCase().includes(filterValue);
          } else {
            return [];
          }
        });
      } else {
        return [];
      }
    } catch (err) {
      return list;
    }
  }

  _filterObjectMultiProperties(
    list: Array<any>,
    condition: Array<any>
  ): string[] {
    // const filterValue = value.toLowerCase();
    // condition = [
    //   {
    //     k: string,
    //     v: string
    //   }
    // ];

    if (list.length > 0) {
      // console.log('condition', condition);
      return list.filter((option) => {
        let pass = true;

        for (const eachCondition of condition) {
          if (eachCondition['k'] in option) {
            if (
              !option[eachCondition['k']]
                .toLowerCase()
                .includes(eachCondition['v'].toLowerCase())
            ) {
              pass = false;
            }
          } else {
            pass = false;
          }
        }
        if (pass) {
          return option;
        } else {
          return false;
        }
      });
    } else {
      return [];
    }
  }

  checkIncludesInArrayOfObjects(
    list: Array<any>,
    condition: Array<any>,
    start = 0
  ): boolean {
    let found = false;

    for (let i = start; i < list.length; i++) {
      const eachRow = list[i];

      for (const eachCondition of condition) {
        if (eachRow[eachCondition['k']] === eachCondition['v']) {
          found = true;
          break;
        }
      }
      if (found) {
        break;
      }
    }

    return found;
  }

  showSnackBar(message: string, action: string, duration: number) {
    return this._snackBar.open(message, action, {
      duration: duration,
    });
  }

  showSnackBarImage(data: any, duration: number) {
    // data = {
    //   content: {},
    //   routing: '',
    // }

    return this._snackBar.openFromComponent(SnackbarComponent, {
      data: data,
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['snack-bar-image']
    });

  }

  async confirmModal(message: string, mode = 0, dataArray = []) {
    //dataArray = [{document_id : String, document_type: String}]

    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      // height: '80%',
      // width: '80%',
      disableClose: true,
      data: { message: message,
              mode: mode,
              dataArray: dataArray
      },
    });

    const result = await dialogRef.afterClosed().toPromise();
    // console.log(result);
    return result;
  }

  async voidConfirmModal(message: string, mode = 0, dataArray =[]) {
    const dialogRef = this.dialog.open(VoidConfirmModalComponent, {
      // height: '620px',
      // width: '600px',
      disableClose: true,
      data: { message: message,
        mode: mode,
        dataArray: dataArray
      },
    });

    const result = await dialogRef.afterClosed().toPromise();
        // console.log('data', result);
    return result;
  }

  group_jms = [];

  configGetGroup() {
    const Post_Data2 = {
      condition: {
        status: 1,
        site: this.site,
        company_id: this.company_id,
      },
    };

    this.http
      .post(
        this.API_URL + '/JMS-BP/config/config-get-group',
        Post_Data2,
        httpOptions
      )
      .subscribe((response1: Array<any>) => {
        for (const eachGroup of response1) {
          this.group_jms.push({
            id: eachGroup['group_id'],
            title: eachGroup['group_id'],
          });
        }
      });
  }

  checkVersion() {
    this.http
      .post(this.API_URL + '/version', {}, httpOptions)
      .subscribe((response: any) => {
        // console.log(response);
        this.API_version = response;
        this.outdated = 0;
        if (version['version_1'] < response['version_1']) {
          this.outdated = 1;
        }

        if (
          version['version_1'] === response['version_1'] &&
          version['version_2'] < response['version_2']
        ) {
          this.outdated = 1;
        }

        if (
          version['version_1'] === response['version_1'] &&
          version['version_2'] === response['version_2'] &&
          version['version_3'] < response['version_3']
        ) {
          this.outdated = 1;
        }

        if (this.outdated > 0) {
          this.showSnackBar(
            'New Version Available! Downloading updates!',
            'Close',
            10000
          );
          // this.router.navigate(['/']);
          // this.loggedInStatus = 0;
          // this.authorized_page = {};
          // location.reload(true);
        }
      });
  }

  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          // console.log('getPosition error.message: ', err.message);
          reject(err);
        });
    });

  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
  }

  resetGuide() {
    const text1 = this.currentURL.split('/')[2];
    const text2 = this.replaceAll(text1,'-', '_');

    console.log('text1', text1);

    this.bdcWalkService.reset(text1);

    let dataTaskFalse = {};

    const dataBDC = this.bdcWalkService.getTasks();

    dataTaskFalse = {...dataTaskFalse, ...dataBDC};

    for (const eachRow of Object.keys(dataTaskFalse)){
      dataTaskFalse[eachRow] = false;
    }

    dataTaskFalse = {...dataTaskFalse, walkthroughmode : true};
    dataTaskFalse[text2] = true; //Reset eachPath.

    this.bdcWalkService.setTasks(dataTaskFalse);
    // here text2.equals("some string with  in it")
  }


  constructor(
    private http: HttpClient,
    public location: Location,
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private bdcWalkService: BdcWalkService
  ) {


    this.content_landing_page = environment['content_landing_page'];
    this.slider_landing_page = environment['slider_landing_page'];


    this.hostname = window.location.protocol + '//' + window.location.hostname + ':' +  window.location.port;

    if (environment['API_URL'] === 'onpremise') {
      this.API_URL = environment['API_PROTOCOL'] +'://' + window.location.hostname + ':' + environment['API_PORT'];
      this.REPORT_API_URL = environment['API_PROTOCOL'] +'://' + window.location.hostname + ':' + environment['REPORT_API_PORT'];
      this.EXPORT_IMPORT_API_URL = environment['API_PROTOCOL'] +'://' + window.location.hostname + ':' + environment['EXPORT_IMPORT_API_PORT'];
    } else {
      this.API_URL = environment['API_URL'];
      this.REPORT_API_URL = environment['REPORT_API_URL'];
      this.EXPORT_IMPORT_API_URL = environment['EXPORT_IMPORT_API_URL'];

      if (environment['ACCURATE_API_URL']){
        this.ACCURATE_API_URL = environment['ACCURATE_API_URL'];
      }

    }

    if (!environment['production']) {
        this.API_URL = 'http://' + window.location.hostname + ':3000';
        this.REPORT_API_URL = 'http://' + window.location.hostname + ':3001';
        this.EXPORT_IMPORT_API_URL = 'http://' + window.location.hostname + ':3003';
    }

    this.UPLOAD_URL = environment['UPLOAD_URL'];
    this.RESOURCE_URL = environment['RESOURCE_URL'];

    if (environment['RESPONSE_RESOURCE_URL']){
      this.RESPONSE_RESOURCE_URL = environment['RESPONSE_RESOURCE_URL'];
    }


    this.loggedInStatus = JSON.parse(sessionStorage.getItem('loggedInStatus'));
    this.username = sessionStorage.getItem('username');
    this.name = sessionStorage.getItem('name');
    this.company_id = sessionStorage.getItem('company_id');
    this.company = sessionStorage.getItem('company');
    this.session_id = sessionStorage.getItem('session_id');
    this.contact_no = sessionStorage.getItem('contact_no');
    this.email = sessionStorage.getItem('email');

    this.site = sessionStorage.getItem('site');
    // this.site_list = JSON.parse(sessionStorage.getItem('site_list'));

    this.system = sessionStorage.getItem('system');
    this.authorized_system = JSON.parse(
      sessionStorage.getItem('authorized_system')
    );
    this.company_authorized_system = JSON.parse(sessionStorage.getItem('company_authorized_system'));
    if (!this.company_authorized_system) {
      this.company_authorized_system = [];
    }

    this.site_authorized_system_list = JSON.parse(sessionStorage.getItem('site_authorized_system_list'));
    if (!this.site_authorized_system_list) {
      this.site_authorized_system_list = [];
    }

    // this.authorized_page = JSON.parse(sessionStorage.getItem('authorized_page'));
    // this.authorization = JSON.parse(sessionStorage.getItem('authorization'));
    // this.config = JSON.parse(sessionStorage.getItem('config'));

    // this.salesman_code = sessionStorage.getItem('salesman_code');
    // this.salesman_code_list = JSON.parse(sessionStorage.getItem('salesman_code_list'));

    // this.attribute_key_list = JSON.parse(sessionStorage.getItem('attribute_key_list'));
    // this.token = sessionStorage.getItem('token');

    if (sessionStorage.getItem('token')) {
      this.token = sessionStorage.getItem('token');
      httpOptions.headers = httpOptions.headers.set(
        'x-access-token',
        this.token
      );
    }
    if (!this.loggedInStatus) {
      return;
    }
    this.changeSystem(this.system, 0, 0);


    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        let data = event.snapshot.data;
        // console.log('data.showSideNav: ', data['showSideNav']);
        if (!data['showMenuButton']) {
          data = {
            showMenuButton: true,
            showSideNav: true,
            showNavBar: true,
          };
        }
        this.showMenuButton = data['showMenuButton'];
        this.showSideNav = data['showSideNav'];
        this.showNavBar = data['showNavBar'];
        // console.log('showSideNav: ', this.showSideNav);
      }
    });

    // if (window.location.hostname === 'localhost') {
    //   this.hostname = 'prototype.prieds.com';
    // } else {
    //   this.hostname = window.location.hostname;
    // }

    // console.log('hostname: ', this.hostname);
    // console.log('window.location.hostname: ', window.location.hostname);

    // const hostname_split = window.localStorage.hostname.split('.');

    // if (hostname_split.length > 2) {
    //   if (hostname_split[0] === 'customer') {
    //     this.router.navigate(['/customer']);
    //   }
    // }

    // if ( window.location.hostname === 'localhost') {
    //   this.API_URL = 'http://' + window.location.hostname + ':3005';
    // } else {
    //   this.API_URL = 'https://' + window.location.hostname + ':3005';
    // }

    // this.resourceURL = 'https://test.gifusouvenir.com.s3.amazonaws.com';

    //    this.resourceURL = 'https://' + window.location.hostname + '.s3.amazonaws.com';
  }
}



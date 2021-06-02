/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {LicenseManager} from '@ag-grid-enterprise/core';
if (environment.production) {
  enableProdMode();
}

LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-10_July_2021_[v2]_MTYyNTg3MTYwMDAwMA==fc7fe9235bb1e7b6c832bd2d53e7cd8a");


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

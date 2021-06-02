/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: "AIzaSyD5LStBIFDKMWSVrxa1Tchjyu7ZPGNvggw",
    authDomain: "geo-app1.firebaseapp.com",
    databaseURL: "https://geo-app1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "geo-app1",
    storageBucket: "geo-app1.appspot.com",
    messagingSenderId: "538575445999",
    appId: "1:538575445999:web:c8223cd70d043a2802a01a",
    measurementId: "G-95BD53KL7E"
  }
};


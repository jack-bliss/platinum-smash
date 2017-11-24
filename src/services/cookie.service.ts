import { Injectable } from '@angular/core';

@Injectable()
export class CookieService {
  static set(key, val, options) {
    let optstring = '';
    for (const ky in options) {
      if (options.hasOwnProperty(ky)) {
        optstring += ';' + ky + '=' + options[ky];
      }
    }
    document.cookie = key + '=' + val + optstring;
  }
  
  static get(key) {
    const cookies = document.cookie.split(';').reduce((accum, val) => {
      const kv = val.trim().split('=');
      accum[kv[0]] = kv[1];
      return accum;
    }, {});
    if (key && cookies[key]) {
      return cookies[key];
    } else if (key && !cookies[key]) {
      return null;
    } else {
      return cookies;
    }
  }
}

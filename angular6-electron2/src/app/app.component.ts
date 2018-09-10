import { Component, OnInit } from '@angular/core';
import { interval /*, Observable */ } from 'rxjs';
// import { map, takeWhile, tap } from 'rxjs/operators';
import { HttpClient /*, HttpHeaders */ } from '@angular/common/http';

// import get from 'lodash/get';

// Contents of settings.json :

/*
{
	"label": "CADUSD=X",
	"url": "https://ca.finance.yahoo.com/quote/CADUSD%3DX",
	"timerIntervalInMilliseconds": 20000,
	"regexes": [
		"/data-reactid=\\\"51\\\"\\>([0-9\\.]+)\\<\\/span/",
		"/\\<span.+data-reactid=\\\"67\\\"\\>([0-9\\.]+)\\<\\/span/",
		"/\\<span.+data-reactid=\\\"35\\\"\\>([0-9\\.]+)\\<\\/span/",
		"/\\<span.+data-reactid=\\\"36\\\"\\>([0-9\\+\\-\\.\\%\\(\\)]+)\\<\\/span/",
		"/\\<span.+data-reactid=\\\"38\\\"\\>([^\\<]+)\\<\\/span/"
	],
	"options": {
		"returnHttpResponseStatus": true
	},
	"stringificationTemplate": [
		"CADUSD=X",
		2,
		3,
		"Bid",
		0,
		"Ask",
		1,
		4
	],
	"specialTimeOfDayIndex": 4
}
 */

const settings = /* require('./settings.json') || */ {
  label: 'USDCAD=X',
  url: 'https://ca.finance.yahoo.com/quote/USDCAD%3DX',
  timerIntervalInMilliseconds: 20000,
  regexes: [
    /data-reactid=\"51\"\>([0-9\.]+)\<\/span/,
    /\<span.+data-reactid=\"67\"\>([0-9\.]+)\<\/span/,
    /\<span.+data-reactid=\"35\"\>([0-9\.]+)\<\/span/,
    /\<span.+data-reactid=\"36\"\>([0-9\\+\-\.\%\(\)]+)\<\/span/,
    /\<span.+data-reactid=\"38\"\>([^\<]+)\<\/span/
  ],
  stringificationTemplate: [
    'USDCAD=X',
    2,
    3,
    'Bid',
    0,
    'Ask',
    1,
    4
  ],
  specialTimeOfDayIndex: 4
};

/*
const defaultSettings = {
	url: "https://nodejs.org/en/",
	regexes: [
		/Download v{0,1}(\S+)\s+Current/
	],
	options: {
		returnHttpResponseStatus: true
	},
	stringificationTemplate: [
		"Current version of Node.js :",
		0
	]
};

const settings = require('./settings.json') || defaultSettings;
//const settings = defaultSettings;

const url = settings.url;
const regexes = settings.regexes.map(regex => ensureRegex(regex));
const options = settings.options;

const defaultTimerIntervalInMilliseconds = 30000;		// === 30 seconds.
const timerIntervalInMilliseconds = settings.timerIntervalInMilliseconds || defaultTimerIntervalInMilliseconds;
 */

/*
function ensureRegex(param) {
	const prototypeAsString = Object.prototype.toString.call(param);

	switch (prototypeAsString) {
		case '[object RegExp]':
			return param;

		case '[object String]':
			// Strip the leading and trailing slashes (if any) from param
			const match = /^\/(.*)\/$/.exec(param);

			if (match && match.length && match[1]) {
				param = match[1];
			}

			return new RegExp(param);

		default:
			return undefined;
	}
}
 */

/*
const httpOptions = {
  headers: new HttpHeaders({
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  })
};
 */

// const scrapeIntervalLengthInMilliseconds = 10000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // max     = 1;
  // current = 0;
  title = settings.label || 'Exchange Rate Scraper';
  max     = settings.timerIntervalInMilliseconds;
  current = settings.timerIntervalInMilliseconds;
  outputText = 'Starting...';
  myInterval = null;
  myIntervalSubscription = null;

  constructor(
    private http: HttpClient) {
  }

  ngOnInit() {
    this.start();
  }

  padToTwoDigits(n: number) {
    let str = '' + n;

    if (str.length < 2) {
      str = '0' + str;
    }

    return str;
  }

  formatUTCDateWithoutTime(date: Date) {
      const year = date.getUTCFullYear(),
          month = this.padToTwoDigits(date.getUTCMonth() + 1),
          day = this.padToTwoDigits(date.getUTCDate());

    return [year, month, day].join('-');
  }

  formatUTCHoursAndMinutes(date: Date) {
    const hours = this.padToTwoDigits(date.getUTCHours());
    const minutes = this.padToTwoDigits(date.getUTCMinutes())

    return `${hours}:${minutes}`;
  }

  // formatDate(date) {
  //     // var d = new Date(date),
  //     const d = date,
  //       year = d.getFullYear(),
  //       month = this.padToTwoDigits(d.getMonth() + 1),
  //       day = this.padToTwoDigits(d.getDate()),
  //       hour = this.padToTwoDigits(d.getHours()),
  //       minute = this.padToTwoDigits(d.getMinutes()),
  //       second = this.padToTwoDigits(d.getSeconds());

  //   return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
  // }

  // formatUTCDate(date) {
  //     const hour = this.padToTwoDigits(date.getUTCHours()),
  //     minute = this.padToTwoDigits(date.getUTCMinutes()),
  //     second = this.padToTwoDigits(date.getUTCSeconds());

  //   return this.formatUTCDateWithoutTime(date) + ' ' + [hour, minute, second].join(':');
  // }

  constructSpecialTimeOfDay(match: string) {
    // const timeRegexMatch = match.match(/[0-9]{1,2}\:[0-9]{2}[A|P]M [A-Z]+/);
    const timeRegexMatch = /[0-9]{1,2}\:[0-9]{2}[A|P]M [A-Z]+/.exec(match);

    if (!timeRegexMatch || !timeRegexMatch[0]) {
      return undefined;
    }

    const now = new Date();
    const timeAsString = this.formatUTCDateWithoutTime(now) + ' '
      + timeRegexMatch[0].replace(/BST/, 'GMT+0100').replace(/AM/, ' AM').replace(/PM/, ' PM');
    const time = new Date(timeAsString);

    time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
    return this.formatUTCHoursAndMinutes(time);
  }

  start() {
    this.http.get(settings.url, { responseType: 'text' })
      .subscribe(
        (s: any) => {
          // console.log('HTTP GET succeeded : s is', s);
          console.log('HTTP GET succeeded.');
          // this.outputText = 'Get: Success';
          // this.outputText = 'Get: ' + s.slideshow.author;

          const body = s;
          const regexMatchResults = settings.regexes.map(regex => {
            const matchResult = { regex: regex, match: '', matches: [] };

            // See https://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression

            const indexOfCaptureGroup = 1;
            let match;

            while ((match = regex.exec(body)) !== null) {
              matchResult.matches.push(match[indexOfCaptureGroup]);

              if (!regex.global) {
                // See https://stackoverflow.com/questions/31969913/why-does-this-regexp-exec-cause-an-infinite-loop
                break;
              }
            }

            if (matchResult.matches.length > 0) {
              matchResult.match = matchResult.matches[0];
            }

            return matchResult;
          });

          // ****

          // const settings = {
          //   stringificationTemplate: stringificationTemplate,
          //   specialTimeOfDayIndex: specialTimeOfDayIndex,
          //   timerIntervalInMilliseconds: scrapeIntervalLengthInMilliseconds
          // };
          // let outputText = '';
          // let separator = '';

          // settings.stringificationTemplate.forEach(st => {
          this.outputText = settings.stringificationTemplate.map(st => {
            /*
            // ipcRenderer.send('consoleLog', typeof st);
            let stringToAppend;

            if (typeof st === 'number' && st >= 0 && st < regexMatchResults.length) {
              // ipcRenderer.send('consoleLog', 'st is a number');
              // ipcRenderer.send('consoleLog', st);
              // ipcRenderer.send('consoleLog', settings.specialTimeOfDayIndex);

              if (st === settings.specialTimeOfDayIndex) {
                // ipcRenderer.send('consoleLog', 'Calling constructSpecialTimeOfDay');
                stringToAppend = this.constructSpecialTimeOfDay(regexMatchResults[st].match);
              } else {
                stringToAppend = regexMatchResults[st].match.toString();
              }
            } else {
              stringToAppend = st.toString();
            }

            // if (stringToAppend) {
            //   outputText = outputText + separator + stringToAppend;
            // }

            // separator = ' ';
            return stringToAppend || '';
             */

            if (typeof st !== 'number' || st < 0 || st >= regexMatchResults.length) {
              return st.toString();
            } else if (st === settings.specialTimeOfDayIndex) {
              // ipcRenderer.send('consoleLog', 'Calling constructSpecialTimeOfDay');
              return this.constructSpecialTimeOfDay(regexMatchResults[st].match);
            } else {
              return regexMatchResults[st].match.toString();
            }
          }).join(' ');

          // console.log('regexMatchResults is', regexMatchResults);
          // this.outputText = intervalId.toString() + ' ' + regexMatchResults.map(rmr => rmr.match).join(', ');
          // this.outputText = intervalId.toString() + ' ' + outputText;
          // this.outputText = outputText;
          // console.log('outputText is', this.outputText);

          const incrementSizeInMilliseconds = 100;

          // this.max = settings.timerIntervalInMilliseconds / 1000;
          this.max = settings.timerIntervalInMilliseconds;
          this.current = this.max;
          // this.reset();
          this.myInterval = interval(incrementSizeInMilliseconds);

          this.myIntervalSubscription = this.myInterval
            // .pipe(
              // takeWhile(_ => !this.isFinished ),
              // tap(i => this.current += 0.1)
            // )
            .subscribe(_ => {
              // this.current += 0.1;
              this.current -= incrementSizeInMilliseconds;

              // if (this.currentVal >= this.maxVal) {
              if (this.currentVal <= 0) {
                this.myIntervalSubscription.unsubscribe();
                this.myIntervalSubscription = null;
                this.myInterval = null;
                this.start();
              }
            });
        },
        f => {
          console.error('HTTP GET failed : f is', f);
          this.outputText = 'Get: Error';
        }
      );
  }

  /// Finish timer
  // finish() {
  //   this.current = this.max;
  // }

  /// Reset timer
  // reset() {
  //   this.current = 0;
  // }

  /// Getters to prevent NaN errors

  get maxVal() {
    return isNaN(this.max) || this.max < 0.1 ? 0.1 : this.max;
  }

  get currentVal() {
    return isNaN(this.current) || this.current < 0 ? 0 : this.current;
  }

  // get isFinished() {
  //   return this.currentVal >= this.maxVal;
  // }
}

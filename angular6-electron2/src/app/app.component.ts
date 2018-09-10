import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

const httpOptions = {
  headers: new HttpHeaders({
    // 'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  max     = 1;
  current = 0;
  outputText = 'Zero';

  constructor(
    private http: HttpClient) {
  }

  padToTwoDigits(n) {
    let str = '' + n;

    if (str.length < 2) {
      str = '0' + str;
    }

    return str;
  }

  formatUTCDateWithoutTime(date) {
      const year = date.getUTCFullYear(),
          month = this.padToTwoDigits(date.getUTCMonth() + 1),
          day = this.padToTwoDigits(date.getUTCDate());

    return [year, month, day].join('-');
  }

  formatUTCHoursAndMinutes(date) {
    const hours = this.padToTwoDigits(date.getUTCHours());
    const minutes = this.padToTwoDigits(date.getUTCMinutes())

    return `${hours}:${minutes}`;
  }

  formatDate(date) {
      // var d = new Date(date),
      const d = date,
        year = d.getFullYear(),
        month = this.padToTwoDigits(d.getMonth() + 1),
        day = this.padToTwoDigits(d.getDate()),
        hour = this.padToTwoDigits(d.getHours()),
        minute = this.padToTwoDigits(d.getMinutes()),
        second = this.padToTwoDigits(d.getSeconds());

    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
  }

  formatUTCDate(date) {
      const hour = this.padToTwoDigits(date.getUTCHours()),
      minute = this.padToTwoDigits(date.getUTCMinutes()),
      second = this.padToTwoDigits(date.getUTCSeconds());

    return this.formatUTCDateWithoutTime(date) + ' ' + [hour, minute, second].join(':');
  }

  constructSpecialTimeOfDay(match) {
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
    /*
    const myInterval = interval(100);

    myInterval
      .pipe(
        takeWhile(_ => !this.isFinished ),
        tap(i => this.current += 0.1)
      )
      .subscribe();
    */

    // this.outputText = 'One';

    const scrapeIntervalLengthInMilliseconds = 10000;
    const scrapeInterval = interval(scrapeIntervalLengthInMilliseconds);
    // const url = 'https://httpbin.org/json';
    // const url = 'https://ca.finance.yahoo.com/quote/CADUSD%3DX';
    const url = 'https://ca.finance.yahoo.com/quote/USDCAD%3DX';
    const regexes = [
      /data-reactid=\"51\"\>([0-9\.]+)\<\/span/,
      /\<span.+data-reactid=\"67\"\>([0-9\.]+)\<\/span/,
      /\<span.+data-reactid=\"35\"\>([0-9\.]+)\<\/span/,
      /\<span.+data-reactid=\"36\"\>([0-9\\+\-\.\%\(\)]+)\<\/span/,
      /\<span.+data-reactid=\"38\"\>([^\<]+)\<\/span/
    ];
    const stringificationTemplate = [
      'USDCAD=X',
      2,
      3,
      'Bid',
      0,
      'Ask',
      1,
      4
    ];
    const specialTimeOfDayIndex = 4;

    console.log('start(); scrapeIntervalLengthInMilliseconds is', scrapeIntervalLengthInMilliseconds);

    scrapeInterval.subscribe(intervalId => {
      console.log('scrapeInterval: intervalId is', intervalId);

      this.http.get(url, { responseType: 'text' })
        .subscribe(
          (s: any) => {
            // console.log('HTTP GET succeeded : s is', s);
            console.log('HTTP GET succeeded.');
            // this.outputText = 'Get: Success';
            // this.outputText = 'Get: ' + s.slideshow.author;

            const body = s;
            const regexMatchResults = regexes.map(regex => {
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

            const settings = {
              stringificationTemplate: stringificationTemplate,
              specialTimeOfDayIndex: specialTimeOfDayIndex,
              timerIntervalInMilliseconds: scrapeIntervalLengthInMilliseconds
            };
            let outputText = '';
            let separator = '';

            settings.stringificationTemplate.forEach(st => {
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

              if (stringToAppend) {
                outputText = outputText + separator + stringToAppend;
              }

              separator = ' ';
            });

            // return outputText;

            // ****

            console.log('regexMatchResults is', regexMatchResults);
            // this.outputText = intervalId.toString() + ' ' + regexMatchResults.map(rmr => rmr.match).join(', ');
            this.outputText = intervalId.toString() + ' ' + outputText;
            console.log('outputText is', this.outputText);
          },
          f => {
            console.error('HTTP GET failed : f is', f);
            this.outputText = 'Get: Error';
          }
        );
      });
  }

  /// Finish timer
  finish() {
    this.current = this.max;
  }

  /// Reset timer
  reset() {
    this.current = 0;
  }

  /// Getters to prevent NaN errors

  get maxVal() {
    return isNaN(this.max) || this.max < 0.1 ? 0.1 : this.max;
  }

  get currentVal() {
    return isNaN(this.current) || this.current < 0 ? 0 : this.current;
  }

  get isFinished() {
    return this.currentVal >= this.maxVal;
  }
}

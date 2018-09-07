import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, takeWhile, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  start() {
    const myInterval = interval(100);

    this.outputText = 'One';

    myInterval
      .pipe(
        takeWhile(_ => !this.isFinished ),
        tap(i => this.current += 0.1)
      )
      .subscribe();

    // const url = 'https://httpbin.org/json';
    const url = 'https://ca.finance.yahoo.com/quote/CADUSD%3DX';
    const regexes = [
      /data-reactid=\"51\"\>([0-9\.]+)\<\/span/,
      /\<span.+data-reactid=\"67\"\>([0-9\.]+)\<\/span/,
      /\<span.+data-reactid=\"35\"\>([0-9\.]+)\<\/span/,
      /\<span.+data-reactid=\"36\"\>([0-9\\+\-\.\%\(\)]+)\<\/span/,
      /\<span.+data-reactid=\"38\"\>([^\<]+)\<\/span/
    ];

    this.http.get(url, { responseType: 'text' })
      .subscribe(
        (s: any) => {
          console.log('HTTP GET succeeded : s is', s);
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
          console.log('HTTP GET succeeded : regexMatchResults is', regexMatchResults);
          this.outputText = regexMatchResults.map(rmr => rmr.match).join(', ');
        },
        f => {
          console.error('HTTP GET failed : f is', f);
          this.outputText = 'Get: Error';
        }
      );
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

import { HttpClient } from "@angular/common/http";
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";

@Component({
  selector: "app-ping",
  templateUrl: "./ping.component.html",
  styleUrls: ["./ping.component.scss"],
})
export class PingComponent implements OnInit, OnChanges {
  @Input() provider: string;
  @Input() dataCenter: string;

  public loading = true;
  public ping = '';
  public rating = '';
  public colorClass = ''

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataCenter.currentValue) {
      this.pingDataCenter();
    }
  }

  private executePing(): Observable<number> {
    const start = Date.now();

    const url = this.provider === 'aws'
      ? `https://ec2.${this.dataCenter}.amazonaws.com/ping`
      : `https://${this.dataCenter}.ping.tensordock.com/`

    return this.http
      .get(url)
      .pipe(
        map(() => Date.now() - start),
        catchError(() => of(Date.now() - start))
      );
  }

  private pingDataCenter() {
    this.loading = true;

    const pings: number[] = [];
    this.executePing()
      .pipe(
        mergeMap((p) => {
          pings.push(p);
          return this.executePing();
        }),
        mergeMap((p) => {
          pings.push(p);
          return this.executePing();
        })
      )
      .subscribe((p) => {
        pings.push(p);
        const ping = pings.sort((a, b) => a - b)[0]
        this.ping = `${ping}`;
        this.updateRating()
        this.loading = false;
      });
  }

  public updateRating() {
    if (+this.ping >= 80) {
      this.rating = 'Noticeable delay'
      this.colorClass = "bg-red-600 text-white"
    } else if (+this.ping >= 40) {
      this.rating = 'Small delay'
      this.colorClass = "bg-yellow-500 text-white"
    } else {
      this.rating = 'Great connection'
      this.colorClass = "bg-green-600 text-white"
    }
  }

}

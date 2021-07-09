import { Component, OnInit, Input } from "@angular/core";
import { HackernewsApiService } from "../../services/hackernews-api.service";
import { ActivatedRoute, Router } from "@angular/router";

import * as moment from "moment";

@Component({
  selector: "app-story-feed-item-detail",
  templateUrl: "./story-feed-item-detail.component.html",
  styleUrls: ["./story-feed-item-detail.component.scss"],
})
export class StoryFeedItemDetailComponent implements OnInit {
  public by: string;
  public id: number;
  public score: number;
  public text: string;
  public title: string;
  public time: string;
  public type: string;
  public kid: any[];
  public result: any[];
  public kids: any[];
  public url: string;
  public commentsCount: number;
  public domain: string;
  public feedItemFetched: boolean;

  constructor(
    private _api: HackernewsApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.feedItemFetched = false;
      this._api.getFeedItem(params.itemId).subscribe(
        (data) => {
          this.kid = data.kids;
          this.result = data;
          this.commentsCount = data.kids ? data.kids.length : 0;
          this.kids = this.kid.slice(0, 3);
          Object.assign(this.kids, data);
          this.time = moment.unix(+data.time).fromNow();
          this.feedItemFetched = true;

          this.domain = this.extractHostname(data.url);
        },
        (error) => console.log(error)
      );
    });
  }

  extractHostname(url: any) {
    if (!url) return undefined;
    let hostname;
    if (url.indexOf("://") > -1) {
      hostname = url.split("/")[2];
    } else {
      hostname = url.split("/")[0];
    }

    return hostname.split(":")[0].split("?")[0];
  }

  onDeleted(comment_id: any) {
    this.kids.splice(this.kids.indexOf(comment_id), 1);
  }
}

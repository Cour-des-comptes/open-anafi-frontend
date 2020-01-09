import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../interfaces/user';
import { Comment } from '../../interfaces/comment';
import { AuthentificationService } from '../../services/authentification.service';
import { apiService } from '../../services/api.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {registerLocaleData} from "@angular/common";
import localeFr from "@angular/common/locales/fr";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})



export class CommentComponent implements OnInit {

  private _id: number;
  user: User;
  comments$: Observable<Comment[]>;


  @Input() type: string;
  @Input()
  set id(id: number) {
    this._id = id;
    // Update comments on id change
    if (this.type === 'indicator') {
      this.comments$ = this.api.getIndicatorComments(this._id);
    } else if (this.type === 'frame') {
      this.comments$ = this.api.getFrameComments(this._id);
    }
  }


  constructor(private route: ActivatedRoute, private authenticationService: AuthentificationService, private api: apiService) { }

  ngOnInit() {
    // the second parameter 'fr-FR' is optional
    registerLocaleData(localeFr, 'fr-FR');
    if (this.route.snapshot.paramMap.get('type')) {
      this.type = this.route.snapshot.paramMap.get('type');
    }
    if (this.type === 'app') {
      this.comments$ = this.api.getComments();

    } else if (this.type === 'indicator') {
      this.comments$ = this.api.getIndicatorComments(this._id);
    } else if (this.type === 'frame') {
      this.comments$ = this.api.getFrameComments(this._id);
    }
    this.authenticationService.getAuthenticatedUser().subscribe(user => {
      this.user = user;
    });

  }

  submitComment(commentaire: string): void {
    if (this.type === 'app') {
      this.api.setComment(this.user.givenName + ' ' + this.user.name, commentaire).subscribe(
        (commentPost) => {
          this.comments$ = this.api.getComments();
        });
    } else if (this.type === 'indicator') {
      this.api.setIndicatorComment(this.user.givenName + ' ' + this.user.name, commentaire, this._id).subscribe(_ => {
        this.comments$ = this.api.getIndicatorComments(this._id);
      });
    } else if (this.type === 'frame') {
      this.api.setFrameComment(this.user.givenName + ' ' + this.user.name, commentaire, this._id).subscribe(_ => {
        this.comments$ = this.api.getFrameComments(this._id);
      });
    }

  }

}


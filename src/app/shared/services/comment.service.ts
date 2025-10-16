import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CommentType} from "../../../types/comment.type";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentActionType} from "../../../types/comment-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {}

  postComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {text, article})
  }

  getComments(offset: number, article: string): Observable<{allCount: number, comments: CommentType[]}> {
    return this.http.get<{allCount: number, comments: CommentType[]}>(environment.api + 'comments/?offset=' + offset + '&article=' + article)
  }

  commentAction(id: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {action})
  }

  getCommentActions(id: string): Observable<CommentActionType | DefaultResponseType> {
    return this.http.get<CommentActionType | DefaultResponseType>(environment.api + 'comments/' + id + '/actions')
  }

  getArticleCommentActions(id: string): Observable<CommentActionType | DefaultResponseType> {
    return this.http.get<CommentActionType | DefaultResponseType>(environment.api + 'comments/article-comment-actions?articleId=' + id)
  }
}

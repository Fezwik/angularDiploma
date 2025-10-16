import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleInformationType} from "../../../../types/article-information.type";
import {ArticleType} from "../../../../types/article.type";
import {CommentService} from "../../../shared/services/comment.service";
import {CommentType} from "../../../../types/comment.type";
import {CommentActionType} from "../../../../types/comment-action.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  articleData: ArticleInformationType = {
    text: '',
    comments: [],
    commentsCount: 0,
    id: '',
    title: '',
    description: '',
    image: '',
    date: '',
    category: '',
    url: ''
  }

  comment: { text: string, article: string } = {
    text: '',
    article: ''
  }

  articleCommentsActions: CommentActionType = []

  comments: CommentType[] = []
  relatedArticles: ArticleType[] = new Array<ArticleType>;
  loading: boolean = false;
  like: boolean = false;
  dislike: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private articleService: ArticleService,
              private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private authService: AuthService,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe({
          next: article => {
            this.articleData = article
            this.comments = article.comments

            this.commentService.getArticleCommentActions(article.id)
              .subscribe(data => {
                this.articleCommentsActions = data as CommentActionType

                article.comments.forEach((comment: CommentType) => {
                  this.articleCommentsActions.forEach(item=> {
                    if (comment.id === item.comment) {
                      comment.action = item.action
                    }
                  })
                })
              })
          },
          error: error => {
            this._snackBar.open(error)
            this.router.navigate(['/blog'])
          }
        })

      this.articleService.getRelatedArticles(params['url'])
        .subscribe(articles => {
          this.relatedArticles = articles
        })
    })
  }

  loadComments(offset: number, article: string) {
    this.loading = true
    if (this.articleData.commentsCount - offset <= 10) {
      offset = this.comments.length
    }
    this.commentService.getComments(offset, article)
      .subscribe(data => {
        this.loading = false
        if (this.comments.length < data.allCount) {
          this.comments = this.comments.concat(data.comments)
        }

        this.commentService.getArticleCommentActions(article)
          .subscribe(data => {
            this.articleCommentsActions = data as CommentActionType

            this.comments.forEach((comment: CommentType) => {
              this.articleCommentsActions.forEach(item=> {
                if (comment.id === item.comment) {
                  comment.action = item.action
                }
              })
            })
          })
      })
  }

  postComment(article: string) {
    this.commentService.postComment(this.comment.text, article)
      .subscribe(data => {
        this.comment.text = ''
        this.comment.article = ''
        this.commentService.getComments(0, this.articleData.id)
          .subscribe(data => this.comments = Array(data.comments[0]).concat(this.comments))
      })
  }

  makeAction(comment: CommentType, action: string) {
    if (this.authService.getIsLoggedIn()) {
      this.commentService.commentAction(comment.id, action)
        .subscribe({
          next: data => {
            if (comment.action === action) {
              if (comment.action === 'like') {
                comment.likesCount--
              } else if (comment.action === 'dislike') {
                comment.dislikesCount--
              }
              comment.action = ''
            } else if (comment.action === 'dislike' || comment.action === 'like') {
              if (action === 'like') {
                comment.likesCount++
                comment.dislikesCount--
              } else if (action === 'dislike') {
                comment.dislikesCount++
                comment.likesCount--
              }
              comment.action = action
            } else if (action === 'violate') {
              comment.violation = true
              this._snackBar.open('Жалоба отправлена')
            } else {
              if (action === 'like') {
                comment.likesCount++
              } else if (action === 'dislike') {
                comment.dislikesCount++
              }
              comment.action = action
            }
            this._snackBar.open('Ваш голос учтен')
          },
          error: error => {
            this._snackBar.open('Жалоба уже отправлена')
          }
        })
    }
  }

  protected readonly localStorage = localStorage;
}


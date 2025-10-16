import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {ArticleType} from "../../../types/article.type";
import {BlogListType} from "../../../types/blog-list.type";
import {CategoryListType} from "../../../types/category-list.type";
import {ArticleInformationType} from "../../../types/article-information.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(): Observable<BlogListType> {
    return this.http.get<BlogListType>(environment.api + 'articles')
  }

  getArticle(url: string): Observable<ArticleInformationType> {
    return this.http.get<ArticleInformationType>(environment.api + 'articles/' + url)
  }

  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url)
  }

  getArticlesFiltered(category:string): Observable<BlogListType> {
    return this.http.get<BlogListType>(environment.api + 'articles?' + category)
  }

  getTopArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top')
  }

  getCategories(): Observable<CategoryListType[]> {
    return this.http.get<CategoryListType[]>(environment.api + 'categories')
  }
}

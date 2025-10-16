import {ArticleType} from "./article.type";

export type BlogListType = {
  count: number,
  pages: number,
  items: ArticleType[],
  params? : string
}

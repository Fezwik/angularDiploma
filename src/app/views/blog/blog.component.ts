import {Component, HostListener, OnInit} from '@angular/core';
import {ArticleService} from "../../shared/services/article.service";
import {BlogListType} from "../../../types/blog-list.type";
import {CategoryListType} from "../../../types/category-list.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveFilterType} from "../../../types/active-filter.type";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: BlogListType = {
    count: 0,
    pages: 0,
    items: []
  };

  open: boolean = false;
  pages: number[] = []
  searchParams = new URLSearchParams()

  filterCategories: CategoryListType[] = [];
  activeFilters: ActiveFilterType = {
    page: 1,
    categories: []
  };

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.open && (event.target as HTMLElement).className.indexOf('blog-filter') === -1) {
      this.open = false;

    }
  }

  constructor(private articleService: ArticleService,
              private activatedRoute: ActivatedRoute,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['categories']) {
          this.activeFilters.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']]
          if (params['pages']) {
            this.activeFilters.page = +params['pages'];
            this.pages = [];
            for (let i = 1; i <= params['pages']; i++) {
              this.pages.push(i);
            }
          }

          this.getFilteredData(this.activeFilters)
        } else {
          this.articleService.getArticles()
            .subscribe((data: BlogListType) => {
              if (data) {
                this.articles = data
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
              }
            })
        }

      })

    this.articleService.getCategories()
      .subscribe((data: CategoryListType[]) => {
        if (data) {
          this.activeFilters.categories.forEach(category => {
            data.forEach(item => {
              if (item.url === category) {
                item.chosen = true
              }
            })
          })
          this.filterCategories = data
        }
      })
  }

  processFilter(category: CategoryListType): void {
    this.activeFilters.page = 1;
    const findElement = this.activeFilters.categories.some((item) => {
      return item === category.url
    });
    if (findElement) {
      category.chosen = false
      this.activeFilters.categories = this.activeFilters.categories.filter((item) => {
        return item !== category.url
      })
    } else {
      category.chosen = true
      this.activeFilters.categories = this.activeFilters.categories.filter((item) => {
        return item !== category.url
      })
      this.activeFilters.categories.push(category.url)
      // Почему-то в URL строку не добавляются параметры, если не создать новый массив
      // Чтобы проверить, закомментируй строчку ниже. Это баг или я что-то не понял?
      this.activeFilters.categories = this.activeFilters.categories.flat()
    }

    this.router.navigate(['/blog'], {
      queryParams: this.activeFilters
    })
    this.getFilteredData(this.activeFilters)
  }

  getFilteredData(activeFilters: ActiveFilterType) {
    this.searchParams.delete('page')
    this.searchParams.delete('categories')
    this.searchParams.append('page', activeFilters.page.toString());
    activeFilters.categories.forEach((item) => {
      this.searchParams.append('categories', item);
    });

    this.articleService.getArticlesFiltered(this.searchParams.toString())
      .subscribe(data => {
        this.articles = data
        this.pages = [];
        for (let i = 1; i <= data.pages; i++) {
          this.pages.push(i);
        }
      })
  }

  removeFilter(category: CategoryListType) {
    category.chosen = false
    this.processFilter(category)
  }

  openPage(page: number) {
    this.activeFilters.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeFilters
    })
  }

  openPrevPage() {
    if (this.activeFilters.page && this.activeFilters.page > 1) {
      this.activeFilters.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeFilters
      })
    }
  }

  openNextPage() {
    if (this.activeFilters.page && (this.activeFilters.page < this.pages.length)) {
      this.activeFilters.page++
      this.router.navigate(['/blog'], {
        queryParams: this.activeFilters
      })
    }
  }

  toggleOpen() {
    this.open = !this.open;
  }
}

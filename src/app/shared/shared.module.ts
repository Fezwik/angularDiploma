import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout/layout.component';
import {RouterModule, RouterOutlet} from "@angular/router";
import {HeaderComponent} from "./layout/header/header.component";
import {FooterComponent} from "./layout/footer/footer.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import { ArticleCardComponent } from './components/article-card/article-card.component';
import {ShortTextPipe} from "./pipes/short-text.pipe";
import {FormatDatePipe} from "./pipes/format-date.pipe";
import {ShortTitlePipe} from "./pipes/short-title.pipe";


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ArticleCardComponent,
    ShortTextPipe,
    ShortTitlePipe,
    FormatDatePipe
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
  ],
  exports: [LayoutComponent, HeaderComponent, FooterComponent, ArticleCardComponent, ShortTextPipe, FormatDatePipe, ShortTitlePipe]
})
export class SharedModule {
}

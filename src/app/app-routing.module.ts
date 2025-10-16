import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {AuthForwardGuard} from "./core/auth/auth-forward.guard";
import {MainComponent} from "./views/main/main.component";
import {BlogComponent} from "./views/blog/blog.component";
import {ArticleComponent} from "./views/blog/article/article.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {
        path: '',
        loadChildren: ()=> import('./views/user/user.module').then(m => m.UserModule),
        canActivate: [AuthForwardGuard]
      },
      {path: 'blog', component: BlogComponent},
      {path: 'blog/:url', component: ArticleComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {anchorScrolling: "enabled", scrollPositionRestoration: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

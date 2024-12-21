import { Routes } from '@angular/router';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { LoginComponent } from './components/login/login.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { AuthorPostListComponent } from './components/posts/author-post-list/author-post-list.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { AuthorAuthGuardService } from './services/author-auth-guard.service';
import { PostDetailsComponent } from './components/posts/post-details/post-details.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
export const routes: Routes = [
    {path: 'author-list', component: AuthorPostListComponent, canActivate: [AuthorAuthGuardService]},
    {path: 'reviews', component: ReviewsComponent, canActivate: [AuthorAuthGuardService]},
    {path: 'post-list', component: PostListComponent, },
    {path: 'post/:id', component: PostDetailsComponent, },
    {path: 'add-post', component: PostCreateComponent, canActivate: [AuthorAuthGuardService]},
    { path: 'edit-post/:id', component: EditPostComponent, canActivate: [AuthorAuthGuardService]},
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

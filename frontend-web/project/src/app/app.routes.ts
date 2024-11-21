import { Routes } from '@angular/router';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { LoginComponent } from './components/login/login.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { AuthorPostListComponent } from './components/posts/author-post-list/author-post-list.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
export const routes: Routes = [
    {path: 'author-list', component: AuthorPostListComponent},
    {path: 'post-list', component: PostListComponent},
    {path: 'add-post', component: PostCreateComponent},
    { path: 'edit-post/:id', component: EditPostComponent },
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

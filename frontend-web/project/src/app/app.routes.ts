import { Routes } from '@angular/router';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { LoginComponent } from './components/login/login.component';
import { PostListComponent } from './components/posts/post-list/post-list/post-list/post-list.component';
export const routes: Routes = [
    {path: 'post-list', component: PostListComponent},
    {path: 'add-post', component: PostCreateComponent},
    {path: 'login', component: LoginComponent},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];

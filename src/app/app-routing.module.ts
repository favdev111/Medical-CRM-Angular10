import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutAppComponent} from './components/about-app/about-app.component';
const GCTFileManagementModule = () => import('./components/gct-file-management/gct-file-management.module').then(x => x.GCTFileManagementModule);
const GCTEditorModule = () => import('./components/gct-editor/gct-editor.module').then(x => x.GCTEditorModule);
const routes: Routes = [
 
  { path: '', loadChildren: GCTFileManagementModule},
  { path: 'editor', loadChildren: GCTEditorModule},
  { path: 'editor/:guidelineType/:id', loadChildren: GCTEditorModule},
  { path: 'about-app', component: AboutAppComponent},
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

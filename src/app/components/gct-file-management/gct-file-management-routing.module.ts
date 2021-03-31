import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GCTFileManagementComponent } from './gct-file-management.component';


const routes: Routes = [
    {
        path: '', component: GCTFileManagementComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GCTFileManagementRoutingModule { }

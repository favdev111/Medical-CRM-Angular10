import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GCTEditorComponent } from './gct-editor.component';


const routes: Routes = [
    {
        path: '', component: GCTEditorComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GCTEditorRoutingModule { }

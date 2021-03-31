import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GCTEditorComponent } from './gct-editor.component';
import { GCTEditorRoutingModule } from './gct-editor-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FootnotesDialogComponent } from './text-editor/text-editor.component';

const components = [
  GCTEditorComponent,
  FootnotesDialogComponent
];

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    SharedModule,
    GCTEditorRoutingModule
  ],
  exports: [
    ...components
  ]
})
export class GCTEditorModule { }

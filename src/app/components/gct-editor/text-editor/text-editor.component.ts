import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import 'tinymce';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Node, Footnotes } from 'src/app/models/dto/node';
import { State } from 'src/app/store/node-store/node.reducer';
import { create, update, remove } from 'src/app/store/node-store/node.actions';
import {
  DialogData,
  ConfirmationDialogComponent
} from '../../confirmation-dialog/confirmation-dialog.component';
import {
  DELETE_NODE_CONFIRMATION,
  confirmationDialogConfig,
  footnotesDialogConfig,
  PREVENT_FOOTNOTES_REF_DELETION
} from 'src/app/constants';
import { AlertType } from 'src/app/models/enums/alert-type';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserProfileFacade } from 'src/app/store/user-profile-store/userprofile.facade';

declare var tinymce: any;

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit, OnDestroy {
  public footnotes: Footnotes[] = [];

  private _currentContent: string;
  private _loggedinUserDisplayName: string;
  private readonly _backspaceAction = 8;
  private readonly _deleteAction = 46;
  private readonly _pasteActoin = 86;
  private readonly _cutAction = 88;

  @Input() currentNode: Node;
  @Input() top: number;
  @Input() left: number;

  @Output() contentChanged: EventEmitter<any> = new EventEmitter();
  @Output() cancel = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private store: Store<State>,
    private _userProfileFacade: UserProfileFacade
  ) {}

  public ngOnInit(): void {
    this._setContent();
    this._initiateEditor();
  }

  public ngOnDestroy(): void {
    tinymce.remove('#text-editor');
    tinymce.EditorManager.execCommand('mceRemoveControl', true, '#text-editor');
    document.querySelector('mat-sidenav-content').scrollLeft = 0;
    document.querySelector('mat-sidenav-content').scrollTop = 0;
    document.querySelector('mat-sidenav-content').scrollLeft = this.left;
    document.querySelector('mat-sidenav-content').scrollTop = this.top;
  }

  public onSave(): void {
    this._setUserDisplayName();
    const node = { ...this.currentNode };
    node.content = this._currentContent;
    node.footnotes = this.footnotes;
    if (node.root && node.id === null) {
      node.createdBy = this._loggedinUserDisplayName;
      this.store.dispatch(create({ node }));
    } else {
      node.lastModifiedBy = this._loggedinUserDisplayName;
      this.store.dispatch(update({ id: node.id, changes: node }));
    }
    this.onCancel();
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  private _setUserDisplayName(): void {
    this._userProfileFacade
      .userDisplayName$
      .pipe(take(1))
      .subscribe((displayName) => {
        this._loggedinUserDisplayName = displayName;
      });
  }

  private _setContent(): void {
    this._currentContent = this.currentNode.content ? this.currentNode.content : '';
    if (this.currentNode.footnotes) {
      this.footnotes = [...this.currentNode.footnotes];
    }
  }

  private _handleEvent = (newContent: string, event) => {
    if (
      [this._backspaceAction, this._deleteAction, this._pasteActoin, this._cutAction, 37, 39].includes(
        event.keyCode
      )
    ) {
      let footnotesDeleted = false;
      for (let i = 0; i <= this.footnotes.length; i++) {
        const currentFootnote = this.footnotes[i];
        if (
          currentFootnote &&
          !newContent.includes(
            '<sup id="foot-note-ref" style="font-family: Roboto; font-size: 12px; font-weight: normal; color: #0066cc;">' +
              currentFootnote.reference +
              '</sup>'
          )
        ) {
          footnotesDeleted = true;
          break;
        }
      }
      if (footnotesDeleted) {
        this._preventFootnotesRefAlert();
        tinymce.get('text-editor').execCommand('Undo');
        this._currentContent = tinymce.get('text-editor').getContent();
      } else {
        this._currentContent = newContent;
      }
    } else {
      this._currentContent = newContent;
    }
    // TODO: To be used in edit or delete footnote dialog
    // for(let i=0;  i<=this.footnotes.length ;i++){
    //   const currentFootnote = this.footnotes[i];
    //   if(currentFootnote){
    //     if (!newContent.includes('<sup id="foot-note-ref" style="font-family: Roboto; font-size: 12px; font-weight: normal; color: #0066cc;">'+currentFootnote.reference+'</sup>')) {
    //       this.footnotes.splice(i,1);
    //     }
    //   }
    // }
    this.cdRef.detectChanges();
  };

  private _preventFootnotesRefAlert(): void {
    const data: DialogData = {
      title: 'Footnotes Reference',
      content: PREVENT_FOOTNOTES_REF_DELETION,
      type: AlertType.Info,
      acceptText: 'ok'
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      ...confirmationDialogConfig,
      data,
      panelClass: 'confirmation-dialog'
    });
  }

  private _initiateEditor = () => {
    const data = this._currentContent;
    const handleEvent = this._handleEvent;
    setTimeout(() => {
      tinymce.init({
        base_url: '/guidelines-config-tool-ui/tinymce',
        suffix: '.min',
        selector: 'textarea#text-editor',
        node_id: this.currentNode.id,
        _currentContent: this._currentContent,
        footnotes: this.footnotes,
        close_emit: this.cancel,
        content_style:
          "@import url('https://fonts.googleapis.com/css2?family=Lato:wght@900&family=Roboto&display=swap'); " +
          'body { border:none !important;font-family: Roboto;font-size: 16px;font-weight: normal;letter-spacing: 0.5px;color: rgba(0, 0, 0, 0.6); }',

        setup(editor) {
          editor.on('init', e => {
            tinymce.get('text-editor').setContent(data);
          });
          editor.on('keyup', e => {
            const myContent = tinymce.get('text-editor').getContent();
            handleEvent(myContent, e);
          });
        },
        height: '23.875rem',
        menubar: false,
        branding: false,
        statusbar: false,
        plugins: [
          'autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount',
          'footnote noneditable',
          'delete'
        ],
        toolbar:
          'bold underline italic | undo redo | link footnote | ' +
          'bullist numlist |  delete',
        defauly_link_target: '_parent',
        target_list: [
          { title: 'Same page', value: '_parent' },
          { title: 'New page', value: '_blank' }
        ]
      });

      // NOTE: Adding custom plugins to the editor
      this._createFootnotePlugin();
      this._createDeletePlugin();
    }, 0);
  };

  private _createDeletePlugin = () => {
    const store = this.store;
    const dialogCopy = this.dialog;
    const openDeleteDialog = this._openDeleteDialog;
    tinymce.PluginManager.add('delete', function (editor) {
      editor.ui.registry.addButton('delete', {
        icon: 'remove',
        onAction() {
          openDeleteDialog(
            editor.settings.node_id,
            dialogCopy,
            store,
            editor.settings.close_emit
          );
        }
      });
    });
  };

  private _openDeleteDialog(
    id: number,
    dialogCopy: MatDialog,
    store: Store<State>,
    cancel
  ): void {
    const data: DialogData = {
      title: 'Delete Confirmation',
      content: DELETE_NODE_CONFIRMATION,
      type: AlertType.Warning,
      acceptText: 'Confirm',
      declineText: 'Cancel'
    };
    const dialogRef = dialogCopy.open(ConfirmationDialogComponent, {
      ...confirmationDialogConfig,
      data,
      panelClass: 'confirmation-dialog'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        store.dispatch(remove({ id }));
        cancel.emit();
      }
    });
  }

  private _createFootnotePlugin = () => {
    const dialogCopy = this.dialog;
    const openFootnotesDialog = this._openFootnotesDialog;
    tinymce.PluginManager.add('footnote', function (editor) {
      editor.ui.registry.addButton('footnote', {
        icon: 'superscript',
        content_style:
          "@import url('https://fonts.googleapis.com/css2?family=Lato:wght@900&family=Roboto&display=swap');",
        onAction() {
          openFootnotesDialog(
            dialogCopy,
            editor.settings.footnotes,
            editor.settings._currentContent
          );
        }
      });
    });
  };

  private _openFootnotesDialog(
    dialogCopy: MatDialog,
    footnotes,
    _currentContent
  ): void {
    const dialogRef = dialogCopy.open(FootnotesDialogComponent, {
      ...footnotesDialogConfig,
      panelClass: 'footnotes-dialog'
    });
    const eventSubscription = dialogRef.componentInstance.onAddFootnote.subscribe(
      footnote => {
        tinymce
          .get('text-editor')
          .execCommand(
            'mceInsertContent',
            false,
            '<a href="https://google.com" class="mceNonEditable"  style="cursor: pointer;"><sup id="foot-note-ref" style="font-family: Roboto;font-size: 12px;font-weight: normal;color: #0066cc;">' +
              footnote.footnoteRef +
              '</sup></a>'
          );
        let newFootnote = {
          id: null,
          reference: footnote.footnoteRef,
          content: footnote.footnoteText
        };
        footnotes.push(newFootnote);
        _currentContent = tinymce.get('text-editor').getContent();
        dialogRef.close();
      }
    );
    dialogRef
      .afterClosed()
      .subscribe(() => eventSubscription.unsubscribe())
      .unsubscribe();
  }
}

@Component({
  selector: 'foot-notes-dialog',
  templateUrl: 'foot-notes-dialog.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class FootnotesDialogComponent {
  public onAddFootnote = new EventEmitter();
  public footnoteRef = '';
  public footnoteText = '';

  constructor(private dialogRef: MatDialogRef<FootnotesDialogComponent>) {}

  public submit(): void {
    const newfootnoteText = this._checkForUrl();
    const footnote = {
      footnoteRef: this.footnoteRef,
      footnoteText: newfootnoteText
    };
    this.onAddFootnote.emit(footnote);
    this.dialogRef.close();
  }

  private _checkForUrl(): string {
    const url = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    let newfootnoteText = this.footnoteText.replace(url, function (match) {
      if (!match.includes('http')) {
        return '<a href="//' + match + '" target="_blank">' + match + '</a>';
      }
      return '<a href="' + match + '" target="_blank">' + match + '</a>';
    });
    newfootnoteText = newfootnoteText.trim();
    return newfootnoteText;
  }
}

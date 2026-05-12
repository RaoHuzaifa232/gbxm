import { MatDialogConfig } from '@angular/material/dialog';

export const DIALOG_SIZES = {
  small: {
    width: '400px',
    maxWidth: '92vw'
  },
  medium: {
    width: '560px',
    maxWidth: '92vw',
  },
  large: {
    width: '720px',
    maxWidth: '92vw'
  },
  extraLarge: {
    width: '900px',
    maxWidth: '95vw'
  }
} as const;

export const DEFAULT_DIALOG_CONFIG: MatDialogConfig = {
  autoFocus: false,
  restoreFocus: true,
  disableClose: false,
  panelClass: 'gbxm-dialog-panel'
};

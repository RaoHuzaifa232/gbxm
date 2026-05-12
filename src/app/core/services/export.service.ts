import { Injectable } from '@angular/core';

export interface ExportColumn<T> {
  header: string;
  selector: (row: T) => string | number | null | undefined;
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportToExcel<T>(rows: T[], columns: ExportColumn<T>[], fileName: string): void {
    const safeName = this.sanitizeFileName(fileName);
    const html = this.buildHtmlTable(rows, columns);
    const blob = new Blob([html], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    this.downloadBlob(blob, `${safeName}.xls`);
  }

  private buildHtmlTable<T>(rows: T[], columns: ExportColumn<T>[]): string {
    const headerHtml = columns
      .map(column => `<th style="background:#f1f3f4;border:1px solid #d0d4d7;padding:6px 10px;text-align:left;">${this.escape(column.header)}</th>`)
      .join('');

    const rowsHtml = rows
      .map(row => {
        const cells = columns
          .map(column => {
            const raw = column.selector(row);
            const value = raw === null || raw === undefined ? '' : String(raw);
            return `<td style="border:1px solid #d0d4d7;padding:6px 10px;">${this.escape(value)}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    return `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px;color:#1d222b;"><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    if (typeof document === 'undefined') {
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  private escape(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/\n/g, '<br/>');
  }

  private sanitizeFileName(name: string): string {
    return name.replace(/[\\/:*?"<>|]/g, '_').trim() || 'export';
  }
}

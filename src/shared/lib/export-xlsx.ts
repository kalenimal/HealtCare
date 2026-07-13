export interface XlsxColumn {
  header: string;
  key: string;
  width?: number;
}

export interface XlsxSheet {
  sheetName: string;
  columns: XlsxColumn[];
  rows: Record<string, string | number>[];
}

function addSheet(workbook: import('exceljs').Workbook, sheet: XlsxSheet) {
  const worksheet = workbook.addWorksheet(sheet.sheetName.slice(0, 31));

  worksheet.columns = sheet.columns.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width ?? 20,
  }));
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF144266' },
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFE5E4E0' } };

  sheet.rows.forEach((row) => worksheet.addRow(row));
}

export async function exportRowsToXlsx(
  fileName: string,
  sheetName: string,
  columns: XlsxColumn[],
  rows: Record<string, string | number>[],
) {
  await exportSheetsToXlsx(fileName, [{ sheetName, columns, rows }]);
}

export async function exportSheetsToXlsx(fileName: string, sheets: XlsxSheet[]) {
  const [{ default: ExcelJS }, { saveAs }] = await Promise.all([
    import('exceljs'),
    import('file-saver'),
  ]);

  const workbook = new ExcelJS.Workbook();
  sheets.forEach((sheet) => addSheet(workbook, sheet));

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
}

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { exportRowsToXlsx, type XlsxColumn } from '@/shared/lib/export-xlsx';

export function ExportButton({
  fileName,
  sheetName,
  columns,
  rows,
  label = 'Выгрузить в XLS',
}: {
  fileName: string;
  sheetName: string;
  columns: XlsxColumn[];
  rows: Record<string, string | number>[];
  label?: string;
}) {
  const [exporting, setExporting] = useState(false);

  const handleClick = async () => {
    setExporting(true);
    try {
      await exportRowsToXlsx(fileName, sheetName, columns, rows);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleClick} disabled={exporting}>
      {exporting ? 'Формируем файл…' : label}
    </Button>
  );
}

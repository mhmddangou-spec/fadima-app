import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatCFA, formatDateShort } from "./utils/format";

interface ExportColumn {
  header: string;
  dataKey: string;
}

export function exportToPDF(
  title: string,
  columns: ExportColumn[],
  data: any[],
  filename: string
) {
  const doc = new jsPDF();
  
  // Titre principal
  doc.setFontSize(20);
  doc.setTextColor(26, 107, 74); // FADIMA Green (#1a6b4a)
  doc.text(title, 14, 22);
  
  // Date d'export
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le : ${formatDateShort(new Date().toISOString())}`, 14, 30);

  // Table
  (doc as any).autoTable({
    startY: 36,
    head: [columns.map(c => c.header)],
    body: data.map(row => columns.map(c => row[c.dataKey])),
    theme: 'grid',
    headStyles: {
      fillColor: [26, 107, 74],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
  });

  doc.save(`${filename}.pdf`);
}

export function exportToExcel(
  data: any[],
  filename: string
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Données");
  
  // Astuce pour auto-size les colonnes
  const maxWidths = data.reduce((acc, row) => {
    Object.keys(row).forEach((key, index) => {
      const cellValue = row[key] ? row[key].toString() : "";
      acc[index] = Math.max(acc[index] || 10, cellValue.length + 2, key.length + 2);
    });
    return acc;
  }, []);
  
  worksheet['!cols'] = maxWidths.map((w: number) => ({ wch: w }));

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

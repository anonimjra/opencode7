// lib/services/export-excel.ts
// Client-side ExcelJS export of the shipment manifest.

'use client';

import type { PortNode, Shipment } from '@/types/supply-chain';

/**
 * Export the provided shipments to a styled .xlsx file and trigger a download.
 *
 * @param shipments Shipments to include in the manifest.
 * @param ports     Port lookup for origin/destination codes.
 */
export async function exportShipmentsToExcel(
  shipments: Shipment[],
  ports: PortNode[],
): Promise<void> {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Aether OS';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Aether Cargo Manifest', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  const portCode = (id: string): string =>
    ports.find((port) => port.id === id)?.code ?? id;

  worksheet.columns = [
    { header: 'Tracking No', key: 'tracking', width: 20 },
    { header: 'B/L No', key: 'bol', width: 18 },
    { header: 'Shipper', key: 'shipper', width: 26 },
    { header: 'Consignee', key: 'consignee', width: 26 },
    { header: 'Origin', key: 'origin', width: 10 },
    { header: 'Destination', key: 'destination', width: 12 },
    { header: 'Incoterm', key: 'incoterm', width: 10 },
    { header: 'Status', key: 'status', width: 18 },
    { header: 'Weight (Kg)', key: 'weight', width: 14 },
    { header: 'Value (USD)', key: 'value', width: 16 },
    { header: 'Mode', key: 'mode', width: 10 },
    { header: 'ETA', key: 'eta', width: 18 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0A1F44' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 22;
  headerRow.eachCell((cell) => {
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FF00F5FF' } },
    };
  });

  shipments.forEach((shipment) => {
    worksheet.addRow({
      tracking: shipment.trackingNumber,
      bol: shipment.bolNumber,
      shipper: shipment.shipperName,
      consignee: shipment.consigneeName,
      origin: portCode(shipment.originPortId),
      destination: portCode(shipment.destPortId),
      incoterm: shipment.incoterm,
      status: shipment.status,
      weight: shipment.weightKg,
      value: shipment.declaredValueUsd,
      mode: shipment.mode,
      eta: new Date(shipment.eta).toISOString().slice(0, 10),
    });
  });

  worksheet.getColumn('weight').numFmt = '#,##0';
  worksheet.getColumn('value').numFmt = '"$"#,##0';

  const lastRow = worksheet.rowCount;
  for (let rowIndex = 2; rowIndex <= lastRow; rowIndex += 1) {
    const row = worksheet.getRow(rowIndex);
    if (rowIndex % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF5F7FA' },
      };
    }
    row.getCell('value').font = { color: { argb: 'FF0A7D5A' }, bold: true };
  }

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: 12 },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `Aether_Shipments_Manifest_${dateStamp}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { EnrichedSalarySlip } from '@/services/salary-slip.service';
import numberToWords from 'number-to-words';

export const generatePdfBlob = async (record: EnrichedSalarySlip): Promise<Blob> => {
  const pdfDoc = await PDFDocument.create();
  
  // A4 size: 595.28 x 841.89
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Colors
  const toyotaRed = rgb(235 / 255, 10 / 255, 30 / 255);
  const black = rgb(0, 0, 0);
  const grayDark = rgb(0.2, 0.2, 0.2);
  const grayLight = rgb(0.5, 0.5, 0.5);
  const grayBg = rgb(0.95, 0.95, 0.95);
  const greenText = rgb(0, 0.5, 0);
  const redText = rgb(0.8, 0, 0);

  // Helper for drawing text
  const drawText = (text: string, x: number, y: number, font: any, size: number, color = black) => {
    page.drawText(text, { x, y: height - y, size, font, color });
  };

  const drawRightText = (text: string, rightX: number, y: number, font: any, size: number, color = black) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: rightX - textWidth, y: height - y, size, font, color });
  };

  // --- LUCIDE ICON HELPER ---
  const drawLucideIcon = (pathData: string, x: number, y: number, color: any, scale: number = 0.6) => {
    page.drawSvgPath(pathData, {
      x,
      y: height - y,
      scale,
      borderColor: color,
      borderWidth: 2,
      borderLineCap: 1, // Round
      borderLineJoin: 1, // Round
    });
  };

  // Common Icon Paths
  const indianRupeePath = 'M 6 3 h 12 M 6 8 h 12 M 6 13 l 8.5 8 M 6 13 h 3 M 9 13 c 6.667 0 6.667 -10 0 -10';
  const fileTextPath = 'M 6 22 a 2 2 0 0 1 -2 -2 V 4 a 2 2 0 0 1 2 -2 h 8 a 2.4 2.4 0 0 1 1.704 .706 l 3.588 3.588 A 2.4 2.4 0 0 1 20 8 v 12 a 2 2 0 0 1 -2 2 z M 14 2 v 5 a 1 1 0 0 0 1 1 h 5 M 10 9 H 8 M 16 13 H 8 M 16 17 H 8';
  const calculatorPath = 'M 6 2 H 18 A 2 2 0 0 1 20 4 V 20 A 2 2 0 0 1 18 22 H 6 A 2 2 0 0 1 4 20 V 4 A 2 2 0 0 1 6 2 Z M 8 6 L 16 6 M 16 14 L 16 18 M 16 10 h .01 M 12 10 h .01 M 8 10 h .01 M 12 14 h .01 M 8 14 h .01 M 12 18 h .01 M 8 18 h .01';
  const fileCheckPath = 'M 6 22 a 2 2 0 0 1 -2 -2 V 4 a 2 2 0 0 1 2 -2 h 8 a 2.4 2.4 0 0 1 1.704 .706 l 3.588 3.588 A 2.4 2.4 0 0 1 20 8 v 12 a 2 2 0 0 1 -2 2 z M 14 2 v 5 a 1 1 0 0 0 1 1 h 5 M 9 15 l 2 2 l 4 -4';

  // --- HEADER ---
  // We draw the SVG vectors directly for infinite scalability and perfect color control.
  const pathText = 'M99.2 5.96H73.74v5.63h9.4v24h6.67v-24h9.4V5.96m24.89 19.57a8.17 8.17 0 0 1-6.16 5.03 8.96 8.96 0 0 1-1.54.14c-.53 0-1.05-.05-1.55-.14a8.15 8.15 0 0 1-6.15-5.03 13 13 0 0 1-.9-4.76 13 13 0 0 1 .9-4.75 8.16 8.16 0 0 1 6.15-5.04 8.52 8.52 0 0 1 3.1 0 8.16 8.16 0 0 1 6.15 5.03 13.1 13.1 0 0 1 0 9.52m-7.7-20.46a15.7 15.7 0 1 0 0 31.41 15.7 15.7 0 0 0 0-31.41zm15.8.9h7.86l7.33 12.73 7.33-12.74h7.85l-11.85 18.67v10.96h-6.66V24.63L132.2 5.96m46.2 24.74c.52 0 1.04-.05 1.54-.14a8.15 8.15 0 0 0 6.15-5.03 13 13 0 0 0 0-9.51 8.15 8.15 0 0 0-6.15-5.03 8.78 8.78 0 0 0-3.1 0 8.15 8.15 0 0 0-6.14 5.03 12.99 12.99 0 0 0-.9 4.75c0 1.68.32 3.29.9 4.76a8.14 8.14 0 0 0 6.15 5.03 8.84 8.84 0 0 0 1.55.14m-15.7-9.93a15.7 15.7 0 1 1 31.4 0 15.7 15.7 0 0 1-31.4 0zm76.87 3.1-4.36-11.71-4.37 11.7h8.73m1.93 5.19h-12.6l-2.43 6.52h-7.42l12-29.63h8.3l12 29.63h-7.4zM221.01 5.96h-25.46v5.63h9.4v24h6.67v-24H221V5.96';
  const pathRings = 'M46.54 2.04A47.5 47.5 0 0 0 32.22 0 47.5 47.5 0 0 0 17.9 2.04C7.3 5.45 0 12.53 0 20.69c0 11.49 14.4 20.86 32.22 20.86 17.78 0 32.22-9.33 32.22-20.86 0-8.16-7.28-15.24-17.9-18.65zM32.22 32.6c-2.66 0-4.83-5.2-4.95-11.79 1.58.17 3.24.21 4.95.21 1.7 0 3.37-.08 4.96-.2-.13 6.57-2.3 11.78-4.96 11.78ZM27.6 15.7c.7-4.63 2.5-7.87 4.62-7.87 2.08 0 3.87 3.24 4.62 7.86a52.52 52.52 0 0 1-9.24.01zm12.07-.38c-1.08-7.2-4-12.4-7.45-12.4s-6.37 5.16-7.45 12.4c-6.54-1.04-11.12-3.33-11.12-6.04 0-3.66 8.33-6.62 18.57-6.62S50.8 5.62 50.8 9.28c0 2.7-4.58 5.04-11.12 6.04zM4.7 19.94c0-3.54 1.38-6.83 3.75-9.7-.04.2-.04.42-.04.58 0 4.46 6.66 8.2 15.94 9.62v1c0 8.24 2.3 15.24 5.46 17.65-14.07-.83-25.1-9.08-25.1-19.15zm29.94 19.2c3.16-2.42 5.45-9.42 5.45-17.66v-1c9.28-1.37 15.94-5.16 15.94-9.61 0-.21 0-.42-.04-.59a15.06 15.06 0 0 1 3.75 9.7c0 10.03-11.03 18.28-25.1 19.15z';

  const logoScale = 0.5;
  const logoX = 40;
  const logoY = height - 35; // adjust to align with text

  try {
    page.drawSvgPath(pathRings, { x: logoX, y: logoY, scale: logoScale, color: black });
    page.drawSvgPath(pathText, { x: logoX, y: logoY, scale: logoScale, color: toyotaRed });
  } catch (e) {
    console.error("Failed to draw SVG path", e);
    drawText('TOYOTA', 40, 40, fontBold, 24, toyotaRed);
  }
  
  drawText('Nippon Toyota', 40, 72, fontBold, 12, grayDark);

  drawRightText('SALARY SLIP', width - 40, 40, fontBold, 18, black);
  
  const getMonthName = (m: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[m - 1] || m;
  };
  drawRightText(`${getMonthName(record.month)} ${record.year}`, width - 40, 72, fontBold, 14, toyotaRed);

  // Header separator line
  page.drawLine({
    start: { x: 40, y: height - 90 },
    end: { x: width - 40, y: height - 90 },
    thickness: 1,
    color: toyotaRed,
  });

  // --- EMPLOYEE INFO ---
  const infoY = 115;
  const col1X = 40;
  const col1ValueX = 140;
  const col2X = 320;
  const col2ValueX = 380;
  const lineSpacing = 20;

  // Col 1
  drawText('Employee ID', col1X, infoY, fontRegular, 10, grayDark);
  drawText(':', col1ValueX - 10, infoY, fontRegular, 10, grayDark);
  drawText(record.employee_code, col1ValueX, infoY, fontBold, 10, black);

  drawText('Employee Name', col1X, infoY + lineSpacing, fontRegular, 10, grayDark);
  drawText(':', col1ValueX - 10, infoY + lineSpacing, fontRegular, 10, grayDark);
  drawText(record.employee_name, col1ValueX, infoY + lineSpacing, fontBold, 10, black);

  drawText('Designation', col1X, infoY + lineSpacing * 2, fontRegular, 10, grayDark);
  drawText(':', col1ValueX - 10, infoY + lineSpacing * 2, fontRegular, 10, grayDark);
  drawText(record.designation, col1ValueX, infoY + lineSpacing * 2, fontBold, 10, black);

  drawText('Department', col1X, infoY + lineSpacing * 3, fontRegular, 10, grayDark);
  drawText(':', col1ValueX - 10, infoY + lineSpacing * 3, fontRegular, 10, grayDark);
  drawText('Toyota Operations', col1ValueX, infoY + lineSpacing * 3, fontBold, 10, black); // Hardcoded fallback

  // Col 2
  drawText('Month', col2X, infoY, fontRegular, 10, grayDark);
  drawText(':', col2ValueX - 10, infoY, fontRegular, 10, grayDark);
  drawText(getMonthName(record.month).toString(), col2ValueX, infoY, fontBold, 10, black);

  drawText('Year', col2X, infoY + lineSpacing, fontRegular, 10, grayDark);
  drawText(':', col2ValueX - 10, infoY + lineSpacing, fontRegular, 10, grayDark);
  drawText(record.year.toString(), col2ValueX, infoY + lineSpacing, fontBold, 10, black);

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  drawText('Date', col2X, infoY + lineSpacing * 2, fontRegular, 10, grayDark);
  drawText(':', col2ValueX - 10, infoY + lineSpacing * 2, fontRegular, 10, grayDark);
  drawText(today, col2ValueX, infoY + lineSpacing * 2, fontBold, 10, black);

  const lastDay = new Date(record.year, record.month, 0).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  drawText('Pay Day', col2X, infoY + lineSpacing * 3, fontRegular, 10, grayDark);
  drawText(':', col2ValueX - 10, infoY + lineSpacing * 3, fontRegular, 10, grayDark);
  drawText(lastDay, col2ValueX, infoY + lineSpacing * 3, fontBold, 10, black);


  // --- NET SALARY HIGHLIGHT CARD ---
  const highlightY = 215;
  
  page.drawRectangle({
    x: 40,
    y: height - (highlightY + 45), // height is 45
    width: width - 80,
    height: 60,
    color: rgb(0.98, 0.94, 0.94), // very light red bg
    borderColor: rgb(0.9, 0.8, 0.8),
    borderWidth: 1,
  });

  // Red circle placeholder for icon
  page.drawCircle({
    x: 70,
    y: height - (highlightY + 15),
    size: 15,
    color: toyotaRed
  });
  drawLucideIcon(indianRupeePath, 61, highlightY + 5, rgb(1, 1, 1), 0.75);

  drawText('NET SALARY', 100, highlightY + 8, fontBold, 10, black);
  
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };
  
  drawText(`Rs. ${formatCurrency(record.net_salary)}`, 100, highlightY + 28, fontBold, 18, toyotaRed);

  drawText('Amount in Words:', 300, highlightY + 8, fontRegular, 10, grayDark);
  
  // Convert number to words
  let words = numberToWords.toWords(record.net_salary).replace(/-/g, ' ');
  // Title case
  words = words.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  drawText(`${words} Only`, 300, highlightY + 28, fontBold, 10, toyotaRed);

  // --- FINANCIAL TABLES (EARNINGS & DEDUCTIONS) ---
  const tableY = 305;
  const tableHeight = 160;
  const halfWidth = (width - 100) / 2;

  // Earnings Box
  page.drawRectangle({
    x: 40,
    y: height - (tableY + tableHeight),
    width: halfWidth,
    height: tableHeight,
    borderColor: grayLight,
    borderWidth: 1,
    color: rgb(1,1,1)
  });

  // Deductions Box
  page.drawRectangle({
    x: 60 + halfWidth,
    y: height - (tableY + tableHeight),
    width: halfWidth,
    height: tableHeight,
    borderColor: grayLight,
    borderWidth: 1,
    color: rgb(1,1,1)
  });

  // Headers
  drawLucideIcon(fileTextPath, 50, tableY + 8, greenText, 0.6);
  drawText('EARNINGS', 70, tableY + 20, fontBold, 10, greenText);
  drawRightText('Amount (Rs.)', 40 + halfWidth - 20, tableY + 20, fontBold, 10, black);

  drawLucideIcon(indianRupeePath, 70 + halfWidth, tableY + 8, redText, 0.6);
  drawText('DEDUCTIONS', 90 + halfWidth, tableY + 20, fontBold, 10, redText);
  drawRightText('Amount (Rs.)', 60 + halfWidth * 2 - 20, tableY + 20, fontBold, 10, black);

  // Content lines
  let currentY = tableY + 50;
  const rowSpacing = 20;

  // Earnings Rows
  drawText('Base Salary', 60, currentY, fontRegular, 10, grayDark);
  drawRightText(formatCurrency(record.base_salary), 40 + halfWidth - 20, currentY, fontRegular, 10, black);

  drawText('HRA', 60, currentY + rowSpacing, fontRegular, 10, grayDark);
  drawRightText(formatCurrency(record.hra), 40 + halfWidth - 20, currentY + rowSpacing, fontRegular, 10, black);

  drawText('Allowances', 60, currentY + rowSpacing * 2, fontRegular, 10, grayDark);
  drawRightText(formatCurrency(record.allowances), 40 + halfWidth - 20, currentY + rowSpacing * 2, fontRegular, 10, black);

  drawText('Other Allowances', 60, currentY + rowSpacing * 3, fontRegular, 10, grayDark);
  drawRightText('-', 40 + halfWidth - 20, currentY + rowSpacing * 3, fontRegular, 10, black);

  // Deductions Rows
  // Since we only have 'deductions' in the DB right now as a lump sum, we will map it nicely.
  drawText('Provident Fund (PF)', 80 + halfWidth, currentY, fontRegular, 10, grayDark);
  drawRightText(formatCurrency(record.deductions * 0.8), 60 + halfWidth * 2 - 20, currentY, fontRegular, 10, black); // Simulating split

  drawText('Professional Tax', 80 + halfWidth, currentY + rowSpacing, fontRegular, 10, grayDark);
  drawRightText(formatCurrency(record.deductions * 0.1), 60 + halfWidth * 2 - 20, currentY + rowSpacing, fontRegular, 10, black);

  drawText('Other Deductions', 80 + halfWidth, currentY + rowSpacing * 2, fontRegular, 10, grayDark);
  drawRightText(formatCurrency(record.deductions * 0.1), 60 + halfWidth * 2 - 20, currentY + rowSpacing * 2, fontRegular, 10, black);

  drawText('Income Tax', 80 + halfWidth, currentY + rowSpacing * 3, fontRegular, 10, grayDark);
  drawRightText('-', 60 + halfWidth * 2 - 20, currentY + rowSpacing * 3, fontRegular, 10, black);

  // Totals Line separators
  page.drawLine({
    start: { x: 60, y: height - (tableY + 130) },
    end: { x: 40 + halfWidth - 20, y: height - (tableY + 130) },
    thickness: 1,
    color: grayLight,
  });

  page.drawLine({
    start: { x: 80 + halfWidth, y: height - (tableY + 130) },
    end: { x: 60 + halfWidth * 2 - 20, y: height - (tableY + 130) },
    thickness: 1,
    color: grayLight,
  });

  const totalEarnings = record.base_salary + record.hra + record.allowances;

  drawText('TOTAL EARNINGS', 60, tableY + 145, fontBold, 10, greenText);
  drawRightText(formatCurrency(totalEarnings), 40 + halfWidth - 20, tableY + 145, fontBold, 10, greenText);

  drawText('TOTAL DEDUCTIONS', 80 + halfWidth, tableY + 145, fontBold, 10, redText);
  drawRightText(formatCurrency(record.deductions), 60 + halfWidth * 2 - 20, tableY + 145, fontBold, 10, redText);

  // --- SUMMARY EQUATION BOX ---
  const eqY = tableY + tableHeight + 20;

  page.drawRectangle({
    x: 40,
    y: height - (eqY + 60),
    width: width - 80,
    height: 60,
    borderColor: grayLight,
    borderWidth: 1,
    color: grayBg
  });

  drawLucideIcon(calculatorPath, 70, eqY + 12, grayLight, 0.7);
  drawText('NET SALARY (Rs.)', 100, eqY + 25, fontBold, 10, black);
  
  drawText('Total Earnings (Rs.)', 210, eqY + 20, fontRegular, 9, grayDark);
  drawText(formatCurrency(totalEarnings), 210, eqY + 40, fontBold, 12, greenText);

  drawText('-', 310, eqY + 20, fontRegular, 10, black);
  drawText('-', 310, eqY + 40, fontRegular, 10, black);

  drawText('Total Deductions (Rs.)', 340, eqY + 20, fontRegular, 9, grayDark);
  drawText(formatCurrency(record.deductions), 340, eqY + 40, fontBold, 12, redText);

  drawText('=', 440, eqY + 20, fontRegular, 10, black);
  drawText('=', 440, eqY + 40, fontRegular, 10, black);

  drawText('Net Salary (Rs.)', 470, eqY + 20, fontRegular, 9, grayDark);
  drawText(formatCurrency(record.net_salary), 470, eqY + 40, fontBold, 12, greenText);


  // --- MESSAGE BOX ---
  const msgY = eqY + 80;
  
  page.drawRectangle({
    x: 40,
    y: height - (msgY + 50),
    width: width - 80,
    height: 50,
    borderColor: grayLight,
    borderWidth: 1,
    color: rgb(1,1,1)
  });

  drawLucideIcon(fileCheckPath, 55, msgY + 8, toyotaRed, 0.6);
  drawText('SUMMARY', 80, msgY + 20, fontBold, 10, toyotaRed);
  drawText('Thank you for your contributions.', 80, msgY + 35, fontRegular, 10, black);


  // --- FOOTER ---
  const footerY = msgY + 120;
  
  // Footer red line
  page.drawLine({
    start: { x: 40, y: height - footerY },
    end: { x: width - 40, y: height - footerY },
    thickness: 1,
    color: toyotaRed,
  });

  drawText('This is a system generated salary slip.', 40, footerY + 30, fontRegular, 9, black);
  drawText('For any queries, please contact HR Department.', 40, footerY + 45, fontRegular, 9, black);

  const lineCenterX = width - 115;

  const authSigText = 'Authorized Signature';
  const authSigWidth = fontRegular.widthOfTextAtSize(authSigText, 9);
  drawText(authSigText, lineCenterX - (authSigWidth / 2), footerY + 20, fontRegular, 9, black);

  // Native SVG vector signature imitating handwritten ink
  // width of path is 120, at scale 0.4 width is 48
  const signaturePath = 'M 0 30 C 10 0, 30 0, 20 40 C 10 80, -10 60, 5 40 C 15 20, 25 30, 30 40 M 45 40 L 45 41 M 60 20 C 50 20, 50 60, 60 60 C 80 60, 80 20, 60 20 C 70 30, 75 40, 70 50 C 65 60, 80 50, 85 45 C 90 40, 95 30, 90 35 C 85 40, 95 50, 100 45 C 105 40, 110 35, 120 45';
  
  page.drawSvgPath(signaturePath, {
    x: lineCenterX - 24,
    y: height - (footerY + 20),
    scale: 0.4,
    borderColor: rgb(0.1, 0.1, 0.5), // Dark blue ink
    borderWidth: 1.5,
  });
  page.drawLine({
    start: { x: width - 170, y: height - (footerY + 50) },
    end: { x: width - 60, y: height - (footerY + 50) },
    thickness: 0.5,
    color: black,
  });

  const hrText = 'HR Manager';
  const hrWidth = fontRegular.widthOfTextAtSize(hrText, 9);
  drawText(hrText, lineCenterX - (hrWidth / 2), footerY + 65, fontRegular, 9, grayDark);

  // Bottom Red Banner
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 40,
    color: toyotaRed
  });
  
  const textWidth = fontBold.widthOfTextAtSize('TOYOTA | Nippon Toyota', 10);
  page.drawText('TOYOTA | Nippon Toyota', { x: (width - textWidth)/2, y: 22, size: 10, font: fontBold, color: rgb(1,1,1) });
  
  const subWidth = fontRegular.widthOfTextAtSize('Drive Your World', 8);
  page.drawText('Drive Your World', { x: (width - subWidth)/2, y: 10, size: 8, font: fontRegular, color: rgb(1,1,1) });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
};

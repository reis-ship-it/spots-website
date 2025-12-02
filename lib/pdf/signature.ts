/**
 * PDF Signature Utilities
 * Overlay signature on NDA PDF using pdf-lib
 */

import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

/**
 * Overlay signature image on PDF at specified coordinates
 */
export async function overlaySignatureOnPDF(
  pdfBytes: Buffer | Uint8Array,
  signatureImageBytes: Uint8Array,
  signatureX: number = 100,
  signatureY: number = 100,
  pageIndex: number = 0,
  width: number = 150,
  height: number = 50
): Promise<Uint8Array> {
  // Load the PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Get the page
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex];

  // Embed the signature image
  const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
  
  // Get page dimensions
  const { width: pageWidth, height: pageHeight } = page.getSize();

  // Calculate position (bottom-left origin in PDF coordinates)
  // Adjust Y to position from bottom
  const x = signatureX;
  const y = pageHeight - signatureY - height; // PDF coordinates start from bottom

  // Draw the signature image
  page.drawImage(signatureImage, {
    x,
    y,
    width,
    height,
  });

  // Save and return the PDF
  const pdfBytesWithSignature = await pdfDoc.save();
  return pdfBytesWithSignature;
}

/**
 * Overlay text signature on PDF
 */
export async function overlayTextSignatureOnPDF(
  pdfBytes: Buffer | Uint8Array,
  signatureText: string,
  signatureX: number = 100,
  signatureY: number = 100,
  pageIndex: number = 0,
  fontSize: number = 16
): Promise<Uint8Array> {
  // Load the PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Get the page
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex];

  // Get page dimensions
  const { width: pageWidth, height: pageHeight } = page.getSize();

  // Calculate position (bottom-left origin in PDF coordinates)
  const x = signatureX;
  const y = pageHeight - signatureY; // PDF coordinates start from bottom

  // Draw the signature text
  page.drawText(signatureText, {
    x,
    y,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  // Save and return the PDF
  const pdfBytesWithSignature = await pdfDoc.save();
  return pdfBytesWithSignature;
}

/**
 * Get NDA PDF file
 */
export async function getNDAPDF(): Promise<Uint8Array> {
  // Try multiple possible locations
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'SPOTS_NDA_fillable_v3.pdf'),
    path.join(process.cwd(), 'SPOTS_NDA_fillable_v3.pdf'),
    path.join(process.cwd(), 'public', 'nda.pdf'),
  ];
  
  for (const pdfPath of possiblePaths) {
    try {
      const pdfBytes = await fs.readFile(pdfPath);
      return new Uint8Array(pdfBytes);
    } catch (error) {
      // Try next path
      continue;
    }
  }
  
  console.error('Error: NDA PDF file not found in any of these locations:', possiblePaths);
  throw new Error('NDA PDF file not found. Please ensure SPOTS_NDA_fillable_v3.pdf is in the public folder.');
}

/**
 * Convert base64 signature image to Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const binaryString = Buffer.from(base64Data, 'base64');
  return new Uint8Array(binaryString);
}


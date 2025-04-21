import htmlPdf from 'html-pdf-node';
import fs from 'fs/promises';
import path from 'path';

/**
 * Converts an HTML file to PDF
 * @param {string} htmlFile - Path to the HTML file
 * @param {Object} options - Conversion options
 * @returns {Promise<string>} - Path to the generated PDF file
 */
export async function convertHtmlToPdf(htmlFile, options = {}) {
  try {
    const pdfFile = options.outputFile || htmlFile.replace(/\.html$/, '.pdf');
    const htmlContent = await fs.readFile(htmlFile, 'utf-8');
    
    const file = { content: htmlContent };
    const pdfOptions = {
      format: 'A4',
      path: pdfFile,
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    };
    
    await htmlPdf.generatePdf(file, pdfOptions);

    return pdfFile;
  } catch (error) {
    throw new Error(`Error during PDF conversion: ${error.message}`);
  }
}

/**
 * Creates a simple PDF conversion server to handle conversion requests
 * @param {number} port - Port to listen on
 */
export async function startPdfServer(port = 3000) {
  // This will be implemented if needed for the HTML button functionality
}
import htmlPdf from 'html-pdf-node';
import fs from 'fs/promises';
import path from 'path';
import open from 'open';

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
      printBackground: options.printBackground !== undefined ? options.printBackground : true,
      margin: {
        top: '0.65in',
        right: '0.4in',
        bottom: '0.65in',
        left: '0.4in'
      }
    };
    
    await htmlPdf.generatePdf(file, pdfOptions);
    
    // Open the PDF file if requested
    if (options.openFile) {
      await open(pdfFile);
    }

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
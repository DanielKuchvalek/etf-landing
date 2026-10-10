// Vypíše text PDF (macOS, PDFKit). Používá check_pdf.py.
// Použití: swift scripts/pdf-text.swift <soubor.pdf>
import PDFKit

guard CommandLine.arguments.count > 1, let doc = PDFDocument(url: URL(fileURLWithPath: CommandLine.arguments[1])) else { exit(1) }
print("STRAN: \(doc.pageCount)")
print(doc.string ?? "")

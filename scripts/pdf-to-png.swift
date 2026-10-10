// Převede stránky PDF na PNG (macOS, PDFKit). Slouží ke kontrole taháku a k náhledu první strany.
// Použití: swift scripts/pdf-to-png.swift <soubor.pdf> <výstupní-prefix> [šířka v px] [jen první strana: 1]
import AppKit
import PDFKit

let args = CommandLine.arguments
guard args.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else {
    print("Použití: swift pdf-to-png.swift <pdf> <prefix> [šířka] [1]")
    exit(1)
}
let width = args.count > 3 ? CGFloat(Double(args[3]) ?? 900) : 900
let onlyFirst = args.count > 4 && args[4] == "1"
let count = onlyFirst ? 1 : doc.pageCount
for i in 0..<count {
    guard let page = doc.page(at: i) else { continue }
    let box = page.bounds(for: .mediaBox)
    let scale = width / box.width
    let size = NSSize(width: box.width * scale, height: box.height * scale)
    let image = page.thumbnail(of: size, for: .mediaBox)
    guard let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
          let png = rep.representation(using: .png, properties: [:]) else { continue }
    let out = "\(args[2])-\(i + 1).png"
    try? png.write(to: URL(fileURLWithPath: out))
    print("uloženo \(out)")
}

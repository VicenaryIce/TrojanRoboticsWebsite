// Strips a file extension and a macOS-style duplicate-download suffix
// (" (1)", " (2)", ...) from a filename, e.g. "Hague TechFest (1).jpg" -> "Hague TechFest".
export function formatImageLabel(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/\s*\(\d+\)$/, '');
}

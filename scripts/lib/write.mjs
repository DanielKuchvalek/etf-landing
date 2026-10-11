// Zápis přes dočasný soubor ve stejné složce a přejmenování (na stejném disku atomické):
// běžící server tak nikdy neuvidí chybějící ani napůl zapsaný soubor.
import { writeFileSync, renameSync, rmSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

export function writeAtomic(path, data) {
  const tmp = join(dirname(path), `.${basename(path)}.tmp-${process.pid}`);
  try {
    writeFileSync(tmp, data);
    renameSync(tmp, path);
  } finally {
    rmSync(tmp, { force: true });
  }
}

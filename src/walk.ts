import type { FilePath } from './types.ts';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function* walk(directory: FilePath): any {
  for (const dirent of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, dirent.name);

    if (dirent.isFile()) {
      yield path;
    } else if (dirent.isDirectory()) {
      yield* walk(path);
    }
  }
}


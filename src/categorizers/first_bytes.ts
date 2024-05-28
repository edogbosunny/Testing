import { open } from 'node:fs/promises';
import type { FilePath } from '../types.ts';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

function toHex(uint8: number): string {
  return uint8.toString(16).padStart(2, '0');
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(toHex).join('');
}

function getFirstNBytes(n: number, file: FilePath): any {
  return new Promise((resolve, reject) => {
    const bytes = new Uint8Array(n);
    let fileHandle;

    open(file)
      .then((fh) => {
        fileHandle = fh;
        fileHandle.read(bytes).then(() => {
          resolve(bytes);
        });
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        fileHandle!.close();
      });
  });
}

export class FirstBytesCategorizer {
  constructor(private numBytes: number) {}

  async rebucket(buckets: Buckets<SortableKey>) {
    const firstBytesBuckets = new Buckets<string>();

    for (const file of buckets.allFiles()) {
      const hex = bytesToHex(await getFirstNBytes(this.numBytes, file));
      firstBytesBuckets.add(hex, [file]);
    }

    return firstBytesBuckets;
  }
}


import { stat } from 'node:fs/promises';
import type { SortableKey } from '../buckets.ts';
import { Buckets } from '../buckets.ts';

export class SizeCategorizer {
  async rebucket(buckets: Buckets<SortableKey>) {
    const sizeBuckets = new Buckets<number>();

    for (const file of buckets.allFiles()) {
      const { size } = await stat(file);
      sizeBuckets.add(size, [file]);
    }

    return sizeBuckets;
  }
}

import type { Categorizer } from './categorizers/index.ts';
import type { FilePath } from './types.ts';
import { Buckets } from './buckets.ts';
import { walk } from './walk.ts';

export async function findDuplicateFiles(directory: FilePath, categorizers: Categorizer[]) {
  let buckets = new Buckets();
  const files = [];
  const walker = walk(directory);

  while (true) {
    const res = await walker.next();
    if (res.done) break;
    files.push(res.value);
  }

  buckets.add('initial', files);

  for (const categorizer of categorizers) {
    buckets = (await categorizer.rebucket(buckets)).removeNonDuplicates();
  }

  return buckets;
}

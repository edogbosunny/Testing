import { findDuplicateFiles } from './find_duplicate_files.ts';
import categorizers from './categorizers/index.ts';

async function main() {
  const directory = process.argv[2];

  if (typeof directory === 'undefined') {
    console.warn('Directory must be provided as first argument');
    process.exitCode = 1;
    return;
  }

  try {
    const buckets = await findDuplicateFiles(directory, categorizers as any);
    if (buckets.size > 0) console.log(buckets.toString());
  } catch (error) {
    process.exitCode = 2;
    console.error(error);
  }
}

main();


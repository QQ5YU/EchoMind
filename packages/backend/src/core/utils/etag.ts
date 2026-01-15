import * as fs from 'fs';
import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import { FileOperationException } from '../error-handling/exceptions/application.exception';

export async function generateETag(
  input: string | fs.ReadStream,
): Promise<string> {
  const filePath = typeof input === 'string' ? input : input.path;

  if (!filePath || typeof filePath !== 'string') {
    throw new FileOperationException(
      'Unable to determine file path for ETag generation.',
    );
  }

  return new Promise<string>((resolve, reject) => {
    const hash = createHash('sha1');
    const stream = createReadStream(filePath);

    stream.on('error', (err) => {
      reject(
        new FileOperationException(
          `Failed to read file for ETag generation: ${err.message}`,
        ),
      );
    });

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

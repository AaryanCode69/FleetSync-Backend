import { Transform } from 'class-transformer';

export const ToTitleCase = () =>
  Transform(({ value }) => {
    if (typeof value !== 'string') return value as unknown;
    return value
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  });

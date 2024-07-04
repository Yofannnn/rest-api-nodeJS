export const isOnlySpaces = (input: string | number) => {
  if (typeof input === "number") {
    input = input.toString();
  }
  return /^\s*$/.test(input);
};

export const hasOnlySpaces = (values: Array<string | number>) => {
  return values.some(isOnlySpaces);
};

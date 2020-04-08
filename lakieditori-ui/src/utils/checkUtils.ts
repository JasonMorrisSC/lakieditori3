export function checkArgument(expression: boolean, message?: string) {
  if (!expression) {
    throw new Error(`Illegal argument: ${message}`);
  }
}

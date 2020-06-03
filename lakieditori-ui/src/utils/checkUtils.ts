export function checkArgument(expression: boolean, message?: string) {
  if (!expression) {
    console.warn(`Illegal argument: ${message}`);
  }
}

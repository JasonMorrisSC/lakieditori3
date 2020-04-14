export function checkArgument(expression: boolean, message?: string) {
  if (!expression) {
    console.error(`Illegal argument: ${message}`);
  }
}

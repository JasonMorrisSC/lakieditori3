export function assertEquals(expected: any, actual: any) {
  if (expected !== actual) {
    throw new Error(`Assertion Error: expected: '${expected}' but was: '${actual}`);
  }
}

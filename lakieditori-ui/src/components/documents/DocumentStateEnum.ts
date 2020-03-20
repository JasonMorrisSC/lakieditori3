export enum DocumentState {
  UNSTABLE = "Kesken",
  DRAFT = "Luonnos",
  RECOMMENDATION = "Suositus",
  DEPRECATED = "Poistettu",
}

export function parseDocumentState(state: string): DocumentState {
  const enumState = state.length > 0
      ? state as keyof typeof DocumentState
      : 'UNSTABLE';
  return DocumentState[enumState];
}

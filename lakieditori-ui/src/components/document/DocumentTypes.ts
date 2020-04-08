export enum DocumentState {
  UNSTABLE,
  DRAFT,
  RECOMMENDATION,
  DEPRECATED,
}

export function parseDocumentState(state: string): DocumentState {
  return DocumentState[state ? state as keyof typeof DocumentState : "UNSTABLE"];
}

export function documentStateLabelFi(state: DocumentState): string {
  switch (state) {
    case DocumentState.DRAFT:
      return "Luonnos";
    case DocumentState.RECOMMENDATION:
      return "Suositus";
    case DocumentState.DEPRECATED:
      return "Suositus";
    case DocumentState.UNSTABLE:
    default:
      return "Kesken";
  }
}

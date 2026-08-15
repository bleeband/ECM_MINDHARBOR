export function Toast({ kind, message }: { kind: "success" | "error" | "info"; message: string }) {
  return <div className={`toast ${kind}`}>{message}</div>;
}

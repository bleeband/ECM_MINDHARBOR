export function LoadingState({ label = 'Chargement en cours...' }: { label?: string }) {
  return <div className="state">{label}</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="state error">{message}</div>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="state empty">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onPage
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} onClick={() => onPage(n)} disabled={n === page}>
          {n}
        </button>
      ))}
    </div>
  );
}
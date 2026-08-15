type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'date' | 'number';
  placeholder?: string;
  error?: string;
  as?: 'input' | 'textarea';
  rows?: number;
};

export function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  as = 'input',
  rows = 4
}: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      {as === 'textarea' ? (
        <textarea name={name} value={value} placeholder={placeholder} rows={rows} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input name={name} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? <small className="error-text">{error}</small> : null}
    </label>
  );
}
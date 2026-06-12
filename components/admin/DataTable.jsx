// Tabel data padat untuk panel admin (back-office). Server-component friendly:
// tanpa state/hook. Status/aksi tetap dirender lewat komponen yang ada (Tag,
// TxnActions, Btn) di dalam renderRow.

export default function DataTable({ columns, rows, renderRow, empty }) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-bg">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={`px-5 py-3 text-[11px] font-semibold text-text-md font-body uppercase tracking-wide ${
                    c.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-lt">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-8 text-center text-text-md font-body text-sm"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Sel tabel dengan padding & alignment konsisten.
export function Td({ children, align, className = "" }) {
  return (
    <td
      className={`px-5 py-3.5 align-middle font-body text-text ${
        align === "right" ? "text-right" : "text-left"
      } ${className}`}
    >
      {children}
    </td>
  );
}

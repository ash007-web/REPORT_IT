import { useItems } from "../../hooks/useItems";

export default function AdminModerationTable({ items }) {
  const { resolveItem, deleteItem } = useItems();

  if (items.length === 0) {
    return (
      <div className="border-2 border-dashed border-[#111827] bg-white/60 p-12 text-center backdrop-blur-xl">
        <p className="font-display text-xl font-[800] uppercase text-[#111827]/40">
          No records found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-2 border-[#111827] bg-white/60 backdrop-blur-xl shadow-[8px_8px_0px_#111827]">
      <table className="w-full min-w-[800px] text-left font-body">
        <thead className="bg-[#F3F4F1] border-b-4 border-[#111827] text-[#111827]">
          <tr>
            <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">ID</th>
            <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Type</th>
            <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Title</th>
            <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Date</th>
            <th className="p-4 text-[10px] font-[800] uppercase tracking-[0.14em]">Status</th>
            <th className="p-4 text-right text-[10px] font-[800] uppercase tracking-[0.14em]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-[#111827]">
          {items.map((item) => (
            <tr 
              key={item.id}
              className="group transition-all hover:-translate-y-px hover:bg-white hover:shadow-[0_4px_0px_#111827]"
            >
              <td className="p-4 text-[12px] font-[700] text-[#6B7280]">
                #{String(item.id).padStart(4, "0")}
              </td>
              <td className="p-4">
                <span 
                  className={`
                    border-2 border-[#111827] px-2 py-1 text-[9px] font-[800] uppercase tracking-[0.1em]
                    ${item.type === 'lost' ? 'bg-[#E63946] text-white' : 'bg-[#4361EE] text-white'}
                  `}
                >
                  {item.type}
                </span>
              </td>
              <td className="p-4">
                <p className={`text-[13px] font-[700] uppercase tracking-wider ${item.status === 'resolved' ? 'text-gray-500 line-through' : 'text-[#111827]'}`}>
                  {item.title}
                </p>
              </td>
              <td className="p-4 text-[12px] font-[500] text-[#374151]">
                {item.date}
              </td>
              <td className="p-4 text-[12px] font-[700] uppercase text-[#111827]">
                {item.status}
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  {item.status !== "resolved" && (
                    <button
                      onClick={() => resolveItem(item.id)}
                      className="
                        border-2 border-[#111827] bg-white px-3 py-1.5 
                        text-[10px] font-[800] uppercase tracking-[0.08em] 
                        text-[#111827] transition-all hover:translate-x-px hover:translate-y-px 
                        hover:shadow-[2px_2px_0px_#111827]
                      "
                    >
                      Force Resolve
                    </button>
                  )}
                  {deleteItem && (
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="
                        border-2 border-[#111827] bg-[#E63946] px-3 py-1.5 
                        text-[10px] font-[800] uppercase tracking-[0.08em] 
                        text-white transition-all hover:translate-x-px hover:translate-y-px 
                        hover:shadow-[2px_2px_0px_#111827]
                      "
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

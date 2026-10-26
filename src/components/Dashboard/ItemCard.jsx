import { useAuth } from "../../context/AuthContext";
import { useItems } from "../../hooks/useItems";

export default function ItemCard({ item, onResolved, onDeleted }) {
  const { currentUser } = useAuth();
  const { resolveItem, deleteItem } = useItems();

  const isLost = item.type === "lost";
  const isResolved = item.status === "resolved";
  
  const isOwner = currentUser?.id === (item.userId || item.user_id);
  const isAdmin = currentUser?.role === "admin";
  const canEdit = isOwner || isAdmin;

  const accent = isLost ? "#E63946" : "#4361EE";
  const shadowClass = isLost
    ? "shadow-[6px_6px_0px_#E63946]"
    : "shadow-[6px_6px_0px_#4361EE]";

  const handleResolve = async () => {
    try {
      await resolveItem(item.id);
      if (onResolved) onResolved(item.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteItem(item.id);
        if (onDeleted) onDeleted(item.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Format date display
  let displayDate = item.date;
  if (!displayDate && item.item_date) {
    displayDate = String(item.item_date).split("T")[0];
  }

  return (
    <article
      className={`
        group relative
        overflow-hidden
        border-2
        p-7
        backdrop-blur-xl
        transition-all
        duration-200
        ${shadowClass}

        ${
          isResolved
            ? "bg-gray-100/80 border-gray-400 shadow-none"
            : "bg-white/80 border-[#111827] hover:-translate-y-1"
        }
      `}
    >
      <div
        className="absolute left-0 top-0 h-full w-1.5"
        style={{
          backgroundColor: accent,
        }}
      />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="
              border-2 px-3 py-1
              font-body text-[10px]
              font-[800] uppercase
              tracking-[0.14em]
            "
            style={{
              borderColor: accent,
              color: accent,
              backgroundColor: isLost ? "rgba(230, 57, 70, 0.08)" : "rgba(67, 97, 238, 0.08)",
            }}
          >
            {item.type}
          </div>

          <span
            className={`
              border-2 px-2.5 py-1 font-body text-[9px] font-[800] uppercase tracking-[0.12em]
              ${isResolved ? "border-gray-500 bg-gray-200 text-gray-700" : "border-[#111827] bg-[#111827] text-white"}
            `}
          >
            {item.status}
          </span>
        </div>

        <span className="font-body text-[11px] font-[700] uppercase tracking-[0.12em] text-[#6B7280]">
          #{String(item.id).padStart(4, "0")}
        </span>
      </div>

      <h2
        className={`
          font-display
          text-[24px]
          md:text-[27px]
          font-[800]
          uppercase
          leading-[1.1]
          tracking-wider
          ${
            isResolved
              ? "line-through text-gray-500"
              : "text-[#111827]"
          }
        `}
      >
        {item.title}
      </h2>

      <p className="mt-3 font-body text-[14px] md:text-[15px] font-[500] leading-[1.55] tracking-normal text-[#4B5563] line-clamp-3">
        {item.description}
      </p>

      <div className="my-5 space-y-2.5 border-y-2 border-[#111827]/10 py-4">
        <Meta
          label="LOCATION"
          value={item.location}
        />

        <Meta
          label="DATE"
          value={displayDate || "Recent"}
        />

        {item.reporter_name && (
          <Meta
            label="REPORTED BY"
            value={`${item.reporter_name}${item.student_id ? ` (${item.student_id})` : ""}`}
          />
        )}
      </div>

      {isResolved ? (
        <div className="border-2 border-gray-400 bg-gray-200/60 px-4 py-2.5 text-center">
          <p className="font-body text-[11px] font-[800] uppercase tracking-[0.1em] text-gray-700">
            ✓ Case Resolved
          </p>
        </div>
      ) : canEdit ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleResolve}
            className="
              flex-1
              border-2 border-[#111827]
              bg-white
              px-4 py-2.5
              font-body text-[11px]
              font-[800]
              uppercase
              tracking-[0.08em]
              text-[#111827]
              shadow-[3px_3px_0px_#111827]
              transition-all
              hover:translate-x-[1px]
              hover:translate-y-[1px]
              hover:shadow-none
            "
          >
            Mark as Resolved
          </button>
          
          {isAdmin && (
            <button
              type="button"
              onClick={handleDelete}
              className="
                border-2 border-[#111827]
                bg-[#E63946]
                px-3 py-2.5
                font-body text-[11px]
                font-[800]
                uppercase
                tracking-[0.08em]
                text-white
                shadow-[3px_3px_0px_#111827]
                transition-all
                hover:translate-x-[1px]
                hover:translate-y-[1px]
                hover:shadow-none
              "
            >
              Delete
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 font-body text-[10px] font-[700] uppercase tracking-[0.12em] text-[#6B7280]">
          <span
            className="h-2 w-2"
            style={{
              backgroundColor: accent,
            }}
          />
          Awaiting Resolution
        </div>
      )}
    </article>
  );
}

function Meta({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-body text-[10px] font-[700] tracking-[0.14em] text-[#6B7280]">
        {label}
      </span>

      <span className="text-right font-body text-[13px] font-[600] leading-[1.3] text-[#111827]">
        {value}
      </span>
    </div>
  );
}

import { useItems } from "../../hooks/useItems";
import ItemCard from "./ItemCard";

const filters = [
  {
    value: "all",
    label: "ALL SIGNALS",
  },
  {
    value: "lost",
    label: "LOST",
  },
  {
    value: "found",
    label: "FOUND",
  },
];

export default function Feed() {
  const {
    items,
    filter,
    setFilter,
    activeCount,
    lostCount,
    foundCount,
  } = useItems();

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse bg-found" />

            <span className="font-body text-xs font-[700] uppercase tracking-[0.14em] text-[#111827]">
              Campus Radar / Live
            </span>
          </div>

          <h1 className="font-display text-[clamp(3.5rem,6vw,6.5rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-[#111827]">
            Find what
            <br />
            went missing.
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat
            value={activeCount}
            label="ACTIVE"
          />

          <Stat
            value={lostCount}
            label="LOST"
          />

          <Stat
            value={foundCount}
            label="FOUND"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-y-2 border-black/10 py-4">
        {filters.map((option) => {
          const active = filter === option.value;

          return (
            <button
              key={option.value}
              onClick={() =>
                setFilter(option.value)
              }
              className={`
                border-2 px-5 py-3
                font-body text-[11px] font-[800]
                uppercase tracking-[0.08em]
                transition-all
                duration-150
                backdrop-blur
                ${
                  active
                    ? "border-[#111827] bg-[#111827] text-white shadow-[4px_4px_0px_#E63946]"
                    : "border-black/25 bg-white/60 text-[#374151] hover:border-[#111827] hover:text-[#111827]"
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {items.length > 0 ? (
        <div
          className="
            columns-1
            gap-7
            md:columns-2
            xl:columns-3
          "
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`
                mb-7 break-inside-avoid
                ${
                  index % 3 === 1
                    ? "md:translate-y-10"
                    : ""
                }
                ${
                  index % 5 === 3
                    ? "xl:translate-y-16"
                    : ""
                }
              `}
            >
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
            border-2 border-dashed border-[#111827]
            bg-white/60
            p-12
            text-center
            backdrop-blur-xl
          "
        >
          <p className="font-display text-3xl font-[800] uppercase text-[#111827]/40">
            No signals detected
          </p>

          <p className="mt-2 font-body text-sm font-[500] text-[#111827]/30">
            Try another radar filter.
          </p>
        </div>
      )}
    </section>
  );
}

function Stat({ value, label }) {
  let labelColor = "text-campus-muted";
  if (label === "LOST") labelColor = "text-[#E63946]";
  if (label === "FOUND") labelColor = "text-[#4361EE]";
  if (label === "ACTIVE") labelColor = "text-[#111827]";

  return (
    <div
      className="
        min-w-[75px]
        border-2 border-[#111827]
        bg-white/60
        px-4 py-3
        backdrop-blur-xl
      "
    >
      <p className="font-display text-[36px] lg:text-[42px] font-[800] leading-none tracking-[-0.01em] text-campus-text">
        {value}
      </p>

      <p className={`mt-1 font-body text-[10px] md:text-[11px] font-[700] tracking-[0.12em] uppercase ${labelColor}`}>
        {label}
      </p>
    </div>
  );
}

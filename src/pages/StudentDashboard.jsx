import { Link } from "react-router-dom";
import { useItems } from "../hooks/useItems";
import ItemCard from "../components/Dashboard/ItemCard";

export default function StudentDashboard() {
  const { items, activeCount, lostCount, foundCount, isLoading, error } = useItems();

  // Recently reported items (top 6)
  const recentItems = items.slice(0, 6);

  // Compact campus activity feed (last 4 items)
  const activityFeed = items.slice(0, 5);

  return (
    <div className="space-y-10">
      {/* Welcome & Action Banner */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b-2 border-[#111827]/15 pb-8">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse bg-[#4361EE]" />
            <span className="font-body text-xs font-[800] uppercase tracking-[0.16em] text-[#111827]">
              Campus Discovery Network / Student Terminal
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-[#111827]">
            Lost Something?
            <br />
            <span className="text-[#4361EE]">Broadcast It.</span>
          </h1>
          <p className="mt-3 max-w-xl font-body text-[14px] md:text-[15px] font-[500] text-[#4B5563]">
            Track lost and found belongings across the university campus in real-time. Fast verification, immediate broadcasting, and safe claim returns.
          </p>
        </div>

        {/* Quick Report Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/report?type=lost"
            className="
              border-2 border-[#111827] bg-[#E63946] px-5 py-3.5
              font-body text-[11px] font-[800] uppercase tracking-[0.1em] text-white
              shadow-[4px_4px_0px_#111827] transition-all hover:translate-x-[2px]
              hover:translate-y-[2px] hover:shadow-none
            "
          >
            + Report Lost Item
          </Link>
          <Link
            to="/report?type=found"
            className="
              border-2 border-[#111827] bg-[#4361EE] px-5 py-3.5
              font-body text-[11px] font-[800] uppercase tracking-[0.1em] text-white
              shadow-[4px_4px_0px_#111827] transition-all hover:translate-x-[2px]
              hover:translate-y-[2px] hover:shadow-none
            "
          >
            + Report Found Item
          </Link>
        </div>
      </div>

      {/* Real Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <SummaryCard
          title="LOST ITEMS"
          count={lostCount}
          description="Active incidents awaiting recovery"
          accent="#E63946"
          link="/browse?type=lost"
          linkText="Browse Lost Items →"
        />
        <SummaryCard
          title="FOUND ITEMS"
          count={foundCount}
          description="Found articles awaiting safe owner retrieval"
          accent="#4361EE"
          link="/browse?type=found"
          linkText="Browse Found Items →"
        />
        <SummaryCard
          title="MY REPORTS"
          count={items.filter(i => i.userId === 1).length} // Will show count of reports
          description="Track status and resolutions of your submissions"
          accent="#111827"
          link="/my-reports"
          linkText="View My Case History →"
        />
      </div>

      {/* Main Grid: Recently Reported Items + Compact Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* Left Column: Recently Reported Items */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-[#111827] pb-3">
            <div>
              <h2 className="font-display text-[26px] font-[800] uppercase tracking-wide text-[#111827]">
                Recently Reported Items
              </h2>
              <p className="font-body text-[11px] font-[600] uppercase tracking-[0.1em] text-[#6B7280]">
                Live campus broadcasts
              </p>
            </div>

            <Link
              to="/browse"
              className="
                border-2 border-[#111827] bg-white px-3 py-1.5
                font-body text-[10px] font-[800] uppercase tracking-[0.08em] text-[#111827]
                shadow-[2px_2px_0px_#111827] hover:shadow-none transition-all
              "
            >
              Browse All ({items.length}) →
            </Link>
          </div>

          {isLoading ? (
            <div className="border-2 border-dashed border-[#111827] bg-white/60 p-12 text-center backdrop-blur-xl">
              <p className="font-display text-xl font-[800] uppercase text-[#111827]">
                Scanning Campus Radar...
              </p>
            </div>
          ) : error ? (
            <div className="border-2 border-[#E63946] bg-[#E63946]/10 p-6">
              <p className="font-body text-xs font-[800] uppercase tracking-wider text-[#E63946]">
                Error loading radar: {error}
              </p>
            </div>
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#111827] bg-white/60 p-12 text-center backdrop-blur-xl">
              <p className="font-display text-2xl font-[800] uppercase text-[#111827]/40">
                No items currently reported
              </p>
              <p className="mt-2 font-body text-xs text-[#6B7280]">
                Be the first to broadcast a lost or found item.
              </p>
            </div>
          )}
        </section>

        {/* Right Column: Campus Activity Feed & Guidelines */}
        <aside className="space-y-6">
          <div className="border-2 border-[#111827] bg-white/80 p-6 backdrop-blur-xl shadow-[6px_6px_0px_#111827]">
            <div className="mb-4 flex items-center justify-between border-b-2 border-[#111827]/10 pb-3">
              <h3 className="font-display text-lg font-[800] uppercase tracking-wide text-[#111827]">
                Campus Activity Feed
              </h3>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-4">
              {activityFeed.map((item) => {
                const isLost = item.type === "lost";
                return (
                  <div
                    key={item.id}
                    className="border-l-4 pl-3 py-1 space-y-1 transition-colors hover:bg-black/5"
                    style={{ borderColor: isLost ? "#E63946" : "#4361EE" }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="font-body text-[9px] font-[800] uppercase tracking-[0.14em]"
                        style={{ color: isLost ? "#E63946" : "#4361EE" }}
                      >
                        {item.type} • #{String(item.id).padStart(4, "0")}
                      </span>
                      <span className="font-body text-[10px] font-[600] text-[#6B7280]">
                        {item.date}
                      </span>
                    </div>
                    <p className="font-display text-[14px] font-[700] uppercase leading-snug text-[#111827] truncate">
                      {item.title}
                    </p>
                    <p className="font-body text-[11px] font-[500] text-[#4B5563] truncate">
                      📍 {item.location}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#111827]/10">
              <Link
                to="/browse"
                className="
                  block w-full text-center border-2 border-[#111827] bg-[#F3F4F1] py-2
                  font-body text-[10px] font-[800] uppercase tracking-[0.1em] text-[#111827]
                  hover:bg-white transition-colors
                "
              >
                Open Discovery Feed →
              </Link>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="border-2 border-[#111827] bg-white/70 p-6 backdrop-blur-xl shadow-[4px_4px_0px_#4361EE]">
            <p className="font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#4361EE]">
              Campus Protocol
            </p>
            <h4 className="mt-1 font-display text-[16px] font-[800] uppercase text-[#111827]">
              Found Valuables?
            </h4>
            <p className="mt-2 font-body text-[12px] font-[500] text-[#4B5563] leading-relaxed">
              If you discover student IDs, electronics, or wallets, report them promptly here or deposit them at Central Security for verification.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SummaryCard({ title, count, description, accent, link, linkText }) {
  return (
    <div
      className="
        border-2 border-[#111827] bg-white/80 p-6 backdrop-blur-xl
        shadow-[5px_5px_0px_#111827] hover:-translate-y-1 transition-all
        flex flex-col justify-between
      "
    >
      <div>
        <div className="flex items-center justify-between">
          <p
            className="font-body text-[11px] font-[800] uppercase tracking-[0.14em]"
            style={{ color: accent }}
          >
            {title}
          </p>
          <span
            className="h-2 w-2"
            style={{ backgroundColor: accent }}
          />
        </div>

        <p className="mt-3 font-display text-5xl font-[800] leading-none text-[#111827]">
          {count}
        </p>

        <p className="mt-2 font-body text-xs font-[500] text-[#6B7280]">
          {description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-[#111827]/10">
        <Link
          to={link}
          className="font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-[#111827] hover:text-[#4361EE] flex items-center justify-between"
        >
          <span>{linkText}</span>
        </Link>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useItems } from "../hooks/useItems";
import ItemCard from "../components/Dashboard/ItemCard";

export default function BrowseItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "all";

  const { items, isLoading, error } = useItems();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"

  // Update type filter when url search params change
  const handleTypeChange = (type) => {
    setTypeFilter(type);
    if (type === "all") {
      searchParams.delete("type");
    } else {
      searchParams.set("type", type);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
    setSortOrder("newest");
    setSearchParams({});
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter: title and description
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.location?.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((item) => item.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Sorting: Newest or Oldest by date/created_at
    result.sort((a, b) => {
      const dateA = new Date(a.created_at || a.item_date || a.date);
      const dateB = new Date(b.created_at || b.item_date || b.date);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [items, searchTerm, typeFilter, statusFilter, sortOrder]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <span className="h-2 w-2 bg-[#4361EE]" />
          <span className="font-body text-xs font-[800] uppercase tracking-[0.16em] text-[#111827]">
            Discovery Radar / Browse Catalog
          </span>
        </div>

        <h1 className="font-display text-[clamp(2.5rem,4.5vw,4.5rem)] font-[800] uppercase leading-[0.95] tracking-[-0.02em] text-[#111827]">
          Browse Campus Items
        </h1>
        <p className="mt-2 max-w-2xl font-body text-[14px] font-[500] text-[#4B5563]">
          Search verified reports across academic blocks, labs, libraries, and campus grounds. Use the filters to pinpoint matching items.
        </p>
      </div>

      {/* Control Panel: Search, Type Filter, Status Filter, Sort, Reset */}
      <div className="border-2 border-[#111827] bg-white/80 p-6 backdrop-blur-xl shadow-[6px_6px_0px_#111827] space-y-5">
        {/* Search Bar */}
        <div>
          <label className="mb-2 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
            Search by Title, Description, or Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search e.g. 'AirPods', 'Scientific Calculator', 'Library'..."
              className="
                w-full border-2 border-[#111827] bg-white px-4 py-3
                font-body text-[14px] font-[500] text-[#111827] outline-none
                placeholder:text-gray-400 focus:border-[#4361EE]
              "
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs font-[800] uppercase text-[#E63946]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {/* Signal Type */}
          <div>
            <label className="mb-2 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
              Report Type
            </label>
            <div className="flex border-2 border-[#111827] bg-white">
              {["all", "lost", "found"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  className={`
                    flex-1 py-2 font-body text-[10px] font-[800] uppercase tracking-[0.06em] transition-all
                    ${
                      typeFilter === t
                        ? t === "lost"
                          ? "bg-[#E63946] text-white"
                          : t === "found"
                          ? "bg-[#4361EE] text-white"
                          : "bg-[#111827] text-white"
                        : "bg-transparent text-[#374151] hover:bg-gray-100"
                    }
                  `}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                w-full border-2 border-[#111827] bg-white px-3 py-2.5
                font-body text-[12px] font-[700] uppercase text-[#111827] outline-none
                focus:border-[#4361EE]
              "
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="resolved">Resolved Cases</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="mb-2 block font-body text-[10px] font-[800] uppercase tracking-[0.14em] text-[#374151]">
              Order By
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="
                w-full border-2 border-[#111827] bg-white px-3 py-2.5
                font-body text-[12px] font-[700] uppercase text-[#111827] outline-none
                focus:border-[#4361EE]
              "
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Reset Action */}
          <div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="
                w-full border-2 border-[#111827] bg-white py-2.5 px-4
                font-body text-[11px] font-[800] uppercase tracking-[0.08em] text-[#111827]
                shadow-[3px_3px_0px_#111827] transition-all hover:translate-x-[1px]
                hover:translate-y-[1px] hover:shadow-none
              "
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b-2 border-[#111827]/15 pb-2">
        <p className="font-body text-xs font-[800] uppercase tracking-[0.14em] text-[#111827]">
          Showing {filteredItems.length} of {items.length} records
        </p>

        {(typeFilter !== "all" || statusFilter !== "all" || searchTerm) && (
          <span className="font-body text-[10px] font-[700] uppercase tracking-[0.1em] text-[#4361EE]">
            Active Filters Applied
          </span>
        )}
      </div>

      {/* Results List */}
      {isLoading ? (
        <div className="border-2 border-dashed border-[#111827] bg-white/60 p-16 text-center backdrop-blur-xl">
          <p className="font-display text-2xl font-[800] uppercase text-[#111827]">
            Querying Radar Database...
          </p>
        </div>
      ) : error ? (
        <div className="border-2 border-[#E63946] bg-[#E63946]/10 p-8 text-center">
          <p className="font-display text-lg font-[800] uppercase text-[#E63946]">
            Failed to retrieve catalog
          </p>
          <p className="mt-1 font-body text-xs text-[#374151]">{error}</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-[#111827] bg-white/60 p-16 text-center backdrop-blur-xl">
          <p className="font-display text-3xl font-[800] uppercase text-[#111827]/40">
            No matching items found
          </p>
          <p className="mt-2 font-body text-sm font-[500] text-[#6B7280]">
            Try adjusting your search keywords or resetting active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="
              mt-6 border-2 border-[#111827] bg-white px-5 py-2.5
              font-body text-xs font-[800] uppercase tracking-wider text-[#111827]
              shadow-[3px_3px_0px_#111827] hover:shadow-none transition-all
            "
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

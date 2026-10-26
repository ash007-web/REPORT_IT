import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useItems } from "../../hooks/useItems";

const getTodayDate = () => new Date().toISOString().split("T")[0];

export default function ReportForm({ defaultType = "lost", onSuccess, isStandalone = false }) {
  const { currentUser } = useAuth();
  const { addItem, isSubmitting } = useItems();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: getTodayDate(),
    type: defaultType,
  });

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleTypeSelect = (type) => {
    setForm((current) => ({
      ...current,
      type,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Item title is required.";
    if (!form.description.trim()) newErrors.description = "Item description is required.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.date) newErrors.date = "Date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);

    if (!validate()) return;

    try {
      await addItem(form);
      setFeedback({
        type: "success",
        message: `Success! Your ${form.type.toUpperCase()} item report has been broadcasted.`,
      });

      // Reset fields while preserving type
      setForm({
        title: "",
        description: "",
        location: "",
        date: getTodayDate(),
        type: form.type,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "Failed to submit report. Please try again.",
      });
    }
  };

  const isLost = form.type === "lost";

  return (
    <section
      className={`
        border-2 border-[#111827]
        bg-white/80
        p-7 md:p-9
        backdrop-blur-xl
        transition-all
        ${isLost ? "shadow-[6px_6px_0px_#E63946]" : "shadow-[6px_6px_0px_#4361EE]"}
      `}
    >
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 ${isLost ? "bg-[#E63946]" : "bg-[#4361EE]"}`}
            />
            <span
              className={`font-body text-[10px] font-[800] uppercase tracking-[0.16em] ${
                isLost ? "text-[#E63946]" : "text-[#4361EE]"
              }`}
            >
              Report Signal / {form.type}
            </span>
          </div>

          {currentUser && (
            <span className="font-body text-[10px] font-[700] uppercase tracking-[0.1em] text-[#6B7280]">
              User: {currentUser.studentId}
            </span>
          )}
        </div>

        <h2 className="font-display text-[32px] md:text-[38px] font-[800] uppercase leading-tight tracking-[-0.015em] text-[#111827]">
          {isStandalone ? `Report ${form.type === "lost" ? "Lost" : "Found"} Item` : "Report an item."}
        </h2>
        <p className="mt-1 font-body text-xs font-[500] text-[#6B7280]">
          File a verified campus incident. New reports are immediately active across the network.
        </p>
      </div>

      {feedback && (
        <div
          className={`
            mb-6 border-2 border-[#111827] p-3.5
            ${
              feedback.type === "success"
                ? "bg-[#4361EE]/10 border-[#4361EE] text-[#4361EE]"
                : "bg-[#E63946]/10 border-[#E63946] text-[#E63946]"
            }
          `}
        >
          <p className="font-body text-[11px] font-[800] uppercase tracking-[0.08em]">
            {feedback.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="mb-2 block font-body text-[10px] font-[800] tracking-[0.14em] uppercase text-[#374151]">
            Report Type <span className="text-[#E63946]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeSelect("lost")}
              className={`
                border-2 px-4 py-3 font-body text-[11px] font-[800] uppercase tracking-[0.08em] transition-all
                ${
                  form.type === "lost"
                    ? "border-[#111827] bg-[#E63946] text-white shadow-[3px_3px_0px_#111827]"
                    : "border-[#111827]/30 bg-white text-[#374151] hover:border-[#111827]"
                }
              `}
            >
              Lost Item
            </button>
            <button
              type="button"
              onClick={() => handleTypeSelect("found")}
              className={`
                border-2 px-4 py-3 font-body text-[11px] font-[800] uppercase tracking-[0.08em] transition-all
                ${
                  form.type === "found"
                    ? "border-[#111827] bg-[#4361EE] text-white shadow-[3px_3px_0px_#111827]"
                    : "border-[#111827]/30 bg-white text-[#374151] hover:border-[#111827]"
                }
              `}
            >
              Found Item
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-body text-[10px] font-[800] tracking-[0.14em] uppercase text-[#374151]">
            Item Title <span className="text-[#E63946]">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={updateField}
            placeholder="e.g. Dell XPS Laptop, Black Leather Wallet"
            className="
              w-full border-2 border-[#111827] bg-white px-4 py-3
              font-body text-[14px] font-[500] text-[#111827] outline-none
              placeholder:text-gray-400 focus:border-[#4361EE]
            "
          />
          {errors.title && (
            <p className="mt-1 font-body text-[10px] font-[700] uppercase tracking-[0.06em] text-[#E63946]">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-body text-[10px] font-[800] tracking-[0.14em] uppercase text-[#374151]">
            Description <span className="text-[#E63946]">*</span>
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={updateField}
            placeholder="Describe distinguishing marks, serial identifiers, stickers, color, model..."
            className="
              w-full resize-none border-2 border-[#111827] bg-white px-4 py-3
              font-body text-[14px] font-[500] text-[#111827] outline-none
              placeholder:text-gray-400 focus:border-[#4361EE]
            "
          />
          {errors.description && (
            <p className="mt-1 font-body text-[10px] font-[700] uppercase tracking-[0.06em] text-[#E63946]">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-body text-[10px] font-[800] tracking-[0.14em] uppercase text-[#374151]">
            Location <span className="text-[#E63946]">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={updateField}
            placeholder="e.g. Central Library - 2nd Floor, Main Canteen"
            className="
              w-full border-2 border-[#111827] bg-white px-4 py-3
              font-body text-[14px] font-[500] text-[#111827] outline-none
              placeholder:text-gray-400 focus:border-[#4361EE]
            "
          />
          {errors.location && (
            <p className="mt-1 font-body text-[10px] font-[700] uppercase tracking-[0.06em] text-[#E63946]">
              {errors.location}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-body text-[10px] font-[800] tracking-[0.14em] uppercase text-[#374151]">
            Date <span className="text-[#E63946]">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={updateField}
            max={getTodayDate()}
            className="
              w-full border-2 border-[#111827] bg-white px-4 py-3
              font-body text-[14px] font-[500] text-[#111827] outline-none
              focus:border-[#4361EE]
            "
          />
          {errors.date && (
            <p className="mt-1 font-body text-[10px] font-[700] uppercase tracking-[0.06em] text-[#E63946]">
              {errors.date}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            mt-3 w-full border-2 border-[#111827] px-5 py-4
            font-body text-[12px] font-[800] uppercase tracking-[0.1em]
            transition-all disabled:cursor-not-allowed disabled:opacity-50
            hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none
            ${
              isLost
                ? "bg-white text-[#111827] shadow-[5px_5px_0px_#E63946]"
                : "bg-white text-[#111827] shadow-[5px_5px_0px_#4361EE]"
            }
          `}
        >
          {isSubmitting
            ? "Submitting Report..."
            : `Publish ${form.type === "lost" ? "Lost" : "Found"} Item →`}
        </button>
      </form>
    </section>
  );
}

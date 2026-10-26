import { useSearchParams, useNavigate } from "react-router-dom";
import ReportForm from "../components/Forms/ReportForm";

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultType = searchParams.get("type") === "found" ? "found" : "lost";

  const handleSuccess = () => {
    // Optionally redirect to My Reports after a brief moment
    setTimeout(() => {
      navigate("/my-reports");
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="
            border-2 border-[#111827] bg-white px-3 py-1.5
            font-body text-[10px] font-[800] uppercase tracking-[0.1em] text-[#111827]
            shadow-[2px_2px_0px_#111827] hover:shadow-none transition-all
          "
        >
          ← Back
        </button>
      </div>

      <ReportForm
        key={defaultType}
        defaultType={defaultType}
        onSuccess={handleSuccess}
        isStandalone={true}
      />
    </div>
  );
}

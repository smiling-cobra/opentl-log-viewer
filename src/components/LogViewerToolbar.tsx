export type ViewMode = "flat" | "grouped";

const TOGGLE_BUTTON_BASE = "px-4 py-2 text-sm font-medium transition-colors";
const TOGGLE_BUTTON_ACTIVE = "bg-white text-gray-900 shadow-sm";
const TOGGLE_BUTTON_INACTIVE = "bg-gray-50 text-gray-500 hover:text-gray-700";

interface LogViewerToolbarProps {
  view: ViewMode;
  onSetView: (view: ViewMode) => void;
  hasExpanded: boolean;
  onCollapseAll: () => void;
}

export const LogViewerToolbar = ({
  view,
  onSetView,
  hasExpanded,
  onCollapseAll,
}: LogViewerToolbarProps) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex rounded-lg border border-gray-200 overflow-hidden w-fit">
      <button
        onClick={() => onSetView("flat")}
        className={`${TOGGLE_BUTTON_BASE} ${view === "flat" ? TOGGLE_BUTTON_ACTIVE : TOGGLE_BUTTON_INACTIVE}`}
      >
        Flat
      </button>
      <button
        onClick={() => onSetView("grouped")}
        className={`${TOGGLE_BUTTON_BASE} border-l border-gray-200 ${view === "grouped" ? TOGGLE_BUTTON_ACTIVE : TOGGLE_BUTTON_INACTIVE}`}
      >
        Group by Service
      </button>
    </div>
    {hasExpanded && (
      <button
        onClick={onCollapseAll}
        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        Collapse all
      </button>
    )}
  </div>
);

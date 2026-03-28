interface ToolbarProps {
  onRefresh: () => void;
  onLoad: () => void;
  onDownload: () => void;
}

export function Toolbar({ onRefresh, onLoad, onDownload }: ToolbarProps) {
  return (
    <div className="toolbar">
      <button className="toolbar-btn" onClick={onRefresh} title="Refresh the display">
        &#x21bb; Refresh
      </button>
      <button className="toolbar-btn" onClick={onLoad} title="Load a configuration">
        &#x1F4C2; Load
      </button>
      <button className="toolbar-btn" onClick={onDownload} title="Download configuration as JSON">
        &#x2B07; Download
      </button>
    </div>
  );
}

interface ButtonControlsProps {
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onRun: () => void;
  onReset: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
  hasError: boolean;
  disableFirstLast?: boolean;
}

function ButtonControls({
  onFirst,
  onPrev,
  onNext,
  onLast,
  onRun,
  onReset,
  canStepForward,
  canStepBackward,
  hasError,
  disableFirstLast = false,
}: ButtonControlsProps) {
  return (
    <>
      <div className="flex justify-center gap-6 p-4">
        <button
          onClick={onFirst}
          disabled={!canStepBackward || disableFirstLast}
          className="btn bg-[#242424] hover:bg-[#343434] text-white active:scale-95 transition-transform font-bold py-2 px-4 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;&lt;First
        </button>
        <button
          onClick={onPrev}
          disabled={!canStepBackward}
          className="btn bg-[#242424] hover:bg-[#343434] text-white active:scale-95 transition-transform font-bold py-2 px-4 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;Prev
        </button>
        <button
          onClick={onNext}
          disabled={!canStepForward || hasError}
          className="btn bg-[#242424] hover:bg-[#343434] text-white active:scale-95 transition-transform font-bold py-2 px-4 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;Next
        </button>
        <button
          onClick={onLast}
          disabled={!canStepForward || hasError || disableFirstLast}
          className="btn bg-[#242424] hover:bg-[#343434] text-white active:scale-95 transition-transform font-bold py-2 px-4 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;&gt;Last
        </button>
        <button
          onClick={onRun || hasError}
          className="btn bg-blue-600 hover:bg-blue-700 text-white active:scale-95 transition-transform font-bold py-2 px-4 cursor-pointer rounded"
        >
          Run
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-red-600 text-white active:scale-95 transition-transform rounded hover:bg-red-700 font-bold cursor-pointer"
        >
          Reset
        </button>
      </div>
    </>
  );
}

export default ButtonControls;

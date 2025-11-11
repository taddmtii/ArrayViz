interface ButtonControlsProps {
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onRun: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
}

function ButtonControls({
  onFirst,
  onPrev,
  onNext,
  onLast,
  onRun,
  canStepForward,
  canStepBackward,
}: ButtonControlsProps) {
  return (
    <>
      <div className="flex justify-center gap-6 p-4">
        <button
          onClick={onFirst}
          disabled={!canStepBackward}
          className="btn bg-[#242424] hover:bg-[#343434] text-white font-bold py-2 px-4 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;&lt;First
        </button>
        <button
          onClick={onPrev}
          disabled={!canStepBackward}
          className="btn bg-[#242424] hover:bg-[#343434] text-white font-bold py-2 px-4 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;Prev
        </button>
        <button
          onClick={onNext}
          disabled={!canStepForward}
          className="btn bg-[#242424] hover:bg-[#343434] text-white font-bold py-2 px-4 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;Next
        </button>
        <button
          onClick={onLast}
          disabled={!canStepForward}
          className="btn bg-[#242424] hover:bg-[#343434] text-white font-bold py-2 px-4 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;&gt;Last
        </button>
        <button
          onClick={onRun}
          className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 cursor-pointer rounded"
        >
          Run
        </button>
      </div>
    </>
  );
}

export default ButtonControls;

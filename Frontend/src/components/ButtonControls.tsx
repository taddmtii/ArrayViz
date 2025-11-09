function ButtonControls() {
  return (
    <>
      <div className="flex justify-center gap-6 p-4">
        <button className="btn btn bg-[#242424] hover:bg-[#343434]  text-white font-bold py-2 px-4 cursor-pointer rounded">
          &lt;&lt;First
        </button>
        <button className="btn btn bg-[#242424] hover:bg-[#343434]  text-white font-bold py-2 px-4 cursor-pointer rounded">
          &lt;Prev
        </button>
        <button className="btn btn bg-[#242424] hover:bg-[#343434]  text-white font-bold py-2 px-4 cursor-pointer rounded">
          &gt;Next
        </button>
        <button className="btn btn bg-[#242424] hover:bg-[#343434]  text-white font-bold py-2 px-4 cursor-pointer rounded">
          &gt;&gt;Last
        </button>
        <button className="btn btn bg-[#242424] hover:bg-[#343434]  text-white font-bold py-2 px-4 cursor-pointer rounded">
          Settings
        </button>
      </div>
    </>
  );
}

export default ButtonControls;

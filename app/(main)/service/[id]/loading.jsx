export default function Loading() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="bg-white border-b border-border px-10 h-12" />
      <div className="max-w-[1240px] mx-auto px-10 py-12 grid grid-cols-[1fr_360px] gap-10 items-start max-md:grid-cols-1">
        <div className="flex flex-col gap-5">
          <div className="bg-white border border-border p-8 flex gap-5">
            <div className="skel h-16 w-16 rounded-xl" />
            <div className="flex-1 flex flex-col gap-3">
              <div className="skel h-6 w-1/2" />
              <div className="skel h-4 w-full" />
              <div className="skel h-4 w-2/3" />
            </div>
          </div>
          <div className="skel h-64 w-full rounded-xl" />
        </div>
        <div className="skel h-80 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="bg-white border-b border-border px-10 py-8">
        <div className="max-w-[820px] mx-auto flex items-center gap-4">
          <div className="skel h-14 w-14 rounded-xl" />
          <div className="flex-1 flex flex-col gap-2">
            <div className="skel h-6 w-1/2" />
            <div className="skel h-4 w-1/3" />
          </div>
        </div>
      </div>
      <div className="max-w-[820px] mx-auto px-10 py-9 grid grid-cols-[1fr_300px] gap-6 items-start max-md:grid-cols-1">
        <div className="bg-white border border-border rounded-xl p-6 flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skel h-12 w-full rounded-[10px]" />
          ))}
        </div>
        <div className="skel h-56 w-full rounded-xl" />
      </div>
    </div>
  );
}

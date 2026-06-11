export default function Loading() {
  return (
    <div>
      <div className="skel h-4 w-16 mb-2" />
      <div className="skel h-7 w-40 mb-6" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-border rounded-xl p-4 flex items-center gap-4"
          >
            <div className="skel h-12 w-12 rounded-xl" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="skel h-4 w-1/2" />
              <div className="skel h-3 w-3/4" />
            </div>
            <div className="skel h-11 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

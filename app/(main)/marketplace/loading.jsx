export default function Loading() {
  return (
    <div className="bg-bg min-h-screen">
      <div className="bg-white border-b border-border px-10 pt-[72px] pb-16">
        <div className="max-w-[800px] mx-auto flex flex-col items-center gap-4">
          <div className="skel h-10 w-[60%]" />
          <div className="skel h-4 w-[80%]" />
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto px-10 py-12">
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-3 border border-border"
            >
              <div className="skel h-[72px] w-[72px] rounded-2xl" />
              <div className="skel h-4 w-3/4" />
              <div className="skel h-4 w-1/2" />
              <div className="skel h-11 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const b = "animate-pulse bg-white/10";

export default function ProfileSkeleton() {
  return (
    <div className="isolate relative flex min-h-dvh w-full flex-col items-center bg-neutral-950 px-5 pb-10 pt-20">
      <div className={`${b} h-24 w-24 rounded-full`} />
      <div className="mt-5 flex max-w-full items-center justify-center gap-2.5">
        <div className={`${b} h-7 w-28 rounded-lg`} />
        <div className={`${b} h-6 w-24 rounded-full`} />
      </div>
      <div className={`${b} mt-3 h-[23px] w-60 max-w-xs rounded-lg`} />
      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`${b} h-9 rounded-full`} />
        ))}
      </div>
      <div className="mt-8 w-full max-w-md space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${b} h-11 rounded-full`} />
        ))}
      </div>
    </div>
  );
}
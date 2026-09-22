export function Marquee({
  items,
  separator = '·',
}: {
  items: string[]
  separator?: string
}) {
  const row = [...items, ...items]
  return (
    <div className="relative flex overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-10 text-sm tracking-[0.2em] text-ivory-dim uppercase"
          >
            {item}
            <span aria-hidden className="text-brass-deep">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

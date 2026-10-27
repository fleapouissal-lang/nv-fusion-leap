// poussières lumineuses : positions fixes (rendu identique côté serveur et client)
const dots = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 37 + 11) % 100,
  y: (i * 53 + 7) % 100,
  delay: (i % 7) * 1.1,
  size: 2 + (i % 3),
}));

/** Fond vivant commun à toute la page : halos orange qui dérivent, voile de lumière, poussières, vignette. Fixé derrière tout le contenu. */
export default function Backdrop() {
  return (
    <div className="bgfx" aria-hidden="true">
      <div className="bgfx__layer" data-speed="-14"><i className="bgfx__blob bgfx__blob--1" /></div>
      <div className="bgfx__layer" data-speed="10"><i className="bgfx__blob bgfx__blob--2" /></div>
      <div className="bgfx__layer" data-speed="-22"><i className="bgfx__blob bgfx__blob--3" /></div>
      <i className="bgfx__sheen" />
      <span className="bgfx__dots">
        {dots.map((d, i) => (
          <b key={i} style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, animationDelay: `${d.delay}s` }} />
        ))}
      </span>
      <i className="bgfx__vignette" />
    </div>
  );
}

import './BackgroundParticles.css'

const COUNT = 18

export const BackgroundParticles = () => (
  <div className="bg-particles" aria-hidden="true">
    {Array.from({ length: COUNT }, (_, i) => (
      <span key={i} className="bg-particle" style={{
        '--x': `${(i / COUNT) * 100 + Math.random() * 5}%`,
        '--dur': `${8 + (i % 5) * 3}s`,
        '--delay': `${(i * 1.1) % 7}s`,
        '--size': `${4 + (i % 4) * 3}px`,
        '--opacity': `${0.1 + (i % 3) * 0.05}`
      } as React.CSSProperties} />
    ))}
  </div>
)

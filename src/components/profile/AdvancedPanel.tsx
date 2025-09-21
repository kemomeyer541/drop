export function AdvancedPanel(){
  return (
    <div className="advanced">
      <div className="card">
        <h4>Custom HTML / CSS (Tumblr/MySpace-style)</h4>
        <p className="muted">Paste custom CSS or light HTML to restyle your profile. (Sandboxed in demo)</p>
        <textarea placeholder="/* CSS here (demo placeholder) */" rows={8} disabled />
        <div className="hint">In the full version you'll be able to theme containers, fonts, and colors.</div>
      </div>

      <div className="card">
        <h4>AI Profile Helper (Preview)</h4>
        <p className="muted">Describe what you want and we'll suggest layout, colors and blocks.</p>
        <input className="ai-input" placeholder="e.g., cozy dark theme, neon accents, big header, grid gallery" />
        <div className="row">
          <button className="cta">Try Prompt</button>
          <button className="cta ghost">Use Suggestion</button>
        </div>
        <ul className="muted small">
          <li>• "minimal pastel with rounded cards"</li>
          <li>• "vaporwave gradient, center header, 2-col feed"</li>
          <li>• "mocha theme, photos first, chalkboard at bottom"</li>
        </ul>
      </div>
    </div>
  );
}
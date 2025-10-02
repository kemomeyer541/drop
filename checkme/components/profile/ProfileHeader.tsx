export function ProfileHeader() {
  return (
    <div className="ph-card">
      <div className="ph-top">
        <div className="ph-id">
          <div className="ph-avatar">T</div>
          <div>
            <div className="ph-name">TestUser</div>
            <div className="ph-handle">@TestUser • Eugene, OR</div>
          </div>
          <span className="ph-pro" title="DropSource BLUE">DS BLUE</span>
        </div>

        <div className="ph-ctas">
          <button className="cta donate" title="Send a one-time tip">🎁 Donate</button>
          <button className="cta monthly" title="Monthly support">💚 Monthly Support</button>
          <button className="cta ghost">Message</button>
        </div>
      </div>

      <p className="ph-bio">Check out the Kickstarter!</p>

      <div className="ph-stats">
        <span>⭐ 12,847 stars</span>
        <span>🧩 Level 47</span>
        <span>🛡️ Trust 94%</span>
        <span>👥 2,341 followers</span>
        <span>🧍 892 following</span>
      </div>

      <div className="ph-links">
        <a>SoundCloud</a>
        <a>YouTube</a>
        <a>Spotify</a>
      </div>
    </div>
  );
}
import React, { useState } from 'react';

export default function ShareButton({ title, url }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // usuario canceló, no hacemos nada
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '20px' }}>
      <button
        onClick={handleShare}
        style={{
          padding: '8px 16px',
          background: 'transparent',
          border: '1px solid var(--usa-cyan)',
          color: 'var(--usa-cyan)',
          borderRadius: '999px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 'bold',
        }}
      >
        {copied ? '¡Copiado!' : '🔗 Compartir'}
      </button>

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={iconStyle}>
        WhatsApp
      </a>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={iconStyle}>
        X
      </a>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={iconStyle}>
        Facebook
      </a>
    </div>
  );
}

const iconStyle = {
  fontSize: '12px',
  color: '#9ca3af',
  textDecoration: 'none',
  border: '1px solid var(--glass-border)',
  padding: '8px 12px',
  borderRadius: '999px',
};
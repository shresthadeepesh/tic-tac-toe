import React, { useState } from 'react';
import { isMuted, playSound, setMuted } from '../../utils/sound';

interface ISoundToggleProps {
  className?: string;
}

const SoundToggle: React.FC<ISoundToggleProps> = ({ className = '' }) => {
  const [muted, setMutedState] = useState<boolean>(isMuted());

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);

    // Confirm the change audibly, which also unlocks audio on the first tap.
    if (!next) playSound('ui');
  };

  return (
    <button
      type="button"
      aria-pressed={muted}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      title={muted ? 'Sound is off' : 'Sound is on'}
      className={`glass-button px-3 py-1.5 text-xs ${className}`}
      onClick={toggle}
    >
      {muted ? 'Sound Off' : 'Sound On'}
    </button>
  );
};

export default SoundToggle;

import React, { useCallback } from 'react';
import { loadSlim } from 'tsparticles-slim';
import Particles from 'react-tsparticles';
import type { Container, Engine } from 'tsparticles-engine';

interface BackgroundParticlesProps {
  enabled: boolean;
}

export default function BackgroundParticles({ enabled }: BackgroundParticlesProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Particles loaded callback
  }, []);

  if (!enabled) return null;

  return (
    <Particles
      id="profile-particles"
      init={particlesInit}
      loaded={particlesLoaded}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: false,
            },
            onHover: {
              enable: true,
              mode: "bubble",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 100,
              duration: 2,
              opacity: 0.3,
              size: 4,
            },
          },
        },
        particles: {
          color: {
            value: ["#5BE9E9", "#A78BFA", "#FFB039", "#FF6BAA"],
          },
          links: {
            color: "#5BE9E9",
            distance: 150,
            enable: true,
            opacity: 0.1,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 0.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 20,
          },
          opacity: {
            value: 0.15,
            random: {
              enable: true,
              minimumValue: 0.05,
            },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.05,
              sync: false,
            },
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
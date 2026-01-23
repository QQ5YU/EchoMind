import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@renderer/shared/utils/css";

interface WaveLoaderProps {
  size: number;
  progress: number;
  className?: string;
}

export const WaveLoader: React.FC<WaveLoaderProps> = ({
  size,
  progress,
  className,
}) => {
  const [waveOffset, setWaveOffset] = useState(0);

  const viewBox = `0 0 ${size} ${size}`;
  const clampedProgress = Math.max(0, Math.min(progress, 100));

  const waveConfig = useMemo(
    () => ({
      amplitude: size * 0.05,
      frequency: 4 / size,
      speed: 0.02,
    }),
    [size],
  );

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setWaveOffset((offset) => offset + waveConfig.speed * size);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, waveConfig.speed]);

  const createWavePath = (yOffset: number, phase: number): string => {
    const points: [number, number][] = [];
    for (let x = 0; x <= size; x++) {
      const y =
        yOffset +
        waveConfig.amplitude * Math.sin(x * waveConfig.frequency + phase);
      points.push([x, y]);
    }

    const path =
      `M 0 ${points[0][1]} ` +
      points.map((p) => `L ${p[0]} ${p[1]}`).join(" ") +
      ` L ${size} ${size} L 0 ${size} Z`;

    return path;
  };

  const waterLevel = size * (1 - clampedProgress / 100);

  const wavePath1 = createWavePath(waterLevel, waveOffset / 20);
  const wavePath2 = createWavePath(waterLevel, -waveOffset / 20 + Math.PI / 2);

  return (
    <div
      className={cn("relative rounded-full overflow-hidden", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        className="absolute bottom-0 left-0"
      >
        <g>
          <path d={wavePath1} fill="currentColor" opacity="0.2" />
          <path d={wavePath2} fill="currentColor" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
};

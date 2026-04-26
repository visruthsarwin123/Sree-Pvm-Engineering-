"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface SphericalPosition {
  theta: number;
  phi: number;
  radius: number;
}

export interface WorldPosition extends Position3D {
  scale: number;
  zIndex: number;
  isVisible: boolean;
  fadeOpacity: number;
  originalIndex: number;
}

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface SphereImageGridProps {
  images?: ImageData[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseImageScale?: number;
  hoverScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
}

interface RotationState {
  x: number;
  y: number;
  z: number;
}

interface VelocityState {
  x: number;
  y: number;
}

interface MousePosition {
  x: number;
  y: number;
}

// ==========================================
// CONSTANTS & CONFIGURATION
// ==========================================

const SPHERE_MATH = {
  degreesToRadians: (degrees: number): number => degrees * (Math.PI / 180),
  radiansToDegrees: (radians: number): number => radians * (180 / Math.PI),

  sphericalToCartesian: (radius: number, theta: number, phi: number): Position3D => ({
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta)
  }),

  calculateDistance: (pos: Position3D, center: Position3D = { x: 0, y: 0, z: 0 }): number => {
    const dx = pos.x - center.x;
    const dy = pos.y - center.y;
    const dz = pos.z - center.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  },

  normalizeAngle: (angle: number): number => {
    while (angle > 180) angle -= 360;
    while (angle < -180) angle += 360;
    return angle;
  }
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export const SphereImageGrid: React.FC<SphereImageGridProps> = ({
  images = [],
  containerSize = 400,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseImageScale = 0.12,
  hoverScale = 1.2,
  perspective = 1000,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [rotation, setRotation] = useState<RotationState>({ x: 15, y: 15, z: 0 });
  const [velocity, setVelocity] = useState<VelocityState>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [imagePositions, setImagePositions] = useState<SphericalPosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef<MousePosition>({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);

  const actualSphereRadius = sphereRadius || containerSize * 0.5;
  const baseImageSize = containerSize * baseImageScale;

  const generateSpherePositions = useCallback((): SphericalPosition[] => {
    const positions: SphericalPosition[] = [];
    const imageCount = images.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = 2 * Math.PI / goldenRatio;

    for (let i = 0; i < imageCount; i++) {
      const t = i / imageCount;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      let phi = inclination * (180 / Math.PI);
      let theta = (azimuth * (180 / Math.PI)) % 360;

      const poleBonus = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
      if (phi < 90) {
        phi = Math.max(5, phi - poleBonus);
      } else {
        phi = Math.min(175, phi + poleBonus);
      }

      phi = 15 + (phi / 180) * 150;

      const randomOffset = (Math.random() - 0.5) * 20;
      theta = (theta + randomOffset) % 360;
      phi = Math.max(0, Math.min(180, phi + (Math.random() - 0.5) * 10));

      positions.push({
        theta: theta,
        phi: phi,
        radius: actualSphereRadius
      });
    }

    return positions;
  }, [images.length, actualSphereRadius]);

  const calculateWorldPositions = useCallback((): WorldPosition[] => {
    const positions = imagePositions.map((pos, index) => {
      const thetaRad = SPHERE_MATH.degreesToRadians(pos.theta);
      const phiRad = SPHERE_MATH.degreesToRadians(pos.phi);
      const rotXRad = SPHERE_MATH.degreesToRadians(rotation.x);
      const rotYRad = SPHERE_MATH.degreesToRadians(rotation.y);

      let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad);
      let y = pos.radius * Math.cos(phiRad);
      let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad);

      const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
      const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
      x = x1;
      z = z1;

      const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad);
      const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad);
      y = y2;
      z = z2;

      const worldPos: Position3D = { x, y, z };

      const fadeZoneStart = -10;
      const fadeZoneEnd = -30;
      const isVisible = worldPos.z > fadeZoneEnd;

      let fadeOpacity = 1;
      if (worldPos.z <= fadeZoneStart) {
        fadeOpacity = Math.max(0, (worldPos.z - fadeZoneEnd) / (fadeZoneStart - fadeZoneEnd));
      }

      const isPoleImage = pos.phi < 30 || pos.phi > 150;
      const distanceFromCenter = Math.sqrt(worldPos.x * worldPos.x + worldPos.y * worldPos.y);
      const distanceRatio = Math.min(distanceFromCenter / actualSphereRadius, 1);
      const distancePenalty = isPoleImage ? 0.4 : 0.7;
      const centerScale = Math.max(0.3, 1 - distanceRatio * distancePenalty);
      const depthScale = (worldPos.z + actualSphereRadius) / (2 * actualSphereRadius);
      const scale = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3);

      return {
        ...worldPos,
        scale,
        zIndex: Math.round(1000 + worldPos.z),
        isVisible,
        fadeOpacity,
        originalIndex: index
      };
    });

    const adjustedPositions = [...positions];

    for (let i = 0; i < adjustedPositions.length; i++) {
      const pos = adjustedPositions[i];
      if (!pos.isVisible) continue;

      let adjustedScale = pos.scale;
      const imageSize = baseImageSize * adjustedScale;

      for (let j = 0; j < adjustedPositions.length; j++) {
        if (i === j) continue;
        const other = adjustedPositions[j];
        if (!other.isVisible) continue;

        const otherSize = baseImageSize * other.scale;
        const dx = pos.x - other.x;
        const dy = pos.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (imageSize + otherSize) / 2 + 25;

        if (distance < minDistance && distance > 0) {
          const overlap = minDistance - distance;
          const reductionFactor = Math.max(0.4, 1 - (overlap / minDistance) * 0.6);
          adjustedScale = Math.min(adjustedScale, adjustedScale * reductionFactor);
        }
      }

      adjustedPositions[i] = {
        ...pos,
        scale: Math.max(0.25, adjustedScale)
      };
    }

    return adjustedPositions;
  }, [imagePositions, rotation, actualSphereRadius, baseImageSize]);

  const clampRotationSpeed = useCallback((speed: number): number => {
    return Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, speed));
  }, [maxRotationSpeed]);

  const updateMomentum = useCallback(() => {
    if (isDragging) return;

    setVelocity(prev => {
      const newVelocity = {
        x: prev.x * momentumDecay,
        y: prev.y * momentumDecay
      };

      if (!autoRotate && Math.abs(newVelocity.x) < 0.01 && Math.abs(newVelocity.y) < 0.01) {
        return { x: 0, y: 0 };
      }

      return newVelocity;
    });

    setRotation(prev => {
      let newY = prev.y;
      if (autoRotate) {
        newY += autoRotateSpeed;
      }
      newY += clampRotationSpeed(velocity.y);

      return {
        x: SPHERE_MATH.normalizeAngle(prev.x + clampRotationSpeed(velocity.x)),
        y: SPHERE_MATH.normalizeAngle(newY),
        z: prev.z
      };
    });
  }, [isDragging, momentumDecay, velocity, clampRotationSpeed, autoRotate, autoRotateSpeed]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;

    const rotationDelta = {
      x: -deltaY * dragSensitivity,
      y: deltaX * dragSensitivity
    };

    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clampRotationSpeed(rotationDelta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clampRotationSpeed(rotationDelta.y)),
      z: prev.z
    }));

    setVelocity({
      x: clampRotationSpeed(rotationDelta.x),
      y: clampRotationSpeed(rotationDelta.y)
    });

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, dragSensitivity, clampRotationSpeed]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - lastMousePos.current.x;
    const deltaY = touch.clientY - lastMousePos.current.y;

    const rotationDelta = {
      x: -deltaY * dragSensitivity,
      y: deltaX * dragSensitivity
    };

    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clampRotationSpeed(rotationDelta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clampRotationSpeed(rotationDelta.y)),
      z: prev.z
    }));

    setVelocity({
      x: clampRotationSpeed(rotationDelta.x),
      y: clampRotationSpeed(rotationDelta.y)
    });

    lastMousePos.current = { x: touch.clientX, y: touch.clientY };
  }, [isDragging, dragSensitivity, clampRotationSpeed]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setImagePositions(generateSpherePositions());
  }, [generateSpherePositions]);

  useEffect(() => {
    const animate = () => {
      updateMomentum();
      animationFrame.current = requestAnimationFrame(animate);
    };

    if (isMounted) {
      animationFrame.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isMounted, updateMomentum]);

  useEffect(() => {
    if (!isMounted) return;

    const container = containerRef.current;
    if (!container) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMounted, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const worldPositions = calculateWorldPositions();

  const renderImageNode = useCallback((image: ImageData, index: number) => {
    const position = worldPositions[index];
    if (!position || !position.isVisible) return null;

    const imageSize = baseImageSize * position.scale;
    const isHovered = hoveredIndex === index;
    const finalScale = isHovered ? Math.min(1.2, 1.2 / position.scale) : 1;

    return (
      <div
        key={image.id}
        className="absolute cursor-pointer select-none transition-transform duration-200 ease-out"
        style={{
          width: `${imageSize}px`,
          height: `${imageSize}px`,
          left: `${containerSize/2 + position.x}px`,
          top: `${containerSize/2 + position.y}px`,
          opacity: position.fadeOpacity,
          transform: `translate(-50%, -50%) scale(${finalScale})`,
          zIndex: position.zIndex
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => setSelectedImage(image)}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.3)] border-2 border-blue-500/20 group hover:border-blue-500 transition-colors duration-300">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
            draggable={false}
            loading={index < 5 ? 'eager' : 'lazy'}
          />
        </div>
      </div>
    );
  }, [worldPositions, baseImageSize, containerSize, hoveredIndex]);

  const renderSpotlightModal = () => {
    if (!selectedImage) return null;

    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all"
        onClick={() => setSelectedImage(null)}
      >
        <div
          className="bg-[#111111] rounded-2xl max-w-xl w-full overflow-hidden border border-white/10 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full h-80">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer border border-white/20"
            >
              <X size={20} />
            </button>
          </div>
          {(selectedImage.title || selectedImage.description) && (
            <div className="p-8">
              {selectedImage.title && (
                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{selectedImage.title}</h3>
              )}
              {selectedImage.description && (
                <p className="text-gray-400 leading-relaxed">{selectedImage.description}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isMounted) {
    return <div className="animate-pulse flex items-center justify-center" style={{ width: containerSize, height: containerSize }} />
  }

  return (
    <>
      <div
        ref={containerRef}
        className={`relative select-none cursor-grab active:cursor-grabbing ${className}`}
        style={{ width: containerSize, height: containerSize, perspective: `${perspective}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="relative w-full h-full" style={{ zIndex: 10 }}>
          {images.map((image, index) => renderImageNode(image, index))}
        </div>
      </div>
      {renderSpotlightModal()}
    </>
  );
};

// ==========================================
// DEMO / SECTION COMPONENT
// ==========================================

const BASE_IMAGES: Omit<ImageData, 'id'>[] = [
  {
    src: "https://images.unsplash.com/photo-1565173153514-66632488a032?auto=format&fit=crop&q=80&w=800",
    alt: "CNC Milling",
    title: "Precision 5-Axis Milling",
    description: "Advanced multi-axis CNC machines producing complex geometries with incredibly tight tolerances for aerospace applications."
  },
  {
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    alt: "Metal Turning",
    title: "Automated Lathe Turning",
    description: "High-speed metal turning operations producing cylindrical parts with perfect surface finishes and micron-level precision."
  },
  {
    src: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
    alt: "Engineering Lab",
    title: "Quality Control",
    description: "Rigorous inspection and quality control processes ensuring every manufactured part meets exact engineering specifications."
  },
  {
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
    alt: "Robotics",
    title: "Automated Assembly",
    description: "Integration of state-of-the-art robotic systems to streamline manufacturing processes and increase output efficiency."
  },
  {
    src: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800",
    alt: "Metal Working",
    title: "Heavy Industrial Machining",
    description: "Large-scale machining capabilities designed to handle heavy industrial components and high-volume production runs."
  },
  {
    src: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800",
    alt: "Blueprint Design",
    title: "Value Engineering",
    description: "Expert engineering consultation to optimize part design for manufacturability, reducing costs and lead times."
  },
  {
    src: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    alt: "Tooling",
    title: "Custom Tooling Design",
    description: "Development of specialized cutting tools and fixtures tailored perfectly to your unique manufacturing requirements."
  },
  {
    src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800",
    alt: "Spark Machining",
    title: "EDM Machining",
    description: "Electrical Discharge Machining for cutting complex shapes in hard metals that are difficult to machine using traditional methods."
  },
];

const IMAGES: ImageData[] = [];
for (let i = 0; i < 40; i++) {
  const baseIndex = i % BASE_IMAGES.length;
  const baseImage = BASE_IMAGES[baseIndex];
  IMAGES.push({
    id: `img-${i + 1}`,
    ...baseImage,
    alt: `${baseImage.alt} - Part ${Math.floor(i / BASE_IMAGES.length) + 1}`
  });
}

const CONFIG = {
  containerSize: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 350 : 600) : 600,
  sphereRadius: typeof window !== 'undefined' ? (window.innerWidth < 768 ? 140 : 220) : 220,
  dragSensitivity: 0.8,
  momentumDecay: 0.96,
  maxRotationSpeed: 6,
  baseImageScale: 0.16,
  hoverScale: 1.3,
  perspective: 1000,
  autoRotate: true,
  autoRotateSpeed: 0.2
};

export default function ImageSphereSection({ id }: { id?: string }) {
  return (
    <section id={id} className="w-full bg-[#050505] py-32 px-4 relative overflow-hidden flex flex-col items-center border-t border-white/5">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto mb-12 px-6 flex flex-col items-center text-center relative z-10">
        <span className="text-blue-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Visual Archive</span>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Our Manufacturing Ecosystem.
        </h2>
        <p className="text-gray-400 mt-6 max-w-2xl leading-relaxed">
            Drag and interact with our 3D engineering gallery to explore the advanced technology, precise machinery, and state-of-the-art facilities powering SREE PVM.
        </p>
      </div>

      <div className="relative z-10">
        <SphereImageGrid images={IMAGES} {...CONFIG} />
      </div>
    </section>
  );
}

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, PlaneGeometry, MeshStandardMaterial, CanvasTexture } from 'three';
import * as THREE from 'three';

interface ProductModel3DProps {
  productType: string;
  canvasData?: string;
}

const ProductModel3D: React.FC<ProductModel3DProps> = ({ productType, canvasData }) => {
  const meshRef = useRef<Mesh>(null);
  
  // Create texture from canvas data
  const designTexture = useMemo(() => {
    if (!canvasData) return null;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      canvas.width = 512;
      canvas.height = 512;
      
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = canvasData;
      
      return new CanvasTexture(canvas);
    } catch (error) {
      console.error('Error creating texture:', error);
      return null;
    }
  }, [canvasData]);

  // Auto-rotate the model
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  // Product-specific geometries and materials
  const { geometry, material, designPosition } = useMemo(() => {
    const baseColor = getProductColor(productType);
    
    switch (productType) {
      case 't-shirt':
        return {
          geometry: createTShirtGeometry(),
          material: new MeshStandardMaterial({ 
            color: baseColor,
            roughness: 0.8,
            metalness: 0.1
          }),
          designPosition: [0, 0.2, 0.01] as [number, number, number]
        };
      
      case 'hoodie':
        return {
          geometry: createHoodieGeometry(),
          material: new MeshStandardMaterial({ 
            color: baseColor,
            roughness: 0.9,
            metalness: 0.05
          }),
          designPosition: [0, 0.1, 0.01] as [number, number, number]
        };
      
      case 'cap':
        return {
          geometry: createCapGeometry(),
          material: new MeshStandardMaterial({ 
            color: baseColor,
            roughness: 0.7,
            metalness: 0.2
          }),
          designPosition: [0, 0.1, 0.3] as [number, number, number]
        };
      
      default:
        return {
          geometry: new THREE.BoxGeometry(1, 1.2, 0.1),
          material: new MeshStandardMaterial({ 
            color: baseColor,
            roughness: 0.8,
            metalness: 0.1
          }),
          designPosition: [0, 0, 0.06] as [number, number, number]
        };
    }
  }, [productType]);

  return (
    <group>
      {/* Main product mesh */}
      <mesh ref={meshRef} geometry={geometry} material={material} />
      
      {/* Design overlay */}
      {designTexture && (
        <mesh position={designPosition}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial 
            map={designTexture} 
            transparent 
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
};

// Helper functions for creating product geometries
function createTShirtGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  
  // T-shirt outline
  shape.moveTo(-0.6, -0.8);
  shape.lineTo(-0.6, 0.2);
  shape.lineTo(-0.8, 0.4);
  shape.lineTo(-0.8, 0.6);
  shape.lineTo(-0.4, 0.6);
  shape.lineTo(-0.4, 0.8);
  shape.lineTo(0.4, 0.8);
  shape.lineTo(0.4, 0.6);
  shape.lineTo(0.8, 0.6);
  shape.lineTo(0.8, 0.4);
  shape.lineTo(0.6, 0.2);
  shape.lineTo(0.6, -0.8);
  shape.lineTo(-0.6, -0.8);
  
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 5
  });
  
  return geometry;
}

function createHoodieGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  
  // Hoodie outline (similar to t-shirt but wider)
  shape.moveTo(-0.7, -0.8);
  shape.lineTo(-0.7, 0.1);
  shape.lineTo(-0.9, 0.3);
  shape.lineTo(-0.9, 0.7);
  shape.lineTo(-0.5, 0.7);
  shape.lineTo(-0.5, 0.9);
  shape.lineTo(0.5, 0.9);
  shape.lineTo(0.5, 0.7);
  shape.lineTo(0.9, 0.7);
  shape.lineTo(0.9, 0.3);
  shape.lineTo(0.7, 0.1);
  shape.lineTo(0.7, -0.8);
  shape.lineTo(-0.7, -0.8);
  
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.15,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 5
  });
  
  return geometry;
}

function createCapGeometry(): THREE.BufferGeometry {
  // Create a cap using a sphere for the top and a cylinder for the visor
  const capGeometry = new THREE.SphereGeometry(0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6);
  return capGeometry;
}

function getProductColor(productType: string): string {
  const colors: Record<string, string> = {
    't-shirt': '#e8e8e8',
    'hoodie': '#d8d8d8',
    'cap': '#c8c8c8',
    'general': '#f0f0f0'
  };
  return colors[productType] || colors.general;
}

export default ProductModel3D;
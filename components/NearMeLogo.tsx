import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const UnitarySystem = () => {
  const rendererRef = useRef<HTMLDivElement>(null);
  let scene, camera, renderer;
  let textMesh, globeMesh;

  useEffect(() => {
    // Initialize Scene, Camera, Renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth / 4, window.innerHeight / 4);
    renderer.setClearColor(0x000000, 0);

    if (rendererRef.current) {
      rendererRef.current.appendChild(renderer.domElement);
    }

    // Load Font and Create Text
    const loader = new FontLoader();
    loader.load(
      'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/fonts/helvetiker_regular.typeface.json',
      (font) => {
        const textGeometry = new TextGeometry('Near-Me', {
          font,
          size: 0.5, // Smaller text size
          height: 0.05,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5,
        });

        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
        textGeometry.translate(-0.5 * textWidth, 0, 0);

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, -1, 0); // Lower text position
        scene.add(textMesh);
      },
      undefined,
      (error) => console.error('Font load error:', error)
    );

    // Create Small Rotating Globe
    const globeGeometry = new THREE.SphereGeometry(1.75, 32, 32); // Smaller globe
    const globeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, side: THREE.BackSide });
    globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeMesh.position.set(0, -0.6, 0); // Position globe slightly above text
    scene.add(globeMesh);

    // Adjust Camera
    camera.position.set(0, 0, 5);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      globeMesh.rotation.y += 0.01; // Rotate globe only
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup Function
    return () => {
      renderer.dispose();
      renderer.domElement.remove();

      if (textMesh) {
        textMesh.geometry.dispose();
        textMesh.material.dispose();
      }
      globeGeometry.dispose();
      globeMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={rendererRef}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '25%',
        height: '25%',
      }}
    />
  );
};

export default UnitarySystem;

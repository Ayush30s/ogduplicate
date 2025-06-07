import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CompareSlider } from "react-compare-slider";

const ProgressVisualizer = ({ userId }) => {
  // State for user data
  const [userData, setUserData] = useState({
    weight: [80, 78, 76, 74], // Example data (kg)
    bodyFat: [22, 20, 19, 18], // Example data (%)
    dates: ["Jan", "Feb", "Mar", "Apr"],
    beforeImage: "https://example.com/before.jpg",
    afterImage: "https://example.com/after.jpg",
  });

  // Refs for DOM elements
  const chartRef = useRef(null);
  const threeContainerRef = useRef(null);
  const [threeScene, setThreeScene] = useState(null);

  // ===== 1. Charts =====
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    const progressChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: userData.dates,
        datasets: [
          {
            label: "Weight (kg)",
            data: userData.weight,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.3,
          },
          {
            label: "Body Fat (%)",
            data: userData.bodyFat,
            borderColor: "rgb(255, 99, 132)",
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Your Progress Over Time",
          },
        },
      },
    });

    return () => progressChart.destroy();
  }, [userData]);

  // ===== 2. 3D Body Model =====
  useEffect(() => {
    if (!threeContainerRef.current || threeScene) return;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      threeContainerRef.current.clientWidth /
        threeContainerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(
      threeContainerRef.current.clientWidth,
      threeContainerRef.current.clientHeight
    );
    threeContainerRef.current.appendChild(renderer.domElement);

    // Add lights
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load 3D model (replace with your GLTF model)
    const loader = new GLTFLoader();
    loader.load(
      "https://example.com/body-model.glb",
      (gltf) => {
        scene.add(gltf.scene);
        // Adjust model based on user data (simplified example)
        gltf.scene.scale.set(
          1,
          1 +
            (userData.weight[0] - userData.weight[userData.weight.length - 1]) /
              100,
          1
        );
      },
      undefined,
      (error) => console.error("Error loading 3D model:", error)
    );

    // Camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    setThreeScene(scene);

    return () => {
      threeContainerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // ===== 3. Before/After Slider =====
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Upload to Firebase Storage or your backend
    const imageUrl = URL.createObjectURL(file);
    setUserData((prev) => ({
      ...prev,
      [type]: imageUrl,
    }));
  };

  return (
    <div className="progress-visualizer">
      <h2>🏅 Your Progress</h2>

      {/* Section 1: Charts */}
      <div className="chart-section">
        <h3>Stats Over Time</h3>
        <canvas ref={chartRef} width="400" height="200"></canvas>
      </div>

      {/* Section 2: 3D Body Model */}
      <div className="threejs-section">
        <h3>3D Body Visualization</h3>
        <div
          ref={threeContainerRef}
          style={{ width: "100%", height: "400px", border: "1px solid #ddd" }}
        />
      </div>

      {/* Section 3: Before/After Slider */}
      <div className="comparison-section">
        <h3>Photo Comparison</h3>
        {userData.beforeImage && userData.afterImage ? (
          <CompareSlider
            beforeImage={userData.beforeImage}
            afterImage={userData.afterImage}
            aspectRatio="16/9"
          />
        ) : (
          <p>Upload before/after photos to see changes!</p>
        )}
        <div className="upload-buttons">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "beforeImage")}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "afterImage")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressVisualizer;

import { useEffect, useRef } from "react";
import * as THREE from "three";

type HeroThreeSceneProps = {
  images: {
    hero: string;
    hoodie: string;
    outfit: string;
    accessories: string;
    drop: string;
    whatsapp: string;
  };
};

type FloatingMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> & {
  userData: {
    basePosition: THREE.Vector3;
    baseRotation: THREE.Euler;
    speed: number;
    amplitude: number;
  };
};

const copper = new THREE.Color("#b46b43");

const makeLabelTexture = (eyebrow: string, title: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 300;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const radius = 34;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(12, 13, 11, 0.78)";
  ctx.strokeStyle = "rgba(255, 250, 241, 0.26)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(10, 10, canvas.width - 20, canvas.height - 20, radius);
  ctx.fill();
  ctx.stroke();

  const gradient = ctx.createLinearGradient(20, 0, canvas.width - 20, 0);
  gradient.addColorStop(0, "rgba(180, 107, 67, 0)");
  gradient.addColorStop(0.5, "rgba(180, 107, 67, 0.95)");
  gradient.addColorStop(1, "rgba(180, 107, 67, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(70, 38, canvas.width - 140, 5);

  ctx.fillStyle = "rgba(255, 250, 241, 0.72)";
  ctx.font = "800 34px Inter, Arial, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText(eyebrow.toUpperCase(), 54, 120);

  ctx.fillStyle = "#fffaf1";
  ctx.font = "900 58px Inter, Arial, sans-serif";
  ctx.letterSpacing = "0px";
  ctx.fillText(title, 54, 205);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

export const HeroThreeScene = ({ images }: HeroThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#070807", 0.045);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 0.25, 8.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.domElement.setAttribute("aria-hidden", "true");
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    const cards = new THREE.Group();
    const ringGroup = new THREE.Group();
    const floatingMeshes: FloatingMesh[] = [];
    const disposableTextures: THREE.Texture[] = [];
    scene.add(root, cards, ringGroup);

    scene.add(new THREE.AmbientLight("#fffaf1", 1.15));

    const keyLight = new THREE.DirectionalLight("#fff4dc", 3.2);
    keyLight.position.set(3.2, 4.5, 5.8);
    scene.add(keyLight);

    const copperLight = new THREE.PointLight("#b46b43", 18, 18, 1.5);
    copperLight.position.set(-2.6, 1.9, 3.4);
    scene.add(copperLight);

    const oliveLight = new THREE.PointLight("#66735c", 8, 14, 1.4);
    oliveLight.position.set(3.4, -1.2, 2.2);
    scene.add(oliveLight);

    const grid = new THREE.GridHelper(18, 34, "#b46b43", "#fffaf1");
    grid.position.y = -3.15;
    grid.position.z = -0.8;
    const gridMaterial = Array.isArray(grid.material) ? grid.material[0] : grid.material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.18;
    root.add(grid);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 10),
      new THREE.MeshBasicMaterial({
        color: "#0e100d",
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.18;
    floor.position.z = -0.6;
    root.add(floor);

    const particlesGeometry = new THREE.BufferGeometry();
    const particles = new Float32Array(150 * 3);
    for (let index = 0; index < particles.length; index += 3) {
      particles[index] = (Math.random() - 0.5) * 12;
      particles[index + 1] = (Math.random() - 0.5) * 7;
      particles[index + 2] = (Math.random() - 0.5) * 9;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particles, 3));
    const particlesMesh = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: "#f6b184",
        size: 0.025,
        transparent: true,
        opacity: 0.58,
        depthWrite: false
      })
    );
    scene.add(particlesMesh);

    const createImagePlane = (texture: THREE.Texture, width: number, height: number, position: [number, number, number], rotation: [number, number, number], speed: number, amplitude: number) => {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        toneMapped: false
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 16, 16), material) as FloatingMesh;
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.userData.basePosition = mesh.position.clone();
      mesh.userData.baseRotation = mesh.rotation.clone();
      mesh.userData.speed = speed;
      mesh.userData.amplitude = amplitude;
      floatingMeshes.push(mesh);
      root.add(mesh);
      return mesh;
    };

    const createLabelPlane = (eyebrow: string, title: string, position: [number, number, number], rotation: [number, number, number]) => {
      const texture = makeLabelTexture(eyebrow, title);
      if (!texture) return;
      disposableTextures.push(texture);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        toneMapped: false
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.92, 0.9), material) as FloatingMesh;
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.userData.basePosition = mesh.position.clone();
      mesh.userData.baseRotation = mesh.rotation.clone();
      mesh.userData.speed = 1.1;
      mesh.userData.amplitude = 0.11;
      floatingMeshes.push(mesh);
      cards.add(mesh);
    };

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: copper,
      transparent: true,
      opacity: 0.46,
      side: THREE.DoubleSide
    });
    const ringOne = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.012, 10, 180), ringMaterial);
    ringOne.rotation.set(1.18, 0.4, -0.48);
    ringOne.position.set(1.25, 0.25, -0.15);
    const ringTwo = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.009, 10, 180), ringMaterial.clone());
    ringTwo.rotation.set(1.32, -0.18, 0.3);
    ringTwo.position.set(1.05, 0.08, -0.55);
    ringGroup.add(ringOne, ringTwo);

    let isMounted = true;
    let frameId = 0;
    const pointer = new THREE.Vector2(0, 0);
    const smoothedPointer = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const textureLoader = new THREE.TextureLoader();
    const loadTexture = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          url,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = 8;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            disposableTextures.push(texture);
            resolve(texture);
          },
          undefined,
          reject
        );
      });

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const isMobile = width < 760;
      const isTablet = width >= 760 && width < 1120;
      root.scale.setScalar(isMobile ? 0.68 : isTablet ? 0.82 : 1);
      root.position.set(isMobile ? 0.05 : isTablet ? 0.7 : 1.45, isMobile ? -0.1 : -0.03, 0);
      cards.scale.setScalar(isMobile ? 0.78 : 1);
      cards.position.set(isMobile ? 0.15 : isTablet ? 0.4 : 1.45, isMobile ? -0.05 : 0, 0.4);
      ringGroup.scale.setScalar(isMobile ? 0.72 : 1);
      ringGroup.position.set(isMobile ? 0.05 : isTablet ? 0.55 : 1.35, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    Promise.all([
      loadTexture(images.hero),
      loadTexture(images.hoodie),
      loadTexture(images.outfit),
      loadTexture(images.accessories),
      loadTexture(images.drop),
      loadTexture(images.whatsapp)
    ])
      .then(([hero, hoodie, outfit, accessories, drop, whatsapp]) => {
        if (!isMounted) return;

        const main = createImagePlane(hero, 2.75, 4.55, [0.45, 0.06, 0.34], [0.02, -0.2, 0.02], 0.85, 0.14);
        main.renderOrder = 3;

        createImagePlane(outfit, 1.36, 1.86, [-1.55, -0.7, 1.35], [-0.1, 0.42, -0.16], 1.05, 0.22).renderOrder = 4;
        createImagePlane(hoodie, 1.42, 1.86, [2.42, 1.14, 1.55], [0.08, -0.52, 0.16], 1.28, 0.2).renderOrder = 5;
        createImagePlane(accessories, 1.5, 1.5, [2.3, -1.28, 1.2], [-0.12, -0.38, 0.12], 1.14, 0.18).renderOrder = 5;
        createImagePlane(drop, 2.25, 1.32, [-1.46, 1.38, -0.1], [0.06, 0.34, -0.12], 0.92, 0.15).renderOrder = 2;
        createImagePlane(whatsapp, 1.14, 1.58, [0.08, -1.65, 1.95], [-0.12, 0.12, -0.04], 1.35, 0.18).renderOrder = 6;

        createLabelPlane("Drop activo", "15 piezas", [-2.35, 0.35, 2.05], [0.02, 0.48, -0.1]);
        createLabelPlane("Stock real", "talle + color", [2.72, 0.08, 2.1], [0.04, -0.5, 0.09]);
        createLabelPlane("WhatsApp", "pedido listo", [0.6, -2.25, 2.45], [-0.04, -0.04, 0.03]);
      })
      .catch(() => {
        // If textures fail, keep the light/grid scene alive instead of breaking the storefront.
      });

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      smoothedPointer.lerp(pointer, prefersReducedMotion ? 0.02 : 0.075);

      const motionScale = prefersReducedMotion ? 0.12 : 1;
      root.rotation.y = Math.sin(elapsed * 0.28) * 0.12 * motionScale + smoothedPointer.x * 0.34 * motionScale;
      root.rotation.x = Math.sin(elapsed * 0.2) * 0.05 * motionScale - smoothedPointer.y * 0.17 * motionScale;
      cards.rotation.y = -smoothedPointer.x * 0.22 * motionScale;
      cards.rotation.x = smoothedPointer.y * 0.12 * motionScale;
      ringGroup.rotation.z = elapsed * 0.12 * motionScale;
      ringGroup.rotation.y = smoothedPointer.x * 0.18 * motionScale;
      particlesMesh.rotation.y = elapsed * 0.035 * motionScale;

      floatingMeshes.forEach((mesh, index) => {
        const basePosition = mesh.userData.basePosition;
        const baseRotation = mesh.userData.baseRotation;
        const pulse = Math.sin(elapsed * mesh.userData.speed + index * 0.7);
        mesh.position.set(
          basePosition.x + smoothedPointer.x * 0.18 * (index % 2 ? -1 : 1) * motionScale,
          basePosition.y + pulse * mesh.userData.amplitude * motionScale - smoothedPointer.y * 0.08 * motionScale,
          basePosition.z + Math.cos(elapsed * 0.55 + index) * 0.06 * motionScale
        );
        mesh.rotation.set(
          baseRotation.x + smoothedPointer.y * 0.08 * motionScale,
          baseRotation.y + smoothedPointer.x * 0.1 * motionScale,
          baseRotation.z + Math.sin(elapsed * 0.38 + index) * 0.025 * motionScale
        );
      });

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isMounted = false;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);

      [...floatingMeshes, floor, ringOne, ringTwo].forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose());
        else mesh.material.dispose();
      });
      particlesGeometry.dispose();
      if (Array.isArray(grid.material)) grid.material.forEach((material) => material.dispose());
      else grid.material.dispose();
      disposableTextures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
  }, [images]);

  return <div className="hero-three-scene" ref={mountRef} aria-hidden="true" />;
};

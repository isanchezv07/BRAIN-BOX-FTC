import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { createBaseField, FIELD_CONSTANTS } from './fields/baseField';
import { createDecodeField } from './fields/decodeField';

export function createScene(container: HTMLElement, world: CANNON.World, fieldConstructor: (scene: THREE.Scene, world: CANNON.World) => void = createBaseField) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        50
    );
    camera.position.set(4, 3.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 12;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 8, 5);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.near = 0.5;
    dir.shadow.camera.far = 20;
    dir.shadow.camera.left = dir.shadow.camera.bottom = -FIELD_CONSTANTS.HALF - 1;
    dir.shadow.camera.right = dir.shadow.camera.top = FIELD_CONSTANTS.HALF + 1;
    scene.add(dir);

    // Call the provided field constructor to add specific field elements
    fieldConstructor(scene, world);

    return { scene, camera, renderer, controls };
}
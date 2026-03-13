import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FIELD_CONSTANTS } from './baseField';

export function createDecodeField(scene: THREE.Scene, world: CANNON.World) {
    const { FIELD, HALF, TILE, WALL_H, WALL_W } = FIELD_CONSTANTS;

    // BASE ZONES (18 inches square = 0.457 m)
    const baseZoneSize = 0.457;
    const baseZoneThickness = 0.001; // Thin layer on the floor

    // Red BASE ZONE on tile B2 (approx position)
    const redBaseZoneGeo = new THREE.BoxGeometry(baseZoneSize, baseZoneThickness, baseZoneSize);
    const redBaseZoneMat = new THREE.MeshStandardMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
    const redBaseZoneMesh = new THREE.Mesh(redBaseZoneGeo, redBaseZoneMat);
    redBaseZoneMesh.position.set(-TILE, baseZoneThickness / 2 + 0.001, -2 * TILE); // Approximate B2 position
    scene.add(redBaseZoneMesh);

    // Blue BASE ZONE on tile E2 (approx position)
    const blueBaseZoneGeo = new THREE.BoxGeometry(baseZoneSize, baseZoneThickness, baseZoneSize);
    const blueBaseZoneMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
    const blueBaseZoneMesh = new THREE.Mesh(blueBaseZoneGeo, blueBaseZoneMat);
    blueBaseZoneMesh.position.set(2 * TILE, baseZoneThickness / 2 + 0.001, -2 * TILE); // Approximate E2 position
    scene.add(blueBaseZoneMesh);

    // Alliance Goals (simple boxes for now)
    const goalSize = 0.5;
    const goalHeight = 0.3;
    const rampLength = 0.4;
    const rampHeight = 0.2;

    // Red Alliance Goal
    const redGoalGeo = new THREE.BoxGeometry(goalSize, goalHeight, goalSize);
    const redGoalMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
    const redGoalMesh = new THREE.Mesh(redGoalGeo, redGoalMat);
    redGoalMesh.position.set(-HALF + goalSize / 2, goalHeight / 2, HALF - goalSize / 2);
    scene.add(redGoalMesh);

    const redRampGeo = new THREE.BoxGeometry(goalSize, rampHeight, rampLength);
    const redRampMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    const redRampMesh = new THREE.Mesh(redRampGeo, redRampMat);
    redRampMesh.rotation.x = Math.PI / 8; // Simulate a ramp angle
    redRampMesh.position.set(-HALF + goalSize / 2, rampHeight / 2, HALF - goalSize / 2 - goalSize / 2 - rampLength / 2 + 0.05); // Position in front of goal
    scene.add(redRampMesh);


    // Blue Alliance Goal
    const blueGoalGeo = new THREE.BoxGeometry(goalSize, goalHeight, goalSize);
    const blueGoalMat = new THREE.MeshStandardMaterial({ color: 0x0000cc });
    const blueGoalMesh = new THREE.Mesh(blueGoalGeo, blueGoalMat);
    blueGoalMesh.position.set(HALF - goalSize / 2, goalHeight / 2, HALF - goalSize / 2);
    scene.add(blueGoalMesh);

    const blueRampGeo = new THREE.BoxGeometry(goalSize, rampHeight, rampLength);
    const blueRampMat = new THREE.MeshStandardMaterial({ color: 0x3333ff });
    const blueRampMesh = new THREE.Mesh(blueRampGeo, blueRampMat);
    blueRampMesh.rotation.x = Math.PI / 8; // Simulate a ramp angle
    blueRampMesh.position.set(HALF - goalSize / 2, rampHeight / 2, HALF - goalSize / 2 - goalSize / 2 - rampLength / 2 + 0.05); // Position in front of goal
    scene.add(blueRampMesh);

    // Purple Artifacts (24 small cylinders)
    const artifactRadius = 0.05;
    const artifactHeight = 0.1;
    const artifactGeo = new THREE.CylinderGeometry(artifactRadius, artifactRadius, artifactHeight, 16);
    const artifactMat = new THREE.MeshStandardMaterial({ color: 0x800080 }); // Purple color

    const artifactPositions = [
        // Example positions, distribute them across the field
        // These are just illustrative and would need precise placement
        [-1 * TILE, artifactHeight / 2, 0],
        [0, artifactHeight / 2, 1 * TILE],
        [1 * TILE, artifactHeight / 2, 0],
        // ... more positions to make up 24 artifacts
    ];

    // Add 24 artifacts
    for (let i = 0; i < 24; i++) {
        // Distribute artifacts randomly for now
        const x = (Math.random() - 0.5) * FIELD * 0.8;
        const z = (Math.random() - 0.5) * FIELD * 0.8;
        const artifactMesh = new THREE.Mesh(artifactGeo, artifactMat);
        artifactMesh.position.set(x, artifactHeight / 2, z);
        scene.add(artifactMesh);

        // Add corresponding physics body
        const artifactShape = new CANNON.Cylinder(artifactRadius, artifactRadius, artifactHeight, 16);
        const artifactBody = new CANNON.Body({ mass: 0.1, shape: artifactShape });
        artifactBody.position.set(x, artifactHeight / 2, z);
        world.addBody(artifactBody);
    }
}
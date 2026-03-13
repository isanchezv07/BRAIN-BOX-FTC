import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export const FIELD_CONSTANTS = {
    FIELD: 3.66, // FTC Field is 12'x12' which is approx 3.66m
    HALF: 3.66 / 2,
    TILE: 3.66 / 6, // 36 tiles 24"x24"
    WALL_H: 0.30,
    WALL_W: 0.04,
};

export function createBaseField(scene: THREE.Scene, world: CANNON.World) {
    const { FIELD, HALF, TILE, WALL_H, WALL_W } = FIELD_CONSTANTS;

    const floorPhys = new CANNON.Material('floor');
    const wallPhys = new CANNON.Material('wall');
    
    // Ground plane
    const ground = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: floorPhys });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(ground);

    // Walls
    const wallShape = (sx: number, sy: number, sz: number) =>
        new CANNON.Box(new CANNON.Vec3(sx / 2, sy / 2, sz / 2));
    [
        [HALF + WALL_W / 2, WALL_H / 2, 0],
        [-HALF - WALL_W / 2, WALL_H / 2, 0],
        [0, WALL_H / 2, HALF + WALL_W / 2],
        [0, WALL_H / 2, -HALF - WALL_W / 2],
    ].forEach(([x, y, z]) => {
        const isX = x !== 0;
        const w = new CANNON.Body({
            mass: 0,
            material: wallPhys,
            shape: isX ? wallShape(WALL_W, WALL_H, FIELD + WALL_W * 2) : wallShape(FIELD + WALL_W * 2, WALL_H, WALL_W),
        });
        w.position.set(x, y, z);
        world.addBody(w);
    });

    // Tiled floor
    const tileGeo = new THREE.PlaneGeometry(TILE - 0.002, TILE - 0.002);
    const matGray = new THREE.MeshStandardMaterial({ color: 0x6b7280 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xe5e7eb });
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            const mat = (i + j) % 2 === 0 ? matGray : matWhite;
            const tile = new THREE.Mesh(tileGeo, mat);
            tile.rotation.x = -Math.PI / 2;
            tile.receiveShadow = true;
            tile.position.set((i - 2.5) * TILE, 0, (j - 2.5) * TILE);
            scene.add(tile);
        }
    }

    return { floorPhys, wallPhys };
}

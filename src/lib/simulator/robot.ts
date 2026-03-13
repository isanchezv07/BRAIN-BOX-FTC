import * as CANNON from 'cannon-es';
import * as THREE from 'three';

// —— ROBOT FTC (chasis 18"×18" ≈ 0.46 m) ——
const RW = 0.23; // Robot Width
const RD = 0.23; // Robot Depth
const RH = 0.06; // Robot Height
const wheelR = 0.055; // El radio de tus llantas

export function createRobot(carBody: CANNON.Body, scene: THREE.Scene) {
    const input = { fl: 0, fr: 0, bl: 0, br: 0 };
    let simYawDeg = 0;
    let turnIntervalId: ReturnType<typeof setInterval> | null = null;
    let executionID = 0;

    const robotPhys = new CANNON.Material('robot');
    carBody.material = robotPhys;
    carBody.shape = new CANNON.Box(new CANNON.Vec3(RW, RH / 2, RD));
    carBody.linearDamping = 0.85;
    carBody.angularDamping = 0.9;
    carBody.position.set(0, wheelR, 0);

    const robotMesh = new THREE.Group();
      
    // Materiales Estilo Industrial
    const aluminumMat = new THREE.MeshStandardMaterial({ color: 0xbdc3c7, metalness: 0.9, roughness: 0.1 });
    const plasticMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const hubMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0x332200, metalness: 0.5 }); // Amarillo Control Hub
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x3498db }); // Batería Azul

    const chW = RW * 2;
    const chD = RD * 2;
    const chH = 0.045; // Altura del canal de aluminio

    // 1. ESTRUCTURA PERIMETRAL (Canales en U)
    const beamGeo = new THREE.BoxGeometry(chW, chH, 0.02);
    const frontBeam = new THREE.Mesh(beamGeo, aluminumMat);
    frontBeam.position.set(0, wheelR + 0.01, chD / 2 - 0.01);
    robotMesh.add(frontBeam);

    const backBeam = frontBeam.clone();
    backBeam.position.z = -chD / 2 + 0.01;
    robotMesh.add(backBeam);

    const sideBeamGeo = new THREE.BoxGeometry(0.02, chH, chD - 0.04);
    const leftBeam = new THREE.Mesh(sideBeamGeo, aluminumMat);
    leftBeam.position.set(-chW / 2 + 0.01, wheelR + 0.01, 0);
    robotMesh.add(leftBeam);

    const rightBeam = leftBeam.clone();
    rightBeam.position.x = chW / 2 - 0.01;
    robotMesh.add(rightBeam);

    // 2. ELECTRÓNICA INTERNA
    // Control Hub (El cerebro amarillo)
    const controlHub = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.1), hubMat);
    controlHub.position.set(0, wheelR + 0.025, 0.03);
    robotMesh.add(controlHub);

    // Batería (Típica batería de 12V Slim)
    const battery = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.025, 0.05), batteryMat);
    battery.position.set(0, wheelR + 0.02, -0.06);
    robotMesh.add(battery);

    // 3. RUEDAS MECANUM DETALLADAS
    const wheelW = 0.038;
    const wheelGeo = new THREE.CylinderGeometry(wheelR, wheelR, wheelW, 16);
    
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sz], idx) => {
        const wheelGroup = new THREE.Group();
        
        // El neumático
        const tire = new THREE.Mesh(wheelGeo, plasticMat);
        tire.rotation.z = Math.PI / 2;
        
        // El rin/masa central (metálico)
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(wheelR*0.4, wheelR*0.4, wheelW + 0.005, 12), aluminumMat);
        hub.rotation.z = Math.PI / 2;
        tire.add(hub);

        // Rodillos simulados (líneas visuales para ver el giro)
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.005, wheelR * 2.1, 0.005), aluminumMat);
        tire.add(stripe);

        wheelGroup.add(tire);
        wheelGroup.position.set(
          sx * (chW / 2 + 0.005),
          wheelR, 
          sz * (chD / 2 - 0.06)
        );
        
        tire.name = `wheel_${idx}`; // Para la animación
        robotMesh.add(wheelGroup);
    });

    // 4. PLACA SUPERIOR (Lexan/Policarbonato)
    const plate = new THREE.Mesh(
        new THREE.BoxGeometry(chW - 0.04, 0.005, chD - 0.04),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    );
    plate.position.y = wheelR + chH;
    robotMesh.add(plate);

    const distanceSensor = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.02, 0.02),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    distanceSensor.position.set(0, wheelR, chD / 2);
    robotMesh.add(distanceSensor);

    const colorSensor = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.02, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    colorSensor.position.set(0, 0.01, 0);
    robotMesh.add(colorSensor);

    scene.add(robotMesh);

    const robotAPI = {
        setPower: (fl: number, fr: number, bl: number, br: number) => {
          input.fl = Math.max(-1, Math.min(1, fl));
          input.fr = Math.max(-1, Math.min(1, fr));
          input.bl = Math.max(-1, Math.min(1, bl));
          input.br = Math.max(-1, Math.min(1, br));
        },
        getPower: (motor: 'fl' | 'fr' | 'bl' | 'br') => {
          return input[motor];
        },
        stop: () => {
          robotAPI.setPower(0, 0, 0, 0);
          carBody.velocity.set(0, 0, 0);
          carBody.angularVelocity.set(0, 0, 0);
        },
        strafe: (power: number, ms: number) => {
          return new Promise<void>((resolve) => {
            // Strafe right: FL+, FR-, BL-, BR+
            robotAPI.setPower(power, -power, -power, power);
            setTimeout(() => {
              resolve();
            }, ms);
          });
        },
        getYaw: () => simYawDeg,
        getDistance: () => {
            const raycaster = new THREE.Raycaster();
            const direction = new THREE.Vector3(0, 0, -1);
            direction.applyQuaternion(robotMesh.quaternion);
            raycaster.set(robotMesh.position, direction);
            const intersections = raycaster.intersectObjects(scene.children, true);
            if (intersections.length > 0) {
                for (const intersection of intersections) {
                    // Check if the intersected object is not part of the robot itself
                    // This is a simplified check, a more robust solution might involve object IDs or layers
                    if (intersection.object !== robotMesh && !robotMesh.children.includes(intersection.object)) {
                        return intersection.distance;
                    }
                }
            }
            return 1000; // Return a large value if no object is detected
        },
        getColor: () => {
            const raycaster = new THREE.Raycaster();
            const direction = new THREE.Vector3(0, -1, 0); // Raycast downwards
            raycaster.set(robotMesh.position, direction);
            const intersections = raycaster.intersectObjects(scene.children, true);
            if (intersections.length > 0) {
                const intersection = intersections[0];
                if (intersection.object instanceof THREE.Mesh) {
                    const material = intersection.object.material as THREE.MeshStandardMaterial;
                    if (material && material.color) {
                        return `#${material.color.getHexString()}`;
                    }
                }
            }
            return '#000000'; // Default to black if no color detected
        },
        turn: (deg: number) => {
          return new Promise<void>((resolve) => {
            if (turnIntervalId) clearInterval(turnIntervalId);
            const goal = Math.abs(deg);
            const sign = Math.sign(deg) || 1;
            const power = 0.55;
            // Turn right: FL+, FR-, BL+, BR-
            robotAPI.setPower(sign * power, -sign * power, sign * power, -sign * power);
            let rotated = 0;
            let last = simYawDeg;
            const normalize = (a: number) => {
              a = a % 360;
              return a > 180 ? a - 360 : a < -180 ? a + 360 : a;
            };
            turnIntervalId = setInterval(() => {
              const d = normalize(simYawDeg - last);
              last = simYawDeg;
              rotated += Math.abs(d);
              if (rotated >= goal) {
                if (turnIntervalId) clearInterval(turnIntervalId);
                turnIntervalId = null;
                robotAPI.stop();
                resolve();
              }
            }, 40);
          });
        },
    };

    function resetRobot() {
        if (turnIntervalId) {
            clearInterval(turnIntervalId);
            turnIntervalId = null;
        }
        robotAPI.stop();
        executionID++;
        carBody.position.set(0, wheelR, 0);
        carBody.quaternion.set(0, 0, 0, 1);
        carBody.velocity.set(0, 0, 0);
        carBody.angularVelocity.set(0, 0, 0);
        robotMesh.position.set(0, RH / 2 + 0.001, 0);
        robotMesh.quaternion.identity();
    }

    function update(world: CANNON.World, FIXED_DT: number) {
        const forwardSpeed = (input.fl + input.fr + input.bl + input.br) * 0.5 * 2.2;
        const strafeSpeed = (-input.fl + input.fr - input.bl + input.br) * 0.5 * 2.2;
        const turnSpeed = (-input.fl + input.fr + input.bl - input.br) * 2.5;

        const forward = new CANNON.Vec3(0, 0, -1);
        carBody.quaternion.vmult(forward, forward);
        
        const strafe = new CANNON.Vec3(1, 0, 0);
        carBody.quaternion.vmult(strafe, strafe);

        carBody.velocity.x = forward.x * forwardSpeed + strafe.x * strafeSpeed;
        carBody.velocity.z = forward.z * forwardSpeed + strafe.z * strafeSpeed;
        carBody.angularVelocity.y = turnSpeed;
        
        carBody.quaternion.x = 0;
        carBody.quaternion.z = 0;

        const euler = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion(
                carBody.quaternion.x,
                carBody.quaternion.y,
                carBody.quaternion.z,
                carBody.quaternion.w
            )
        );
        simYawDeg = (euler.y * 180) / Math.PI;

        robotMesh.position.copy(carBody.position as unknown as THREE.Vector3);
        robotMesh.quaternion.copy(carBody.quaternion as unknown as THREE.Quaternion);
    }

    return {
        robotAPI,
        resetRobot,
        update,
        getExecutionId: () => executionID,
        incrementExecutionId: () => executionID++,
        robotMesh, // Return robotMesh as well
    }
}
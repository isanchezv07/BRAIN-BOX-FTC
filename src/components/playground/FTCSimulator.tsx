import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const FIELD_SIZE = 3.66;
const ROBOT_SIZE = 0.45; 
const WALL_HEIGHT = 0.3;

const FTCSimulator: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cameraMode, setCameraMode] = useState<'field' | 'robot'>('field');
    const [matchState, setMatchState] = useState<{
        phase: 'READY' | 'AUTO' | 'TELEOP' | 'END';
        timeLeft: number;
    }>({ phase: 'READY', timeLeft: 150 }); 

    const [telemetry, setTelemetry] = useState({
        x: 0,
        y: 0,
        z: 0,
        heading: 0,
        speed: 0
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);

        const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        const fieldCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        fieldCamera.position.set(0, 4, 4);
        fieldCamera.lookAt(0, 0, 0);

        const robotCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        containerRef.current.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);
        world.defaultContactMaterial.friction = 0.5;

        const grid = new THREE.GridHelper(FIELD_SIZE, 6, 0x444444, 0x222222);
        scene.add(grid);

        const floorGeo = new THREE.PlaneGeometry(FIELD_SIZE, FIELD_SIZE);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.receiveShadow = true;
        scene.add(floorMesh);

        const floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane() });
        floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        world.addBody(floorBody);

        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x0088ff, transparent: true, opacity: 0.3 });
        const createWall = (x: number, z: number, width: number, depth: number) => {
            const geo = new THREE.BoxGeometry(width, WALL_HEIGHT, depth);
            const mesh = new THREE.Mesh(geo, wallMaterial);
            mesh.position.set(x, WALL_HEIGHT / 2, z);
            scene.add(mesh);

            const body = new CANNON.Body({
                mass: 0,
                shape: new CANNON.Box(new CANNON.Vec3(width / 2, WALL_HEIGHT / 2, depth / 2)),
            });
            body.position.set(x, WALL_HEIGHT / 2, z);
            world.addBody(body);
        };

        const halfField = FIELD_SIZE / 2;
        createWall(0, halfField, FIELD_SIZE, 0.05);
        createWall(0, -halfField, FIELD_SIZE, 0.05);
        createWall(halfField, 0, 0.05, FIELD_SIZE);
        createWall(-halfField, 0, 0.05, FIELD_SIZE);

        const pixels: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];
        const createPixel = (x: number, z: number, color: number) => {
            const size = 0.08;
            const geo = new THREE.BoxGeometry(size, size, size);
            const mat = new THREE.MeshStandardMaterial({ color });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.castShadow = true;
            scene.add(mesh);

            const body = new CANNON.Body({
                mass: 0.2,
                shape: new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2)),
            });
            body.position.set(x, size / 2, z);
            world.addBody(body);
            pixels.push({ mesh, body });
        };

        for (let i = 0; i < 10; i++) {
            createPixel(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                Math.random() > 0.5 ? 0xffffff : 0xffff00
            );
        }

        const robotGeo = new THREE.BoxGeometry(ROBOT_SIZE, ROBOT_SIZE / 2, ROBOT_SIZE);
        const robotMat = new THREE.MeshStandardMaterial({ color: 0xff3300 });
        const robotMesh = new THREE.Mesh(robotGeo, robotMat);
        robotMesh.castShadow = true;
        scene.add(robotMesh);

        const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2), new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
        arrow.rotation.x = -Math.PI / 2;
        arrow.position.z = -0.3;
        robotMesh.add(arrow);

        const robotBody = new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3(ROBOT_SIZE / 2, ROBOT_SIZE / 4, ROBOT_SIZE / 2)),
            linearDamping: 0.9,
            angularDamping: 0.9,
        });
        robotBody.position.set(0, ROBOT_SIZE / 4 + 0.1, 0);
        world.addBody(robotBody);

        const keys: Record<string, boolean> = {};
        const onKeyDown = (e: KeyboardEvent) => {
            keys[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === 'c') setCameraMode(p => p === 'field' ? 'robot' : 'field');
        };
        const onKeyUp = (e: KeyboardEvent) => (keys[e.key.toLowerCase()] = false);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        let lastTime = performance.now();
        let telemetryUpdateCounter = 0;

        const animate = () => {
            const requestID = requestAnimationFrame(animate);
            const time = performance.now();
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            world.step(1 / 60, dt);

            robotMesh.position.copy(robotBody.position as any);
            robotMesh.quaternion.copy(robotBody.quaternion as any);
            pixels.forEach(p => {
                p.mesh.position.copy(p.body.position as any);
                p.mesh.quaternion.copy(p.body.quaternion as any);
            });

            const force = 100;
            const torque = 40;
            if (keys['w']) robotBody.applyLocalForce(new CANNON.Vec3(0, 0, -force), new CANNON.Vec3(0, 0, 0));
            if (keys['s']) robotBody.applyLocalForce(new CANNON.Vec3(0, 0, force), new CANNON.Vec3(0, 0, 0));
            if (keys['a']) robotBody.applyTorque(new CANNON.Vec3(0, torque, 0));
            if (keys['d']) robotBody.applyTorque(new CANNON.Vec3(0, -torque, 0));

            telemetryUpdateCounter++;
            if (telemetryUpdateCounter > 5) {
                const rotation = new THREE.Euler().setFromQuaternion(robotMesh.quaternion);
                setTelemetry({
                    x: robotBody.position.x,
                    y: robotBody.position.y,
                    z: robotBody.position.z,
                    heading: (rotation.y * 180) / Math.PI,
                    speed: robotBody.velocity.length()
                });
                telemetryUpdateCounter = 0;
            }

            if (cameraMode === 'robot') {
                const relativeCameraOffset = new THREE.Vector3(0, 0.4, 0.8);
                const cameraOffset = relativeCameraOffset.applyMatrix4(robotMesh.matrixWorld);
                robotCamera.position.copy(cameraOffset);
                robotCamera.lookAt(robotMesh.position.x, robotMesh.position.y + 0.1, robotMesh.position.z);
                renderer.render(scene, robotCamera);
            } else {
                renderer.render(scene, fieldCamera);
            }
        };

        const animationId = requestAnimationFrame(animate);

        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            renderer.setSize(width, height);
            fieldCamera.aspect = width / height;
            fieldCamera.updateProjectionMatrix();
            robotCamera.aspect = width / height;
            robotCamera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        const timerInterval = setInterval(() => {
            setMatchState(prev => {
                if (prev.phase === 'READY') return prev;
                if (prev.timeLeft <= 0) return { ...prev, phase: 'END' };
                
                const newTime = prev.timeLeft - 1;
                let newPhase = prev.phase;
                if (newTime <= 120 && prev.phase === 'AUTO') newPhase = 'TELEOP';
                
                return { phase: newPhase as any, timeLeft: newTime };
            });
        }, 1000);

        return () => {
            cancelAnimationFrame(animationId);
            clearInterval(timerInterval);
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
        };
    }, [cameraMode]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-full h-[600px] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <div ref={containerRef} className="w-full h-full" />
                
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 text-white flex gap-6 items-center">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-widest text-white/50">Phase</span>
                            <span className={`font-bold ${matchState.phase === 'AUTO' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                {matchState.phase}
                            </span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-widest text-white/50">Time</span>
                            <span className="text-2xl font-mono font-bold">{formatTime(matchState.timeLeft)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={() => setMatchState({ phase: 'AUTO', timeLeft: 150 })}
                            className="pointer-events-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-900/20"
                        >
                            START MATCH
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white/90 text-xs font-mono w-48">
                        <h3 className="text-blue-400 font-bold mb-2 flex justify-between">
                            TELEMETRY <span>[LIVE]</span>
                        </h3>
                        <div className="space-y-1">
                            <p>X: <span className="text-white">{telemetry.x.toFixed(2)}m</span></p>
                            <p>Z: <span className="text-white">{telemetry.z.toFixed(2)}m</span></p>
                            <p>Heading: <span className="text-white">{telemetry.heading.toFixed(1)}°</span></p>
                            <p>Speed: <span className="text-white">{(telemetry.speed * 100).toFixed(1)} cm/s</span></p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 pointer-events-none">
                    <div className="bg-black/70 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white/60 text-[10px] uppercase tracking-tighter">
                        <div className="flex gap-4">
                            <div><span className="text-white bg-white/20 px-1 rounded mr-1">W/S</span> Drive</div>
                            <div><span className="text-white bg-white/20 px-1 rounded mr-1">A/D</span> Turn</div>
                            <div><span className="text-white bg-white/20 px-1 rounded mr-1">C</span> Camera</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-white font-bold mb-2">Autonomous</h4>
                    <p className="text-white/60 text-sm">30 seconds to score as many points as possible with pre-programmed logic.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-white font-bold mb-2">Tele-Operated</h4>
                    <p className="text-white/60 text-sm">2 minutes of driver control to navigate and interact with game elements.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="text-white font-bold mb-2">End Game</h4>
                    <p className="text-white/60 text-sm">The final 30 seconds of Tele-Op where special scoring actions are available.</p>
                </div>
            </div>
        </div>
    );
};


export default FTCSimulator;

import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String
 * }
 */

export default class WallWithoutDoor {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a texture
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1); // Ajusta según sea necesario
        // Create a wall (seven faces) that casts and receives shadows

        // Create a group of objects
        this.object = new THREE.Group();
        this.frontFace = new THREE.Group();

        // Create the front face
        let geometry = new THREE.PlaneGeometry(0.275, 2.0);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.340, 0.0, 0.0);
        face.castShadow = true;
        face.receiveShadow = true;
        this.frontFace.add(face);


        geometry = new THREE.PlaneGeometry(0.275, 2.0);
        material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        face = new THREE.Mesh(geometry, material);
        face.position.set(-0.340, 0.0, 0.0);
        face.castShadow = true;
        face.receiveShadow = true;
        this.frontFace.add(face);

        geometry = new THREE.PlaneGeometry(0.405, 0.5);
        material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });
        face = new THREE.Mesh(geometry, material);
        face.position.set(0, 0.750, 0.0);
        face.castShadow = true;
        face.receiveShadow = true;
        this.frontFace.add(face);



        this.frontFace.position.set(0, 0, 0.025);
        this.object.add(this.frontFace);


        // Create the rear face
        this.rearFace = this.frontFace.clone();
        this.rearFace.rotateY(Math.PI);
        this.rearFace.position.set(0, 0, -0.025);
        this.object.add(this.rearFace);





        // Create the two left faces (a four-triangle mesh)
        let points = new Float32Array([
            -0.475, -1, 0.025,
            -0.475, 1, 0.025,
            -0.5, 1, 0.0,
            -0.5, -1, 0.0,

            -0.5, 1, 0.0,
            -0.475, 1, -0.025,
            -0.475, -1, -0.025,
            -0.5, -1, 0.0
        ]);
        let normals = new Float32Array([
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,

            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707
        ]);
        let indices = [
            0, 1, 2,
            2, 3, 0,
            4, 5, 6,
            6, 7, 4
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        material = new THREE.MeshPhongMaterial({ color: 0x6b554b });
        face = new THREE.Mesh(geometry, material);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Create the two right faces (a four-triangle mesh)
        face = new THREE.Mesh().copy(face, false);
        face.rotateY(Math.PI);
        this.object.add(face);

        // Create the top face (a four-triangle mesh)
        points = new Float32Array([
            -0.5, 1, 0.0,
            -0.475, 1, 0.025,
            -0.475, 1, -0.025,

            0.475, 1, 0.025,
            0.475, 1, -0.025,
            0.5, 1, 0.0
        ]);
        normals = new Float32Array([
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ]);
        indices = [
            0, 1, 2,
            2, 1, 3,
            3, 4, 2,
            4, 3, 5
        ];
        geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        face = new THREE.Mesh(geometry, material);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);


    // Create the top door frame face
    geometry = new THREE.PlaneGeometry(0.45,0.05);
    material = new THREE.MeshPhongMaterial({ color: 0x6b554b});
    face = new THREE.Mesh(geometry, material);
    face.position.set(0.0, 0.5, -0.025);
    face.rotation.x = Math.PI / 2; // Rotar el plano para que esté en el suelo
    face.castShadow = true;
    face.receiveShadow = false;
    this.frontFace.add(face);

    // Create the left door frame face
    geometry = new THREE.PlaneGeometry(0.0503,1.5); // Invertí las dimensiones para que ahora sean en los ejes Z e X
    material = new THREE.MeshPhongMaterial({ color: 0x6b554b });
    face = new THREE.Mesh(geometry, material);
    face.position.set(0.203, -0.25, -0.025);
    face.rotation.y = -Math.PI / 2; // Rota el plano 90 grados alrededor del eje Y para que esté vertical
    face.castShadow = false;
    face.receiveShadow = false;
    this.frontFace.add(face);

     // Create the rigth door frame face
    face = new THREE.Mesh().copy(face, false);
    face.position.set(-0.203, -0.25, 0);
    face.rotateY(Math.PI);
    this.object.add(face);

    }

    isDoorOpen() {

        return Math.abs(this.doorRotation.y - Math.PI / 2) < 0.01;
    }


}



/*

        // Create the front face

         // Create the front face

        let points = new Float32Array([
            -0.475, 1, 0.0,  // 0
            -0.475, -1, 0.0, // 1
            -0.175, 1, 0.0,  // 2
            -0.175, -1, 0.0, // 3
            -0.175, 0.5, 0.0, // 4

            0.175, 0.5, 0.0,  // 5
            0.175, 1, 0.0,    // 6
            0.175, -1, 0.0,   // 7
            0.475, 1, 0.0,    // 8
            0.475, -1, 0.0    // 9
        ]);

        // Defina os índices para formar triângulos
        let indices = [
            0, 1, 2,
            1, 3, 2,
            2, 3, 4,
            2, 4, 5,
            6, 2, 5,
            6, 5, 7,
            6, 7, 8,
            8, 7, 9
        ];

        // Defina as normais para os vértices (apontando para cima)
        let normals = new Float32Array([
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ]);
       let  geometry = new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)); // itemSize = 3 because there are 3 values (X, Y and Z components) per vertex
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setIndex(indices);
        let material = new THREE.MeshMatcapMaterial({  mapper: texture  });

        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.0, 0.0, 0.025);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);

        // Create the rear face
        face = new THREE.Mesh().copy(face, false);
        face.rotateY(Math.PI);
        face.position.set(0.0, 0.0, -0.025);
        this.object.add(face);




       */

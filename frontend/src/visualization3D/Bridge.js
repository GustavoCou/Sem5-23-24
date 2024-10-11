import * as THREE from "three";
import Wall from "./wall";

/*
 * parameters = {
 *  textureUrl: String
 * }
 */

export default class Bridge {

    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a texture
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Create a wall (seven faces) that casts and receives shadows

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the front face (a rectangle)
        let geometry = new THREE.PlaneGeometry(0.95, 2.0);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture,
             transparent: true,
            opacity: 0.5, // Ajusta la opacidad según tus necesidades
             });
        let face = new THREE.Mesh(geometry, material);
        face.position.set(0.0, 0.0, 0.025);
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);



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






        ///////////////////////////////////////////////////////////////////////////////////////////


        let texture2 = new THREE.TextureLoader().load(this.textureUrl2);
        texture2.anisotropy = 16; // Puedes ajustar esto según tus necesidades
        texture2.minFilter = THREE.LinearFilter;
        texture2.magFilter = THREE.LinearFilter;
        texture2.format = THREE.RGBAFormat;


        // Create the front face (a rectangle)
         geometry = new THREE.PlaneGeometry(0.95, 2.0);
         material = new THREE.MeshPhongMaterial({  map: texture2,
            transparent: true,
            opacity: 0.9, // 

           });

        face = new THREE.Mesh(geometry, material);
        face.position.set(0.475, 0, 0.5);
        face.rotateY(-Math.PI/2)
        face.castShadow = true;
        face.receiveShadow = true;
        this.object.add(face);


        face = new THREE.Mesh().copy(face, false);
        
        face.castShadow = true;
        face.receiveShadow = true;
        face.position.set(0.525, 0, 0.5);
        face.rotateY(Math.PI)
        this.object.add(face);

        // Create the two left faces (a four-triangle mesh)
         points = new Float32Array([
            -0.475, -1, 0.025,
            -0.475, 1, 0.025,
            -0.5, 1, 0.0,
            -0.5, -1, 0.0,

            -0.5, 1, 0.0,
            -0.475, 1, -0.025,
            -0.475, -1, -0.025,
            -0.5, -1, 0.0
        ]);
         normals = new Float32Array([
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,
            -0.707, 0.0, 0.707,

            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707,
            -0.707, 0.0, -0.707
        ]);
         indices = [
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
        face.position.set(0.5, 0, 0.5);
        face.rotateY(-Math.PI/2)
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
        face.position.set(0.5, 0, 0.5);
        face.rotateY(-Math.PI/2)
        this.object.add(face);



        ////////////////////////////////////////////////////////////////////////////////////////////////



          // Create the front face (a rectangle)
          geometry = new THREE.PlaneGeometry(0.95, 2.0);
          material = new THREE.MeshPhongMaterial({  map: texture2,
             transparent: true,
             opacity: 0.9, // 
 
            });
 
         face = new THREE.Mesh(geometry, material);
         face.position.set(-0.475, 0, 0.5);
         face.rotateY(Math.PI/2)
         face.castShadow = true;
         face.receiveShadow = true;
         this.object.add(face);
 
 
         face = new THREE.Mesh().copy(face, false);
         
         face.castShadow = true;
         face.receiveShadow = true;
         face.position.set(-0.525, 0, 0.5);
         face.rotateY(Math.PI)
         this.object.add(face);
 
         // Create the two left faces (a four-triangle mesh)
          points = new Float32Array([
             -0.475, -1, 0.025,
             -0.475, 1, 0.025,
             -0.5, 1, 0.0,
             -0.5, -1, 0.0,
 
             -0.5, 1, 0.0,
             -0.475, 1, -0.025,
             -0.475, -1, -0.025,
             -0.5, -1, 0.0
         ]);
          normals = new Float32Array([
             -0.707, 0.0, 0.707,
             -0.707, 0.0, 0.707,
             -0.707, 0.0, 0.707,
             -0.707, 0.0, 0.707,
 
             -0.707, 0.0, -0.707,
             -0.707, 0.0, -0.707,
             -0.707, 0.0, -0.707,
             -0.707, 0.0, -0.707
         ]);
          indices = [
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
         face.position.set(-0.5, 0,0.5);
         face.rotateY(-Math.PI/2)
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
         face.position.set(-0.5, 0, 0.5);
         face.rotateY(-Math.PI/2)
         this.object.add(face);
 
 


  //// ground //////////////////////////////////////////////////////////////////////

  
        // Create a texture

        const texture3 = new THREE.TextureLoader().load(this.textureUrl3);
        texture3.colorSpace = THREE.SRGBColorSpace;
        texture3.wrapS = THREE.RepeatWrapping;
        texture3.wrapT = THREE.RepeatWrapping;
        texture3.repeat.set(1, 1);
        texture3.magFilter = THREE.LinearFilter;
        texture3.minFilter = THREE.LinearMipmapLinearFilter;
        
        // Create a ground plane that receives shadows but does not cast them
         geometry = new THREE.PlaneGeometry(1,1);
         material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture3 });
        this.face = new THREE.Mesh(geometry, material);
        
        this.face.rotateX(-Math.PI / 2.0);
        this.face.castShadow = false;
        this.face.receiveShadow = true;
        this.face.position.set(0,-1,0.5);
        this.object.add(this.face);

//////////////////////////////////// ROOF////////////


const texture4 = new THREE.TextureLoader().load(this.textureUrl4);
texture4.colorSpace = THREE.SRGBColorSpace;
texture4.wrapS = THREE.RepeatWrapping;
texture4.wrapT = THREE.RepeatWrapping;
texture4.repeat.set(1, 1);
texture4.magFilter = THREE.LinearFilter;
texture4.minFilter = THREE.LinearMipmapLinearFilter;

// Create a ground plane that receives shadows but does not cast them
 geometry = new THREE.PlaneGeometry(1,1);
 material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture4 });
this.face = new THREE.Mesh(geometry, material);

this.face.rotateX(Math.PI / 2.0);
this.face.castShadow = false;
this.face.receiveShadow = true;
this.face.position.set(0,1,0.5);
this.object.add(this.face);


    }
}
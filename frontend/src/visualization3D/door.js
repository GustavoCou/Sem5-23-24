import * as THREE from "three";


export default class Door {
    constructor(parameters) {

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        //apaga este comentario quando leres: criei esta condicao para que fosse possivel instanciar uma porta com uma dada textura assim temos texturas diferentes para o elevador e para a porta
        let texture;
        if (this.textureUrl) {
            texture = new THREE.TextureLoader().load(this.textureUrl);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
        } else {
            //pus uma cor padrao pq seria indiferente uma vez que vamos ter sempre uma textura
            texture = new THREE.TextureLoader().load({ color: 0x7c4f3b });
        }


        this.object = new THREE.Group();



        // --------------------- DOOR ------------------

        // Adicione uma porta à parede
        const doorWidth = 0.41;
        const doorHeight = 1.50;


        const geometry = new THREE.BoxGeometry(doorWidth, doorHeight, 0.05);
        const material = new THREE.MeshPhongMaterial({ map: texture })
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, -0.25, 0)
        this.object.add(cube);



    }
}


     /*

           // Defina os pontos para a face da porta (um retângulo)
           const doorPoints = new Float32Array([
               -doorWidth / 2, -doorHeight / 2, 0.026,
               -doorWidth / 2, doorHeight / 2, 0.026,
               doorWidth / 2, doorHeight / 2, 0.026,
               doorWidth / 2, -doorHeight / 2, 0.026,
           ]);

           // Defina as normais para a face da porta
           const doorNormals = new Float32Array([
               0, 0, 1,
               0, 0, 1,
               0, 0, 1,
               0, 0, 1,
           ]);

           // Defina os índices para a face da porta (dois triângulos formando um retângulo)
           const doorIndices = [
               0, 1, 2,
               0, 2, 3
           ];

           // Crie uma nova geometria para a porta
           let doorGeometry = new THREE.BufferGeometry();
           doorGeometry.setAttribute("position", new THREE.BufferAttribute(doorPoints, 3));
           doorGeometry.setAttribute("normal", new THREE.BufferAttribute(doorNormals, 3));
           doorGeometry.setIndex(doorIndices);

           // Crie um material para a porta
           let doorMaterial = new THREE.MeshPhongMaterial({ color: 0x7c4f3b , mapper:texture});

           // Crie uma malha para a porta
           let doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
           doorMesh.position.set(0, -0.25, -0.05); // Posicione a porta onde desejar na parede
           doorMesh.castShadow = true;
           doorMesh.receiveShadow = true;

           // Adicione a porta ao objeto da parede
           this.object.add(doorMesh);

           doorMesh = new THREE.Mesh().copy(doorMesh, false);
           doorMesh.position.set(0, -0.25, 0.05); // Posicione a porta onde desejar na parede
           doorMesh.rotateY(Math.PI);
           this.object.add(doorMesh);
   */



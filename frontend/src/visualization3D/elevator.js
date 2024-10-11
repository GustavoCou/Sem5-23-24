import * as THREE from "three";
import Door from "./door.js"; // Importando a classe Door

export default class Elevator {
    constructor(parameters) {
        this.parameters = {
            //para a cabine do elevador
            width: 1,
            height: 2,
            depth: 1,
            //para a porta
            doorWidth: 0.5,
            doorHeight: 1,
            doorTextureUrl: null,

            ...parameters

        };

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        
        const texture = new THREE.TextureLoader().load(this.textureUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;


        const exteriorMaterial = new THREE.MeshPhongMaterial({
            //opacity: 0x000,
           // transparent:true,
            map: texture
        });

        this.cabin = new THREE.BoxGeometry(this.parameters.width, this.parameters.height, this.parameters.depth);
        this.cabinMesh = new THREE.Mesh(this.cabin, exteriorMaterial);

        this.interior = new THREE.Group();
        
        let interiorTexture = new THREE.TextureLoader().load(this.wallElevatorTexture);
        let interiorMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: interiorTexture
        });
        
        //Paredes interior 

        let interiorGeometry = new THREE.PlaneGeometry(this.parameters.width, this.parameters.height);
        let interiorWall = new THREE.Mesh(interiorGeometry, interiorMaterial);
        
        // top 
        interiorWall.position.set(0, 0, -this.parameters.depth / 2 + 0.05); //p ficar img no interior no fundo.
        interiorWall.rotation.y = 0; // Virar para dentro
        this.interior.add(interiorWall);

        // left
        interiorWall = new THREE.Mesh().copy(interiorWall, false);
        interiorWall.position.set(-0.45, 0,0); //p ficar img no interior no fundo.
        interiorWall.rotation.y = Math.PI /2 ; // Virar para dentro
        this.interior.add(interiorWall);
        
        // rigth
        interiorWall = new THREE.Mesh().copy(interiorWall, false);
        interiorWall.position.set(0.45 , 0,0); //p ficar img no interior no fundo.
        interiorWall.rotation.y = -Math.PI /2 ; // Virar para dentro
        this.interior.add(interiorWall)

        // button 
        interiorWall = new THREE.Mesh().copy(interiorWall, false);
        interiorWall.position.set(0, 0, this.parameters.depth / 2); //p ficar img no interior no fundo.
        interiorWall.rotation.y = Math.PI ; // Virar para dentro
        this.interior.add(interiorWall);

        //floor

        interiorTexture = new THREE.TextureLoader().load(this.floorElevatorTexture);
        interiorMaterial = new THREE.MeshPhongMaterial({map: interiorTexture  });



        interiorGeometry = new THREE.PlaneGeometry(1 ,1);
        interiorWall = new THREE.Mesh(interiorGeometry, interiorMaterial);
        interiorWall.position.set(0, -0.99,0); //p ficar img no interior no fundo.
        interiorWall.rotation.x = 3*Math.PI /2  ; // Virar para dentro
        this.interior.add(interiorWall);


         interiorGeometry = new THREE.PlaneGeometry(this.parameters.width, this.parameters.height);
         interiorWall = new THREE.Mesh(interiorGeometry, interiorMaterial);
               
        this.door = new Door({

            width: this.parameters.doorWidth,
            height: this.parameters.doorHeight,
            textureUrl: this.parameters.doorTextureUrl,

        });


        this.door.object.position.set(0, 0, this.parameters.depth / 2);


        this.object = new THREE.Group();
        this.object.add(this.cabinMesh);
        this.object.add(this.door.object);
        this.object.add(this.interior);
    }

}


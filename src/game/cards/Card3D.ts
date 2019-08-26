import StandardMaterial = BABYLON.StandardMaterial;
import {inject, injectable} from "inversify";
import {CardTextureCache} from "@game/CardTextureCache";
import {View3D} from "@game/View3D";
import MeshBuilder = BABYLON.MeshBuilder;
import Axis = BABYLON.Axis;
import Color3 = BABYLON.Color3;
import Texture = BABYLON.Texture;

@injectable()
export class Card3D extends View3D {

    @inject(CardTextureCache)
    private cardsTextureCache: CardTextureCache;

    init(...params: any[]): this {
        const billetMesh = this.generateBilletMesh();
        const plane = MeshBuilder.CreatePlane("card-face", {width: 10, height: 14});
        billetMesh.parent = this;
        plane.parent = this;
        plane.rotate(Axis.X, Math.PI / 2);
        plane.position.y = 0.05;

        const faceMaterial = new StandardMaterial("card-face", this.scene);
        let faceTexture = this.cardsTextureCache.getRandom();
        faceMaterial.diffuseTexture = faceTexture;
        faceMaterial.opacityTexture = faceTexture;
        faceMaterial.specularColor = Color3.FromHexString("#888888");
        plane.material = faceMaterial;
        return this
    }

    private generateBilletMesh() {
        const faceUVs = [
            new BABYLON.Vector4(0.5, 0.125, 1, 1),
            new BABYLON.Vector4(0, 0, 0, 0.1),
            new BABYLON.Vector4(0, 0.125, 0.5, 1),
        ];
        // TODO: generate shape more elegant
        const roundRectShape = [
            {x:0,y:9},{x:0,y:131},{x:0.0625,y:132.4375},{x:0.25,y:133.75},{x:0.5625,y:134.9375},{x:1,y:136},{x:1.5625000000000002,y:136.9375},{x:2.25,y:137.75},{x:3.0625000000000004,y:138.4375},{x:4,y:139},{x:5.0625,y:139.4375},{x:6.250000000000001,y:139.75},{x:7.562499999999999,y:139.9375},{x:9,y:140},{x:91,y:140},{x:92.43749999999999,y:139.9375},{x:93.75,y:139.75},{x:94.9375,y:139.4375},{x:96.00000000000001,y:139},{x:96.93749999999999,y:138.43749999999997},{x:97.75,y:137.75},{x:98.4375,y:136.9375},{x:99,y:136},{x:99.4375,y:134.9375},{x:99.75,y:133.75},{x:99.9375,y:132.4375},{x:100,y:131},{x:100,y:9},{x:99.93749999999999,y:7.562499999999999},{x:99.75,y:6.250000000000001},{x:99.4375,y:5.0625},{x:99.00000000000001,y:4.000000000000001},{x:98.4375,y:3.062499999999999},{x:97.75,y:2.25},{x:96.9375,y:1.5624999999999998},{x:96,y:1.0000000000000002},{x:94.9375,y:0.5625},{x:93.75,y:0.2499999999999999},{x:92.4375,y:0.06250000000000006},{x:91,y:0},{x:9,y:0},{x:7.562499999999999,y:0.0625},{x:6.250000000000001,y:0.25},{x:5.0625,y:0.5625},{x:4.000000000000001,y:1},{x:3.062499999999999,y:1.5625000000000002},{x:2.25,y:2.25},{x:1.5624999999999998,y:3.0625000000000004},{x:1.0000000000000002,y:4},{x:0.5625,y:5.0625},{x:0.2499999999999999,y:6.250000000000001},{x:0.06250000000000006,y:7.562499999999999},{x:0,y:9}
        ].map(p => new BABYLON.Vector3((p.x-50) * 0.1, 0, (p.y-70) * 0.1));

        const extrusion = BABYLON.MeshBuilder.CreatePolygon("star", {
            shape: roundRectShape,
            depth: 0.1,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            faceUV: faceUVs
        }, this.scene);

        let dynamicTexture = this.cardsTextureCache.getById("card_billet");
        const billetMaterial = new StandardMaterial("card_billet", this.scene);
        billetMaterial.diffuseTexture = dynamicTexture;
        billetMaterial.specularColor = Color3.FromHexString("#333333");

        extrusion.material = billetMaterial;
        extrusion.convertToFlatShadedMesh();

        return extrusion;
    }

}
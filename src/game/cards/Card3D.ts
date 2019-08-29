import StandardMaterial = BABYLON.StandardMaterial;
import MeshBuilder = BABYLON.MeshBuilder;
import Axis = BABYLON.Axis;
import Color3 = BABYLON.Color3;
import {inject, injectable} from "inversify";
import {CardTextureCache} from "@game/CardTextureCache";
import {View3D} from "@game/View3D";
import {Metrics} from "@game/Metrics";

@injectable()
export class Card3D extends View3D {

    @inject(CardTextureCache)
    private cardsTextureCache: CardTextureCache;

    init(...params: any[]): this {
        const billetMesh = this.generateBilletMesh();
        const plane = MeshBuilder.CreatePlane("card-face", {width: Metrics.CARD_WIDTH, height: Metrics.CARD_HEIGHT});
        billetMesh.parent = this;
        plane.parent = this;
        plane.rotate(Axis.X, Math.PI / 2);
        plane.position.y = 0.05;

        const faceMaterial = new StandardMaterial("card-face", this.scene);
        let faceTexture = this.cardsTextureCache.getRandom();
        faceMaterial.diffuseTexture = faceTexture;
        faceMaterial.opacityTexture = faceTexture;
        faceMaterial.specularColor = Color3.Black();
        plane.material = faceMaterial;
        return this
    }

    private generateBilletMesh() {
        const faceUVs = [
            new BABYLON.Vector4(0.5, 0.125, 1, 1),
            new BABYLON.Vector4(0, 0, 0, 0.1),
            new BABYLON.Vector4(0, 0.125, 0.5, 1),
        ];
        const halfWidth = Metrics.CARD_WIDTH * 0.5;
        const halfHeight = Metrics.CARD_HEIGHT * 0.5;
        // TODO: generate shape more elegant
        const roundRectShape = [
            {"x":0,"y":5},{"x":0,"y":55},{"x":0.034722222222222224,"y":55.7986111111111},{"x":0.1388888888888889,"y":56.52777777777778},{"x":0.3125,"y":57.1875},{"x":0.5555555555555556,"y":57.77777777777778},{"x":0.8680555555555557,"y":58.2986111111111},{"x":1.25,"y":58.75},{"x":1.7013888888888893,"y":59.13194444444445},{"x":2.2222222222222223,"y":59.44444444444444},{"x":2.8125,"y":59.6875},{"x":3.4722222222222228,"y":59.861111111111114},{"x":4.201388888888888,"y":59.96527777777777},{"x":5,"y":60},{"x":39,"y":60},{"x":39.79861111111111,"y":59.965277777777764},{"x":40.52777777777778,"y":59.86111111111112},{"x":41.1875,"y":59.6875},{"x":41.77777777777778,"y":59.44444444444446},{"x":42.29861111111111,"y":59.13194444444444},{"x":42.75,"y":58.75},{"x":43.13194444444444,"y":58.298611111111114},{"x":43.44444444444444,"y":57.77777777777778},{"x":43.6875,"y":57.1875},{"x":43.861111111111114,"y":56.52777777777778},{"x":43.96527777777777,"y":55.798611111111114},{"x":44,"y":55},{"x":44,"y":5},{"x":43.96527777777777,"y":4.201388888888888},{"x":43.86111111111112,"y":3.4722222222222228},{"x":43.6875,"y":2.8125},{"x":43.44444444444445,"y":2.2222222222222228},{"x":43.131944444444436,"y":1.7013888888888884},{"x":42.75,"y":1.25},{"x":42.298611111111114,"y":0.8680555555555554},{"x":41.77777777777778,"y":0.5555555555555557},{"x":41.1875,"y":0.3125},{"x":40.52777777777778,"y":0.13888888888888884},{"x":39.79861111111111,"y":0.03472222222222225},{"x":39,"y":0},{"x":5,"y":0},{"x":4.201388888888888,"y":0.034722222222222224},{"x":3.4722222222222228,"y":0.1388888888888889},{"x":2.8125,"y":0.3125},{"x":2.2222222222222228,"y":0.5555555555555556},{"x":1.7013888888888884,"y":0.8680555555555557},{"x":1.25,"y":1.25},{"x":0.8680555555555554,"y":1.7013888888888893},{"x":0.5555555555555557,"y":2.2222222222222223},{"x":0.3125,"y":2.8125},{"x":0.13888888888888884,"y":3.4722222222222228},{"x":0.03472222222222225,"y":4.201388888888888},{"x":0,"y":5}
        ].map(p => new BABYLON.Vector3(p.x - halfWidth, 0, p.y - halfHeight));

        const extrusion = BABYLON.MeshBuilder.CreatePolygon("star", {
            shape: roundRectShape,
            depth: Metrics.CARD_DEPTH,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            faceUV: faceUVs
        }, this.scene);

        let dynamicTexture = this.cardsTextureCache.getById("card_billet");
        const billetMaterial = new StandardMaterial("card_billet", this.scene);
        billetMaterial.diffuseTexture = dynamicTexture;
        billetMaterial.specularColor = Color3.Black();

        extrusion.material = billetMaterial;
        extrusion.convertToFlatShadedMesh();

        return extrusion;
    }

}
import {inject, injectable} from "inversify";
import {Metrics} from "@game/Metrics";
import {CoreTypes} from "../../CoreTypes";
import {Color3, InstancedMesh, Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector4} from "@babylonjs/core";

@injectable()
export default class ChipsMeshPool {

    @inject(CoreTypes.mainScene)
    private scene: Scene;

    private cachedTemplates: { [key: string]: Mesh } = {};

    get(color: Color3): Mesh | InstancedMesh {

        const id = ChipsMeshPool.getIdFromColor(color);

        if (!this.cachedTemplates[id]) {
            const mesh = this.createMesh();
            const material = this.createMaterialTemplate();
            material.diffuseColor = color;
            mesh.material = material;
            this.cachedTemplates[id] = mesh;
            this.scene.removeMesh(mesh)
        }
        return this.cachedTemplates[id].createInstance("chip-instance-" + Math.random());
    }

    createMesh(): Mesh {
        const sideTextureSize = 16;
        const textureWidth = 512;
        const textureHeight = 512 + sideTextureSize;

        const p = 1 - sideTextureSize / textureHeight;
        const faceUV = [
            new Vector4(0, 0, 1, p),
            new Vector4(0, p, 6, 1),
        ];
        faceUV.push(faceUV[0]);

        const mesh = MeshBuilder.CreateCylinder("chip", {
            diameter: Metrics.CHIP_DIAMETER,
            height: Metrics.CHIP_DEPTH,
            // tessellation: 24,
            faceUV,
        }, this.scene);

        return mesh;
    }

    createMaterialTemplate(): StandardMaterial {
        const material = new StandardMaterial("chip", this.scene);
        const texture = new Texture("./assets/texture-chip-wb.png", this.scene);
        const bumpTexture = new Texture("./assets/chip-normalmap.png", this.scene);

        material.diffuseColor = Color3.Black();
        material.specularColor = Color3.White();
        material.specularTexture = texture;
        material.emissiveColor = Color3.Black();
        material.emissiveTexture = texture;
        material.bumpTexture = bumpTexture;
        // material.wireframe = true;

        return material;
    }

    private static getIdFromColor(color: Color3, postfix: string = "_mesh") {
        return `${color.toHexString()}${postfix}`;
    }

}
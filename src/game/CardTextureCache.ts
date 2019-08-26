import {inject, injectable} from "inversify";
import DynamicTexture = BABYLON.DynamicTexture;
import Scene = BABYLON.Scene;

const mapR = ["C", "S", "D", "H"];
const mapC = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

@injectable()
export class CardTextureCache {

    @inject(Scene)
    private scene: Scene;

    private _atlasSource: HTMLImageElement = new Image();
    private _cache: { [id: string]: DynamicTexture } = {};

    async preload(atlasFile: string) {
        return new Promise((resolve) => {
            this._atlasSource.onload = () => resolve();
            this._atlasSource.src = atlasFile;
        });
    }

    async generate(scale: number) {
        console.time("generateALL");
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 13; c++) {
                let id = `${mapC[c]}${mapR[r]}`;
                console.time("generate_" + id);
                this._cache[id] = this.generateFrame(scale, c, r);
                console.timeEnd("generate_" + id);
            }
        }
        this._cache.shirt = this.generateFrame(scale, 0, 4);
        console.timeEnd("generateALL");
    }
    public getRandomId(): string {
        let c = Math.floor(Math.random() * mapC.length);
        let r = Math.floor(Math.random() * mapR.length);
        return `${mapC[c]}${mapR[r]}`;
    }
    public getById(id: string): DynamicTexture {
        return this._cache[id];
    }
    public getRandom(): DynamicTexture {
        return this.getById(this.getRandomId());
    }

    private cutFrame(x: number, y: number, width: number, height: number, scale: number = 1): DynamicTexture {
        let outWidth = width * scale;
        let outHeight = height * scale;
        const texture = new DynamicTexture(`frame-${x}-${y}`, {width: 512, height: 512}, this.scene, true);
        // const canvas = document.createElement("canvas") as HTMLCanvasElement;
        // canvas.id = `frame-${x}-${y}`;
        // canvas.width = outWidth;
        // canvas.height = outHeight;
        // const ctx = canvas.getContext("2d")!;
        const ctx = texture.getContext();
        ctx.drawImage(this._atlasSource, x, y, width, height, 0, 0, outWidth, outHeight);
        texture.update();
        return texture;
    }
    private generateFrame(scale: number, i: number, j: number): DynamicTexture {
        let frw = 100;
        let frh = 140;
        let jOffset = j * 40;
        return this.cutFrame(i * frw, j * frw + jOffset, frw, frh, scale);
    }
}
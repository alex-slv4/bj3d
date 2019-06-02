import { inject, injectable } from "inversify";
import Scene = BABYLON.Scene;
import TransformNode = BABYLON.TransformNode;

@injectable()
export abstract class View3D extends TransformNode {

    public readonly NAME: string = `${this.constructor.name}_node`;

    @inject(Scene)
    protected readonly scene: Scene;

    constructor() {
        super("");
        this.name = this.NAME;
    }

    public abstract init(...params: any): this;

    public async initAsync(...params: any): Promise<this> {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                this.init.apply(this, params);
                resolve(this);
            });
        });
    }

    public destroy(): void {
        this.dispose();
    }

}

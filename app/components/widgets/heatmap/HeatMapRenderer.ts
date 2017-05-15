
import {
    Clock, Scene, PerspectiveCamera, OrthographicCamera,
    WebGLRenderer, Mesh, MeshBasicMaterial,
    TextureLoader, Texture, PlaneBufferGeometry
} from 'three';

import { HeatMapMesh } from './HeatMapMesh';
import { HeatMapControls } from './HeatMapControls';

export class HeatMapRenderer {

    private width: number;
    private height: number;

    private clock: Clock;

    private controls: HeatMapControls;

    private heatmapCamera: OrthographicCamera;
    private heatmaps: HeatMapMesh[] = [];

    private background: Mesh;

    private scene: Scene;
    private renderer: WebGLRenderer;

    constructor(private container: any, private params: any) {

        this.container = container;
        this.params = params;
        this.params.width = 512;
        this.params.height = 512;
        this.params.fov = 70;
        this.width = this.height = 1;

        this.commonInit();
        this.initControls();
    }

    public setViewport(width: number, height: number, background: Texture) {
        this.params.width = width;
        this.params.height = height;
        this.scene.remove(this.background);
        this.background = new Mesh(
            new PlaneBufferGeometry(this.params.width, this.params.height, 1, 1),
            new MeshBasicMaterial({ color: 0xffffff, map: background }));
        this.background.position.set(0, 0, -0.5);
        this.scene.add(this.background);
        this.controls.setViewport(-this.params.width/2, -this.params.height/2, this.params.width/2, this.params.height/2);
    }

    private commonInit(): void {

        this.clock = new Clock();

        this.heatmapCamera
            //= new PerspectiveCamera(this.params.fov, this.getWidth() / this.getHeight(), 0.1, 2000);
            = new OrthographicCamera(-this.width/2, this.width/2, this.height/2, -this.height/2, 0, 1)
        //this.heatmapCamera
        //    .position.set(0, 0, 600);

        this.renderer = new WebGLRenderer({
            alpha: true
        });
        this.appendChild(this.renderer.domElement);
        this.scene = new Scene();
    }

    private initControls(): void {
        this.controls = new HeatMapControls(this.heatmapCamera, {
            zoomMin: 1,
            zoomMax: 4,
            clickToInteract: true,            
            scope: this.getContainer(),
            zoomWheel: true
        });
        this.controls.setViewport(-this.params.width/2, -this.params.height/2, this.params.width/2, this.params.height/2);
    }

    private updateControls(): void {
        this.controls.update();
    }

    private appendChild(elt: any): void {
        this.getContainer().appendChild(elt);
    }

    public onSurfaceChanged(): boolean {
        if (this.getWidth() !== this.getContainerWidth() || this.getHeight() !== this.getContainerHeight()) {
            this.updateSizeFromContainer();
            return true;
        }
        return false;
    }

    public removeAllHeatMap(): void {
        this.heatmaps.forEach((heatmap: HeatMapMesh) => {
            heatmap.clear();
            this.scene.remove(heatmap);
        });
        this.heatmaps = [];
    }

    public addHeatMap(data: any[], intensityNorm?: number, gradientTexture?: Texture): void {
        let heatmap = new HeatMapMesh(this.params.width, this.params.height, intensityNorm, gradientTexture);
        heatmap.setHeatMapData(data);
        this.heatmaps.push(heatmap);
        this.scene.add(heatmap);
    }

    public onDrawFrame(): void {
        this.updateControls();
        this.heatmaps.forEach((heatmap: HeatMapMesh) => heatmap.update(this.renderer));
        this.renderer.render(this.scene, this.heatmapCamera);
    }

    private updateSizeFromContainer(): void {
        this.width = this.getContainerWidth();
        this.height = this.getContainerHeight();
        this.renderer.setSize(this.getWidth(), this.getHeight());
        this.heatmaps.forEach((heatmap: HeatMapMesh) => heatmap.setSize(this.getWidth(), this.getHeight()));
        /*this.heatmapCamera.left = -this.width / 2;
        this.heatmapCamera.right = this.width / 2;
        this.heatmapCamera.top = this.height / 2;
        this.heatmapCamera.bottom = -this.height / 2;
        this.heatmapCamera.updateProjectionMatrix();*/
        //this.heatmapCamera
        //    .aspect = this.getWidth() / this.getHeight();        
        //this.heatmapCamera
        //    .updateProjectionMatrix();            
    }

    private getContainer(): any {
        return this.container;
    }

    private getContainerWidth(): number {
        return this.getContainer().offsetWidth;
    }

    private getContainerHeight(): number {
        return this.getContainer().offsetHeight;
    }

    private getWidth(): number {
        return this.width;
    }

    private getHeight(): number {
        return this.height;
    }

}

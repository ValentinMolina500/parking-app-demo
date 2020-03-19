import { Observable } from "tns-core-modules/ui/page/page";

export interface Vector {
    x: number;
    y: number;
}

export enum Status {
    SLEEP = "Sleep",
    ACTIVE = "Active"
}

export class Phone extends Observable {
    public location: Vector;
    public r: number = 0;
    private name: string;
    private status: Status = Status.SLEEP;

    constructor(coordinates: Vector, name: string) {
        super();
        this.location = coordinates;
        this.name = name;
    }
    private getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    public calculateDistance(p: Vector) {
        /* Math things */
        let error = this.getRndInteger(-1, 1);
        const d = ((p.x - this.location.x) ** 2 + (p.y - this.location.y) ** 2) ** 0.5 + error;
        this.set("r", d);
    }

    public setActive() {
        this.set("status", Status.ACTIVE);
    }
}
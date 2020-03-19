import { Observable } from "tns-core-modules/data/observable";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Page, Color } from "tns-core-modules/ui/page/page";
import { Button } from "tns-core-modules/ui/button";
import { ListView } from "tns-core-modules/ui/list-view";
import { Vector, Phone } from "./utils/util";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";
import firebase from "./utils/firebase";
import * as fb from "nativescript-plugin-firebase";

export default class MainViewModel extends Observable {
    private page: Page;
    private startButton: Button;
    private active: boolean = false;
    private beaconDataLayout: StackLayout;
    private phoneTable: ListView;
    private beaconX: string = "Loading...";
    private beaconY: string = "Loading...";
    private targetX: string = "Loading...";
    private targetY: string = "Loading...";
    private beaconVector: Vector = { x: 0, y: 0 };
    private targetVector: Vector;
    private phones: ObservableArray<Phone> = new ObservableArray();

    private beaconInterval: any;
    private phoneInterval: any;

    constructor(page: Page) {
        super();
        this.setupPhones();
        this.page = page;
        this.startButton = page.getViewById("start-button");
        this.beaconDataLayout = page.getViewById("beacon-data");
        this.phoneTable = page.getViewById("phone-table");
        this.phoneTable.separatorColor = new Color("transparent")
    }

    private setupPhones(): void {
        this.phones.push(new Phone({ x: 0, y: 0 }, "Phone 1"));
        this.phones.push(new Phone({ x: 100, y: 0 }, "Phone 2"));
        this.phones.push(new Phone({ x: 100, y: 100 }, "Phone 3"));
        this.phones.push(new Phone({ x: 0, y: 100 }, "Phone 4"));
    }

    private createRandomPoint(): Vector {
        return { x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 100)}
    }
    public startSendData() {
        /* Adjust UI */
        this.set("active", true);
        // this.startButton.visibility = "collapse";
        // this.beaconDataLayout.visibility = "visible";

        let startVector: Vector = this.createRandomPoint();
        this.beaconVector = startVector;
        this.targetVector = this.createRandomPoint();

        fb.setValue('/target', {
            x: this.targetVector.x,
            y: this.targetVector.y
        })
        
        this.set("targetX", this.targetVector.x);
        this.set("targetY", this.targetVector.y);
        let speed = 2;
        let elapsed = 0.01;

        let distance = Math.abs(((this.targetVector.x - this.beaconVector.x) ** 2 + (this.targetVector.y - this.beaconVector.y)) ** 0.5);
        let directionX = (this.targetVector.x - this.beaconVector.x) / distance;
        let directionY = (this.targetVector.y - this.beaconVector.y) / distance;

        let index2 = 0;
        this.beaconInterval = setInterval(() => {
            let x = this.get("beaconX");
            let y = this.get("beaconY");

            this.beaconVector.x += directionX * speed * elapsed;
            this.beaconVector.y += directionY * speed * elapsed;
            this.setBeaconXY(this.beaconVector);
            index2++;
            if ((((startVector.x - this.beaconVector.x ) ** 2 + (startVector.y - this.beaconVector.y) ** 2) ** 0.5) >= distance) {
                console.log("reached destination");
                clearInterval(this.beaconInterval);
            }
        }, 20)
        
        let index = 0;
        let listeners;

        console.log("running");
        this.phoneInterval = setInterval(() => {
            this.phones.forEach((phone, index) => {
                phone.calculateDistance(this.beaconVector);
            });

            index++
            console.log('tick: ' + index);
            if (index > 1) {
                fb.update('/phones', {
                    x1: this.phones.getItem(0).location.x,
                    y1: this.phones.getItem(0).location.y,
                    r1: this.phones.getItem(0).r,
                    x2: this.phones.getItem(1).location.x,
                    y2: this.phones.getItem(1).location.y,
                    r2: this.phones.getItem(1).r,
                    x3: this.phones.getItem(2).location.x,
                    y3: this.phones.getItem(2).location.y,
                    r3: this.phones.getItem(2).r,
                })
                .catch((err) => console.log(err))
                
                fb.update('/beacon', {
                    x: this.beaconVector.x,
                    y: this.beaconVector.y
                })
                .catch((err) => console.log(err))
            }

            // End the data after sometime so I don't lose all my money
            if (index > 50) {
                console.log("stopping data");
                clearInterval(this.phoneInterval);
                this.set("active", false);
            }
        }, 1000)

    }

    private setBeaconXY(location: Vector) {
        this.set("beaconX", location.x);
        this.set("beaconY", location.y);
    }

    public cancelData() {
        clearInterval(this.phoneInterval);
        clearInterval(this.beaconInterval);
        this.set("active", false);
    }
}

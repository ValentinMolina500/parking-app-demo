import * as fb from "nativescript-plugin-firebase";
import { Vector } from "./util";


class Firebase {
    public init(): any {
        return fb.init({
            persist: false,
        })
            .then(() => {
                console.log("LISTEN TO MEE!!")

                // OR
                // fb.keepInSync(
                //     "/beacon", // which path in your Firebase needs to be kept in sync?
                //     true      // set to false to disable this feature again
                // ).then(
                //     function () {
                //         console.log("firebase.keepInSync is ON for /becon");
                //     },
                //     function (error) {
                //         console.log("firebase.keepInSync error: " + error);
                //     }
                // );
            })
            .catch((err) => {
                console.log(err);
            })
    }

    /**
     * For testing purposes. Retrieves the beacon location stored in the database.
     * Obviously if we knew this beforehand, we wouldn't have to do math things.
     */
    public getBeaconLocation(): Promise<any> {
        return fb.getValue('/beacon');
    }

    // public listenToBeacon(callback) {
    //     return fb.addValueEventListener(callback, '/beacon');
    // }
}

const firebase = new Firebase();

export default firebase;
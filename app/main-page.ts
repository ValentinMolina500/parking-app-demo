import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import ViewModel from "./main-view-model";


export function navigatingTo(args: EventData) {
    const page = <Page>args.object;

    page.bindingContext = new ViewModel(page);
}

export function phoneSelector(phone, index) {
    return index % 2 ? "odd" : "even";
}
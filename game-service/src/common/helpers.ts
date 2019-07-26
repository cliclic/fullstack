import { Model } from "mongoose";
import { Ref } from "typegoose";

export function isModel<T>(arg: Ref<T>): arg is T {
    return arg instanceof Model;
}

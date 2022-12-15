import { ObjectType, Field, InputType } from "type-graphql";
import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { UserType } from "./user.schema";

@ObjectType()
@index({ createdAt: -1 })
export class EmType {
    @Field(() => String)
    id!: string;

    @Field(() => Date)
    @prop({ default: Date.now() })
    createdAt!: Date;

    @Field(() => String)
    @prop({ ref: () => UserType })
    //@ts-ignore
    uid!: Ref<UserType>;

    @Field(() => String)
    @prop({required: true})
    name!: string
}

export const EmCall = getModelForClass(EmType)

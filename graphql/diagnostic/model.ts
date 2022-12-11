import { ObjectType, Field, InputType } from "type-graphql";
import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { UserType } from "../user/model";

@ObjectType()
@index({ createdAt: -1 })
export class DiagnosticType {
    @Field(() => String)
    id!: string;

    @Field(() => Date)
    @prop({ default: Date.now() })
    createdAt!: Date;

    @Field(() => String)
    @prop({ ref: () => UserType })
    //@ts-ignore
    uid!: Ref<UserType>;

    @Field(() => DiagnosticData)
    @prop({ required: true })
    diagnostic_data!: Object;
}

@ObjectType()
export class DiagnosticData {
    @Field()
    Lymphocytes!: string;

    @Field()
    Neutrophils!: string;

    @Field()
    Sodium!: string;

    @Field()
    Potassium!: string;

    @Field()
    Creatinine!: string;

    @Field()
    PCR!: string;
}

export const Diagnostic = getModelForClass(DiagnosticType)

import { ObjectType, Field, registerEnumType, InputType } from "type-graphql";
import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import bcrypt from "bcrypt";

export enum UserRole {
    Nurse = "nurse",
    Patient = "patient",
    Visitor = "visitor"
}

export class UserJwt {
    name!: string;
    username!: string
    role!: string
    id!: string
}

registerEnumType(UserRole, { name: "UserRole", });

@pre<UserType>("save", async function() {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
})

@ObjectType()
export class UserType {
    @Field(() => String)
    id!: string;

    @Field()
    @prop({ required: true })
    name!: string;

    @Field()
    @prop({ required: true, index: true, unique: true })
    username!: string;

    @Field()
    @prop({ required: true })
    password!: string;

    @Field(_type => UserRole)
    @prop({ required: true, enum: Object.values(UserRole), default: UserRole.Visitor })
    role!: UserRole;
}

export const User = getModelForClass(UserType)

@InputType()
export class Login {
    @Field(() => String)
    username!: string;

    @Field(() => String)
    password!: string;
}

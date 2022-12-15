import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { EmType, EmCall } from "../schema/emergency_call.schema";
import { Types } from "mongoose";
import * as graphql from "../../pages/api/graphql";

@Resolver(EmType)
export default class EmResolver {
    @Query(() => [EmType])
    async listEm() {
        return EmCall.find()
    }

    @Mutation(() => EmType)
    async deleteEm(
        @Arg("id") id: string
    ) {
        return EmCall.findOneAndDelete({ _id: id })
    }

    @Mutation(() => EmType)
    async createEm(
        @Ctx() ctx: graphql.Context,
        @Arg("name") name: string,
    ) {
        if (!ctx.user) {
            return
        }
        //@ts-ignore
        return EmCall.create({ uid: new Types.ObjectId(ctx.user.id), name })
    }
}

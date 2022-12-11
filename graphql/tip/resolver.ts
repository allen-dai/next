import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { TipType, Tip } from "./model";
import { Types } from "mongoose";
import * as graphql from "../../pages/api/graphql";

@Resolver(TipType)
export class TipResolver {
    @Query(() => [TipType])
    async listTip() {
        return Tip.find()
    }

    @Mutation(() => TipType)
    async deleteTip(
        @Arg("id") id: string
    ) {
        return Tip.findOneAndDelete({ _id: id })
    }

    @Mutation(() => TipType)
    async createTip(
        @Ctx() ctx: graphql.Context,
        @Arg("tip") tip: string,
    ) {
        if (!ctx.user) {
            return
        }
        //@ts-ignore
        return Tip.create({ uid: new Types.ObjectId(ctx.user.id), tip })
    }
}


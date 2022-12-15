import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { DiagnosticType, Diagnostic } from "../schema/diagnostic.schema";
import { Types } from "mongoose";
import * as graphql from "../../pages/api/graphql";

@Resolver(DiagnosticType)
export default class DiagnosticResolver {
    @Query(() => [DiagnosticType])
    async listDiagnosticByUserId(@Arg("uid") uid: string) {
        return Diagnostic.find({ uid: new Types.ObjectId(uid) });
    }

    @Mutation(() => DiagnosticType)
    async createDiagnostic(
        @Arg("uid") uid: string,
        @Arg("Lymphocytes") Lymphocytes: Number,
        @Arg("Neutrophils") Neutrophils: Number,
        @Arg("Sodium") Sodium: Number,
        @Arg("Potassium") Potassium: Number,
        @Arg("Creatinine") Creatinine: Number,
        @Arg("PCR") PCR: Number,
    ) {
        return Diagnostic.create({ uid: new Types.ObjectId(uid), diagnostic_data: { Lymphocytes, Neutrophils, Sodium, Potassium, Creatinine, PCR } });
    }
}


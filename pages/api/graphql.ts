import { ApolloServer } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
import dbConnect from "../../lib/dbConnect";
import { UserResolver, verifyJwt } from "../../graphql/user/resolver";
import { DiagnosticResolver } from "../../graphql/diagnostic/resolver";
import { EmResolver } from "../../graphql/emergency_call/resolver";
import { TipResolver } from "../../graphql/tip/resolver";
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserJwt } from "../../graphql/user/model";
import { serialize } from "cookie";

let _ = await dbConnect();

export interface Context {
    req: NextApiRequest;
    res: NextApiResponse;
    user: UserJwt | null;
}

const schema = await buildSchema({
    resolvers: [UserResolver, DiagnosticResolver, TipResolver, EmResolver]
})
const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
        if (ctx.req.cookies.jwt) {
            ctx.user = verifyJwt<UserJwt>(ctx.req.cookies.jwt);
            if (ctx.user === null) {
                ctx.res.setHeader("Set-Cookie", serialize("jwt", "", { maxAge: -1, path: "/" }));
            }
        }
        return ctx
    }
});

export const config = {
    api: {
        bodyParser: false,
    }
}

const startServer = server.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await startServer;
    await server.createHandler({ path: "/api/graphql" })(req, res);
}

import { ApolloServer } from "apollo-server-micro";
import { buildSchema } from "type-graphql";
import dbConnect from "../../lib/dbConnect";
import { resolvers } from "../../graphql/resolver";
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserJwt } from "../../graphql/schema/user.schema";
import { serialize } from "cookie";
import { verifyJwt } from "../../graphql/resolver/user.resolver";

let _ = await dbConnect();

export interface Context {
    req: NextApiRequest;
    res: NextApiResponse;
    user: UserJwt | null;
}

const schema = await buildSchema({
    resolvers: [...resolvers]
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

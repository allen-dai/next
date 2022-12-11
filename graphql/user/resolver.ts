import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { UserType, UserRole, User, Login, UserJwt } from "./model";
import { Types } from "mongoose";
import * as graphql from "../../pages/api/graphql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

@Resolver(UserType)
export class UserResolver {
    @Query(() => UserType)
    async findUserById(@Arg("_id") _id: string) {
        return User.findById(new Types.ObjectId(_id));
    }

    @Query(() => [UserType])
    async nurses() {
        return User.find({ role: "nurse" })
    }
    @Query(() => [UserType])
    async patients() {
        return User.find({ role: "patient" })
    }

    @Query(() => UserType)
    async findUserByUsername(@Arg("username") username: string) {
        return User.findOne({ username });
    }

    @Mutation(_type => UserType)
    async createUser(
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Arg('name') name: string,
        @Arg('role', { nullable: true }) role: UserRole,
    ) {
        return User.create({ name, password, username, role });
    }

    @Query(() => String)
    async login(@Arg("username") username: string, @Arg("password") password: string, @Ctx() ctx: graphql.Context) {
        return loginUser({ username, password }, ctx);
    }

    @Query(() => String)
    async ping(@Ctx() ctx: graphql.Context) {
        if (!ctx.user) {
            return ""
        }
        return JSON.stringify(ctx.user)
    }

    @Query(() => String)
    async signout(@Ctx() ctx: graphql.Context) {
        ctx.res.setHeader("Set-Cookie", serialize("jwt", "", { maxAge: -1, path: "/" }));
        return "sign out"
    }
}


async function loginUser(input: Login, context: graphql.Context) {
    const e = "Invalid email or password";
    const user = await User.findOne({ username: input.username }).exec();
    if (!user) {
        return e;
    }
    const passwordIsValid = await bcrypt.compare(input.password, user.password);
    if (!passwordIsValid) {
        return e;
    }
    const token = jwt.sign({ username: user.username, name: user.name, role: user.role, id: user.id}, "privatekey", {
        expiresIn: "1h",
        algorithm: "HS256",
    });
    context.res.setHeader("Set-Cookie", serialize("jwt", token, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
    }));
    return token;
}

export function verifyJwt<T>(token: string): T | null {
    try {
        const decoded = jwt.verify(token, "privatekey") as T;
        return decoded;
    } catch (e) {
        return null;
    }
}

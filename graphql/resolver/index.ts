import UserResolver from "./user.resolver";
import TipResolver from "./tip.resolver";
import EmResolver from "./emergency_call.resolver";
import DiagnosticResolver from "./diagnostic.resolver";

export const resolvers = [UserResolver, TipResolver, EmResolver, DiagnosticResolver] as const;

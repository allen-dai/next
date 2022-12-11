import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserContext } from "./userHook";

const requireAuth = (WrappedComponent: React.FC, role: string) => {
    const Component = (props: React.Attributes) => {
        const router = useRouter();
        const { user, loading } = useUserContext();
        useEffect(() => {
            if (!loading && !user) {
                router.push("/login");
            }
            if (role !== "" && (!loading && user.role !== role)) {
                if (user.role === "patient"){
                    router.push("tip")
                }
                router.back()
            }
        }, [user, loading]);

        return (user && (user.role === role || role === "")) ? <WrappedComponent {...props} /> : <></>;
    };

    return Component;
};

export default requireAuth;

import { useState, useEffect, createContext, useContext } from "react"
import { ApolloClient, gql, InMemoryCache, useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";

const CHECK_AUTH = gql`
query ping{
  ping
}
`
const SIGN_OUT = gql`
query signout{
  signout
}
`

const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
});

export const UserContext = createContext<any>(null);
export const useUserContext = () => useContext(UserContext);


export function useUserData() {
    const [user, setUser] = useState<any>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        client.query({ query: CHECK_AUTH }).then((data) => {
            if (data.data.ping !== "") {
                setUser(JSON.parse(data.data.ping));
            }
            else {
                setUser("")
            }
            setLoading(false);
        }).catch(console.log)
    }, []);

    function sign_out() {
        client.query({ query: SIGN_OUT }).then(console.log).catch(console.log)
        setUser("")
    }

    return {
        loading,
        user,
        sign_out,
    };
}

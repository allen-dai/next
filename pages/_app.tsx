import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { Main } from "../components/layouts/main"
import "reflect-metadata"
import { UserContext, useUserData } from '../lib/userHook'
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";


export default function App({ Component, pageProps, router }: AppProps) {
    const client = new ApolloClient({
        uri: "/api/graphql",
        cache: new InMemoryCache(),
    });
    return (
        <ApolloProvider client={client}>
            <UserContext.Provider value={useUserData()}>
                <ChakraProvider>
                    <Main router={router}>
                        <Component {...pageProps} />
                    </Main>
                </ChakraProvider>
            </UserContext.Provider>
        </ApolloProvider>
    )
}

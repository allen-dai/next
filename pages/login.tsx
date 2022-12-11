import {
    Heading,
    Container,
    Box,
    Grid,
    Button,
    Input,
    FormControl,
    FormLabel,
    Divider,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useState } from "react";
import Article from "../components/layouts/article";
import { gql, useLazyQuery } from "@apollo/client";
import { useUserContext } from "../lib/userHook";
import { useRouter } from "next/router";


const LOGIN_USER = gql`
query login($username: String!, $password: String!){
  login(username: $username, password: $password)
}
`

const Login = () => {
    const router = useRouter();
    const [login, { loading }] = useLazyQuery(LOGIN_USER);
    const [userInfo, setUserInfo] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });
    };


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(1);
        try {
            let data = await login({ variables: { ...userInfo } });
            window.location.replace("/")
        }
        catch (e) {
        }
    }

    return (
        <Article>
            <form onSubmit={handleSubmit}>
                <Grid gap={2}>
                    <Heading>Login</Heading>
                    <Divider />

                    <FormControl isRequired>
                        <FormLabel p={0} m={0} htmlFor="username">
                            Username
                        </FormLabel>
                        <Input
                            type="text"
                            placeholder="username"
                            borderColor="gray.400"
                            name="username"
                            id="username"
                            onChange={handleChange}
                        />
                    </FormControl>

                    <FormControl isRequired>
                        <FormLabel p={0} m={0} htmlFor="password">
                            Password
                        </FormLabel>
                        <Input
                            type="password"
                            placeholder="password"
                            borderColor="gray.400"
                            name="password"
                            id="password"
                            onChange={handleChange}
                        />
                    </FormControl>
                    <Button
                        isLoading={loading}
                        loadingText={"Registering"}
                        type="submit"
                        w="100%"
                        colorScheme="teal"
                        mt={2}
                    >
                        Login
                    </Button>
                </Grid>
            </form>
            <Link href="/register">
                Register
            </Link>
            <ChevronRightIcon />
        </Article>
    );
};

export default Login;

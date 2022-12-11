import {
    Heading,
    Grid,
    Button,
    Input,
    FormControl,
    FormLabel,
    Divider,
    useRadioGroup,
    HStack,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import Article from "../components/layouts/article";
import { RadioCard } from "../components/radio";
import { gql, useLazyQuery, useMutation } from "@apollo/client";

const CREATE_USER = gql`
mutation createUser($name: String!, $username: String!, $password: String!, $role: UserRole! ){
  createUser(name: $name, username: $username, password: $password, role: $role){
    id
    username
    name
    role
  }
}
`

const LOGIN_USER = gql`
query login($username: String!, $password: String!){
  login(username: $username, password: $password)
}
`

const Register = () => {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        name: "",
        username: "",
        password: "",
        role: "Visitor"
    });
    const [createUser, { loading }] = useMutation(CREATE_USER);
    const [login, { }] = useLazyQuery(LOGIN_USER);

    const options = ["Nurse", "Patient", "Visitor"];
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });
    };

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'role',
        defaultValue: 'Visitor',
        onChange: (role) => { setUserInfo({ ...userInfo, role }) },
    })

    const group = getRootProps()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        createUser({ variables: { ...userInfo } }).
            then(() => {
                login({ variables: { username: userInfo.username, password: userInfo.password } }).then(() => {
                    window.location.replace("/")
                }).catch(e => {
                    console.log(e)
                })
            })
            .catch(e => {
                console.log(e)
            })


    }

    return (
        <Article>
            <form onSubmit={handleSubmit}>
                <Grid gap={2}>
                    <Heading>Register</Heading>
                    <Divider />

                    <FormControl isRequired>
                        <FormLabel p={0} m={0} htmlFor="name">
                            Name
                        </FormLabel>
                        <Input
                            type="text"
                            placeholder="name"
                            borderColor="gray.400"
                            name="name"
                            id="name"
                            onChange={handleChange}
                        />
                    </FormControl>

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

                    <HStack {...group}>
                        {options.map((value) => {
                            const radio = getRadioProps({ value })
                            return (
                                <RadioCard key={value} {...radio}>
                                    {value}
                                </RadioCard>
                            )
                        })}
                    </HStack>

                    <Button
                        isLoading={loading}
                        loadingText={"Registering"}
                        type="submit"
                        w="100%"
                        colorScheme="teal"
                        mt={2}
                    >
                        Register
                    </Button>
                </Grid>
            </form>
            <Link href="/login">
                Login
            </Link>
            <ChevronRightIcon />
        </Article>
    );
};

export default Register;

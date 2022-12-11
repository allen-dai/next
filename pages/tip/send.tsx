import requireAuth from "../../lib/requireAuth";
import { Button, Center, Container, Heading, Textarea } from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import Article from "../../components/layouts/article";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const CREATE_TIP = gql`
mutation createTip($tip: String!) {
    createTip(tip: $tip){
        createdAt
        id
        uid
        tip
    }
}
`
const SendTip = () => {
    const [tip, setTip] = useState("");
    const [createTip, { loading }] = useMutation(CREATE_TIP);
    const router = useRouter();

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (tip) {
            createTip({ variables: { tip } }).
                then(() => router.push("/tip"))
        }

    }

    return (
        <Center mt={100}>
            <form onSubmit={onSubmit}>
                <Heading>Enter tip</Heading>
                <div>
                    <Textarea
                        borderColor="blackAlpha.500"
                        //@ts-ignore
                        _focusVisible="" _hover=""
                        w={"70vw"}
                        h={"70vh"}
                        placeholder="Enter a new motivation tip."
                        value={tip}
                        onChange={(e) => setTip(e.target.value)}
                    />
                </div>

                <Button
                    mt={2}
                    size="sm"
                    isLoading={loading}
                    loadingText="Generating..."
                    colorScheme="teal"
                    type="submit"
                >
                    Submit
                </Button>
            </form>
        </Center>
    );
}

export default requireAuth(SendTip, "nurse");

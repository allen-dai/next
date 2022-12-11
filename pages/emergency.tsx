import requireAuth from "../lib/requireAuth";
import { Box, Button, Center, Container, Flex, Heading, Input, Textarea } from '@chakra-ui/react';
import { FormEvent, useEffect, useState } from 'react';
import Article from "../components/layouts/article";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useUserData } from "../lib/userHook";

const LIST_EM = gql`
query listEm {
    listEm {
        createdAt
        id
        uid
        name
    }
}
`

const DELETE_EM = gql`
mutation deleteEm($id: String!) {
    deleteEm(id: $id) {
        createdAt
        id
        uid
        name
    }
}
`

type EmProps = {
    name: string,
    id: string,
}

const TipList = () => {
    const { loading, error, data, refetch } = useQuery(LIST_EM);
    const [deleteEm, { }] = useMutation(DELETE_EM);
    const { user } = useUserData();
    const [em, setEm] = useState<EmProps[]>([]);
    useEffect(() => {
        if (data && !loading) {
            let tmp: EmProps[] = []
            //@ts-ignore
            data.listEm.forEach(item => {
                tmp.push({ id: item.id, name: item.name })
            })
            setEm(tmp)
        }
    }, [loading, data])

    return (
        <Article minW="4xl">
            <Heading>Emergencies</Heading>
            {
                em.map((item, idx) => {
                    return <Box>
                        <Box
                            key={idx}
                            border="1px"
                            borderColor="blackAlpha.500"
                            mb={1}
                            p={2}
                            borderRadius="5px"
                        >
                            {"Name: " + item.name}
                        </Box>
                        {user.role === "nurse" &&
                            <Flex
                                gap={1}
                                mb={3}
                            >
                                <Button colorScheme="red" onClick={() => { deleteEm({ variables: { id: item.id } }); refetch(); }}>Delete</Button>
                            </Flex>
                        }
                    </Box>
                })
            }
        </Article>
    );
}

export default TipList;

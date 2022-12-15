import requireAuth from "../../lib/requireAuth";
import { Box, Button, Center, Container, Flex, Heading, Input, Textarea } from '@chakra-ui/react';
import { FormEvent, useEffect, useState } from 'react';
import Article from "../../components/layouts/article";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useUserData } from "../../lib/userHook";

const LIST_TIP = gql`
query listTip {
    listTip {
        createdAt
        id
        uid
        tip
    }
}
`

const DELETE_TIP = gql`
mutation deleteTip($id: String!) {
    deleteTip(id: $id) {
        createdAt
        id
        uid
        tip
    }
}
`

type TipProps = {
    tip: string,
    id: string,
}

const TipList = () => {
    const { loading, error, data, refetch } = useQuery(LIST_TIP);
    const [deleteTip, { }] = useMutation(DELETE_TIP);
    const { user } = useUserData();
    const [tips, setTips] = useState<TipProps[]>([]);
    useEffect(() => {
        if (data && !loading) {
            let tmp: TipProps[] = []
            //@ts-ignore
            data.listTip.forEach(item => {
                tmp.push({ id: item.id, tip: item.tip })
            })
            setTips(tmp)
        }
    }, [loading, data])

    return (
        <Article minW="4xl">
            <Heading>Tips</Heading>
            {
                tips.map((item, idx) => {
                    return <Box
                        key={idx}
                    >
                        <Box
                            border="1px"
                            borderColor="blackAlpha.500"
                            mb={1}
                            p={2}
                            borderRadius="5px"
                        >
                            {item.tip}
                        </Box>
                        {user.role === "nurse" &&
                            <Flex
                                gap={1}
                                mb={3}
                            >
                                <Button colorScheme="red" onClick={() => { deleteTip({ variables: { id: item.id } }); refetch(); }}>Delete</Button>
                            </Flex>
                        }
                    </Box>
                })
            }
        </Article>
    );
}

export default TipList;

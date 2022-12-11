import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { ArrowBackIcon, CheckIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Article from "../../../components/layouts/article";
import requireAuth from "../../../lib/requireAuth";
import analyze from "../../analyze";

const LIST_DIANOSTIC = gql`
query list($uid: String!) {
    listDiagnosticByUserId(uid: $uid){
        createdAt
        id
        uid
        diagnostic_data {
                Lymphocytes
                Neutrophils
                Sodium
                Potassium
                Creatinine
                PCR
        }
    }
}
`

export type DiagnosticType = {
    createdAt: string,
    uid: string,
    id: string,
    diagnostic_data: DiagnosticData,
}

export type DiagnosticData = {
    Lymphocytes: string,
    Neutrophils: string,
    Sodium: string,
    Potassium: string,
    Creatinine: string,
    PCR: string,
}

export const DiagnosticHead = [
    "Lymphocytes",
    "Neutrophils",
    "Sodium",
    "Potassium",
    "Creatinine",
    "PCR",
]

function formatDate(date: string) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const List = () => {
    const router = useRouter();
    const { uid } = router.query;
    const [query, { loading, error, data }] = useLazyQuery(LIST_DIANOSTIC, { variables: { uid } });
    const [userDiagnostic, setUserDiagnostic] = useState<DiagnosticType[]>([]);
    const [diagnostics, setDiagnostics] = useState(new Map());

    useEffect(() => {
        if (uid) {
            query()
        }
    }, [uid])

    useEffect(() => {
        if (data && !loading && !error) {
            setUserDiagnostic(data.listDiagnosticByUserId)
        }
        console.log(userDiagnostic)
    }, [data, loading])

    const handleListChange = (id: string, diagnostic_data: DiagnosticData) => {
        if (diagnostics.has(id)) {
            setDiagnostics(prev => {
                let newMap = new Map(prev);
                newMap.delete(id);
                return newMap;
            })
            return
        }
        setDiagnostics(prev => {
            let newMap = new Map(prev);
            newMap.set(id, diagnostic_data);
            return newMap;
        })
    }

    const analyze = () => {
        if (Array.from(diagnostics.values()).length > 0) {
            router.push({ pathname: "/analyze", query: { diagnostics: JSON.stringify(Array.from(diagnostics.values())) } })
        }
    }


    return (
        <>
            <Flex pos="fixed" gap={2} m="1rem" bottom={0} right={0}>
                <IconButton icon={<ArrowBackIcon />} onClick={() => router.push("/patient")} aria-label={"Back Button"} />
                <Button colorScheme="facebook" onClick={() => analyze()}>Analyze</Button>
            </Flex>
            <Article minW="8xl">
                <TableContainer pt="5rem">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Date</Th>
                                {
                                    DiagnosticHead.map((sym, i) => {
                                        return <Th key={i}>{sym}</Th>
                                    })
                                }
                            </Tr>
                        </Thead>
                        <Tbody >
                            {
                                userDiagnostic.map((item, i) => {
                                    return <Tr key={i}>
                                        {diagnostics.has(item.id) ?
                                            <Td><IconButton onClick={() => { handleListChange(item.id, item.diagnostic_data) }} colorScheme="teal" icon={<CheckIcon />} aria-label={""} /></Td>
                                            :
                                            <Td><IconButton onClick={() => { handleListChange(item.id, item.diagnostic_data) }} colorScheme="gray" aria-label={""} /></Td>
                                        }
                                        <Td>{formatDate(item.createdAt)}</Td>
                                        <Td>{item.diagnostic_data.Lymphocytes}</Td>
                                        <Td>{item.diagnostic_data.Neutrophils}</Td>
                                        <Td>{item.diagnostic_data.Sodium}</Td>
                                        <Td>{item.diagnostic_data.Potassium}</Td>
                                        <Td>{item.diagnostic_data.Creatinine}</Td>
                                        <Td>{item.diagnostic_data.PCR}</Td>
                                    </Tr>
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
            </Article>
        </>
    )
}

export default requireAuth(List, "nurse");

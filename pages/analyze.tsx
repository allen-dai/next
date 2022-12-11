import requireAuth from "../lib/requireAuth"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DiagnosticData, DiagnosticHead } from "./patient/list/[uid]"
import { Button, Center, Flex, Heading, Stack } from "@chakra-ui/react";
import Article from "../components/layouts/article";

const ResultHead = ['Regular', 'Semi-Intensive', 'Intensive', 'No care']

const Analyze = () => {
    const router = useRouter();
    const object = router.query;
    const [diagnostics, setDiagnostics] = useState<DiagnosticData[]>();
    const [newestIdx, setNewestIdx] = useState<number>(-1);
    const [result, setResult] = useState<number[]>([]);
    useEffect(() => {
        if (object && object.diagnostics) {
            //@ts-ignore
            setDiagnostics(JSON.parse(object.diagnostics))
        }
    }, [object])

    useEffect(() => {
        analyze()
    }, [diagnostics])


    const analyze = async () => {
        if (diagnostics) {
            //@ts-ignore
            let { __typename, ...obj } = diagnostics[0];
            let input = Object.values(obj).map(str => {
                return Number(str)
            })
            const resRaw = await fetch("/api/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ input })
            })
            let res = await resRaw.json()
            setResult(res)
            setNewestIdx(res.indexOf(Math.max(...res)))
        }
    }
    return (
        <Article minW="4xl">
            <Heading>Analytics of diagnostics</Heading>
            <Flex gap={2}>
                {
                    ResultHead.map((name, idx) => {
                        return <Stack key={idx}>
                            <p>{result ? result[idx] : null}</p>
                            <Center
                                fontSize="1rem"
                                width="7rem"
                                height="3rem"
                                bg={newestIdx !== -1 ? name === ResultHead[newestIdx] ? "teal" : "gray" : "gray"}
                                color="white"
                                borderRadius="5px">
                                {name}

                            </Center>
                        </Stack>
                    })
                }
            </Flex>
        </Article >
    )
}

export default requireAuth(Analyze, "nurse");

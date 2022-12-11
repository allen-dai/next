import requireAuth from "../lib/requireAuth";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Box, Text, Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import Article from "../components/layouts/article";
import { useRouter } from "next/router";

const PATIENTS = gql`
query patient {
    patients {
        id
        name
        username
    }
}
`

type PatientProps = {
    name: string,
    id: string,
    username: string,
}

const PatientBox = (patient: PatientProps) => {
    const router = useRouter();
    return (
        <Flex
            border="1px"
            borderColor="blackAlpha.500"
            my={2}
            p={2}
            borderRadius="5px"
            alignItems="center">
            <Text>
                {patient.name}
            </Text>
            <Spacer />
            <Button colorScheme="facebook" onClick={() => { router.push(`/patient/list/${patient.id}`) }}>List</Button>
            <Button colorScheme="teal" ml={2} onClick={() => { router.push(`/patient/${patient.id}`) }}>Enter Diagnostics</Button>
        </Flex>
    )
}

const Patients = () => {
    let [patients, setPatients] = useState([])
    const { loading, error, data } = useQuery(PATIENTS);
    useEffect(() => {
        if (!loading && !error && data) {
            setPatients(data.patients)
        }
    }, [loading, data])

    return (
        <Article minW="4xl">
            <Heading>Patient List</Heading>
            {patients.map((patient) => {
                //@ts-ignore
                return <PatientBox key={patient.id} {...patient} />
            })}
        </Article>
    )
}

export default requireAuth(Patients, "nurse")

import React, { useState } from "react";
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
    Container,
    RadioGroup,
    Radio,
    CheckboxGroup,
    Checkbox,
    Stack,
    IconButton,
} from "@chakra-ui/react";
import Article from "../../components/layouts/article";
import requireAuth from "../../lib/requireAuth";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useUserData } from "../../lib/userHook";

const CREATE_DIAGNOSTIC = gql`
mutation createDiagnostic(
    $uid: String!,
    $Lymphocytes: Float!,
    $Neutrophils: Float!,
    $Sodium: Float!,
    $Potassium: Float!,
    $Creatinine: Float!,
    $PCR: Float!,
) {
    createDiagnostic(
        uid: $uid,
        Lymphocytes: $Lymphocytes,
        Neutrophils: $Neutrophils,
        Sodium: $Sodium,
        Potassium: $Potassium,
        Creatinine: $Creatinine,
        PCR: $PCR,
    ){
        createdAt
    }
}
`
const LIST_DIAGNOSTIC = gql`
query list($uid: String!) {
    listByUserId(uid: $uid){
        createdAt
        diagnostic_data
    }
}
`

const Patient = () => {
    const { user } = useUserData();
    const router = useRouter();
    const { uid } = router.query;
    const [diagnostics, setDiagnostics] = useState({
        "Lymphocytes": 0.0,
        "Neutrophils": 0.0,
        "Sodium": 0.0,
        "Potassium": 0.0,
        "Creatinine": 0.0,
        "PCR": 0.0
    });
    const [createSymtom, { loading }] = useMutation(CREATE_DIAGNOSTIC);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (+e.target.value > 10.0) { e.target.value = "10.0" }
        if (+e.target.value < -10.0) { e.target.value = "-10.0" }
        setDiagnostics({
            ...diagnostics,
            [e.target.name]: +e.target.value,
        });
        console.log(diagnostics)
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (uid && !Object.values(diagnostics).includes(NaN)) {
            createSymtom({ variables: { uid: uid, ...diagnostics } })
                .then(() => {
                    if (user.role === "nurse") {
                        router.push(`/patient/list/${uid}`)
                    }
                    else{
                        router.reload()
                    }
                })
        }
    };

    return (
        <Article>
            <Heading>Diagnostics</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel p={0} m={0} htmlFor="Lymphocytes">
                        Lymphocytes
                    </FormLabel>
                    <Input
                        placeholder="Lymphocytes"
                        borderColor="gray.400"
                        name="Lymphocytes"
                        id="Lymphocytes"
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel p={0} m={0} htmlFor="Neutrophils">
                        Neutrophils
                    </FormLabel>
                    <Input
                        placeholder="Neutrophils"
                        borderColor="gray.400"
                        name="Neutrophils"
                        id="Neutrophils"
                        onChange={handleChange}
                    />
                </FormControl>


                <FormControl isRequired>
                    <FormLabel p={0} m={0} htmlFor="Sodium">
                        Sodium
                    </FormLabel>
                    <Input
                        placeholder="Sodium"
                        borderColor="gray.400"
                        name="Sodium"
                        id="Sodium"
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel p={0} m={0} htmlFor="Potassium">
                        Potassium
                    </FormLabel>
                    <Input
                        placeholder="Potassium"
                        borderColor="gray.400"
                        name="Potassium"
                        id="Potassium"
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel p={0} m={0} htmlFor="Creatinine">
                        Creatinine
                    </FormLabel>
                    <Input
                        placeholder="Creatinine"
                        borderColor="gray.400"
                        name="Creatinine"
                        id="Creatinine"
                        onChange={handleChange}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel p={0} m={0} htmlFor="PCR">
                        PCR  (Proteina C reativa mg/dL)
                    </FormLabel>
                    <Input
                        placeholder="PCR"
                        borderColor="gray.400"
                        name="PCR"
                        id="PCR"
                        onChange={handleChange}
                    />
                </FormControl>
                <Button mt={4} type="submit" colorScheme="teal" w="100%">
                    Save
                </Button>
            </form>
        </Article>
    )
}

export default Patient;

import { Box, Container } from "@chakra-ui/react"

type props = {
    children?: React.ReactNode
    minW?: string
}

export default function Article({ children, minW }: props) {
    return (
        <Container m="auto" minW={minW ? minW : ""}>
            <Box w="80%" m="auto" mt={100}>
                {children}
            </Box>
        </Container>
    )
}

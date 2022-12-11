import NextLink from "next/link";
import { Link, useColorModeValue, Box, Center, Button } from "@chakra-ui/react";
import { useUserContext } from ".././lib/userHook";
import {
    Text,
    SimpleGrid,
    Flex,
    IconButton,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerFooter,
    DrawerCloseButton,
    DrawerBody,
    DrawerHeader,
    Spacer,
    Divider,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useLazyQuery, useMutation } from "@apollo/client";
import { gql } from "apollo-server-micro";

type SidebarProps = {
    path: any;
    variant: "drawer" | "sidebar";
    isOpen: boolean;
    toggle: VoidFunction;
};

export const SideBar = ({ path, variant, isOpen, toggle }: SidebarProps) => {
    if (!variant) {
        variant = "drawer"
    }

    const bg = useColorModeValue("#ffffff", "#161619");

    return variant === "sidebar" ? (
        <Flex
            pos="fixed"
            h="100vh"
            w="20em"
            bg={bg}
            py={3}
            px={5}
            left={0}
            top="0"
            flexDir="column"
        >
            <SimpleGrid column={1} spacing={2} my={2} mt={5}>
                <NavItems path={path} toggle={toggle} />
            </SimpleGrid>

            <Spacer />
            <ProfileFooter toggle={toggle} />
        </Flex>
    ) : (
        <>
            <Drawer isOpen={isOpen} placement="left" onClose={toggle}>
                <DrawerOverlay />
                <DrawerContent m="1rem" bg={bg} borderRadius="1rem">
                    <DrawerCloseButton />
                    <DrawerHeader>Page</DrawerHeader>
                    <Divider mb={5} />

                    <DrawerBody>
                        <SimpleGrid column={1} spacing={2} mt={5}>
                            <NavItems path={path} toggle={toggle} />
                        </SimpleGrid>
                    </DrawerBody>

                    <DrawerFooter>
                        <Box width="100%">
                            <ProfileFooter toggle={toggle} />
                        </Box>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Box position="fixed" top={0} left={0} m={3}>
                <IconButton
                    aria-label="Sidebar button"
                    icon={<ChevronRightIcon />}
                    onClick={toggle}
                    mr={3}
                />
            </Box>
        </>
    );
};

type LinkItemProps = {
    href: string;
    path: string;
    onClick: VoidFunction;
    children: React.ReactNode;
};

export const LinkItem = ({ href, path, onClick, children }: LinkItemProps) => {
    const active = path === href; // if path =  curr path(active)
    const activeColor = useColorModeValue("whiteAlpha.800", "gray.900");
    const inactiveColor = useColorModeValue("gray.800", "whiteAlpha.900");
    return (
        <NextLink href={href}>
            <Box
                borderRadius="lg"
                bg={active ? inactiveColor : undefined}
                p="8px"
            >
                <Text
                    color={active ? activeColor : inactiveColor}
                    onClick={onClick}
                >
                    {children}
                </Text>
            </Box>
        </NextLink>
    );
};

type NavProps = {
    toggle: VoidFunction;
    path: string;
};

export const NavItems = ({ toggle, path }: NavProps) => {
    const { user } = useUserContext();
    return user ? (
        <>
            {user.role === "nurse" &&
                <>
                    <LinkItem path={path} href="/" onClick={toggle}>
                        Patients
                    </LinkItem>
                    <LinkItem path={path} href="/tip" onClick={toggle}>
                        Motivations Tips
                    </LinkItem>
                    <LinkItem path={path} href="/tip/send" onClick={toggle}>
                        Send Tips
                    </LinkItem>
                    <LinkItem path={path} href="/emergency" onClick={toggle}>
                        Emergency
                    </LinkItem>
                </>
            }
            {user.role === "patient" &&
                <>
                    <LinkItem path={path} href="/tip" onClick={toggle}>
                        Motivations Tips
                    </LinkItem>
                    <LinkItem path={path} href={`/patient/${user.id}`} onClick={toggle}>
                        Eenter diagnostics
                    </LinkItem>
                    <LinkItem path={path} href="/games" onClick={toggle}>
                        Games
                    </LinkItem>
                </>
            }
        </>
    ) : (
        <>
            <LinkItem path={path} href="/login" onClick={toggle}>
                Login
            </LinkItem>
            <LinkItem path={path} href="/register" onClick={toggle}>
                Register
            </LinkItem>
        </>
    );
};
const CREATE_EM = gql`
mutation createEm($name: String!) {
    createEm(name: $name) {
        createdAt
        id
        uid
        name
    }
}
`

export const ProfileFooter = ({ toggle }: any) => {
    const { user, sign_out } = useUserContext();
    const [createEm, { loading, error, data }] = useMutation(CREATE_EM, { variables: { id: user.id, name: user.name } });
    return (
        <Box display={user ? "flex" : "none"} flexDir="column">
            <Flex>
                <Center>
                    <Text fontSize="xl">
                        {user ? user.name : "something is wrong"}
                    </Text>
                </Center>
            </Flex>
            {
                user.role === "patient" &&
                <Button
                    colorScheme="red"
                    mb={2}
                    loadingText="Calling"
                    isLoading={loading}
                    isDisabled={data}
                    onClick={() => createEm()}
                >
                    Call Emergency
                </Button>
            }

            <Button
                colorScheme="red"
                onClick={() => {
                    sign_out();
                }}
            >
                Sign out
            </Button>
        </Box>
    );
};

export default ProfileFooter;

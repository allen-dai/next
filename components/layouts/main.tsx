import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useState } from "react";
import { SideBar } from "../nav";

type props = {
    children?: React.ReactNode;
    router: NextRouter;
};

export enum BarVariant {
    Drawer,
    Sidebar,
}

const base = { sidebar: "drawer" as const, navButton: true };
const md = { sidebar: "sidebar" as const, navButton: false };

export const Main = ({ children, router }: props) => {
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const variant = useBreakpointValue({ base: base, lg: md });

    return (
        <Box>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <title>Group Project</title>
            </Head>
            <Flex>
                <SideBar
                    path={router.asPath}
                    isOpen={isSidebarOpen}
                    toggle={toggleSidebar}
                    variant={
                        variant?.sidebar === undefined
                            ? "drawer"
                            : variant?.sidebar
                    }
                />
                <Box ml={{ lg: "15em" }} width="100%">
                    {children}
                </Box>
            </Flex>
        </Box>
    )
}

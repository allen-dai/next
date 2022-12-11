import { Box, Heading } from "@chakra-ui/react";
import Link from "next/link";
import Article from "../components/layouts/article";

const links = {
    "2048": "https://2048game.com/",
    "Wordle": "https://www.nytimes.com/games/wordle/index.html",
    "Spelling Bee": "https://www.nytimes.com/puzzles/spelling-bee",
    "Tiles": "https://www.nytimes.com/puzzles/tiles",
    "Letter Box": "https://www.nytimes.com/puzzles/letter-boxed",
    "Sudoku": "https://www.nytimes.com/puzzles/sudoku/easy",
    "Vertex": "https://www.nytimes.com/puzzles/vertex"
}

const Games = () => {
    return (
        <Article minW="8xl">
            <Heading>Game List</Heading>
            {
                Object.entries(links).map(([name, link], idx) => {
                    return <Box fontSize="2rem" key={idx}><Link href={link}>{name}</Link></Box>
                })
            }
        </Article>
    )
}

export default Games;

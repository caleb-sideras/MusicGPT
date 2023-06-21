import Waveform from "@/components/Icons/waveform";
import { inlineStyles } from "@/types";
import Link from "next/link";
import ListItem from "./ListItem";

export default function Lite() {

    const liteStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_lite.png')"
    }

    return (
        <div style={liteStyles} className="col-span-1 md:col-span-2 lg:col-span-4 rounded-lg p-4 w-full h-fill">
            <Link href="/lite">
                <ul className="w-full h-full m-auto rounded-md bg-secondary grid list-none gap-x-[10px] p-[22px] sm:grid-cols-[0.75fr_1fr]">
                    <li className="row-span-3 grid">
                        <div className="flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-secondary-container p-[25px] no-underline hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-200 focus:shadow-[0_0_0_2px]">
                            <Waveform />
                            <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-on-secondary-container">
                                MusicGPT Lite
                            </div>
                            <p className="text-mauve4 text-[14px] leading-[1.3] text-on-secondary-container">
                                Musical, Lyrical & Cultural analysis.
                            </p>
                        </div>
                    </li>

                    <ListItem title="Musical" section="lite">
                        Discuss high & low level features capturing the general structure of the music.
                    </ListItem>
                    <ListItem title="Lyrics" section="lite">
                        Understand the meaning behind lyrics.
                    </ListItem>
                    <ListItem title="Cultural" section="lite">
                        Be informed about the context surrounding the music and its relevance to various topics.
                    </ListItem>
                </ul>
            </Link>
        </div>
    );
};
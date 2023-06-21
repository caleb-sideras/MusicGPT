import { inlineStyles } from "@/types";
import Link from "next/link";
import Waveform from "../Icons/waveform";
import ListItem from "./ListItem";

export default function Pro() {

    const proStyles = {
        ...inlineStyles,
        backgroundImage: "url('/home_pro.png')"
    }

    return (
        <div style={proStyles} className="col-span-1 md:col-span-2 lg:col-span-6 rounded-lg p-4 w-full h-fill">
            <ul className="w-full h-full m-auto rounded-md bg-inverse-surface grid list-none gap-x-[10px] p-[22px] sm:grid-cols-[0.75fr_1fr]">
                <li className="row-span-4 grid">
                    <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-[6px] bg-inverse-on-surface p-[25px] no-underline hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-200 focus:shadow-[0_0_0_2px]"
                        href="/pro"
                    >
                        <Waveform />
                        <div className="mt-4 mb-[7px] text-[18px] font-medium leading-[1.2] text-inverse-surface">
                            MusicGPT Pro
                        </div>
                        <p className="text-mauve4 text-[14px] leading-[1.3] text-inverse-surface">
                            Real-time, dedicated, technical analysis.
                        </p>
                    </Link>
                </li>
                <ListItem title="Production and Engineering">
                    Discuss technical aspects of songs such as stero image, compression and more.
                </ListItem>
                <ListItem title="MIDI">
                    Discuss a songs MIDI with MusicGPT&apos;s Polyphonic MIDI extraction.
                </ListItem>
                <ListItem title="Visualizations">
                    Describe a visualization and MusicGPT will create it.
                </ListItem>
                <ListItem title="Upload">
                    Upload your own music for analysis.
                </ListItem>
            </ul>
        </div>
    );
};
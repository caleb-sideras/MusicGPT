import { MessagePart } from "@/types";
import { NoteEventTime } from "@/utils/basic-pitch-ts/src";

export default class CommandParser {
    private buffer: string;
    private commandPattern: RegExp;
    private procedingText: string;
    private characters: string[];
    private regPattern: RegExp;
    // private data: { "!{midi}": Buffer | null; "!{wave}": any; "!{audi}": any; };
    private data: Record<string, any>;

    constructor(messageData: Record<string, any>) {
        this.buffer = '';
        // this.commandPatternOld = /!\{[a-zA-Z]*\}/g;
        this.commandPattern = /!\{(\D+)(\d+)\}/;
        this.procedingText = ''
        this.characters = ["!", "{", "}"];
        this.regPattern = new RegExp(`[${this.characters.map(char => `\\${char}`).join('')}]`);

        // params
        // this.data = {
        //     "!{midi}": midiData ? midiData : null,
        //     "!{wave}": wavformData ? wavformData : null,
        //     "!{audi}": audioData ? audioData : null,
        // }
        this.data = messageData
    }

    public receiveAndProcessText(text: string): MessagePart[] | null {
        this.buffer += text;
        return this.processBuffer();
    }

    public getBuffer(): MessagePart[] {
        return [
            {
                type: "text",
                content: this.buffer,
            }
        ]
    }

    private resetProps() {
        this.buffer = ''
        this.procedingText = ''
    }

    private processBuffer(): MessagePart[] | null {
        let lastIndex = 0;
        // let match: RegExpExecArray | null;
        let match: RegExpMatchArray | null;
        const results: MessagePart[] = [];

        // SHOULD be while -> as next iterations return null if no other duplicates (g flag)

        if ((match = this.commandPattern.exec(this.buffer)) !== null) {
            console.log('match:', this.commandPattern.exec(this.buffer), this.buffer)
            const precedingText = this.buffer.slice(lastIndex, match.index);
            if (precedingText.length > 0) {
                results.push({
                    type: "text",
                    content: precedingText,
                });
            }
            results.push({
                type: `!{${match[1]}}` as "!{midi}" | "!{audi}" | "!{wave}",
                content: this.data[match[2]][match[1]],
            });
            console.log(this.data)
            console.log({
                type: `!{${match[1]}}` as "!{midi}" | "!{audi}" | "!{wave}",
                content: this.data[match[2]][match[1]],
            })

            lastIndex = match.index as number + match[0].length;
            this.procedingText = this.buffer.slice(lastIndex, this.buffer.length);
        }


        if (results.length > 0) {
            const out: MessagePart[] = [
                ...results,
                {
                    type: "text",
                    content: this.procedingText,
                }
            ]
            this.resetProps();
            return out
        }
        if (!this.regPattern.test(this.buffer.slice(-9))) {
            const tmp = this.buffer
            this.resetProps();
            return [
                {
                    type: "text",
                    content: tmp,
                }
            ]
        }
        return null
    }

    // private processBufferOld(): MessagePart[] | null {
    //     let lastIndex = 0;
    //     let match: RegExpExecArray | null;
    //     const results: MessagePart[] = [];

    //     while ((match = this.commandPattern.exec(this.buffer)) !== null) {
    //         const precedingText = this.buffer.slice(lastIndex, match.index);
    //         if (precedingText.length > 0) {
    //             results.push({
    //                 type: "text",
    //                 content: precedingText,
    //             });
    //         }
    //         results.push({
    //             type: match[0] as "!{midi}" | "!{audi}" | "!{wave}",
    //             content: this.data[match[0] as "!{midi}" | "!{audi}" | "!{wave}"],
    //         });
    //         console.log({
    //             type: match[0] as "!{midi}" | "!{audi}" | "!{wave}",
    //             content: this.data[match[0] as "!{midi}" | "!{audi}" | "!{wave}"],
    //         })

    //         lastIndex = match.index + match[0].length;
    //         this.procedingText = this.buffer.slice(lastIndex, this.buffer.length);
    //     }


    //     if (results.length > 0) {
    //         const out: MessagePart[] = [
    //             ...results,
    //             {
    //                 type: "text",
    //                 content: this.procedingText,
    //             }
    //         ]
    //         this.resetProps();
    //         return out
    //     }
    //     if (!this.regPattern.test(this.buffer.slice(-8))) {
    //         const tmp = this.buffer
    //         this.resetProps();
    //         return [
    //             {
    //                 type: "text",
    //                 content: tmp,
    //             }
    //         ]
    //     }
    //     return null


    // }
}
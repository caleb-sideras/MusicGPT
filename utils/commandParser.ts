import { MessagePart } from "@/types";
import { NoteEventTime } from "@/utils/basic-pitch-ts/src";

export default class CommandParser {
    private buffer: string;
    private commandPattern: RegExp;
    private procedingText: string;
    private characters: string[];
    private regPattern: RegExp;
    private data: Record<string, any>;

    constructor(messageData: Record<string, any>) {
        this.buffer = '';
        this.commandPattern = /!\{(\D+)(\d+)\}/;
        this.procedingText = ''
        this.characters = ["!", "{", "}"];
        this.regPattern = new RegExp(`[${this.characters.map(char => `\\${char}`).join('')}]`);
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
                type: `!{${match[1]}}` as "!{midi}" | "!{audi}" | "!{wave}" | "!{hpcp}" | "!{mels}",
                content: this.data[match[2]][match[1]],
            });

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
}
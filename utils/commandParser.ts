import { MessagePart } from "@/types";

export default class CommandParser {
    private buffer: string;
    private commandPattern: RegExp;
    private procedingText: string;
    private characters: string[];
    private regPattern: RegExp;

    constructor() {
        this.buffer = '';
        this.commandPattern = /!\{[a-zA-Z]*\}/g;
        this.procedingText = ''
        this.characters = ["!", "{", "}"];
        this.regPattern = new RegExp(`[${this.characters.map(char => `\\${char}`).join('')}]`);
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
        let match: RegExpExecArray | null;
        const results: MessagePart[] = [];

        while ((match = this.commandPattern.exec(this.buffer)) !== null) {
            const precedingText = this.buffer.slice(lastIndex, match.index);
            if (precedingText.length > 0) {
                results.push({
                    type: "text",
                    content: precedingText,
                });
            }
            results.push({
                type: match[0] as "!{midi}" | "!{audio}",
                content: "", // You can set the content to the appropriate data for visualization
            });
            console.log({
                type: match[0] as "!{midi}" | "!{audio}",
                content: "", // You can set the content to the appropriate data for visualization
            })

            lastIndex = match.index + match[0].length;
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
        if (!this.regPattern.test(this.buffer.slice(-8))) {
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
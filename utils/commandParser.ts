import { ChatData, MessagePart, ParserState } from "@/types";
import { NoteEventTime, generateFileData } from "@/utils/basic-pitch-ts/src";
import { filterAndAdjustNotesByTime } from "./utils";

type ParserReturn = [MessagePart[], ParserState]

export default class CommandParser {
    private buffer: string = '';
    private commandPattern: RegExp = /!\{([^\}]+)\}/;
    private procedingText: string = '';
    private currentState: ParserState = ParserState.COMMAND;
    private codeRegPattern: RegExp = /```/;
    private characters: string[] = ["!", "{", "}", "S:", "E:", "V:", "D:"];
    private regPattern: RegExp;
    private preData: Record<string, any>;
    private chatData: ChatData;
    private extractor: any;
    private currentObject: any

    constructor(chatData: ChatData, essentiaExtractor: any, messageData: Record<string, any>) {
        this.regPattern = new RegExp(this.characters.map(char => {
            // Escape special characters in the string, as these have special meanings in regex
            return char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }).join('|')); // Join the characters array elements with '|', which acts as an OR in regex


        this.preData = messageData
        this.chatData = chatData
        this.extractor = essentiaExtractor
    }

    public receiveAndProcessText(text: string): ParserReturn | null {
        this.buffer += text;
        switch (this.currentState) {
            case ParserState.COMMAND:
                return this.parseCommand();
            case ParserState.CODE_START:
                return this.parseCodeStart();
            case ParserState.CODE_END:
                return this.parseCodeEnd();
            default:
                break;
        }
        return null
    }

    private parseCommand(): ParserReturn | null {

        let lastIndex = 0;
        let match: RegExpMatchArray | null;
        const results: MessagePart[] = [];

        if ((match = this.commandPattern.exec(this.buffer)) !== null) {
            console.log("match", match, "\n")
            const precedingText = this.buffer.slice(lastIndex, match.index);
            if (precedingText.length > 0) {
                results.push({
                    type: "text",
                    content: precedingText,
                });
            }

            const commandContent = match[1];
            const fields = commandContent.split(',');
            const fieldValues = fields.map(field => field.split(':'));
            const commandObject = Object.fromEntries(fieldValues);
            console.log(commandObject)            

            if ('V' in commandObject) {
                const visualization = commandObject.V
                const startTime = commandObject.S
                const endTime = commandObject.E
                const ID = `${startTime}${endTime}`

                if (visualization === 'midi') {
                    const message = this.getMessageFromID(ID, visualization)
                    results.push(message ? message : this.getMidiMessage(visualization, startTime, endTime));
                }
                else if (visualization === 'audi') {
                    results.push(this.getAudioMessage(visualization, startTime, endTime));
                }
                else if (visualization === 'hpcp') {
                    const message = this.getMessageFromID(ID, visualization)
                    console.log("message", message)
                    results.push(message ? message : this.getHPCPMessage(visualization, startTime, endTime));
                    console.log("results", results)

                }
                else if (visualization === 'mels') {
                    const message = this.getMessageFromID(ID, visualization)
                    results.push(message ? message : this.getMelsMessage(visualization, startTime, endTime));
                }
            }
            else if ('D' in commandObject) {
                const dataParameter = commandObject.D
                const startTime = commandObject.S
                const endTime = commandObject.E
                const ID = `${startTime}${endTime}`
                this.currentState = ParserState.CODE_START

                if (dataParameter === 'midB') {
                    const message = this.getDataFromID(ID, dataParameter)
                    this.currentObject = message ? message : this.getMidiFileData(startTime, endTime)
                }
                else if (dataParameter === 'midN') {
                    const message = this.getDataFromID(ID, dataParameter)
                    this.currentObject = message ? message : this.getMidiNoteData(startTime, endTime)
                }
                else if (dataParameter === 'audF') {
                    const message = this.getDataFromID(ID, dataParameter)
                    this.currentObject = message ? message : this.getAudioData(startTime, endTime)
                }
                else if (dataParameter === 'file') {
                    this.currentObject = this.chatData.file.file
                }
                else if (dataParameter === 'hpcp') {
                    const message = this.getDataFromID(ID, dataParameter)
                    this.currentObject = message ? message : this.getHPCPData(startTime, endTime)
                }
                else if (dataParameter === 'mels') {
                    const message = this.getDataFromID(ID, dataParameter)
                    this.currentObject = message ? message : this.getMelsData(startTime, endTime)
                }

            }

            lastIndex = match.index as number + match[0].length;
            this.procedingText = this.buffer.slice(lastIndex, this.buffer.length);
        }

        if (results.length > 0) {
            if (this.procedingText) {
                const out: MessagePart[] = [
                    ...results,
                    {
                        type: "text",
                        content: this.procedingText,
                    }
                ]
                console.log(out)
                this.resetProps();
                return [out, ParserState.COMMAND]
            }
            else {
                this.resetProps();
                return [results, ParserState.COMMAND]
            }
        }

        if (!this.regPattern.test(this.buffer.slice(-9))) {
            const tmp = this.buffer
            this.resetProps();
            return [[{ type: "text", content: tmp, }], ParserState.COMMAND]
        }
        return null
    }

    private parseCodeStart(): ParserReturn | null {
        const match: RegExpMatchArray | null = this.codeRegPattern.exec(this.buffer);

        if (match) {
            let lastIndex = 0;
            const results: MessagePart[] = [];
            const precedingText = this.buffer.slice(lastIndex, match.index);

            if (precedingText) {
                console.log('precedingText', precedingText)
                results.push({
                    type: "text",
                    content: precedingText,
                });
            }

            const procedingText = this.buffer.slice(match.index as number + match[0].length, this.buffer.length);
            this.resetProps()
            if (procedingText) {
                this.buffer = procedingText
                console.log('procedingText', precedingText)

            }
            this.currentState = ParserState.CODE_END

            console.log("parseCodeStart", results)

            return results ? [results, ParserState.COMMAND] : null
        }
        return null
    }

    private parseCodeEnd(): ParserReturn | null {
        const match: RegExpMatchArray | null = this.codeRegPattern.exec(this.buffer);

        if (match) {
            let lastIndex = 0;
            const results: MessagePart[] = [];
            let precedingText = this.buffer.slice(lastIndex, match.index);

            let regex = /(\w+)([\s\S]+)/;
            let matchCode = regex.exec(precedingText);

            if (matchCode && matchCode[1].includes('javascript')) {
                let code = matchCode[2].trim();
                precedingText = code
            }

            results.push({
                type: "code",
                content: precedingText,
            });

            results.push({
                type: "exec",
                content: {
                    parameters: this.currentObject,
                    code: precedingText
                },
            })

            const procedingText = this.buffer.slice(match.index as number + match[0].length, this.buffer.length);
            this.resetProps()

            if (procedingText) {
                this.buffer = procedingText
            }
            this.currentState = ParserState.COMMAND

            return [results, ParserState.CODE_END]
        }
        else {
            return [[{
                type: "code",
                content: this.buffer,
            }] as MessagePart[],
            ParserState.CODE_END]
        }
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

    private getMessageFromID(id: string, id2: string): MessagePart | null {
        const data = this.getDataFromID(id, id2);
        return data ? { type: id2, content: data } as MessagePart : data;
    }

    private getDataFromID(id: string, id2: string): any | null {
        return (id in this.preData && id2 in this.preData[id]) ? this.preData[id][id2] : null;
    }

    private getMidiMessage(id: string, startTime: number, endTime: number): MessagePart {
        return {
            type: id,
            content: this.getMidiFileData(startTime, endTime)

        } as MessagePart
    }

    private getMidiFileData(startTime: number, endTime: number) {
        return generateFileData(
            this.getMidiNoteData(startTime, endTime)
        )
    }

    private getMidiNoteData(startTime: number, endTime: number) {
        return filterAndAdjustNotesByTime(
            this.chatData.midi as NoteEventTime[],
            startTime,
            endTime
        )
    }

    private getAudioMessage(id: string, startTime: number, endTime: number): MessagePart {
        return {
            type: id,
            content: this.getAudioData(startTime, endTime)
        } as MessagePart
    }

    private getAudioData(startTime: number, endTime: number) {
        return {
            file: this.chatData.file.file,
            start: startTime,
            end: endTime
        }
    }

    private getHPCPMessage(id: string, startTime: number, endTime: number): MessagePart {
        return {
            type: id,
            content: this.getHPCPData(startTime, endTime)
        } as MessagePart
    }

    private getHPCPData(startTime: number, endTime: number) {
        const audioFrame = this.getAudioFrame(startTime, endTime)
        return this.extractor.hpcpExtractor(audioFrame);
    }

    private getMelsMessage(id: string, startTime: number, endTime: number): MessagePart {
        return {
            type: id,
            content: this.getMelsData(startTime, endTime)
        } as MessagePart
    }

    private getMelsData(startTime: number, endTime: number) {
        const audioFrame = this.getAudioFrame(startTime, endTime)
        return this.extractor.melSpectrumExtractor(audioFrame);
    }

    private getAudioFrame(startTime: number, endTime: number) {
        return this.chatData.graph.frame.slice(
            startTime * this.chatData.graph.sampleRate,
            endTime * this.chatData.graph.sampleRate
        )
    }
}
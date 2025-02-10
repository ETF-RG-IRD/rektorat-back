export function CONSOLE_INFO(message: string) {
    console.log(`🟦\tINFO: ${message}`);
}

export function CONSOLE_WARN(message: string){
    console.log(`🟨\tWARN: ${message}`);
}

export function CONSOLE_SUCCESS(message: string) {
    console.log(`🟩\tSUCCESS: ${message}`)
}

export function CONSOLE_FAIL(message: string) {
    console.log(`🟥\tFAIL: ${message}`)
}
import * as pdfjsLib from "pdfjs-dist";
import type { ParsedFileData } from "@/context/UploadContext";

// Use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
).toString();

/**
 * Extract text content from a PDF file using pdfjs-dist.
 */
async function parsePDF(file: File): Promise<ParsedFileData> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const lines: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
            .map((item: any) => item.str)
            .join(" ");
        if (pageText.trim()) {
            lines.push(pageText.trim());
        }
    }

    const rawText = lines.join("\n");

    // Try to create a table-like preview from extracted lines
    // Split each line by common delimiters to form rows
    const rows = lines
        .filter((l) => l.trim().length > 0)
        .slice(0, 50) // limit preview rows
        .map((line) => [line]);

    return {
        fileName: file.name,
        fileSize: file.size,
        fileType: "pdf",
        headers: ["Extracted Text"],
        rows,
        rawText,
    };
}

/**
 * Parse a plain text file line by line.
 */
async function parseTXT(file: File): Promise<ParsedFileData> {
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim().length > 0);

    const rows = lines.slice(0, 50).map((line) => [line]);

    return {
        fileName: file.name,
        fileSize: file.size,
        fileType: "txt",
        headers: ["Line Content"],
        rows,
        rawText: text,
    };
}

/**
 * Parse a file based on its extension.
 * Currently supports PDF and TXT.
 * For unsupported types, returns file metadata only.
 */
export async function parseFile(file: File): Promise<ParsedFileData> {
    const name = file.name.toLowerCase();

    if (name.endsWith(".pdf")) {
        return parsePDF(file);
    }

    if (name.endsWith(".txt")) {
        return parseTXT(file);
    }

    // Unsupported format — return metadata only
    return {
        fileName: file.name,
        fileSize: file.size,
        fileType: name.split(".").pop() || "unknown",
        headers: ["Info"],
        rows: [
            [`File: ${file.name}`],
            [`Size: ${(file.size / 1024).toFixed(1)} KB`],
            [`Preview not available for .${name.split(".").pop()} files. File will be processed during analysis.`],
        ],
        rawText: "",
    };
}

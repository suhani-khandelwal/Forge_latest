import { createContext, useContext, useState, ReactNode } from "react";
import type { ProductConcept } from "@/data/mockData";

export interface ParsedFileData {
    fileName: string;
    fileSize: number;
    fileType: string;
    headers: string[];
    rows: string[][];
    rawText: string;
}

export interface GeneratedResults {
    concepts: ProductConcept[];
    sentimentData: { theme: string; positive: number; negative: number }[];
    trendData: { month: string;[key: string]: string | number }[];
    gapMatrixData: { name: string; x: number; y: number; size: number }[];
}

interface UploadContextType {
    files: File[];
    setFiles: (files: File[]) => void;
    parsedData: ParsedFileData[];
    setParsedData: (data: ParsedFileData[]) => void;
    context: string;
    setContext: (ctx: string) => void;
    generatedResults: GeneratedResults | null;
    setGeneratedResults: (results: GeneratedResults | null) => void;
}

const UploadContext = createContext<UploadContextType | null>(null);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [parsedData, setParsedData] = useState<ParsedFileData[]>([]);
    const [context, setContext] = useState("");
    const [generatedResults, setGeneratedResults] = useState<GeneratedResults | null>(null);

    return (
        <UploadContext.Provider value={{
            files, setFiles,
            parsedData, setParsedData,
            context, setContext,
            generatedResults, setGeneratedResults,
        }}>
            {children}
        </UploadContext.Provider>
    );
};

export const useUploadContext = () => {
    const ctx = useContext(UploadContext);
    if (!ctx) throw new Error("useUploadContext must be used within UploadProvider");
    return ctx;
};

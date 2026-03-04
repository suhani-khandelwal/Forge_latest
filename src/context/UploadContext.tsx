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
    mineCategory: string;
    setMineCategory: (cat: string) => void;
    mineSources: string[];
    setMineSources: (sources: string[]) => void;
    mineKeywords: string;
    setMineKeywords: (kw: string) => void;
}

const UploadContext = createContext<UploadContextType | null>(null);

export const UploadProvider = ({ children }: { children: ReactNode }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [parsedData, setParsedData] = useState<ParsedFileData[]>([]);
    const [context, setContext] = useState("");
    const [generatedResults, setGeneratedResults] = useState<GeneratedResults | null>(null);
    const [mineCategory, setMineCategory] = useState("skincare");
    const [mineSources, setMineSources] = useState<string[]>(["amazon", "nykaa", "google"]);
    const [mineKeywords, setMineKeywords] = useState("");

    return (
        <UploadContext.Provider value={{
            files, setFiles,
            parsedData, setParsedData,
            context, setContext,
            generatedResults, setGeneratedResults,
            mineCategory, setMineCategory,
            mineSources, setMineSources,
            mineKeywords, setMineKeywords,
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

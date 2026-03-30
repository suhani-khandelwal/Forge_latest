import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Upload, FileText, X, Table, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { useUploadContext } from "@/context/UploadContext";
import { parseFile } from "@/utils/fileParser";
import { generateFromUpload } from "@/utils/conceptGenerator";
import type { ParsedFileData } from "@/context/UploadContext";

const UploadPage = () => {
  const navigate = useNavigate();
  const { setFiles: setContextFiles, setParsedData, setContext: setContextValue, setGeneratedResults } = useUploadContext();

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [context, setContext] = useState("");
  const [previewData, setPreviewData] = useState<ParsedFileData[]>([]);
  const [isParsing, setIsParsing] = useState(false);

  const processFiles = async (newFiles: File[]) => {
    setIsParsing(true);
    try {
      const parsed = await Promise.all(newFiles.map((f) => parseFile(f)));
      setPreviewData((prev) => [...prev, ...parsed]);
    } catch (err) {
      console.error("Error parsing files:", err);
    } finally {
      setIsParsing(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
    processFiles(dropped);
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files!);
      setFiles((prev) => [...prev, ...newFiles]);
      processFiles(newFiles);
    }
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviewData((prev) => prev.filter((_, idx) => idx !== i));
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleAnalyze = async () => {
    setIsGenerating(true);
    try {
      // Store data in context for the pipeline
      setContextFiles(files);
      setParsedData(previewData);
      setContextValue(context);

      const rawTexts = previewData.map((pd) => pd.rawText).filter(Boolean);
      
      console.log(`[Upload Analysis] Processing ${rawTexts.length} files with Gemini Core...`);

      // Generate truly dynamic results based on selection from the backend
      const response = await fetch("/api/generate-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: context || "General",
          keywords: context,
          rawTexts: rawTexts,
          isUpload: true
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate insights from upload");
      }

      const results = await response.json();
      setGeneratedResults(results);

      navigate("/loading?source=upload");
    } catch (error) {
      console.error("Upload analysis error:", error);
      // Fallback for seamless experience
      const rawTexts = previewData.map((pd) => pd.rawText).filter(Boolean);
      if (rawTexts.length > 0) {
        const { generateFromUpload } = await import("@/utils/conceptGenerator");
        const results = generateFromUpload(rawTexts);
        setGeneratedResults(results);
      }
      navigate("/loading?source=upload");
    } finally {
      setIsGenerating(false);
    }
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith(".csv") || name.endsWith(".xlsx")) return "📊";
    if (name.endsWith(".pdf")) return "📄";
    return "📝";
  };

  // Get the combined preview: show the first file with actual table data
  const activePreview = previewData.length > 0 ? previewData[0] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 pt-28 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-sm font-body text-muted-foreground mb-4">
              <span className="text-forest font-semibold">Forge</span>
              <ChevronRight className="w-4 h-4" />
              <span>Upload Trends & Data</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-forest mb-3">Upload Your Data</h1>
            <p className="text-muted-foreground font-body">
              Upload PDF or TXT files containing consumer reviews, trend reports, or market research. Forge will extract insights and generate product concepts.
            </p>
          </div>

          {/* Drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragging
              ? "border-forest bg-sage-light scale-[1.01]"
              : "border-border hover:border-sage hover:bg-surface"
              }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.txt"
              onChange={onFileInput}
            />
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all ${isDragging ? "bg-forest" : "bg-sage-light"}`}>
              <Upload className={`w-8 h-8 ${isDragging ? "text-white" : "text-forest"}`} />
            </div>
            <h3 className="font-body font-semibold text-forest text-lg mb-2">
              {isDragging ? "Release to upload" : "Drag & drop files here"}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">or click to browse</p>
            <div className="flex gap-2 justify-center flex-wrap">
              {["PDF", "TXT"].map(ext => (
                <span key={ext} className="px-3 py-1 bg-sage-light text-forest text-xs font-body font-semibold rounded-full">
                  {ext}
                </span>
              ))}
            </div>
          </div>

          {/* Uploaded files */}
          {files.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-body font-semibold text-forest text-sm uppercase tracking-wide">Uploaded Files</h3>
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-surface border border-border rounded-xl">
                  <span className="text-2xl">{getFileIcon(file.name)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-foreground text-sm truncate">{file.name}</p>
                    <p className="text-muted-foreground text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-sage animate-pulse-slow" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Context input */}
          <div className="mt-8">
            <label className="block font-body font-semibold text-forest text-sm mb-2">
              Additional Context <span className="font-normal text-muted-foreground">(Optional)</span>
            </label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={4}
              placeholder="e.g. Focus on skincare for oily skin types. Target audience: 22–35 year old Indian women. Competitor: Minimalist, Dot & Key…"
              className="w-full px-4 py-3 rounded-xl border border-border bg-surface font-body text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition-all resize-none"
            />
          </div>

          {/* Note */}
          {files.length === 0 && (
            <div className="mt-6 flex gap-3 p-4 bg-sage-light border border-sage/30 rounded-xl">
              <AlertCircle className="w-4 h-4 text-forest mt-0.5 flex-shrink-0" />
              <p className="text-sm font-body text-forest/80">
                Don't have data? Click "Analyze & Forge Concepts" anyway — Forge will use built-in Indian wellness market data to generate concepts.
              </p>
            </div>
          )}

          {/* Parsing indicator */}
          {isParsing && (
            <div className="mt-8 flex items-center justify-center gap-3 p-6 bg-sage-light/50 border border-sage/30 rounded-xl">
              <Loader2 className="w-5 h-5 text-forest animate-spin" />
              <span className="font-body text-sm text-forest font-semibold">Parsing uploaded file…</span>
            </div>
          )}

          {/* Data Preview — from actual parsed file */}
          {!isParsing && activePreview && activePreview.rows.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Table className="w-4 h-4 text-forest" />
                <h3 className="font-body font-semibold text-forest">Data Preview</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {activePreview.fileName} · {activePreview.rows.length} rows extracted
                </span>
              </div>

              {/* Show tabs if multiple files */}
              {previewData.length > 1 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {previewData.map((pd, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        // Move the selected item to the front
                        setPreviewData((prev) => {
                          const copy = [...prev];
                          const [item] = copy.splice(idx, 1);
                          return [item, ...copy];
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${idx === 0
                        ? "bg-forest text-primary-foreground"
                        : "bg-surface border border-border text-muted-foreground hover:border-forest"
                        }`}
                    >
                      {pd.fileName}
                    </button>
                  ))}
                </div>
              )}

              <div className="overflow-x-auto rounded-xl border border-border max-h-96 overflow-y-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="bg-forest text-primary-foreground sticky top-0">
                      {activePreview.headers.map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activePreview.rows.map((row, i) => (
                      <tr key={i} className={`border-t border-border ${i % 2 === 0 ? "bg-background" : "bg-surface"} hover:bg-sage-light/30 transition-colors`}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3 text-muted-foreground">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analyze button */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isParsing || isGenerating}
              className="inline-flex items-center gap-2 px-8 py-4 bg-forest text-primary-foreground font-body font-semibold rounded-xl hover:bg-forest-light transition-all shadow-forge hover:shadow-forge-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Forging Concepts...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Analyze & Forge Concepts
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;

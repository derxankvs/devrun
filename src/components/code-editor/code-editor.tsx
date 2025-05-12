"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Loader2, AlertTriangle, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FileSystemNode, Language } from "@/types";
import { EDITOR_LANGUAGES, DEFAULT_LANGUAGE } from "@/lib/constants";

interface CodeEditorProps {
  selectedFile: FileSystemNode | null;
  onFileContentChange: (path: string, newContent: string) => void;
}

export function CodeEditor({ selectedFile, onFileContentChange }: CodeEditorProps) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isLoadingBugs, setIsLoadingBugs] = useState(false);
  const [bugReport, setBugReport] = useState<{ bugs: string[]; fixes: string[] } | null>(null);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!selectedFile) {
      setCode("");
      return;
    }

    setCode(selectedFile.content || "");

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    const matchedLanguage = EDITOR_LANGUAGES.find(
      (l) =>
        l.value === extension ||
        (extension === "js" && l.value === "javascript") ||
        (extension === "ts" && l.value === "typescript") ||
        (extension === "py" && l.value === "python") ||
        (extension === "md" && l.value === "markdown")
    );

    setLanguage((matchedLanguage?.value as Language) || DEFAULT_LANGUAGE);
    setBugReport(null);
  }, [selectedFile]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (selectedFile) {
      onFileContentChange(selectedFile.path, newCode);
    }
  };

  const handleDetectBugs = () => {
    if (!code.trim() || !language) {
      toast({
        title: "Não é possível detectar bugs",
        description: "Nenhum código ou linguagem selecionada.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingBugs(true);
    setBugReport(null);

    // Simulação de detecção de bugs
    setTimeout(() => {
      setBugReport({
        bugs: ["Bug de exemplo encontrado!"],
        fixes: ["Exemplo de correção sugerida."]
      });
      setIsLoadingBugs(false);
    }, 2000);
  };

  if (!selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <p className="text-lg">Selecione um arquivo para começar a codificar ou crie um novo.</p>
      </div>
    );
  }

  return (
    <Card className="h-full flex flex-col shadow-none border-0 md:border md:rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between px-4 md:px-6 pb-2 pt-4 border-b">
        <CardTitle className="text-lg font-medium truncate" title={selectedFile.name}>
          {selectedFile.name}
        </CardTitle>
        <Button
          onClick={handleDetectBugs}
          variant="outline"
          size="sm"
          disabled={isLoadingBugs}
          className="h-8 text-xs"
        >
          {isLoadingBugs ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <AlertTriangle className="mr-2 h-3 w-3" />
          )}
          Detectar Bugs
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
        <Textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder={`// Digite código ${language} aqui...`}
          className="flex-grow w-full h-full p-4 text-sm font-mono resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
          style={{ tabSize: 4 } as React.CSSProperties}
          spellCheck="false"
          aria-label="Editor de código"
        />
      </CardContent>

      {bugReport && (
        <CardFooter className="p-4 border-t flex-col items-start gap-2 max-h-48 overflow-y-auto bg-muted/30">
          <h4 className="text-sm font-semibold">Relatório de Bugs:</h4>
          <div className="text-xs">
            <strong>Bugs:</strong>
            <ul className="list-disc pl-5">
              {bugReport.bugs.map((bug, i) => (
                <li key={`bug-${i}`}>{bug}</li>
              ))}
            </ul>
          </div>
          {bugReport.fixes.length > 0 && (
            <div className="text-xs mt-2">
              <strong>Correções Sugeridas:</strong>
              <ul className="list-disc pl-5">
                {bugReport.fixes.map((fix, i) => (
                  <li key={`fix-${i}`}>{fix}</li>
                ))}
              </ul>
            </div>
          )}
          {bugReport.bugs.length === 0 && (
            <p className="text-xs text-green-500 flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Nenhum bug em potencial encontrado.
            </p>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

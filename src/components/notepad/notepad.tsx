
"use client"

import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NOTEPAD_STORAGE_KEY = "devrun-notepad-content"; // Changed to reflect app name potentially

export function Notepad() {
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedNotes = localStorage.getItem(NOTEPAD_STORAGE_KEY);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleSaveNotes = () => {
    localStorage.setItem(NOTEPAD_STORAGE_KEY, notes);
    toast({ title: "Notas Salvas", description: "Suas notas foram salvas localmente." });
  };

  const handleClearNotes = () => {
    setNotes("");
    localStorage.removeItem(NOTEPAD_STORAGE_KEY);
    toast({ title: "Notas Limpas", description: "Suas notas foram limpas." });
  };


  return (
    <div className="p-4 h-full flex flex-col">
      <Card className="shadow-none border-0 md:border flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Bloco de Notas</CardTitle>
          <CardDescription>Anote rapidamente notas, ideias ou tarefas.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-0">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Digite suas notas aqui..."
            className="flex-grow w-full h-full p-4 text-sm resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Bloco de Notas"
          />
        </CardContent>
        <div className="p-4 border-t flex justify-end gap-2">
           <Button variant="outline" size="sm" onClick={handleClearNotes}>
            <RotateCcw className="mr-2 h-4 w-4" /> Limpar
          </Button>
          <Button size="sm" onClick={handleSaveNotes}>
            <Save className="mr-2 h-4 w-4" /> Salvar Notas
          </Button>
        </div>
      </Card>
    </div>
  );
}

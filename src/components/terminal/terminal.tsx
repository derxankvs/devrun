
"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, XSquare } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export function Terminal({ isVisible, onClose }: { isVisible: boolean, onClose: () => void }) {
  const [history, setHistory] = useState<string[]>([`Bem-vindo ao Terminal ${APP_NAME}!`]);
  const [command, setCommand] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleCommand = () => {
    if (!command.trim()) return;

    const newHistory = [...history, `> ${command}`];
    // Mock command execution
    if (command.toLowerCase() === "clear") {
      setHistory([]);
    } else if (command.toLowerCase() === "help") {
      newHistory.push("Comandos disponíveis: help, clear, date, echo [texto]");
    } else if (command.toLowerCase() === "date") {
      newHistory.push(new Date().toLocaleString('pt-BR'));
    } else if (command.toLowerCase().startsWith("echo ")) {
      newHistory.push(command.substring(5));
    } else {
      newHistory.push(`comando não encontrado: ${command}`);
    }
    setHistory(newHistory);
    setCommand("");
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [history]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-background border-t border-border shadow-md">
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/50">
        <h3 className="text-sm font-semibold">Terminal</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
          <XSquare className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-grow p-2 text-xs" ref={scrollAreaRef}>
        {history.map((line, index) => (
          <div key={index} className="font-mono whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </ScrollArea>
      <div className="p-2 border-t border-border flex items-center gap-2">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCommand();
          }}
          placeholder="Digite o comando..."
          className="flex-grow h-8 text-xs bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          spellCheck="false"
        />
        <Button onClick={handleCommand} size="sm" className="h-8 text-xs">
          Executar
        </Button>
      </div>
    </div>
  );
}

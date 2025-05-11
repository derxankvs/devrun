
"use client"

import type { FileSystemNode } from "@/types";
import { FileText, Edit3, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface FileItemProps {
  node: FileSystemNode;
  onSelectFile: (node: FileSystemNode) => void;
  onRenameFile: (node: FileSystemNode, newName: string) => void;
  onDeleteFile: (node: FileSystemNode) => void;
  level: number;
}

export function FileItem({ node, onSelectFile, onRenameFile, onDeleteFile, level }: FileItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleRename = () => {
    if (newName.trim() && newName !== node.name) {
      onRenameFile(node, newName.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div
      className="flex items-center justify-between p-1 pr-2 hover:bg-accent hover:text-accent-foreground rounded-md group"
      style={{ paddingLeft: `${level * 1 + 0.25}rem` }}
    >
      {isRenaming ? (
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => e.key === 'Enter' && handleRename()}
          className="h-7 text-xs flex-grow mr-2"
          autoFocus
        />
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs w-full justify-start px-1"
          onClick={() => onSelectFile(node)}
        >
          <FileText className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
          <span className="truncate">{node.name}</span>
        </Button>
      )}
      {!isRenaming && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100">
              <GripVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <Edit3 className="mr-2 h-3.5 w-3.5" />
              Renomear
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteFile(node)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

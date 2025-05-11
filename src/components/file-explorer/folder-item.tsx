
"use client"

import type { FileSystemNode } from "@/types";
import { Folder, FolderOpen, ChevronRight, ChevronDown, Edit3, Trash2, FilePlus, FolderPlus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

interface FolderItemProps {
  node: FileSystemNode;
  onToggleFolder: (node: FileSystemNode) => void;
  onRenameFolder: (node: FileSystemNode, newName: string) => void;
  onDeleteFolder: (node: FileSystemNode) => void;
  onCreateFileInFolder: (parentNode: FileSystemNode) => void;
  onCreateFolderInFolder: (parentNode: FileSystemNode) => void;
  isOpen: boolean;
  level: number;
  children?: React.ReactNode;
}

export function FolderItem({
  node,
  onToggleFolder,
  onRenameFolder,
  onDeleteFolder,
  onCreateFileInFolder,
  onCreateFolderInFolder,
  isOpen,
  level,
  children,
}: FolderItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleRename = () => {
    if (newName.trim() && newName !== node.name) {
      onRenameFolder(node, newName.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div>
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
            onClick={() => onToggleFolder(node)}
          >
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            )}
            {isOpen ? (
              <FolderOpen className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            ) : (
              <Folder className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            )}
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
              <DropdownMenuItem onClick={() => onCreateFileInFolder(node)}>
                <FilePlus className="mr-2 h-3.5 w-3.5" />
                Novo Arquivo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateFolderInFolder(node)}>
                <FolderPlus className="mr-2 h-3.5 w-3.5" />
                Nova Pasta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsRenaming(true)}>
                <Edit3 className="mr-2 h-3.5 w-3.5" />
                Renomear
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteFolder(node)} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isOpen && <div className="pl-2">{children}</div>}
    </div>
  );
}

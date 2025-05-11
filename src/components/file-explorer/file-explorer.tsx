
"use client"

import React, { useState, useCallback } from 'react';
import type { FileSystemNode } from '@/types';
import { INITIAL_FILE_SYSTEM, DEFAULT_FILE_CONTENT } from '@/lib/constants';
import { FileItem } from './file-item';
import { FolderItem } from './folder-item';
import { Button } from '@/components/ui/button';
import { FilePlus, FolderPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid'; // Needs npm install uuid and @types/uuid

// Helper function to recursively find and update/delete a node
const updateNodeRecursive = (
  nodes: FileSystemNode[],
  path: string,
  updateFn: (node: FileSystemNode) => FileSystemNode | null | undefined,
  parentPath: string = ''
): FileSystemNode[] => {
  return nodes.map(node => {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
    if (node.path === path) {
      const updatedNode = updateFn(node);
      return updatedNode === undefined ? node : updatedNode; // undefined means no change, null means delete
    }
    if (node.children && path.startsWith(node.path + '/')) {
      const newChildren = updateNodeRecursive(node.children, path, updateFn, currentPath);
      return { ...node, children: newChildren.filter(Boolean) as FileSystemNode[] };
    }
    return node;
  }).filter(Boolean) as FileSystemNode[];
};

// Helper function to add a node
const addNodeRecursive = (
  nodes: FileSystemNode[],
  parentId: string | null, // null for root
  newNode: FileSystemNode
): FileSystemNode[] => {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map(node => {
    if (node.id === parentId) {
      if (node.type === 'folder') {
        return { ...node, children: [...(node.children || []), newNode] };
      }
    }
    if (node.children) {
      return { ...node, children: addNodeRecursive(node.children, parentId, newNode) };
    }
    return node;
  });
};


export function FileExplorer({ onFileSelect }: { onFileSelect: (file: FileSystemNode) => void }) {
  const [fileSystem, setFileSystem] = useState<FileSystemNode[]>(INITIAL_FILE_SYSTEM);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ '1': true }); // Root folder initially open
  const { toast } = useToast();

  const generateUniqueName = (baseName: string, type: 'file' | 'folder', siblings?: FileSystemNode[]): string => {
    let count = 1;
    let newName = type === 'file' ? `${baseName}.${count}` : `${baseName}-${count}`;
    if (siblings) {
      // eslint-disable-next-line no-loop-func
      while (siblings.some(sibling => sibling.name === newName)) {
        count++;
        newName = type === 'file' ? `${baseName}.${count}` : `${baseName}-${count}`;
      }
    }
    return newName;
  };

  const findNodeById = (nodes: FileSystemNode[], id: string): FileSystemNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getSiblings = (nodes: FileSystemNode[], path: string): FileSystemNode[] | undefined => {
    const parentPath = path.substring(0, path.lastIndexOf('/'));
    if (!parentPath) return nodes; // Root siblings

    const findParent = (currentNodes: FileSystemNode[], currentPath: string): FileSystemNode | null => {
      for (const node of currentNodes) {
        if (node.path === currentPath && node.type === 'folder') return node;
        if (node.children && currentPath.startsWith(node.path + '/')) {
          const found = findParent(node.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    };
    const parentNode = findParent(nodes, parentPath);
    return parentNode?.children;
  };


  const handleCreateNode = (type: 'file' | 'folder', parentNode?: FileSystemNode) => {
    const parentId = parentNode ? parentNode.id : null;
    const parentPath = parentNode ? parentNode.path : '';
    const siblings = parentNode ? parentNode.children : fileSystem;

    const baseName = type === 'file' ? 'sem_titulo' : 'NovaPasta';
    let count = 1;
    let newNodeName = type === 'file' ? `${baseName}.${count}` : `${baseName}-${count}`;

    while (siblings?.some(sibling => sibling.name === newNodeName)) {
      count++;
      newNodeName = type === 'file' ? `${baseName}.${count}` : `${baseName}-${count}`;
    }

    const newNode: FileSystemNode = {
      id: uuidv4(),
      name: newNodeName,
      type,
      path: parentPath ? `${parentPath}/${newNodeName}` : newNodeName,
      content: type === 'file' ? DEFAULT_FILE_CONTENT(newNodeName) : undefined,
      children: type === 'folder' ? [] : undefined,
    };

    setFileSystem(prev => addNodeRecursive(prev, parentId, newNode));
    if (parentNode && !openFolders[parentNode.id]) {
      setOpenFolders(prev => ({ ...prev, [parentNode.id]: true }));
    }
    toast({ title: `${type === 'file' ? 'Arquivo' : 'Pasta'} criado: ${newNodeName}` });
  };

  const handleRenameNode = (nodeToRename: FileSystemNode, newName: string) => {
    const parentPath = nodeToRename.path.substring(0, nodeToRename.path.lastIndexOf('/'));
    const newPath = parentPath ? `${parentPath}/${newName}` : newName;

    // Check for name conflicts
    const siblings = getSiblings(fileSystem, nodeToRename.path);
    if (siblings?.some(s => s.name === newName && s.id !== nodeToRename.id)) {
      toast({ title: "Erro", description: `Um(a) ${nodeToRename.type === 'file' ? 'arquivo' : 'pasta'} com este nome já existe.`, variant: "destructive" });
      return;
    }

    setFileSystem(prev =>
      updateNodeRecursive(prev, nodeToRename.path, (node) => ({
        ...node,
        name: newName,
        path: newPath,
        // If it's a folder, its children's paths also need updating. This gets complex.
        // For simplicity, this example won't recursively update children paths on folder rename.
        // A real implementation would require a more robust path update mechanism.
      }))
    );
    toast({ title: `${nodeToRename.type === 'file' ? 'Arquivo' : 'Pasta'} renomeado para ${newName}` });
  };

  const handleDeleteNode = (nodeToDelete: FileSystemNode) => {
    setFileSystem(prev => updateNodeRecursive(prev, nodeToDelete.path, () => null));
    toast({ title: `${nodeToDelete.type === 'file' ? 'Arquivo' : 'Pasta'} excluído: ${nodeToDelete.name}`, variant: "destructive" });
  };

  const handleToggleFolder = useCallback((folderNode: FileSystemNode) => {
    setOpenFolders(prev => ({ ...prev, [folderNode.id]: !prev[folderNode.id] }));
  }, []);

  const renderNodes = (nodes: FileSystemNode[], level: number): React.ReactNode => {
    return nodes.map(node => (
      <React.Fragment key={node.id}>
        {node.type === 'folder' ? (
          <FolderItem
            node={node}
            isOpen={!!openFolders[node.id]}
            onToggleFolder={handleToggleFolder}
            onRenameFolder={handleRenameNode}
            onDeleteFolder={handleDeleteNode}
            onCreateFileInFolder={() => handleCreateNode('file', node)}
            onCreateFolderInFolder={() => handleCreateNode('folder', node)}
            level={level}
          >
            {openFolders[node.id] && node.children && renderNodes(node.children, level + 1)}
          </FolderItem>
        ) : (
          <FileItem
            node={node}
            onSelectFile={onFileSelect}
            onRenameFile={handleRenameNode}
            onDeleteFile={handleDeleteNode}
            level={level}
          />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="h-full flex flex-col text-sm">
      <div className="p-2 flex gap-2 border-b border-sidebar-border">
        <Button variant="ghost" size="sm" onClick={() => handleCreateNode('file')} className="flex-1">
          <FilePlus className="mr-2 h-4 w-4" /> Novo Arquivo
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleCreateNode('folder')} className="flex-1">
          <FolderPlus className="mr-2 h-4 w-4" /> Nova Pasta
        </Button>
      </div>
      <ScrollArea className="flex-grow p-1">
        {renderNodes(fileSystem, 0)}
      </ScrollArea>
    </div>
  );
}

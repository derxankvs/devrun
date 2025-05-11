
"use client"

import React, { useState, useCallback } from 'react';
import { AppLogo } from '@/components/icons/app-logo';
import { FileExplorer } from '@/components/file-explorer/file-explorer';
import { CodeEditor } from '../components/code-editor/code-editor';
import { Terminal } from '@/components/terminal/terminal';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { SocialMediaLinks } from '@/components/social/social-media-links';
import { Notepad } from '@/components/notepad/notepad';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PanelLeft, LayoutGrid, StickyNote, Settings, Link as LinkIcon, TerminalSquare, PanelBottomOpen, PanelBottomClose } from 'lucide-react';
import type { FileSystemNode } from '@/types';
import { APP_NAME } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";

type ActiveTab = "explorer" | "notepad" | "social" | "settings";

export default function CodeFlowApp() {
  const [selectedFile, setSelectedFile] = useState<FileSystemNode | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("explorer");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const { toast } = useToast();

  const handleFileSelect = useCallback((file: FileSystemNode) => {
    setSelectedFile(file);
    if (file.name.endsWith('.md')) {
      // Potentially switch to a markdown preview mode or set language
    }
    toast({ title: "Arquivo Selecionado", description: `${file.name} carregado no editor.` });
  }, [toast]);

  const handleFileContentChange = (path: string, newContent: string) => {
    // This would typically involve updating the file system state.
    // For now, we just update the selectedFile if it matches.
    if (selectedFile && selectedFile.path === path) {
      setSelectedFile(prev => prev ? { ...prev, content: newContent } : null);
    }
    // console.log(`File ${path} content changed. This should be saved to the FileSystem state.`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'explorer':
        return <FileExplorer onFileSelect={handleFileSelect} />;
      case 'notepad':
        return <Notepad />;
      case 'social':
        return <SocialMediaLinks />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Header */}
      <header className="h-12 flex items-center justify-between px-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="h-8 w-8">
            <PanelLeft className="h-5 w-5" />
          </Button>
          <AppLogo className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">{APP_NAME}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            className="h-8 w-8"
            aria-label={isTerminalVisible ? "Fechar terminal" : "Abrir terminal"}
          >
            {isTerminalVisible ? <PanelBottomClose className="h-5 w-5" /> : <PanelBottomOpen className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className="w-72 min-w-[288px] border-r flex flex-col bg-sidebar text-sidebar-foreground shrink-0">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)} className="flex flex-col flex-1 overflow-hidden">
              <TabsList className="grid w-full grid-cols-4 rounded-none bg-transparent p-1 border-b border-sidebar-border h-10">
                <TabsTrigger value="explorer" className="h-full rounded-md text-xs data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="notepad" className="h-full rounded-md text-xs data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground">
                  <StickyNote className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="social" className="h-full rounded-md text-xs data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground">
                  <LinkIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="settings" className="h-full rounded-md text-xs data-[state=active]:bg-sidebar-accent data-[state=active]:text-sidebar-accent-foreground">
                  <Settings className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-hidden">
                {renderTabContent()}
              </div>
            </Tabs>
          </aside>
        )}

        {/* Editor and Terminal Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-grow overflow-auto p-1 md:p-2"> {/* Added padding for editor */}
            <CodeEditor selectedFile={selectedFile} onFileContentChange={handleFileContentChange} />
          </div>
          {isTerminalVisible && (
            <div className="h-1/3 max-h-[50vh] min-h-[150px] shrink-0 overflow-hidden"> {/* Fixed height for terminal */}
              <Terminal isVisible={isTerminalVisible} onClose={() => setIsTerminalVisible(false)}/>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

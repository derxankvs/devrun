export type FileSystemNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string; // Full path to the node
  content?: string; // For files
  children?: FileSystemNode[]; // For folders
};

export type SocialLink = {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type Language = 'javascript' | 'python' | 'html' | 'css' | 'typescript' | 'markdown'; // Add more as needed

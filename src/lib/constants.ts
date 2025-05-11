
import type { SocialLink, FileSystemNode } from '@/types';
import { Instagram, Globe, Twitter, Github, MessageSquare } from 'lucide-react';

export const APP_NAME = "DevRun";

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', url: '#', icon: Instagram },
  { name: 'Site Oficial', url: '#', icon: Globe },
  { name: 'Discord', url: '#', icon: MessageSquare },
  { name: 'Twitter', url: '#', icon: Twitter },
  { name: 'GitHub', url: '#', icon: Github },
];

export const INITIAL_FILE_SYSTEM: FileSystemNode[] = [
  {
    id: '1', name: 'raiz-do-projeto', type: 'folder', path: 'raiz-do-projeto', children: [
      {
        id: '2', name: 'publico', type: 'folder', path: 'raiz-do-projeto/publico', children: [
          { id: '3', name: 'index.html', type: 'file', path: 'raiz-do-projeto/publico/index.html', content: '<h1>Bem-vindo ao DevRun!</h1>\n<p>Edite este arquivo ou crie novos.</p>' },
          { id: '4', name: 'styles.css', type: 'file', path: 'raiz-do-projeto/publico/styles.css', content: 'body {\n  font-family: sans-serif;\n}' },
        ]
      },
      {
        id: '5', name: 'src', type: 'folder', path: 'raiz-do-projeto/src', children: [
          { id: '6', name: 'app.js', type: 'file', path: 'raiz-do-projeto/src/app.js', content: 'console.log("Olá do app.js do DevRun!");' },
          { id: '7', name: 'utils.py', type: 'file', path: 'raiz-do-projeto/src/utils.py', content: 'def saudar(nome):\n  print(f"Olá, {nome}!")' },
        ]
      },
      { id: '8', name: 'README.md', type: 'file', path: 'raiz-do-projeto/README.md', content: '# Projeto DevRun\nSua incrível descrição de projeto aqui.' },
    ]
  },
];

export const EDITOR_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "typescript", label: "TypeScript" },
  { value: "markdown", label: "Markdown" },
];

export const DEFAULT_LANGUAGE = "javascript";
export const DEFAULT_FILE_CONTENT = (fileName: string) => `// ${fileName}\n\nconsole.log("Novo arquivo criado no DevRun!");`;


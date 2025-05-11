
'use server';

/**
 * @fileOverview Um agente de IA para detectar bugs em código e sugerir correções.
 *
 * - detectBugs - Uma função que lida com o processo de detecção de bugs.
 * - BugDetectionInput - O tipo de entrada para a função detectBugs.
 * - BugDetectionOutput - O tipo de retorno para a função detectBugs.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BugDetectionInputSchema = z.object({
  code: z.string().describe('O código a ser analisado em busca de bugs.'),
  language: z.string().describe('A linguagem de programação do código.'),
});

export type BugDetectionInput = z.infer<typeof BugDetectionInputSchema>;

const BugDetectionOutputSchema = z.object({
  bugs: z
    .array(z.string())
    .describe('Uma lista de bugs potenciais encontrados no código.'),
  suggestedFixes: z
    .array(z.string())
    .describe('Uma lista de correções sugeridas para os bugs identificados.'),
});

export type BugDetectionOutput = z.infer<typeof BugDetectionOutputSchema>;

export async function detectBugs(input: BugDetectionInput): Promise<BugDetectionOutput> {
  return detectBugsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bugDetectionPrompt',
  input: {schema: BugDetectionInputSchema},
  output: {schema: BugDetectionOutputSchema},
  prompt: `Você é uma ferramenta de detecção de bugs alimentada por IA.
Você receberá um trecho de código e sua linguagem de programação ({{{language}}}).
Sua tarefa é analisar o código, identificar bugs potenciais e sugerir correções para esses bugs.

Código de Entrada:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Por favor, forneça suas descobertas.
Sua resposta deve incluir:
1. Uma lista de descrições para cada bug encontrado (como 'bugs').
2. Uma lista de sugestões correspondentes para corrigir cada bug (como 'suggestedFixes').
Se nenhum bug for encontrado, as listas 'bugs' e 'suggestedFixes' devem estar vazias.`,
});

const detectBugsFlow = ai.defineFlow(
  {
    name: 'detectBugsFlow',
    inputSchema: BugDetectionInputSchema,
    outputSchema: BugDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

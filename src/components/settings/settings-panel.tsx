
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/lib/constants";

export function SettingsPanel() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <Card className="shadow-none border-0 md:border">
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Personalize a aparência e o comportamento do {APP_NAME}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme-switcher" className="text-base font-semibold">Aparência</Label>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Tema</p>
                <p className="text-xs text-muted-foreground">Selecione seu tema preferido.</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
             <h3 className="text-base font-semibold">Configurações do Editor</h3>
             <p className="text-sm text-muted-foreground">
                Mais configurações do editor (ex: tamanho da fonte, tamanho da tabulação, atalhos de teclado) em breve.
             </p>
          </div>

          <Separator />

           <div className="space-y-2">
             <h3 className="text-base font-semibold">Configurações de IA</h3>
             <p className="text-sm text-muted-foreground">
                Preferências de funcionalidades de IA (ex: sugestão automática, sensibilidade da detecção de bugs) em breve.
             </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

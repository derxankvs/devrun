
"use client"

import { SOCIAL_LINKS, APP_NAME } from '@/lib/constants';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export function SocialMediaLinks() {
  return (
    <div className="p-4 h-full overflow-y-auto">
      <Card className="shadow-none border-0 md:border">
        <CardHeader>
          <CardTitle>Conecte-se Conosco</CardTitle>
          <CardDescription>Siga o {APP_NAME} e seus criadores nas redes sociais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {SOCIAL_LINKS.map(link => (
            <Button
              key={link.name}
              variant="outline"
              className="w-full justify-start text-sm"
              asChild
            >
              <Link href={link.url} target="_blank" rel="noopener noreferrer">
                <link.icon className="mr-3 h-5 w-5 text-muted-foreground" />
                {link.name}
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

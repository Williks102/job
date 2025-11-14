import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                <CardTitle>Contactez-nous</CardTitle>
                <CardDescription>
                    Remplissez le formulaire ci-dessous pour toute question ou demande d'information.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input id="name" placeholder="Votre nom complet" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="Votre adresse e-mail" />
                        </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" placeholder="Le sujet de votre message" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Écrivez votre message ici..." className="min-h-[120px]" />
                    </div>
                    <Button type="submit" className="w-full">Envoyer le message</Button>
                </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { errorEmitter, type FirestorePermissionError } from '@/lib/firebase/error-handler';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { X, ServerCrash } from 'lucide-react';
import { Button } from './ui/button';

export function FirebaseErrorListener() {
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    const handleError = (e: FirestorePermissionError) => {
      console.error('Caught Firestore Permission Error:', e);
      setError(e);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  if (!error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[200] max-w-lg w-full">
      <Alert variant="destructive">
        <ServerCrash className="h-4 w-4" />
        <AlertTitle>Erreur de Permission Firestore</AlertTitle>
        <AlertDescription>
          <div className="space-y-2 mt-2 text-sm">
            <p>
              <strong>Opération :</strong>{' '}
              <span className="font-mono bg-destructive-foreground/10 px-1 py-0.5 rounded">
                {error.operation}
              </span>
            </p>
            <p>
              <strong>Chemin :</strong>{' '}
              <span className="font-mono bg-destructive-foreground/10 px-1 py-0.5 rounded">
                {error.ref.path}
              </span>
            </p>
            <p className="text-xs pt-2 text-destructive-foreground/70">{error.originalError?.message}</p>
          </div>
        </AlertDescription>
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => setError(null)}
        >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
        </Button>
      </Alert>
    </div>
  );
}

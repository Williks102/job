import { EventEmitter } from 'events';
import type {
  CollectionReference,
  DocumentReference,
  FirestoreError,
} from 'firebase/firestore';

export function isFirebaseError(error: any): error is FirestoreError {
  return error && typeof error === 'object' && 'code' in error && 'message' in error;
}

export class FirestorePermissionError extends Error {
  public readonly publicMessage: string;

  constructor(
    public readonly operation: 'read' | 'write' | 'delete',
    public readonly ref: DocumentReference | CollectionReference,
    public readonly originalError: FirestoreError
  ) {
    const message = `Firestore Permission Denied: Cannot ${operation} on ${ref.path}.`;
    super(message);
    this.name = 'FirestorePermissionError';
    this.publicMessage = "Vous n'avez pas les autorisations nécessaires pour effectuer cette action. Vérifiez les règles de sécurité Firestore.";

    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}

// Simple event emitter to decouple error handling from components
class ErrorEmitter extends EventEmitter {}
export const errorEmitter = new ErrorEmitter();

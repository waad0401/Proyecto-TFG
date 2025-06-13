import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(msg: string): void      { console.log('[LOG]', msg); }
  warn(msg: string): void     { console.warn('[WARN]', msg); }
  error(msg: string, err?: any): void { 
    console.error('[ERROR]', msg, err); 
  }
}

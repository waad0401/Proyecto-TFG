import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: string, ...optionalParams: any[]) {
    console.log(`[LOG ] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }
  warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }
  error(message: string, ...optionalParams: any[]) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...optionalParams);
  }
}

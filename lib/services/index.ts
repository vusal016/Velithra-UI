/**
 * Velithra API - Service Exports
 * Central export point for all API services
 */

// Authentication Service
export { authService } from './authService';

// Core Services
export * from './coreServices';

// HR Services
export * from './hrService';

// Module Services
export * from './moduleServices';

// SignalR Service
export { signalRService } from './signalrService';

// Legacy CRUD Service
export { CrudService } from './crudService';

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "course-tracker-f892d", appId: "1:818383863033:web:62fd223e205560b657b628", storageBucket: "course-tracker-f892d.firebasestorage.app", apiKey: "AIzaSyDbrIlmll4W3jW0GLCSNjGzkXXaWqrq6M8", authDomain: "course-tracker-f892d.firebaseapp.com", messagingSenderId: "818383863033", measurementId: "G-3FQ5NCEW0R" })), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())]
};
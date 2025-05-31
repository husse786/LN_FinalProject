// src/routes/projekte/erstellen/+page.server.js

import db from '$lib/server/db.js'; // Datenbank-Service-Objekt importieren
import { fail } from '@sveltejs/kit';   // Für das Zurückgeben von Fehlern/Validierungsfehlschlägen

export const actions = {
    /**
     * Action zum Erstellen eines neuen Projekts.
     * Wird aufgerufen, wenn das Formular mit action="?/create" abgeschickt wird.
     */
    create: async ({ request }) => {
        const formData = await request.formData();

        // Formulardaten extrahieren
        const name = formData.get('name')?.toString();
        const beschreibung = formData.get('beschreibung')?.toString();
        const status = formData.get('status')?.toString();
        const prioritaet = formData.get('prioritaet')?.toString();
        const startDatumString = formData.get('startDatum')?.toString();
        const endDatumGeplantString = formData.get('endDatumGeplant')?.toString();
        const projektIcon = formData.get('projektIcon')?.toString() || ''; // Leerer String, falls nichts ausgewählt

        // --- Validierung der Formulardaten ---
        if (!name || name.trim() === '') {
            return fail(400, {
                isError: true,
                errorMessage: 'Projektname ist ein Pflichtfeld.',
                fieldWithError: 'name',
                name, beschreibung, status, prioritaet, startDatum: startDatumString, endDatumGeplant: endDatumGeplantString, projektIcon
            });
        }

        if (!status || status.trim() === '') {
            return fail(400, {
                isError: true,
                errorMessage: 'Status ist ein Pflichtfeld.',
                fieldWithError: 'status',
                name, beschreibung, status, prioritaet, startDatum: startDatumString, endDatumGeplant: endDatumGeplantString, projektIcon
            });
        }

        // Datenobjekt für die Datenbank vorbereiten
        const projektDaten = {
            name: name.trim(),
            beschreibung: beschreibung?.trim() || null, // null speichern, wenn leer
            status,
            prioritaet,
            startDatum: startDatumString ? new Date(startDatumString) : null,
            endDatumGeplant: endDatumGeplantString ? new Date(endDatumGeplantString) : null,
            projektIcon: projektIcon || null, // null speichern, wenn kein Icon ausgewählt
            // 'erstelltAm' und 'zuletztBearbeitetAm' werden in der db.addProjekt() Funktion gesetzt
        };

        try {
            await db.addProjekt(projektDaten);
            console.log('Projekt erfolgreich durch Action in DB gespeichert.');

            // Erfolgsmeldung zurückgeben, damit +page.svelte das Pop-up anzeigen kann
            return {
                success: true,
                message: 'Projekt erfolgreich erstellt 1!'
            };

        } catch (error) {
            console.error('Fehler beim Speichern des Projekts durch Action:', error);
            // Fehler beim Datenbankzugriff
            return fail(500, { // 500 Internal Server Error
                isError: true,
                errorMessage: 'Ein interner Fehler ist beim Speichern des Projekts aufgetreten. Bitte versuchen Sie es später erneut.',
                // Bereits eingegebene Werte zurückgeben
                name,
                beschreibung,
                status,
                prioritaet,
                startDatum: startDatumString,
                endDatumGeplant: endDatumGeplantString,
                projektIcon
            });
        }
        // in +page.svelte nach dem Pop-up erfolgt.
    }
};
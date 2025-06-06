// src/routes/projekte/[projektId]/+page.server.js

import db from '$lib/server/db.js'; // Unser Datenbank-Service-Objekt
import { fail, redirect, error } from '@sveltejs/kit'; // SvelteKit's error helper für 404 etc.

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
    console.log(`Load-Funktion für Projektdetailseite aufgerufen. Projekt-ID: ${params.projektId}`);

    const projektId = params.projektId;

    if (!projektId) {
        // Dieser Fall sollte durch das Routing eigentlich nicht eintreten.
        console.error('Keine Projekt-ID in params gefunden.');
        throw error(400, { message: 'Ungültige Anfrage: Projekt-ID fehlt.' });
    }

    try {
        const projekt = await db.getProjektById(projektId);

        if (!projekt) {
            // Wenn kein Projekt mit dieser ID gefunden wurde, einen 404-Fehler auslösen.
            // SvelteKit zeigt dann die Standard-Fehlerseite oder Ihre eigene $error.svelte an.
            console.warn(`Projekt mit ID ${projektId} nicht gefunden.`);
            throw error(404, { message: 'Projekt nicht gefunden' });
        }

        // Lade die dazugehörige Aufgaben für dieses Projekt

        const aufgaben = await db.getAufgabenFuerProjekt(projektId);
        console.log(`${aufgaben.length} Aufgaben für Projekt ${projektId} geladen.`);

        // Das gefundene Projekt wird an die +page.svelte Komponente übergeben
        // und ist dort via 'data.projekt' verfügbar.
        return {
            projekt: projekt,
            aufgaben: aufgaben
        };

    } catch (err) {
        // Hier wird  sowohl Fehler von db.getProjektById als auch die geworfenen 404-Fehler abgefangen.
        // Wenn es ein SvelteKit 'error' Objekt ist (von throw error(404,...)), wird es weitergereicht.
        // Andere Fehler werden als 500er behandelt.
        if (err.status) { // Prüft, ob es ein SvelteKit 'error' Objekt ist
            throw err; // SvelteKit Fehler direkt weiterwerfen
        }
        console.error(`Unerwarteter Fehler beim Laden des Projekts ${projektId}:`, err.message);
        throw error(500, { message: `Ein interner Fehler ist aufgetreten beim Laden des Projekts: ${err.message}` });
    }
}

// In src/routes/projekte/[projektId]/+page.server.js


export const actions = {
  /**
   * Action zum Löschen eines Projekts.
   * Zugehörige Aufgaben werden NICHT mitgelöscht (Option A).
   * Wird aufgerufen, wenn ein Formular mit action="?/delete" abgeschickt wird.
   */
  delete: async ({ params }) => {
    const projektId = params.projektId;
    console.log(`Delete-Action für Projekt-ID ${projektId} aufgerufen (Option A).`);

    if (!projektId) {
      return fail(400, { message: 'Projekt-ID zum Löschen fehlt.' });
    }

    try {
      const deleteResult = await db.deleteProjekt(projektId); // Ruft Ihre bestehende Funktion auf

      if (deleteResult.deletedCount === 0) {
        // Dies könnte bedeuten, dass das Projekt bereits von jemand anderem gelöscht wurde
        // oder die ID ungültig war und die DB-Funktion dies so signalisiert.
        return fail(404, { message: 'Projekt zum Löschen nicht gefunden.' });
      }

      console.log(`Projekt ${projektId} erfolgreich gelöscht.`);

    } catch (error) {
      console.error(`Fehler in Delete-Action für Projekt ${projektId}:`, error);
      return fail(500, { message: error.message || 'Fehler beim Löschen des Projekts.' });
    }

    // Nach erfolgreichem Löschen zur Projektübersicht weiterleiten.
    throw redirect(303, '/projekte');
  },

   // ACTION: deleteAufgabe

  deleteAufgabe: async ({ request, params }) => {
    const formData = await request.formData();
    const aufgabenId = formData.get('aufgabenId')?.toString();
    const projektId = params.projektId; // Die ID des aktuellen Projekts aus der URL

    console.log(`Action deleteAufgabe aufgerufen für Aufgabe ${aufgabenId} in Projekt ${projektId}`);

    if (!aufgabenId) {
      return fail(400, { deleteAufgabeError: true, message: 'Aufgaben-ID zum Löschen fehlt.' });
    }

    try {
      const result = await db.deleteAufgabe(aufgabenId);

      if (result.deletedCount === 0) {
        return fail(404, { deleteAufgabeError: true, message: 'Aufgabe zum Löschen nicht gefunden.' });
      }

      console.log(`Aufgabe ${aufgabenId} erfolgreich gelöscht.`);
      // Kein Pop-up hier, da die Seite direkt neu geladen wird durch den Redirect.

    } catch (error) {
      console.error(`Fehler beim Löschen der Aufgabe ${aufgabenId}:`, error);
      return fail(500, { deleteAufgabeError: true, message: error.message || 'Fehler beim Löschen der Aufgabe.' });
    }
    // weiterleiten, damit die Aufgabenliste aktualisiert wird.
    // SvelteKit wird die load-Funktion der Seite erneut ausführen.
    throw redirect(303, `/projekte/${projektId}`);
  }

}
// src/routes/+page.server.js
import db from '$lib/server/db.js'; // Importiert das default exportierte Objekt ( dbExportObjekt)

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  console.log('Load-Funktion auf /+page.server.js aufgerufen');

  try {
    const alleProjekte = await db.getAlleProjekte(); // Aufruf als Methode des 'db'-Objekts

    return {
      projekte: alleProjekte
    };
  } catch (error) {
    console.error('Fehler beim Laden der Projekte in +page.server.js:', error.message);
    return {
      projekte: [], // Wichtig: Immer noch die erwartete Datenstruktur zurückgeben
      error: { message: error.message || 'Ein Fehler ist aufgetreten.' } // Serialisierbares Fehlerobjekt
    };
  }
}
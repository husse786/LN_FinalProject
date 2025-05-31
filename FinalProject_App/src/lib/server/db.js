import { MongoClient, ObjectId } from 'mongodb';
import { DB_URI } from '$env/static/private'; // Importiert Connectionstring

// Erstellen neue MongoClient-Instanz mit der Connectionstring
const client = new MongoClient(DB_URI);

let dbInstance; // Umbenannt von 'db' zu 'dbInstance', um Verwechslung mit dem exportierten 'db'-Objekt zu vermeiden (optional, aber klarer)

// Asynchrone Funktion, um die Verbindung herzustellen und die Datenbank auszuwählen
async function connectToDatabase() {
    if (dbInstance) { // Prüft dbInstance
        return dbInstance; // Wenn bereits verbunden, die bestehende Instanz zurückgeben
    }
    try {
        await client.connect(); // Verbindung zum MongoDB-Server herstellen
        console.log('Erfolgreich mit MongoDB verbunden!');
        dbInstance = client.db('projektTrackerDB'); // Datenbank auswählen und dbInstance zuweisen
        return dbInstance;
    } catch (error) {
        console.error('Fehler beim Verbinden mit MongoDB:', error);
        throw error; // Fehler weiterwerfen, um ihn an anderer Stelle behandeln zu können
    }
}

// Exportieren einer Funktion, die die verbundene Datenbankinstanz zurückgibt
// So stellen wird sichergestellt, dass andere Module die Verbindung nutzen können,
// ohne sie selbst herstellen zu müssen.
// Diese Funktion ist optional, wenn alle DB-Operationen über das 'db'-Objekt unten exportiert werden.
// Wenn wir sie behalten, ist der 'export' hier korrekt für einen Named Export.
export async function getDB() {
    if (!dbInstance) { // Prüft dbInstance
        await connectToDatabase();
    }
    return dbInstance;
}


//Getting the projects
/**
 * Ruft alle Projekte aus der Datenbank ab.
 * @returns {Promise<Array>} Ein Promise, das ein Array mit allen Projektdokumenten zurückgibt.
 */
// KORREKTUR: 'export' hier entfernen, da die Funktion über das 'db'-Objekt unten exportiert wird
async function getAlleProjekte() {
    try {
        // Konsistenter wäre es, hier auch connectToDatabase() zu verwenden,
        // oder wenn getDB() die bevorzugte Methode ist, diese beizubehalten.
        // Aktuell verwenden Sie getDB(), was connectToDatabase() intern aufruft. Das ist OK.
        const datenbank = await getDB();
        const projekte = await datenbank.collection('projekte').find({}).toArray();
        // Da MongoDB _id ist ein ObjectId, für SvelteKit wandeln wir es in einen String um.
        return projekte.map(projekt => ({
            ...projekt,
            _id: projekt._id.toString() // Konvertiert ObjectId zu String
        }));
    } catch (error) {
        console.error('Fehler beim Abrufen aller Projekte:', error);
        throw new Error('Konnte Projekte nicht aus der Datenbank laden.');
    }
}

/**
 * Fügt ein neues Projekt zur Datenbank hinzu.
 * @param {object} projektDaten - Ein Objekt, das die Daten des neuen Projekts enthält
 * (entsprechend unserem Datenmodell für Projekt).
 * @returns {Promise<import('mongodb').InsertOneResult>} Ein Promise, das das Ergebnis der Einfügeoperation zurückgibt.
 */
async function addProjekt(projektDaten) {
    try {
        const datenbank = await connectToDatabase(); // Stellt die Verbindung sicher (oder getDB() verwenden für Konsistenz)

        const neuesProjekt = {
            ...projektDaten,
            erstelltAm: new Date(),
            zuletztBearbeitetAm: new Date()
        };

        const result = await datenbank.collection('projekte').insertOne(neuesProjekt);
        console.log(`Neues Projekt erfolgreich hinzugefügt mit ID: ${result.insertedId}`);
        return result;
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Projekts:', error);
        throw new Error('Konnte neues Projekt nicht in der Datenbank speichern.');
    }
}
/**
 * Ruft ein einzelnes Projekt anhand seiner ID aus der Datenbank ab.
 * @param {string} id - Die ID des gesuchten Projekts (als String).
 * @returns {Promise<object|null>} 
 */
async function getProjektById(id) {
  if (!id) {
    console.warn('getProjektById aufgerufen ohne ID.');
    return null;
  }
  try {
    const datenbank = await connectToDatabase();
    // Die String-ID muss in ein MongoDB ObjectId-Objekt umgewandelt werden für die Abfrage.
    const projekt = await datenbank.collection('projekte').findOne({ _id: new ObjectId(id) });

    if (projekt) {
      // Konvertiere _id zu String für einfachere Handhabung in SvelteKit
      return {
        ...projekt,
        _id: projekt._id.toString()
      };
    } else {
      console.warn(`Kein Projekt gefunden mit ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Fehler beim Abrufen des Projekts mit ID ${id}:`, error);
    // Fehler Log and Null
    // Ein 'throw new Error(...)' würde in der load-Funktion den error-Prop setzen.
    throw new Error(`Konnte Projekt mit ID ${id} nicht aus der Datenbank laden.`);
  }
}

/**
 * Aktualisiert ein bestehendes Projekt in der Datenbank.
 * @param {string} id - Die ID des zu aktualisierenden Projekts (als String).
 * @param {object} projektUpdateDaten - Ein Objekt mit den Feldern, die aktualisiert werden sollen.
 * @returns {Promise<import('mongodb').UpdateResult>} Ein Promise, das das Ergebnis der Update-Operation zurückgibt.
 */
async function updateProjekt(id, projektUpdateDaten) {
  if (!id) {
    console.warn('updateProjekt aufgerufen ohne ID.');
    throw new Error('Projekt-ID für Update fehlt.');
  }
  try {
    const datenbank = await connectToDatabase();

    // Das 'zuletztBearbeitetAm'-Datum setzen/aktualisieren
    const datenMitTimestamp = {
      ...projektUpdateDaten,
      zuletztBearbeitetAm: new Date()
    };

    // Felder, die nicht aktualisiert werden sollen (z.B. erstelltAm), sollten nicht in projektUpdateDaten sein

    const result = await datenbank.collection('projekte').updateOne(
      { _id: new ObjectId(id) },      // Filter: Welches Dokument soll aktualisiert werden?
      { $set: datenMitTimestamp }
    );

    if (result.matchedCount === 0) {
      console.warn(`Kein Projekt mit ID ${id} für Update gefunden.`);
      // Entweder null zurückgeben oder einen Fehler werfen, den die Action behandeln kann
      throw new Error(`Projekt mit ID ${id} nicht gefunden für Update.`);
    }

    console.log(`Projekt mit ID ${id} erfolgreich aktualisiert. Modifizierte Dokumente: ${result.modifiedCount}`);
    return result;
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Projekts mit ID ${id}:`, error);
    // Den ursprünglichen Fehler weiterwerfen oder einen spezifischeren Fehler erstellen
    if (error.message.startsWith('Projekt mit ID')) throw error; // Eigenen Fehler weiterleiten
    throw new Error(`Konnte Projekt mit ID ${id} nicht in der Datenbank aktualisieren.`);
  }
}


// Objekt, das alle unsere Datenzugriffsfunktionen bündelt
const dbExportObjekt = {
    getAlleProjekte: getAlleProjekte,
    addProjekt: addProjekt,
    getProjektById: getProjektById,
    updateProjekt: updateProjekt,
};

export default dbExportObjekt; // Default Export dieses Objekts
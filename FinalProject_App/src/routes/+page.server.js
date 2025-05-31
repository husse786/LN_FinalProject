export async function load() {
    // Diese Seite benötigt aktuell keine serverseitig geladenen Daten.
    // Ein leeres Objekt wird standardmässig von SvelteKit bereitgestellt,
    // wenn keine load-Funktion existiert oder nichts zurückgibt.
    console.log('Load-Funktion für Willkommensseite (/) aufgerufen.');
    return {};
}
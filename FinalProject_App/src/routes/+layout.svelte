<script>
    //@runes // Um den Runes-Modus explizit für diese Datei zu deklarieren

    // Import Ihrer Navigationsleiste.svelte Komponente
    import Navigationsleiste from "$lib/components/Navigationsleiste.svelte";
    // Import Ihrer globalen Stile
    import "../app.css"; // Stellt sicher, dass app.css geladen wird

    // Den 'children'-Prop (den Inhalt der aktuellen Seite) über $props() im Runes-Mode erhalten.
    // $props() ist eine Rune und muss nicht importiert werden.
    let { children } = $props();
</script>

<Navigationsleiste />

<main class="container mt-3">
    {@render children()}
</main>

<footer class="text-center mt-5 mb-3">
    <p>&copy; {new Date().getFullYear()} Mein ProjektTracker</p>
</footer>

<style>
    main {
        min-height: 70vh; /* Stellt sicher, dass der Footer bei wenig Inhalt unten bleibt */
        /* WICHTIG: Platz für die fixed-top Navbar schaffen.
           Passen Sie diesen Wert ggf. an die tatsächliche Höhe Ihrer Navigationsleiste an.
           Der Wert von 80px ist eine Schätzung. */
        padding-top: 80px; 
    }

    /* Sie können hier weitere globale Styles für das Layout definieren, falls nötig */
</style>
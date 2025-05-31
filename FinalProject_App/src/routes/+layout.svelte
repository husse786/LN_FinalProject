<script>
    // Import Ihrer Navigationsleiste.svelte Komponente
    import Navigationsleiste from "$lib/components/Navigationsleiste.svelte";
    // Import Ihrer globalen Stile
    import "../app.css";

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
    /* Globale Layout-Stylings, falls spezifisch für dieses Layout benötigt */
    main {
        min-height: 70vh; /* Stellt sicher, dass der Footer nach unten gedrückt wird */
    }
</style>
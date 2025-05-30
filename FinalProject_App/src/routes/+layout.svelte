<script>
    // Hier könnten später globale Skripte oder Importe für die Navigation stehen
    // z.B. Import Navigationsleiste.svelte Komponente
    import Navigationsleiste from "$lib/components/Navigationsleiste.svelte";
    import "../app.css"; // Globale Stile importieren (falls Sie app.css verwenden)
</script>

<Navigationsleiste />

<main class="container mt-3">
    <slot />
</main>

<footer class="text-center mt-5 mb-3">
    <p>&copy; {new Date().getFullYear()} Mein ProjektTracker</p>
</footer>
ƒ

<style>
    /* Globale Layout-Stylings */
    main {
        min-height: 70vh; /*Footer nach unten zu drücken */
    }
</style>

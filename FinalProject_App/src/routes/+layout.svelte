<script>

    // Import Ihrer Navigationsleiste.svelte Komponente
    import Navigationsleiste from "$lib/components/Navigationsleiste.svelte";
    // Import Ihrer globalen Stile
    import "../app.css"; // Stellt sicher, dass app.css geladen wird

    // Den 'children'-Prop (den Inhalt der aktuellen Seite) erhalten.
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
           Höhe Ihrer Navigationsleiste . */
        padding-top: 80px; 
    }
</style>
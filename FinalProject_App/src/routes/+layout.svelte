<script>
    //@runes
    import Navigationsleiste from "$lib/components/Navigationsleiste.svelte";
    import "../app.css";
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
            min-height: 100vh;
            padding-top: 80px; 
        }
    </style>
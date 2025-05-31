<script>

    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';

    // Props von SvelteKit (data von load, form von actions) über die $props() Rune empfangen.
    // Falls 'data' oder 'form' initial nicht vorhanden sein sollten,
    // würden sie 'undefined' sein. Das optionale Chaining (form?.success) im $effect fängt das ab.
    let { data, form } = $props();

    // Formularzustand mit Svelte 5 Runes ($state)
    let projektName = $state('');
    let projektBeschreibung = $state('');
    let projektStatus = $state('Planung'); // Standardwert
    let projektPrioritaet = $state('Mittel'); // Standardwert
    let projektStartDatum = $state('');
    let projektEndDatumGeplant = $state('');
    let projektIcon = $state('');

    const verfuegbareIcons = [
        { value: "work.png", label: "Arbeit", path: "/images/projekt-icons/work.png" },
        { value: "ideas.png", label: "Idee", path: "/images/projekt-icons/ideas.png" },
        { value: "private.png", label: "Privat", path: "/images/projekt-icons/private.png" },
        { value: "school.png", label: "Studium", path: "/images/projekt-icons/school.png" }
        // Fügen Sie hier weitere Icons hinzu, die Sie erstellt haben
    ];

    function handleCancel() {
        goto('/projekte');
    }

    // $effect wird ausgeführt, wenn sich 'form' (die via $props() erhaltene Prop) ändert
    $effect(() => {
        if (form?.success) { // Optionales Chaining für form
            alert(form.message || 'Projekt erfolgreich erstellt!');
            goto('/projekte', { replaceState: true });
        } else if (form?.isError) { // Optionales Chaining für form
            // Formularfelder bei Fehler mit den zurückgegebenen Werten neu befüllen
            if (form.name !== undefined) projektName = form.name;
            if (form.beschreibung !== undefined) projektBeschreibung = form.beschreibung;
            if (form.status !== undefined) projektStatus = form.status;
            if (form.prioritaet !== undefined) projektPrioritaet = form.prioritaet;
            if (form.startDatum !== undefined) projektStartDatum = form.startDatum || '';
            if (form.endDatumGeplant !== undefined) projektEndDatumGeplant = form.endDatumGeplant || '';
            if (form.projektIcon !== undefined) projektIcon = form.projektIcon || '';
        }
    });
</script>

<svelte:head>
    <title>Neues Projekt erstellen</title>
</svelte:head>

<div class="container mt-4 mb-5">
    <h1>Neues Projekt erstellen</h1>

    {#if form?.isError} <div class="alert alert-danger" role="alert">
            <strong>Fehler:</strong> {form.errorMessage || 'Ein unbekannter Fehler ist aufgetreten.'}
            {#if form.fieldWithError}
                <p class="mb-0">Bitte überprüfen Sie das Feld: {form.fieldWithError}</p>
            {/if}
        </div>
    {/if}

    <form method="POST" action="?/create" use:enhance>
        <div class="mb-3">
            <label for="name" class="form-label">Projektname <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="name" name="name" bind:value={projektName} required />
        </div>

        <div class="mb-3">
            <label for="beschreibung" class="form-label">Beschreibung</label>
            <textarea class="form-control" id="beschreibung" name="beschreibung" rows="3" bind:value={projektBeschreibung}></textarea>
        </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="status" class="form-label">Status <span class="text-danger">*</span></label>
                <select class="form-select" id="status" name="status" bind:value={projektStatus} required>
                    <option value="Planung">Planung</option>
                    <option value="In Arbeit">In Arbeit</option>
                    <option value="Angehalten">Angehalten</option>
                    <option value="Abgeschlossen">Abgeschlossen</option>
                    <option value="Abgebrochen">Abgebrochen</option>
                </select>
            </div>
            <div class="col-md-6 mb-3">
                <label for="prioritaet" class="form-label">Priorität</label>
                <select class="form-select" id="prioritaet" name="prioritaet" bind:value={projektPrioritaet}>
                    <option value="Hoch">Hoch</option>
                    <option value="Mittel">Mittel</option>
                    <option value="Niedrig">Niedrig</option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 mb-3">
                <label for="startDatum" class="form-label">Startdatum</label>
                <input type="date" class="form-control" id="startDatum" name="startDatum" bind:value={projektStartDatum} />
            </div>
            <div class="col-md-6 mb-3">
                <label for="endDatumGeplant" class="form-label">Geplantes Enddatum</label>
                <input type="date" class="form-control" id="endDatumGeplant" name="endDatumGeplant" bind:value={projektEndDatumGeplant} />
            </div>
        </div>

        <fieldset class="mb-3">
            <legend class="form-label">Projekt-Icon auswählen (optional)</legend>
            <div class="d-flex flex-wrap align-items-center">
                {#each verfuegbareIcons as icon (icon.value)}
                    <div class="form-check me-3 mb-2">
                        <input class="form-check-input" type="radio" name="projektIcon" id="icon-{icon.value}" value={icon.value} bind:group={projektIcon} />
                        <label class="form-check-label d-flex flex-column align-items-center" for="icon-{icon.value}" style="cursor: pointer;">
                            <img src={icon.path} alt={icon.label} title={icon.label} style="width: 50px; height: 50px; object-fit: contain; border: 2px solid transparent; border-radius: 4px; margin-bottom: 0.25rem;" class:selected={projektIcon === icon.value} />
                            <span style="font-size: 0.8rem;">{icon.label}</span>
                        </label>
                    </div>
                {/each}
                {#if projektIcon}
                    <button type="button" class="btn btn-sm btn-outline-secondary ms-2" style="height: fit-content;" onclick={() => projektIcon = ''}>Auswahl aufheben</button>
                {/if}
            </div>
        </fieldset>

        <hr />
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-secondary me-2" onclick={handleCancel}>Abbrechen</button>
            <button type="submit" class="btn btn-primary">Projekt erstellen</button>
        </div>
    </form>
</div>

<style>
  .form-check-label img.selected {
    border-color: var(--bs-primary);
    box-shadow: 0 0 8px var(--bs-primary);
  }
</style>
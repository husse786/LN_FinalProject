<script>

    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';

    // Props von SvelteKit (data von load, form von actions)
    let { data, form } = $props();


    // Formularzustand mit Svelte 5 Runes ($state)
    // Initialwerte werden später im $effect aus data.projekt gesetzt.
    let projektName = $state('');
    let projektBeschreibung = $state('');
    let projektStatus = $state('Planung');
    let projektPrioritaet = $state('Mittel');
    let projektStartDatum = $state('');
    let projektEndDatumGeplant = $state('');
    let projektIcon = $state('');

    // Original Projekt-ID, falls wir sie für die Weiterleitung oder anderes benötigen.
    // data.projekt._id wird im $effect gesetzt, wenn data.projekt verfügbar ist.
    let aktuelleProjektId = $state(data?.projekt?._id); 

    // Verfügbare Icons (identisch zur Erstellen-Seite)
    const verfuegbareIcons = [
        { value: "work.png", label: "Arbeit", path: "/images/projekt-icons/work.png" },
        { value: "ideas.png", label: "Idee", path: "/images/projekt-icons/ideas.png" },
        { value: "private.png", label: "Privat", path: "/images/projekt-icons/private.png" },
        { value: "school.png", label: "Studium", path: "/images/projekt-icons/school.png" }
    ];

    // $effect zum Initialisieren und Aktualisieren der Formularfelder aus data.projekt
    $effect(() => {
        if (data?.projekt) {
            aktuelleProjektId = data.projekt._id; // ID speichern
            projektName = data.projekt.name || '';
            projektBeschreibung = data.projekt.beschreibung || '';
            projektStatus = data.projekt.status || 'Planung';
            projektPrioritaet = data.projekt.prioritaet || 'Mittel';
            // Für <input type="date"> wird "YYYY-MM-DD" Format benötigt oder leerer String
            projektStartDatum = data.projekt.startDatum 
                ? new Date(data.projekt.startDatum).toISOString().split('T')[0] 
                : '';
            projektEndDatumGeplant = data.projekt.endDatumGeplant 
                ? new Date(data.projekt.endDatumGeplant).toISOString().split('T')[0] 
                : '';
            projektIcon = data.projekt.projektIcon || '';
        }
    });

    // $effect für die Reaktion auf das Ergebnis der Formular-Action
    $effect(() => {
        if (form?.success) {
            alert(form.message || 'Projekt erfolgreich aktualisiert!');
            // Leite zur Detailseite des aktualisierten Projekts weiter
            goto(`/projekte/${form.updatedProjektId || aktuelleProjektId}`, { replaceState: true, invalidateAll: true });
            // invalidateAll sorgt dafür, dass die load-Funktion der Detailseite neu ausgeführt wird
        } else if (form?.isError && form.name !== undefined) {
            // Formularfelder bei Validierungsfehler mit den (vom Server zurückgegebenen) Werten neu befüllen
            // Dies ist nützlich, falls der Benutzer etwas korrigieren muss.
            projektName = form.name;
            projektBeschreibung = form.beschreibung || '';
            projektStatus = form.status;
            projektPrioritaet = form.prioritaet;
            projektStartDatum = form.startDatum || '';
            projektEndDatumGeplant = form.endDatumGeplant || '';
            projektIcon = form.projektIcon || '';
        }
    });

    function handleCancel() {
        // Zurück zur Detailseite des aktuellen Projekts oder zur Übersicht, falls keine ID vorhanden
        if (aktuelleProjektId) {
            goto(`/projekte/${aktuelleProjektId}`);
        } else {
            goto('/projekte');
        }
    }
</script>

<svelte:head>
    <title>Projekt bearbeiten: {projektName || '...'}</title>
</svelte:head>

<div class="container mt-4 mb-5">
    <h1>Projekt bearbeiten</h1>
    <h2 class="text-muted fs-5 mb-3">{projektName || 'Wird geladen...'}</h2>

    {#if form?.isError && form.errorMessage}
        <div class="alert alert-danger" role="alert">
            <strong>Fehler:</strong> {form.errorMessage}
            {#if form.fieldWithError}
                <p class="mb-0">Bitte überprüfen Sie das Feld: {form.fieldWithError}</p>
            {/if}
        </div>
    {/if}

    {#if data?.projekt} <form method="POST" action="?/update" use:enhance>
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

            <div class="mb-3">
                <label class="form-label">Projekt-Icon auswählen (optional)</label>
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
            </div>

            <hr />
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-secondary me-2" onclick={handleCancel}>Abbrechen</button>
                <button type="submit" class="btn btn-primary">Änderungen speichern</button>
            </div>
        </form>
    {:else if data?.error}
        <div class="alert alert-warning" role="alert">
            Das zu bearbeitende Projekt konnte nicht geladen werden: {data.error.message}
        </div>
    {:else}
        <div class="alert alert-info">Lade Projektdaten zum Bearbeiten...</div>
    {/if}
</div>

<style>
  .form-check-label img.selected {
    border-color: var(--bs-primary);
    box-shadow: 0 0 8px var(--bs-primary);
  }
</style>
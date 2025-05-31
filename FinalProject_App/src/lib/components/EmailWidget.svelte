<script>
    let { title = "E-Mail Eingang" } = $props(); // Titel als Prop, mit Standardwert

    // Beispiel-Emaildaten (statisch)
    const emails = [
        { id: 1, sender: 'Max Mustermann', subject: 'Wichtige Ankündigung zum Projekt X', preview: 'Bitte beachten Sie die neuen Deadlines...', unread: true },
        { id: 2, sender: 'Universität Info', subject: 'Erinnerung: Kursanmeldung endet bald', preview: 'Vergessen Sie nicht, sich für Ihre Kurse anzumelden...', unread: true },
        { id: 3, sender: 'Svelte Newsletter', subject: 'Neuigkeiten zu Svelte 5 und Runes', preview: 'Entdecken Sie die neuesten Features und Verbesserungen...', unread: false },
        { id: 4, sender: 'Team-Meeting', subject: 'Protokoll vom Meeting am 30.05.', preview: 'Anbei finden Sie das Protokoll unseres letzten Meetings...', unread: false }
    ];

    // Filtern, um nur relevante E-Mails anzuzeigen. nur Beispiel
    let angezeigteEmails = $state(emails);
    if (title === 'Email Studium') {
        angezeigteEmails = emails.filter(e => e.sender.includes('Universität') || e.subject.includes('Kurs'));
    } else if (title === 'Email') {
        angezeigteEmails = emails.filter(e => !e.sender.includes('Universität') && !e.subject.includes('Kurs'));
    }
</script>

<div class="card h-100 shadow-sm">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 class="mb-0">{title}</h5>
        <span class="badge bg-danger rounded-pill">
            {angezeigteEmails.filter(e => e.unread).length} Ungelesen
        </span>
    </div>
    <div class="card-body p-0" style="overflow-y: auto; max-height: 300px;"> <!-- * Scrollbar bei Bedarf -->
        {#if angezeigteEmails.length > 0}
            <ul class="list-group list-group-flush">
                {#each angezeigteEmails as email (email.id)}
                    <li class="list-group-item list-group-item-action" style="cursor: pointer;">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1 {email.unread ? 'fw-bold' : ''}">{email.sender}</h6>
                            <small class="text-muted">{email.unread ? 'Neu' : 'Gelesen'}</small>
                        </div>
                        <p class="mb-1 {email.unread ? 'fw-bold' : ''}">{email.subject}</p>
                        <small class="text-muted">{email.preview}</small>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="text-center text-muted p-3">Keine E-Mails anzuzeigen.</p>
        {/if}
    </div>
    <div class="card-footer bg-light text-center">
        <a href="/" class="btn btn-sm btn-outline-secondary disabled" aria-disabled="true">Alle E-Mails anzeigen (simuliert)</a>
    </div>
</div>

<style>
    .card-header h5 {
        font-weight: 500;
    }
    .list-group-item-action:hover {
        background-color: #f8f9fa; /* Leichter Hover-Effekt */
    }
    .fw-bold { /* Bootstrap 5 standardmässig, aber zur Sicherheit */
        font-weight: bold !important;
    }
</style>
export default [
    { heading: 'Gestionale' },
    {
        title: 'Dashboard',
        icon: { icon: 'bx-home' },
        to: 'private',
    },
    {
        title: 'Analisi',
        icon: { icon: 'bx-bar-chart' },
        to: 'private',
    },
    {
        title: 'Logistica',
        icon: { icon: 'bx-globe' },
        to: 'private',
    },
    {
        title: 'Clienti',
        icon: { icon: 'bx-user' },
        to: 'private',
    },
    {
        title: 'Fornitori',
        icon: { icon: 'bx-store' },
        to: 'private',
    },
    {
        title: 'Prodotti',
        icon: { icon: 'bx-box' },
        to: 'private',
    },
    {
        title: 'Reclutamento',
        icon: { icon: 'bx-user-plus' },
        to: 'private',
    },
    {
        title: 'Calendario',
        icon: { icon: 'bx-calendar' },
        to: 'private',
    },
    {
        title: 'Fatture',
        icon: { icon: 'bx-receipt' },
        to: 'private',
    },
    {
        title: 'Chat',
        icon: { icon: 'bx-chat' },
        to: 'private',
    },
    {
        title: 'Dipendenti',
        icon: { icon: 'bx-group' },
        to: 'admin-dipendenti',
        children: [
            { title: 'Lista', to: 'admin-dipendenti' },
        ],
    },
    {
        title: 'Admin',
        icon: { icon: 'bx-user' },
        to: 'private',
    },
    {
        title: 'Documenti',
        icon: { icon: 'bx-file' },
        to: 'private',
    },
    {
        title: 'Impostazioni',
        icon: { icon: 'bx-cog' },
        to: 'private',
    },
]

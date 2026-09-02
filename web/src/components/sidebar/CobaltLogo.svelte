<script>
    import IconCobalt from "$components/icons/Cobalt.svelte";
</script>

<div id="cobalt-logo">
    <div class="logo-wrapper">
        <IconCobalt />
        <span class="plus-badge">++</span>
    </div>
</div>

<style>
    #cobalt-logo {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: calc(var(--sidebar-tab-padding) * 2);

        /* accommodate space for scaling animation */
        padding-bottom: calc(var(--sidebar-tab-padding) * 2 - var(--sidebar-inner-padding));
    }

    .logo-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .plus-badge {
        position: absolute;
        top: -6px;
        right: -14px;
        font-size: 11px;
        font-weight: 800;
        font-family: inherit;
        color: var(--accent-primary);
        text-shadow: 0 0 8px var(--accent-glow);
        letter-spacing: -1px;
    }

    #cobalt-logo :global(path) {
        fill: var(--sidebar-highlight);
    }

    @media screen and (max-width: 535px) {
        #cobalt-logo {
            display: none;
        }
    }
</style>

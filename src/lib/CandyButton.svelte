<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  export let children: Snippet = () => 'Candy Button';
  export let className: string = '';
  export let href: string = '';

  // Forward all other props using $$restProps (Svelte 4) or use rest spread
  // In Svelte 5, we can just use the rest operator
  const restProps = $$restProps;
</script>

{#if href}
  <a
    href={href}
    target="_blank"
    rel="noopener"
    class="candy-button {className}"
    {...$$restProps}
  >
    {@render children()}
  </a>
{:else}
  <button
    class="candy-button {className}"
    {...$$restProps}
  >
    {@render children()}
  </button>
{/if}

<style>
  .candy-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    line-height: 22px;
    letter-spacing: 0.02em;
    padding: 0.75rem 2.25rem; /* py-3 px-9 */
    border-radius: 0.75rem; /* rounded-xl */
    cursor: pointer;
    transition: all 200ms ease-out;
    border: 1px solid #54A1FD;
    background: radial-gradient(95% 60% at 50% 75%, #005FD6 0%, #209BFF 100%);
    box-shadow: 0px 4px 48px -12px #1187FF, inset 0px 1px 8px -4px #FFFFFF;
  }

  .candy-button:active {
    transform: scale(0.95) rotate(1deg);
  }

  .candy-button::after {
    content: '';
    position: absolute;
    top: 1px;
    right: 10%;
    width: 60%;
    height: 1px;
    background: linear-gradient(to right, transparent, white/50%, transparent);
  }

  .candy-button:hover {
    filter: brightness(1.1);
  }

  .candy-button:focus-visible {
    outline: 2px solid #54A1FD;
    outline-offset: 2px;
  }
</style>
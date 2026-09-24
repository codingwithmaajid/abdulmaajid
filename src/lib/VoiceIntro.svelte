<script>
  import { onMount } from 'svelte';
  let played = false;
  let audio;

  onMount(() => {
    audio = new Audio('/intro.mp3');
    const trigger = () => {
      if (played) return;
      played = true;
      audio.play().catch(() => {});
      window.removeEventListener('click', trigger);
      window.removeEventListener('scroll', trigger);
    };
    window.addEventListener('click', trigger, { once: true });
    window.addEventListener('scroll', trigger, { once: true });
  });
</script>
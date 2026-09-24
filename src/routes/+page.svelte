<script>
  import Neko from '$lib/Neko.svelte';

  const CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons';

  const links = {
    github: 'https://github.com/codingwithmaajid',
    linkedin: 'https://linkedin.com/in/codingwithmaajid',
    techStack: '/tech-stack',
  };

  const stack = [
    { name: 'Python',  slug: 'python'    },
    { name: 'Rust',    slug: 'rust'      },
    { name: 'C++',     slug: 'cplusplus' },
    { name: 'C',       slug: 'c'         },
    { name: 'Linux',   slug: 'linux'     },
    { name: 'Docker',  slug: 'docker'    },
    { name: 'Git',     slug: 'git'       },
    { name: 'GitHub',  slug: 'github'    },
  ];
</script>

<svelte:head>
  <title>Abdul Maajid</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400&display=swap" rel="stylesheet" />
</svelte:head>

<main class="page">
  <section class="content">
    <h1>Abdul Maajid</h1>

    <div class="body">
      <p>
        I am a CS student from Chennai, somewhere between coursework and the real thing.
      </p>
      <p>
        Most of what I know did not come from a classroom. It came from showing up to
        meetups, staying late at hackathons, reading other people's code at midnight,
        and slowly figuring out how systems actually hold together.
      </p>
      <p>
        I am drawn to agents, developer tooling, and the kind of problems that only make
        sense after you have sat with them for a while. I build things to understand
        them — and then I build them again when I realise I was wrong the first time.
      </p>
      <p>
        This page will grow. For now, everything I have made is on
        <a href={links.github}>GitHub</a> and I am on
        <a href={links.linkedin}>LinkedIn</a>.
      </p>
    </div>

    <div class="stack-section">
      <span class="stack-label">Stack</span>
      <div class="stack-items">
        {#each stack as item}
          <div class="stack-item" title={item.name}>
            <img
              src="{CDN}/{item.slug}.svg"
              alt={item.name}
              width="18"
              height="18"
              loading="lazy"
            />
          </div>
        {/each}
        <a href={links.techStack} class="stack-more">all →</a>
      </div>
    </div>
  </section>

  <Neko />
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    background: #080808;
    overflow-x: hidden;
  }

  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .content {
    width: 100%;
    max-width: 680px;
  }

  main,
  .content {
    position: relative;
    z-index: 1;
    font-family: 'Inter', sans-serif;
  }

  h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.6rem, 8vw, 4rem);
    font-weight: 400;
    color: #f0ede8;
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 2.8rem;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  p {
    font-size: 1.0625rem;
    line-height: 1.85;
    color: #c8c4bb;
    max-width: 58ch;
    margin: 0;
  }

  a {
    color: #c9b99a;
    text-decoration: none;
    border-bottom: 1px solid #4a3f30;
    transition: color 0.15s, border-color 0.15s;
  }

  a:hover {
    color: #e8d4b8;
    border-bottom-color: #9a8060;
  }

  .stack-section {
    margin-top: 3rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stack-label {
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #4a4640;
    white-space: nowrap;
  }

  .stack-items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .stack-item img {
    display: block;
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(0.45);
    transition: filter 0.15s;
  }

  .stack-item:hover img {
    filter: brightness(0) invert(0.8);
  }

  .stack-more {
    font-size: 0.8125rem;
    color: #4a4640;
    border-bottom: none;
    letter-spacing: 0.02em;
    transition: color 0.15s;
  }

  .stack-more:hover {
    color: #c9b99a;
    border-bottom: none;
  }

  @media (max-width: 760px) {
    .page {
      padding: 1.5rem 1rem 2.5rem;
    }

    .content {
      width: 100%;
    }
  }
</style>

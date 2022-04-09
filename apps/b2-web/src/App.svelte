<script lang="ts">
  import "./global.css";
  import Output from "./lib/Output.svelte";
  import ThemeTitle from "./lib/ThemeTitle.svelte";
  import { selectedPairStore } from "./stores/pair.store";
  import { DEPTHS } from "./utils";

  const DEV_PORT = import.meta.env.VITE_SERVICE_PORT
    ? import.meta.env.VITE_SERVICE_PORT
    : 3600;

  export const apiUrl =
    import.meta.env.MODE === "production"
      ? "https://api.e8y.fun/b2"
      : `http://localhost:${DEV_PORT}`;

  let pairs;
  let loading;

  function submit(e: any) {
    const formData = new FormData(document.querySelector("form"));
    const data = {};
    for (let field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    e.preventDefault();
    getColours(data.theme);
  }

  async function getColours(theme: string) {
    loading = true;
    const res = await fetch(`${apiUrl}?url=${theme}`);
    const data = await res.json();
    loading = false;
    pairs = data;
  }
</script>

<header>
  <h1>b2</h1>
</header>
<main>
  <section>
    <p>
      Get the best bracket colour pair suggestions for your current theme 🎨
    </p>
    <ol>
      <li>
        Find your theme on <a href="https://vscodethemes.com">vscodethemes</a> and
        "view extension"
      </li>
      <li>Copy the entire url</li>
      <li>Paste it below!</li>
    </ol>
    <form on:submit|preventDefault={submit}>
      <input name="theme" type="text" placeholder="theme url" />
      <button type="submit">get bracket colours</button>
    </form>
  </section>
  <section>
    {#if loading}
      loading...
    {/if}
    {#if pairs}
      <h2>found {pairs.length} variants for your theme!</h2>
      <div class="grid">
        <div>
          {#each pairs as pair}
            <ThemeTitle
              title={pair.title}
              onClick={() => ($selectedPairStore = pair)}
              active={pair.dict === $selectedPairStore?.dict || false}
            />
          {/each}
        </div>
        {#if $selectedPairStore}
          <code style:position="relative" style:height="200px">
            {#each DEPTHS as depth, index}
              {@const colorHex = $selectedPairStore?.dict[index]}
              <span
                class="bracket"
                style:color={colorHex}
                style:background={colorHex}
                style:top={`${15 * index}px`}
                style:left={`${15 * index}px`}
              >
                {depth[0]}
              </span>
              <span
                class="bracket"
                style:color={colorHex}
                style:position="absolute"
                style:bottom={`${15 * index}px`}
                style:left={`${15 * index}px`}
              >
                {depth[1]}
              </span>
            {/each}
          </code>
        {/if}
        <code>
          <Output pairs={$selectedPairStore?.dict} />
        </code>
      </div>
    {/if}
  </section>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    background-color: black;
    color: white;
  }

  .grid {
    display: grid;
    grid-template-columns: auto 200px 1fr;
    gap: 5em;
  }

  header {
    display: flex;
    justify-content: flex-start;
  }

  code {
    background-color: #212121;
    padding: 0.25rem 0.5rem;
    margin: 0.1rem;
    border-radius: 3px;
    overflow: hidden;
    white-space: pre-wrap;
  }

  code span {
    color: green;
    background: transparent !important;
  }

  h1 {
    color: white;
    font-size: 1.8rem;
    font-style: italic;
    font-weight: 700;
    max-width: 14rem;
    padding: 0;
    margin: 0;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  .bracket {
    width: 100%;
    position: absolute;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>

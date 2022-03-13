<script lang="ts">
  import "./global.css";

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
    const res = await fetch(`${apiUrl}/?search=${theme}`);
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
      <li>
        Copy everything after the e/ in the url <code
          >https://vscodethemes.com/<u>e/</u><span
            >dracula-theme.theme-dracula</span
          ></code
        >
      </li>
      <li>Paste it below!</li>
    </ol>
    <form on:submit|preventDefault={submit}>
      <input name="theme" type="text" placeholder="theme name" />
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
        {#each pairs as pair}
          <div>
            <h4>{pair.title}</h4>
            {#each pair.dict as color}
              <div>
                <span style={`color: ${color}`}>{color}</span>
              </div>
            {/each}
          </div>
        {/each}
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
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    /* grid-template-columns: 1fr 1fr 1fr; */
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
  }

  code span {
    color: green;
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

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>

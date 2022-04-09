<script lang="ts">
  export let pairs: any[];
</script>

<!-- {@debug pairs} -->
<!-- "editorBracketHighlight.foreground1": "#DA8548",
    "editorBracketHighlight.foreground2": "#98BE65",
    "editorBracketHighlight.foreground3": "#ECBE7B",
    "editorBracketHighlight.foreground4": "#C678DD",
    "editorBracketHighlight.foreground5": "#51AFEF",
    "editorBracketHighlight.foreground6": "#BBC2CF", -->

{#if pairs}
  {#each pairs as pair, idx}
    {#if idx <= 5}
      {`"editorBracketHighlight.foreground${idx + 1}": "${pair}", \n`}
    {/if}
  {/each}
{/if}

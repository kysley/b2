<script lang="ts">
  export let title: string = "";
  export let onClick: (arg0: any) => void;
  export let active: boolean = false;
</script>

<div class="container" on:click={onClick}>
  <h4 class="header" class:active>{title}</h4>
</div>

<style>
  .container {
    width: auto;
    display: flex;
    margin: 0;
  }

  .header {
    background-color: #3f3e3e;
    border-radius: 3px;
    cursor: pointer;
    padding: 0.5em 1em;
  }

  .header.active {
    background-color: #636363;
  }
</style>

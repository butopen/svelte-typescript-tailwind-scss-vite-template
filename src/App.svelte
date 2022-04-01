<script lang="ts">
  import './index.scss';
  import Counter from './components/Counter.svelte';
  import { messagesStore } from './stores/messages.store';
</script>

<div class="mx-auto mt-24 w-full max-w-md text-center">
  <div class="hello">{$messagesStore.message}</div>
  <Counter />
</div>

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .hello {
    @apply font-bold text-gray-600;
  }
</style>

<script lang="ts">
  import { messagesStore } from '../stores/messages.store';

  let activeTabIndex = 0;
</script>

<div class="bo-tabs" tabIndex={activeTabIndex}>
  <div
    class="bo-tab"
    on:click={() => (activeTabIndex = 0)}
    class:active={activeTabIndex == 0}>
    {$messagesStore.authForm.tabs.login}
  </div>
  <div
    class="bo-tab"
    on:click={() => (activeTabIndex = 1)}
    class:active={activeTabIndex == 1}>
    {$messagesStore.authForm.tabs.register}
  </div>
</div>

<div class="" />
{#if activeTabIndex == 0}
  <div class="my-4 block text-sm">
    <span class="text-gray-400">{$messagesStore.authForm.login.noAccountLabel}</span>
    <a on:click={() => (activeTabIndex = 1)}>
      {$messagesStore.authForm.login.noAccountLink}
    </a>
  </div>
{/if}
{#if activeTabIndex == 1}
  <div class="my-4 block text-sm">
    <span class="text-gray-400">
      {$messagesStore.authForm.register.alreadyHaveAccountLabel}
    </span>
    <a on:click={() => (activeTabIndex = 0)}>
      {$messagesStore.authForm.register.alreadyHaveAccountLink}
    </a>
  </div>
{/if}

<style lang="scss">
</style>

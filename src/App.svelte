<script lang="ts">
  import './index.scss';
  import AuthForm from './components/auth-form.svelte';

  let hasCode = false;
  let code = '';
  try {
    const match = /t\/(\w+)/.exec(window.location.href);
    code = match[1];
    hasCode = true;
  } catch {}
</script>

<div class="mt-24 flex w-full justify-center md:items-center">
  <div class="max-w-screen-md md:w-1/3">
    <AuthForm />
  </div>
</div>

<div class="bo-steps">
  <div class="bo-step-done">Confirm your email</div>
  <div class="bo-step-active">Create a project</div>
  <div class="bo-step-todo">Customize the theme</div>
</div>

<style lang="scss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>

<template>
  <header id="navbar-section" class="drop-shadow">
    <header class="bg-white">
      <div
        class="mx-auto flex h-16 max-w-screen-xl items-center gap-8 py-8 px-4 sm:px-6 lg:px-8"
      >
        <a class="block text-red-600" href="/">
          <span class="sr-only">Home</span>
          <img src="../assets/logo.svg" alt="" style="height: 36px" />
        </a>

        <div class="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" class="hidden md:block">
            <ul class="flex items-center gap-6 text-sm">
              <li>
                <RouterLink
                  to="/"
                  class="text-gray-500 transition hover:text-gray-500/75"
                  href="/"
                >
                  Home
                </RouterLink>
              </li>

              <li>
                <RouterLink
                  to="/favorites"
                  class="text-gray-500 transition hover:text-gray-500/75"
                  href="/"
                >
                  Favorites
                </RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  </header>
</template>

<script>
import { RouterLink } from "vue-router";
export default {
  created() {
    this.isLoggedIn = true;
  },
};
</script>

<style lang="scss" scoped></style>

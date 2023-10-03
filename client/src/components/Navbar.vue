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
          <a
            v-if="isLoggedIn"
            @click.prevent="handleLogout()"
            href="#"
            class="inline-block rounded border border-red-600 bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500"
          >
            Logout
          </a>
          <RouterLink
            to="/login"
            v-else
            href="#"
            class="inline-block rounded border border-red-600 bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500"
          >
            Login
          </RouterLink>
        </div>
      </div>
    </header>
  </header>
</template>

<script>
import { RouterLink } from "vue-router";
import { mapActions, mapState, mapStores } from "pinia";
import { useRootStore } from "../stores/root";

export default {
  methods: {
    ...mapActions(useRootStore, ["handleLogout"]),
  },
  computed: {
    ...mapState(useRootStore, ["isLoggedIn"]),
  },
};
</script>

<style lang="scss" scoped></style>

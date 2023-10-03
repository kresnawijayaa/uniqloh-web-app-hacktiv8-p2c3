<template>
  <Navbar />
  <RouterView />
</template>

<script>
import { RouterLink, RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import NavbarNoButton from "./components/NavbarNoButton.vue";
import { mapWritableState } from "pinia";
import { useRootStore } from "./stores/root";
export default {
  components: {
    Navbar,
    NavbarNoButton,
  },
  computed: {
    ...mapWritableState(useRootStore, ["isLoggedIn"]),
  },
  created() {
    if (localStorage.access_token) {
      this.isLoggedIn = true;
    }
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <a
    @click.prevent="handleLogout()"
    href="#"
    class="inline-block rounded border border-red-600 bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500"
  >
    Logout
  </a>
</template>

<script>
import { mapActions, mapState, mapStores } from "pinia";
import { useRootStore } from "../stores/root";

export default {
  methods: {
    ...mapActions(useRootStore, ["handleLogout"]),
  },
};
</script>

<style lang="scss" scoped></style>

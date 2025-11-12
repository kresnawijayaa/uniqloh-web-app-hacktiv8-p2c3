<template>
  <section id="home-section">
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h2 class="text-xl font-bold text-gray-900 sm:text-3xl">My Favorites</h2>
        <p class="mt-4 max-w-2xl text-gray-500">
          Your saved products live here. Add more from the catalog ✨
        </p>
      </header>

      <div class="mt-4 lg:mt-8">
        <!-- LOADING -->
        <div v-if="loading" class="py-12 text-center text-gray-500">
          Loading favorites…
        </div>

        <!-- EMPTY STATE -->
        <div v-else-if="!products || products.length === 0" class="py-12 text-center">
          <p class="text-gray-500">No favorites yet.</p>
          <RouterLink
            to="/"
            class="mt-4 inline-block rounded-md border border-red-600 bg-red-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-red-600"
          >
            Explore Products
          </RouterLink>
        </div>

        <!-- GRID -->
        <div v-else class="lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
          <div class="lg:col-span-4">
            <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card v-for="product in products" :key="product.id" :product="product" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useRootStore } from "../stores/root";
import Card from "../components/Card.vue";
import { RouterLink } from "vue-router";

export default {
  components: { RouterLink, Card },
  data() {
    return { loading: true };
  },
  computed: {
    ...mapState(useRootStore, ["products", "isLoggedIn"]),
  },
  methods: {
    ...mapActions(useRootStore, ["fetchFavorites"]),
    async boot() {
      // kalau belum login → redirect
      if (!this.isLoggedIn && !localStorage.getItem("access_token")) {
        this.$router.push("/login");
        return;
      }
      try {
        await this.fetchFavorites();
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.boot();
  },
};
</script>

<style lang="scss" scoped></style>

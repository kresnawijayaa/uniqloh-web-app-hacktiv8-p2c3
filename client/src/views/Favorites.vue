<template>
  <section id="home-section">
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h2 class="text-xl font-bold text-gray-900 sm:text-3xl">
          My Favorites
        </h2>

        <p class="mt-4 max-w-2xl text-gray-500">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque
          praesentium cumque iure dicta incidunt est ipsam, officia dolor fugit
          natus?
        </p>
      </header>

      <div class="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
        <div class="lg:col-span-4">
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card
              v-for="product in products"
              :key="product.id"
              :product="product"
            />
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { RouterLink } from "vue-router";
import { mapActions, mapState } from "pinia";
import { useRootStore } from "../stores/root";
import Card from "../components/Card.vue";

export default {
  computed: {
    ...mapState(useRootStore, ["products"]),
  },
  methods: {
    ...mapActions(useRootStore, ["fetchFavorites"]),
  },
  components: { RouterLink, Card },
  created() {
    this.fetchFavorites();
  },
};
</script>

<style lang="scss" scoped></style>

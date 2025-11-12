<template>
  <li
    class="group block overflow-hidden rounded-lg border border-gray-100 bg-white"
  >
    <RouterLink
      :to="`/products/${safeId}`"
      class="block"
    >
      <img
        :src="imageSrc"
        :alt="product?.name || 'Product image'"
        class="h-[150px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[160px]"
      />
    </RouterLink>

    <div class="relative bg-white pt-3 grid lg:grid-cols-2 lg:gap-4 px-3 pb-3">
      <div>
        <RouterLink
          :to="`/products/${safeId}`"
          class="block"
        >
          <h3
            class="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4"
          >
            {{ product.name }}
          </h3>
        </RouterLink>

        <p class="mt-2">
          <span class="sr-only"> Price </span>
          <span class="tracking-wider text-gray-900">{{ priceDisplay }}</span>
        </p>
      </div>

      <div class="sm:flex flex-row-reverse sm:gap-4 mt-2 mb-2">
        <button
          type="button"
          :disabled="isProcessing"
          @click.stop="onToggleFavorite"
          class="inline-flex items-center justify-center rounded-full border border-red-600 bg-white p-2 text-red-600 hover:bg-red-50 focus:outline-none focus:ring disabled:opacity-60 disabled:cursor-not-allowed"
          :aria-label="faved ? 'Remove from favorites' : 'Add to favorites'"
          :title="faved ? 'Remove from favorites' : 'Add to favorites'"
        >
          <svg
            v-if="faved"
            class="w-[16px] h-[16px]"
            viewBox="0 0 20 18"
            fill="currentColor"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z"
            />
          </svg>

          <svg
            v-else
            class="w-[16px] h-[16px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-.99-1.06a5.5 5.5 0 0 0-7.78 7.78l.99 1.06L12 21.35l7.78-8.9 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
            />
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>

<script>
import { mapActions, mapStores } from "pinia";
import { useRootStore } from "../stores/root";
import { RouterLink } from "vue-router";

export default {
  components: { RouterLink },
  props: { product: { type: Object, required: true } },
  data() {
    return { isProcessing: false };
  },
  computed: {
    ...mapStores(useRootStore), // this.rootStore
    safeId() {
      return (
        this.product?.id ??
        this.product?.productId ??
        this.product?.product_id ??
        null
      );
    },
    faved() {
      return this.safeId ? this.rootStore.isFavorited(this.safeId) : false;
    },
    priceDisplay() {
      const n = Number(this.product?.price ?? 0);
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(n);
      // pakai IDR? ganti ke:
      // return new Intl.NumberFormat("id-ID",{ style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
    },
    imageSrc() {
      return (
        this.product?.imgUrl ||
        "https://via.placeholder.com/600x400?text=No+Image"
      );
    },
  },
  methods: {
    ...mapActions(useRootStore, ["handleAddFavorites", "handleRemoveFavorite"]),
    async onToggleFavorite() {
      if (this.isProcessing || !this.safeId) return;
      if (!localStorage.getItem("access_token")) {
        this.$router.push("/login");
        return;
      }
      this.isProcessing = true;
      try {
        if (this.faved) {
          await this.handleRemoveFavorite(this.safeId);
        } else {
          await this.handleAddFavorites(this.safeId);
        }
      } finally {
        this.isProcessing = false;
      }
    },
  },
};
</script>

<template>
  <section>
    <div class="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
      <!-- LOADING -->
      <div v-if="loading" class="py-16 text-center text-gray-500">
        Loading product…
      </div>

      <!-- NOT FOUND -->
      <div v-else-if="!productDetail || !productDetail.id" class="py-16 text-center">
        <p class="text-gray-500">Product not found.</p>
        <RouterLink
          to="/"
          class="mt-4 inline-block rounded-md border border-red-600 bg-red-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-red-600"
        >
          Back to Catalog
        </RouterLink>
      </div>

      <!-- CONTENT -->
      <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-4">
        <div class="relative h-64 overflow-hidden rounded-lg sm:h-160 lg:order-last lg:h-full lg:col-span-3">
          <img
            :alt="productDetail.name || 'Product image'"
            :src="imageSrc"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div class="lg:col-span-2">
          <h2 class="text-xl font-bold text-gray-900 sm:text-3xl mt-4">
            {{ productDetail.name }}
          </h2>

          <p class="mt-4 text-gray-600">
            {{ productDetail.description }}
          </p>

          <div class="mt-8 sm:mt-8">
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2 w-4/5">
              <div class="flex flex-col rounded-lg border border-gray-300 px-2 py-4 text-center">
                <dt class="order-last text-md font-medium text-gray-500">Price</dt>
                <dd class="text-2xl font-extrabold text-red-600 md:text-3xl">
                  {{ priceDisplay }}
                </dd>
              </div>

              <div class="flex flex-col rounded-lg border border-gray-300 px-2 py-4 text-center">
                <dt class="order-last text-md font-medium text-gray-500">Stock</dt>
                <dd class="text-2xl font-extrabold text-red-600 md:text-3xl">
                  {{ productDetail.stock }}
                </dd>
              </div>
            </dl>
          </div>

          <div class="w-4/5 mt-4">
            <!-- QR HTML dari backend -->
            <div v-if="productDetail.qr" v-html="productDetail.qr" class="lg:w-100"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { RouterLink } from "vue-router";
import { mapState, mapActions } from "pinia";
import { useRootStore } from "../stores/root";

export default {
  components: { RouterLink },
  data() {
    return { loading: true };
  },
  computed: {
    ...mapState(useRootStore, ["productDetail"]),
    priceDisplay() {
      const n = Number(this.productDetail?.price ?? 0);
      // ganti "USD" kalau perlu (IDR dsb)
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
    },
    imageSrc() {
      return this.productDetail?.imgUrl || "https://via.placeholder.com/800x600?text=No+Image";
    },
  },
  methods: {
    ...mapActions(useRootStore, ["fetchDetailProducts"]),
    async boot() {
      this.loading = true;
      try {
        await this.fetchDetailProducts(this.$route.params.id);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.boot();
  },
  watch: {
    "$route.params.id"() {
      this.boot();
    },
  },
};
</script>

<style lang="scss" scoped></style>

<template>
  <section id="register-section">
    <section class="bg-white">
      <div class="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main class="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-4 lg:px-16 lg:py-12">
          <div class="max-w-xl lg:max-w-3xl">
            <!-- header kecil -->
            <div class="relative -mt-16 block lg:hidden">
              <a class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600 sm:h-20 sm:w-20" href="/">
                <span class="sr-only">Home</span>
                <!-- svg logo singkat -->
                <svg class="h-8 sm:h-10" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78..." fill="currentColor"/></svg>
              </a>
              <h1 class="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">UNIQ-LOH</h1>
              <p class="mt-4 leading-relaxed text-gray-500">More than just a clothing brand.</p>
            </div>

            <h6 class="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">Sign Up</h6>

            <form @submit.prevent="doRegister" class="mt-8 grid grid-cols-6 gap-6">
              <div class="col-span-12">
                <label for="UserName" class="block text-sm font-medium text-gray-700">Username</label>
                <input
                  v-model="form.username"
                  type="text"
                  id="UserName"
                  name="username"
                  autocomplete="username"
                  required
                  class="focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 px-2 ring-1 ring-slate-200 shadow-sm"
                />
              </div>

              <div class="col-span-12">
                <label for="Email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="Email"
                  name="email"
                  autocomplete="email"
                  required
                  class="focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 px-2 ring-1 ring-slate-200 shadow-sm"
                />
              </div>

              <div class="col-span-12">
                <label for="Password" class="block text-sm font-medium text-gray-700">Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  id="Password"
                  name="password"
                  autocomplete="new-password"
                  required
                  class="focus:ring-2 focus:ring-red-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 px-2 ring-1 ring-slate-200 shadow-sm"
                />
              </div>

              <div class="col-span-12">
                <button
                  :disabled="submitting"
                  class="w-full shrink-0 rounded-md border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span v-if="!submitting">Create an account</span>
                  <span v-else>Creating…</span>
                </button>
              </div>

              <div class="col-span-12">
                <p class="mt-4 text-sm text-gray-500 sm:mt-0 text-center">
                  Already have an account?
                  <RouterLink to="/login" class="text-gray-700 underline">Log in</RouterLink>.
                </p>
              </div>
            </form>
          </div>
        </main>

        <!-- side image -->
        <section class="relative flex h-32 items-end bg-black lg:col-span-8 lg:h-full">
          <img alt="Night" src="../assets/medium-shot-stylish-women-posing.jpg" class="absolute inset-0 h-full w-full object-cover opacity-80" />
          <div class="hidden lg:relative lg:block lg:p-12">
            <img src="../assets/logo.svg" alt="" style="height: 40px" />
            <h2 class="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">UNIQ-LOH</h2>
            <p class="mt-4 leading-relaxed text-white/90">More than just a clothing brand.</p>
          </div>
        </section>
      </div>
    </section>
  </section>
</template>

<script>
import { mapActions } from "pinia";
import { useRootStore } from "../stores/root";
import { RouterLink } from "vue-router";

export default {
  components: { RouterLink },
  data() {
    return {
      submitting: false,
      form: {
        username: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(useRootStore, ["handleRegister"]),
    async doRegister() {
      if (this.submitting) return;
      this.submitting = true;
      try {
        const res = await this.handleRegister(this.form);
        if (res?.ok) {
          this.$router.push(res.redirect || "/login");
        }
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>

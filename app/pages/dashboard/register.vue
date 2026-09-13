<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const error = ref<string | null>(null);
const pending = ref(false);

useHead({
	title: t("app.register.title"),
	meta: [{ name: "robots", content: "noindex, nofollow" }],
});

async function submit() {
	error.value = null;
	pending.value = true;
	try {
		await $fetch("/api/auth/register", {
			method: "POST",
			body: {
				name: name.value,
				username: username.value,
				email: email.value,
				password: password.value,
			},
		});
		const redirect =
			typeof route.query.redirect === "string"
				? route.query.redirect
				: localePath("/dashboard");
		await navigateTo(redirect);
	} catch (e) {
		const status = (e as { statusCode?: number })?.statusCode;
		const msg = (e as { data?: { statusMessage?: string } })?.data
			?.statusMessage;
		if (status === 409 || msg === "username_exists") {
			error.value = t("app.register.taken");
		} else {
			error.value = t("app.register.invalid");
		}
	} finally {
		pending.value = false;
	}
}
</script>

<template>
	<div class="flex min-h-screen items-center justify-center bg-surface-container px-4">
		<UCard class="w-full max-w-sm">
			<template #header>
				<h1 class="text-xl font-bold text-deep-navy">{{ t("app.register.title") }}</h1>
				<p class="text-sm text-on-surface-variant">{{ t("app.register.subtitle") }}</p>
			</template>

			<form class="flex flex-col gap-4" @submit.prevent="submit">
				<UFormField :label="t('app.register.name')">
					<UInput v-model="name" autocomplete="name" />
				</UFormField>
				<UFormField :label="t('app.register.username')">
					<UInput v-model="username" autocomplete="username" />
				</UFormField>
				<UFormField :label="t('app.register.email')">
					<UInput v-model="email" type="email" autocomplete="email" />
				</UFormField>
				<UFormField :label="t('app.register.password')">
					<UInput v-model="password" type="password" autocomplete="new-password" />
				</UFormField>

				<UAlert v-if="error" color="error" variant="soft" :title="error" />

				<UButton type="submit" :loading="pending" block>
					{{ t("app.register.submit") }}
				</UButton>
			</form>

			<template #footer>
				<p class="text-sm text-on-surface-variant">
					{{ t("app.register.haveAccount") }}
					<ULink :to="localePath('/dashboard/login')" class="font-medium text-deep-navy">
						{{ t("app.register.login") }}
					</ULink>
				</p>
			</template>
		</UCard>
	</div>
</template>
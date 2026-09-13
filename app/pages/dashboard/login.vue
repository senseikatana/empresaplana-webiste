<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const username = ref("");
const passkey = ref("");
const error = ref<string | null>(null);
const pending = ref(false);

// Las credenciales demo son las del seed (DEMO_USERS en prisma/seed-data/seed.ts),
// normalizadas a passkey única para la demo del cliente.
const demoAccounts = [
	{ username: "cliente", roleKey: "asClient", icon: "person" },
	{ username: "trabajador", roleKey: "asWorker", icon: "badge" },
	{ username: "admin", roleKey: "asBoss", icon: "admin_panel_settings" },
];

useHead({
	title: t("app.auth.welcome"),
	meta: [{ name: "robots", content: "noindex, nofollow" }],
});

async function submit(
	usernameValue = username.value,
	passkeyValue = passkey.value,
) {
	error.value = null;
	pending.value = true;
	try {
		await $fetch("/api/auth/login", {
			method: "POST",
			body: { username: usernameValue, passkey: passkeyValue },
		});
		const redirect =
			typeof route.query.redirect === "string"
				? route.query.redirect
				: localePath("/dashboard");
		await navigateTo(redirect);
	} catch (e) {
		error.value = t("app.auth.invalid");
	} finally {
		pending.value = false;
	}
}
</script>

<template>
	<div class="flex min-h-screen items-center justify-center bg-surface-container px-4">
		<UCard class="w-full max-w-sm">
			<template #header>
				<h1 class="text-xl font-bold text-deep-navy">{{ t("app.auth.welcome") }}</h1>
				<p class="text-sm text-on-surface-variant">{{ t("app.auth.subtitle") }}</p>
			</template>

			<form class="flex flex-col gap-4" @submit.prevent="submit">
				<UFormField :label="t('app.auth.username')">
					<UInput v-model="username" autocomplete="username" placeholder="admin" />
				</UFormField>
				<UFormField :label="t('app.auth.passkey')">
					<UInput v-model="passkey" type="password" autocomplete="current-password" placeholder="••••••••" />
				</UFormField>

				<UAlert v-if="error" color="error" variant="soft" :title="error" />

				<UButton type="submit" :loading="pending" block>
					{{ t("app.auth.login") }}
				</UButton>
			</form>

			<div class="mt-6 border-t border-surface-variant pt-4">
				<p class="text-xs text-on-surface-variant mb-2">{{ t("app.auth.demoHint") }}</p>
				<div class="flex flex-col gap-2">
					<UButton
						v-for="account in demoAccounts"
						:key="account.username"
						color="neutral"
						variant="soft"
						block
						:disabled="pending"
						@click="submit(account.username, '12345678')"
					>
						{{ t(`app.auth.${account.roleKey}`) }}
					</UButton>
				</div>
			</div>

			<template #footer>
				<p class="text-sm text-on-surface-variant">
					<ULink :to="localePath('/dashboard/register')" class="font-medium text-deep-navy">
						{{ t("app.register.title") }}
					</ULink>
				</p>
			</template>
		</UCard>
	</div>
</template>
<template>
	<div class="bg-background font-body-md text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col">
		<SiteHeader />
		<main class="flex-1">
			<slot />
		</main>
		<SiteFooter />
		<CookieBanner />
	</div>
</template>
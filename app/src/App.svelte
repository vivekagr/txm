<script>
	import { setClient } from 'svelte-apollo';
    import Router from 'svelte-spa-router';
    import TailwindCss from './TailwindCss.svelte';

	import routes from './routes/';
	import { client } from './apollo';

    setClient(client);
</script>

<TailwindCss/>
<body>
	<Router {routes} />
</body>

<style>
    body {
        text-align: center;
        padding: 1em;
        max-width: 960px;
        margin: 0 auto;
    }
</style>
